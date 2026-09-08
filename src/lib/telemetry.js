// Anonymous usage counters, posted to /api/event.
//
// Deliberately minimal: a page view, the referring host, and which sections a
// visitor actually reached. No cookies, no identifiers, no fingerprinting —
// nothing stored server-side can distinguish one visitor from another, only
// count them. Nothing here is rendered on the site.
//
// sendBeacon so it never blocks navigation, never delays paint, and survives
// the page being closed mid-request.

const ENDPOINT = '/api/event'

const enabled = () =>
  typeof navigator !== 'undefined' &&
  typeof navigator.sendBeacon === 'function' &&
  navigator.doNotTrack !== '1' &&
  window.doNotTrack !== '1' &&
  !import.meta.env.DEV

function send(payload) {
  if (!enabled()) return
  try {
    navigator.sendBeacon(ENDPOINT, new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  } catch {
    // Counters are never worth surfacing an error for.
  }
}

// Referrer host only — the full URL can carry search terms and other things
// that are none of this site's business.
function referrerHost() {
  if (!document.referrer) return ''
  try {
    const host = new URL(document.referrer).hostname
    return host === location.hostname ? '' : host // ignore internal navigation
  } catch {
    return ''
  }
}

export function trackPageView(path = location.pathname) {
  send({ t: 'view', p: path, r: referrerHost() })
}

// Reports each section the first time it comes into view, once per page load.
// Returns a teardown function for the effect that owns it.
export function trackSections(ids) {
  if (!enabled() || typeof IntersectionObserver === 'undefined') return () => {}

  const seen = new Set()
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const id = entry.target.id
        if (seen.has(id)) continue
        seen.add(id)
        observer.unobserve(entry.target)
        send({ t: 'section', id })
      }
    },
    { threshold: 0.4 },
  )

  for (const id of ids) {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  }
  return () => observer.disconnect()
}
