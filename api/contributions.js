// Vercel serverless function for the contribution calendar.
//
// Mirrors functions/api/contributions.js (the Cloudflare Pages Function) so the
// site deploys to either host unchanged. Both delegate to the same scraper in
// shared/, and both prefer the AWS origin when it is configured, falling back
// to scraping GitHub directly.

import { fetchContributions, DEFAULT_USER } from '../shared/githubContributions.js'

const HOUR = 3600

export default async function handler(req, res) {
  const year = Number(req.query?.year) || new Date().getFullYear()
  const user = req.query?.user || DEFAULT_USER

  // 1. AWS origin, when the stack is deployed and wired up.
  if (process.env.AWS_CONTRIB_URL) {
    try {
      const origin = new URL(process.env.AWS_CONTRIB_URL)
      origin.searchParams.set('user', user)
      origin.searchParams.set('year', String(year))
      const upstream = await fetch(origin, {
        headers: process.env.PORTFOLIO_KEY ? { 'x-portfolio-key': process.env.PORTFOLIO_KEY } : {},
      })
      if (upstream.ok) {
        res.setHeader('Cache-Control', `public, s-maxage=${HOUR}, stale-while-revalidate=86400`)
        res.setHeader('X-Contrib-Source', 'aws')
        return res.status(200).json(await upstream.json())
      }
      console.warn(`contrib origin responded ${upstream.status}; scraping directly`)
    } catch (err) {
      console.warn(`contrib origin unreachable (${err.message}); scraping directly`)
    }
  }

  // 2. Scrape GitHub here. Shorter TTL than the origin path: this is the
  //    degraded route, and we want to prefer the origin again once it recovers.
  try {
    const data = await fetchContributions(user, year)
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400')
    res.setHeader('X-Contrib-Source', 'origin')
    res.status(200).json(data)
  } catch (err) {
    // The client has one more fallback of its own, so this is not fatal.
    res.setHeader('Cache-Control', 'no-store')
    res.status(502).json({ error: String(err.message || err) })
  }
}
