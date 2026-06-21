import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: '/' for clean URLs with BrowserRouter on Netlify (served at domain root).
// Asset references use import.meta.env.BASE_URL so deep routes resolve correctly.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
