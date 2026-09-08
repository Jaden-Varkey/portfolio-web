// Vercel counterpart to functions/api/event.js.
//
// Forwards anonymous counters to the AWS events Lambda. With no AWS configured
// it simply accepts and drops them, so the client's beacon never sees an error
// and nothing is stored anywhere.

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  if (!process.env.AWS_EVENTS_URL) return res.status(204).end()

  try {
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {})
    if (body && body.length <= 2048) {
      await fetch(process.env.AWS_EVENTS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.PORTFOLIO_KEY ? { 'x-portfolio-key': process.env.PORTFOLIO_KEY } : {}),
        },
        body,
      })
    }
  } catch {
    // Counters are never worth failing a request over.
  }
  res.status(204).end()
}
