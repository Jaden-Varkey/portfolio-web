# Jaden Varkey — Portfolio

A dark, interactive personal portfolio built with **React + Vite**. Features a parallax
background, an animated load transition, a custom spaceship cursor that ignites on hover,
scrolling tech-logo marquees, and shimmering gradient headings. Motion via **Framer Motion**;
type is **Space Grotesk / Inter**, self-hosted with Fontsource. Animations are GPU-only
(transform/opacity) for smooth, lag-free scrolling.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

## Edit content

All text lives in `src/data/content.js` — hero intro, socials, experience, projects,
project detail pages, and the categorized tech stack. Images live in `public/`
(`public/logos/` for tech + social icons, `public/bg/` for the background).

## Deploy (GitHub Pages)

Routing uses `HashRouter` and Vite `base: './'`, so the build is drop-in for GitHub Pages
(project subpath or custom domain) with no extra config.

```bash
npm run deploy   # builds and publishes dist/ via gh-pages
```

Or push `dist/` through a GitHub Actions Pages workflow.

## Structure

```
src/
  data/content.js   all copy + data
  styles/           global, home, detail CSS
  components/       Hero, Projects, Experience, TechStack, Footer,
                    Background, Cursor, FloatingNav, PageIntro, LogoTile
  pages/            Home, ProjectDetail
public/
  logos/            tech + social SVG/PNG logos
  bg/               background images
```
