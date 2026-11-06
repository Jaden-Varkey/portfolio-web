import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fetchContributions } from './shared/githubContributions.js'

// Serves /api/contributions during `vite dev`, where Cloudflare's Pages
// Functions runtime isn't running. It calls the same shared scraper the
// deployed Worker falls back to, so local dev exercises real code.
function contributionsApi() {
  return {
    name: 'contributions-api',
    configureServer(server) {
      server.middlewares.use('/api/contributions', async (req, res) => {
        try {
          const q = new URL(req.url, 'http://localhost').searchParams
          const data = await fetchContributions(
            q.get('user') || undefined,
            Number(q.get('year')) || undefined,
          )
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(data))
        } catch (err) {
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: String(err.message || err) }))
        }
      })
    },
  }
}

// Production builds load assets from the absolute deployment origin so the page
// also works when proxied under a sub-path (www.cs.purdue.edu/homes/varkey/),
// where root-relative /assets/... would hit Purdue's server instead of ours.
// Asset references use import.meta.env.BASE_URL so deep routes resolve correctly.
const PROD_ORIGIN = 'https://portfolio-web-mu-sable.vercel.app/'

export default defineConfig({
  plugins: [react(), contributionsApi()],
  base: process.env.VERCEL_ENV === 'production' ? PROD_ORIGIN : '/',
})
