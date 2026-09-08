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

// base: '/' for clean URLs with BrowserRouter on Cloudflare Pages (domain root).
// Asset references use import.meta.env.BASE_URL so deep routes resolve correctly.
export default defineConfig({
  plugins: [react(), contributionsApi()],
  base: '/',
})
