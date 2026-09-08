// Cloudflare Pages Function: the edge tier in front of the AWS origin.
//
//   browser -> [ edge cache ] -> AWS Lambda Function URL -> DynamoDB -> GitHub
//
// Almost every request stops at the cache. When it doesn't, the Lambda answers
// from its DynamoDB snapshot (kept warm hourly by EventBridge), so a visitor
// never waits on GitHub. If AWS is unreachable the Worker scrapes GitHub itself
// rather than failing — and `src/lib/contributions.js` has one more fallback
// after that, so the graph survives any single tier going down.

import { fetchContributions, DEFAULT_USER } from '../../shared/githubContributions.js'

const HOUR = 3600
const CACHE_CONTROL = `public, s-maxage=${HOUR}, stale-while-revalidate=86400`
// Shorter when we had to scrape directly: that path is the degraded one, and we
// want to start preferring the origin again as soon as it recovers.
const FALLBACK_CACHE_CONTROL = 'public, s-maxage=600, stale-while-revalidate=86400'

const json = (body, cacheControl, source) =>
  new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': cacheControl,
      'X-Contrib-Source': source,
    },
  })

export async function onRequest({ request, env, waitUntil }) {
  const url = new URL(request.url)
  const year = Number(url.searchParams.get('year')) || new Date().getFullYear()
  const user = url.searchParams.get('user') || DEFAULT_USER

  // Normalised key so `?year=2026&user=x` and `?user=x&year=2026` share an entry.
  const cacheKey = new Request(
    `${url.origin}/api/contributions?user=${encodeURIComponent(user)}&year=${year}`,
    { method: 'GET' },
  )
  const cache = caches.default
  const hit = await cache.match(cacheKey)
  if (hit) return hit

  // 1. AWS origin.
  if (env.AWS_CONTRIB_URL) {
    try {
      const origin = new URL(env.AWS_CONTRIB_URL)
      origin.searchParams.set('user', user)
      origin.searchParams.set('year', String(year))
      const res = await fetch(origin, {
        headers: env.PORTFOLIO_KEY ? { 'x-portfolio-key': env.PORTFOLIO_KEY } : {},
      })
      if (res.ok) {
        const body = await res.json()
        const out = json(body, CACHE_CONTROL, 'aws')
        waitUntil(cache.put(cacheKey, out.clone()))
        return out
      }
      // Falling through is the designed behaviour, but a silent fallback would
      // hide a dead origin indefinitely — the CloudWatch alarms only fire when
      // the Lambda itself errors, not when it's unreachable from here.
      console.warn(`contrib origin responded ${res.status}; falling back to edge scrape`)
    } catch (err) {
      console.warn(`contrib origin unreachable (${err.message}); falling back to edge scrape`)
    }
  }

  // 2. Scrape GitHub from the edge.
  try {
    const body = await fetchContributions(user, year)
    const out = json(body, FALLBACK_CACHE_CONTROL, 'edge')
    waitUntil(cache.put(cacheKey, out.clone()))
    return out
  } catch (err) {
    // Uncached: the client still has its own last-resort source.
    return new Response(JSON.stringify({ error: String(err.message || err) }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    })
  }
}
