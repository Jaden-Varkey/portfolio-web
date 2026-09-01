// GitHub contribution calendar, scraped from the public (no-auth) endpoint at
// github.com/users/<login>/contributions and normalised to compact JSON.
//
// Exported as a Vercel function; `fetchContributions` is reused by the Vite dev
// middleware (see vite.config.js) so local dev hits the same code path as prod.

const DEFAULT_USER = 'Jaden-Varkey'
// Scoped to a calendar year: GitHub returns Jan 1 - Dec 31 for the year `from`
// falls in, the same window its own profile year view shows.
const SOURCE = (user, year) =>
  `https://github.com/users/${encodeURIComponent(user)}/contributions` +
  `?from=${year}-01-01&to=${year}-12-31`

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`${name}="([^"]*)"`))
  return m ? m[1] : null
}

// GitHub renders one <td> per day (attribute order is not stable, so each
// attribute is pulled out individually) plus a matching <tool-tip> carrying the
// exact count, which the cell itself only exposes as a 0-4 bucket.
export async function fetchContributions(user = DEFAULT_USER, year = new Date().getFullYear()) {
  const res = await fetch(SOURCE(user, year), {
    headers: {
      'User-Agent': 'jadenvarkey.com contribution graph',
      'X-Requested-With': 'XMLHttpRequest',
      Accept: 'text/html',
    },
  })
  if (!res.ok) throw new Error(`github responded ${res.status}`)
  const html = await res.text()

  const counts = new Map()
  for (const tip of html.match(/<tool-tip[^>]*>[^<]*<\/tool-tip>/g) || []) {
    const forId = attr(tip, 'for')
    if (!forId) continue
    const text = tip.slice(tip.indexOf('>') + 1, tip.lastIndexOf('<'))
    const n = text.match(/^([\d,]+)\s+contribution/)
    counts.set(forId, n ? Number(n[1].replace(/,/g, '')) : 0)
  }

  const days = []
  for (const td of html.match(/<td[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>/g) || []) {
    const date = attr(td, 'data-date')
    if (!date) continue
    const id = attr(td, 'id')
    days.push({
      d: date,
      l: Number(attr(td, 'data-level') || 0),
      c: counts.get(id) ?? 0,
    })
  }
  if (!days.length) throw new Error('no contribution cells found')

  days.sort((a, b) => (a.d < b.d ? -1 : a.d > b.d ? 1 : 0))
  return {
    user,
    year: Number(year),
    total: days.reduce((sum, day) => sum + day.c, 0),
    days,
  }
}

export default async function handler(req, res) {
  try {
    const year = Number(req.query?.year) || new Date().getFullYear()
    const data = await fetchContributions(req.query?.user || DEFAULT_USER, year)
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    res.status(200).json(data)
  } catch (err) {
    res.status(502).json({ error: String(err.message || err) })
  }
}
