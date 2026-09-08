# Jaden Varkey — Portfolio

A dark, interactive personal portfolio built with **React + Vite**, currently
deployed on **Vercel**, with a **Cloudflare Pages** path and an **AWS** origin
tier ready behind it.

A live WebGL planet as the backdrop, an animated load transition, a custom spaceship
cursor that ignites on hover, a projects rail that scrolls sideways, scroll-driven warp
crossings between sections, scrolling tech-logo marquees, and a GitHub contribution
calendar that rides above the cursor on hover. Motion via **Motion** (motion.dev); type
is **Clash Display / Inter**, self-hosted. Animations stay on transform/opacity so
scrolling never drops frames, and every component honours `prefers-reduced-motion`.

## Architecture

The site is static, but the contribution graph needs live data, and I wanted the data path
to be genuinely resilient rather than a single `fetch` that breaks when GitHub rate-limits.

```
  browser
    |
    v
  Vercel / Cloudflare Pages ... static assets
    |
    +-- serverless function  /api/contributions
          |
          |  1. edge cache (1h)                       <-- almost every request stops here
          |  2. AWS Lambda Function URL              <-- origin
          |       |
          |       +-- DynamoDB  snapshot + TTL       <-- serves stale if GitHub is down
          |       ^
          |       +-- EventBridge rate(1 hour)       <-- re-warms the snapshot
          |
          |  3. scrape GitHub from the edge          <-- if AWS is unreachable
          v
       4. public contributions API (client-side)     <-- last resort
```

Each tier earns its place:

- **Edge cache** (1h) absorbs essentially all traffic. On Cloudflare this is `caches.default`
  with the key normalised to `user`+`year` so junk query params can't fragment it; on Vercel
  it is `s-maxage` on the response.
- **Lambda** owns the GitHub scrape and writes the result to DynamoDB. Visitors never wait
  on GitHub, because **EventBridge** re-warms the snapshot hourly.
- **DynamoDB** keeps the last good snapshot. If GitHub is down or rate-limiting, the Lambda
  serves the stale snapshot rather than an error — a slightly old graph beats a broken one.
- **Fallbacks:** if AWS is unreachable the Worker scrapes GitHub itself; if that fails too,
  the client falls back to a public contributions API. Any single tier can disappear and
  the graph still renders.

A second Function URL collects anonymous counters (page views, which sections people
actually reach). Counters only — no cookies, no identifiers, no IP or user-agent storage,
and it no-ops under Do Not Track. Nothing is displayed on the site.

### Cost

Everything sits inside AWS's **always-free** allowances, not the 12-month trial:

| | Used | Always-free allowance |
|---|---|---|
| Lambda | ~750 invocations/mo | 1M requests, 400k GB-s |
| DynamoDB | 5 RCU / 5 WCU provisioned | 25 RCU / 25 WCU, 25 GB |
| EventBridge | 720 scheduled events/mo | scheduled rules are free |
| CloudWatch | 2 log groups, 4 alarms | 5 GB logs, 10 alarms |
| Lambda Function URLs | 2 | no additional charge |

Two decisions do the work here:

- **DynamoDB is PROVISIONED, not on-demand.** The always-free tier covers provisioned
  capacity only; on-demand bills per request from the very first one.
- **Log groups declare `RetentionInDays: 14`.** CloudWatch's default is *never expire*,
  which is the usual way a "free" side project quietly starts costing money.

API Gateway is deliberately absent — Lambda Function URLs do the same job here, and API
Gateway's free tier expires after 12 months.

## Develop

```bash
npm install
npm run dev        # Vite dev server; serves /api/contributions via middleware
npm run build      # production build -> dist/
npm run pages:dev  # build, then run the real Pages Functions locally (Wrangler)
```

`npm run dev` serves `/api/contributions` from the same scraper the deployed Worker falls
back to, so local dev exercises real code rather than a mock.

For `pages:dev`, copy `.dev.vars.example` to `.dev.vars` and fill it in. Leaving the values
empty is fine — the Function skips the AWS origin and scrapes from the edge instead.

> Wrangler's `--binding` flag prints variables in the startup table but never delivers them
> to `context.env`. Use `.dev.vars`.

## Deploy

The same source deploys to either host — each ignores the other's convention
(`api/` is Vercel's, `functions/` is Cloudflare's), and both delegate to the
same scraper in `shared/`.

**Vercel** (current) — connect the repo; `vercel.json` supplies the build and
the SPA rewrite. Environment variables, once the AWS stack exists:
`AWS_CONTRIB_URL`, `AWS_EVENTS_URL`, `PORTFOLIO_KEY`. Without them the function
scrapes GitHub directly, which is a supported mode.

**Cloudflare Pages** — connect the repo and set:

- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: `AWS_CONTRIB_URL`, `AWS_EVENTS_URL`, `PORTFOLIO_KEY` (secret)

There is no `_redirects` file: Pages already serves `index.html` for any request that
doesn't match a static asset, which is exactly the SPA fallback `BrowserRouter` needs.

**AWS origin** — see [`infra/`](infra/):

```bash
cd infra
sam build
sam deploy --guided     # asks for GitHubUser, PortfolioKey, AlertEmail
```

Then copy the `ContribUrl` / `EventsUrl` stack outputs into the Pages environment
variables, confirm the SNS subscription email, and add a $1 AWS Budget alert (Budgets
allows two for free; it can't be expressed in the template).

## Edit content

All copy lives in `src/data/content.js` — hero intro, socials, experience, projects,
project detail pages, and the categorised tech stack. Images live in `public/`
(`public/logos/` for tech + social icons, `public/bg/` for the background).

## Structure

```
src/
  data/content.js   all copy + data
  styles/           global, home, detail CSS
  components/       Hero, Projects, Experience, TechStack, Footer, Background,
                    Cursor, FloatingNav, PageIntro, ContribGraph, LogoTile
  lib/              contributions (client loader), telemetry, asset
  pages/            Home, ProjectDetail
api/                Vercel serverless functions (contributions, event)
functions/api/      Cloudflare Pages Functions — same two, Workers signature
shared/             GitHub scraper — used by the Worker, the Lambda and Vite dev
infra/              AWS SAM template + Lambda handlers
public/
  logos/            tech + social SVG/PNG logos
  bg/               background images
```
