// Cloudflare Pages Function: forwards anonymous usage counters to the AWS
// events Lambda. Forwarded inside waitUntil() so the browser's sendBeacon
// resolves immediately and a slow (or absent) origin never costs a visitor
// anything. Always 204 — there is nothing the client can do with a failure.

const NO_CONTENT = () => new Response(null, { status: 204 })

export async function onRequest({ request, env, waitUntil }) {
  if (request.method !== 'POST') return new Response('method not allowed', { status: 405 })
  if (!env.AWS_EVENTS_URL) return NO_CONTENT()

  let body
  try {
    body = await request.text()
  } catch {
    return NO_CONTENT()
  }
  if (!body || body.length > 2048) return NO_CONTENT()

  waitUntil(
    fetch(env.AWS_EVENTS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(env.PORTFOLIO_KEY ? { 'x-portfolio-key': env.PORTFOLIO_KEY } : {}),
      },
      body,
    }).catch(() => {}),
  )
  return NO_CONTENT()
}
