import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fetchContributions } from './api/contributions.js'

// Serves /api/contributions during `vite dev`, where Vercel's function runtime
// isn't running, so local dev exercises the same handler as production.
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

// base: '/' for clean URLs with BrowserRouter on Netlify (served at domain root).
// Asset references use import.meta.env.BASE_URL so deep routes resolve correctly.
export default defineConfig({
  plugins: [react(), contributionsApi()],
  base: '/',
})
