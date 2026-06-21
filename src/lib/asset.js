// Build an absolute URL to a file in /public, honoring Vite's base path.
// Needed with BrowserRouter so deep routes (e.g. /projects/boilersub) don't
// resolve assets relative to the current path.
export const asset = (path) => `${import.meta.env.BASE_URL}${path}`
