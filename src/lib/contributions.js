// Client-side loader for the GitHub contribution calendar, scoped to the
// current calendar year.
//
// Fetched once per page load and memoised, so hovering the GitHub icon
// repeatedly costs nothing. The request is fired on first hover intent rather
// than at boot, keeping it off the critical path.

const YEAR = new Date().getFullYear()
const ENDPOINT = `/api/contributions?year=${YEAR}`
// Used when the serverless function isn't reachable (e.g. a static-only host).
const FALLBACK = `https://github-contributions-api.jogruber.de/v4/Jaden-Varkey?y=${YEAR}`

let pending = null

async function fromFallback() {
  const res = await fetch(FALLBACK)
  if (!res.ok) throw new Error(`fallback responded ${res.status}`)
  const json = await res.json()
  const days = (json.contributions || []).map((day) => ({
    d: day.date,
    l: day.level ?? 0,
    c: day.count ?? 0,
  }))
  if (!days.length) throw new Error('fallback returned no days')
  return {
    user: 'Jaden-Varkey',
    year: YEAR,
    total: days.reduce((s, day) => s + day.c, 0),
    days,
  }
}

export function loadContributions() {
  if (!pending) {
    pending = (async () => {
      try {
        const res = await fetch(ENDPOINT)
        if (!res.ok) throw new Error(`api responded ${res.status}`)
        return await res.json()
      } catch {
        return await fromFallback()
      }
    })().catch((err) => {
      pending = null // let a later hover retry
      throw err
    })
  }
  return pending
}

// Turns the flat day list into GitHub's column-per-week grid. Each column is a
// Sunday-started week; leading cells before the first day are null placeholders.
export function toWeeks(days) {
  const weeks = []
  let week = new Array(new Date(`${days[0].d}T00:00:00Z`).getUTCDay()).fill(null)
  for (const day of days) {
    week.push(day)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }
  if (week.length) weeks.push([...week, ...new Array(7 - week.length).fill(null)])
  return weeks
}

// Month labels aligned to the column where each new month first appears.
export function monthLabels(weeks) {
  const out = []
  let last = null
  weeks.forEach((week, i) => {
    const first = week.find(Boolean)
    if (!first) return
    const month = first.d.slice(0, 7)
    if (month === last) return
    last = month
    const name = new Date(`${first.d}T00:00:00Z`).toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
    // Skip a label that would collide with the previous one.
    if (out.length && i - out[out.length - 1].col < 3) return
    out.push({ col: i, name })
  })
  return out
}
