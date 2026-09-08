// Origin for the contribution calendar.
//
// DynamoDB holds the last good snapshot; this function refreshes it from GitHub
// when it goes stale. An EventBridge rule invokes it hourly, so the snapshot is
// already warm by the time anyone asks and no visitor pays for the scrape.
//
// Two event shapes arrive here: a Function URL request (has `requestContext`)
// and the bare `{ refresh: true }` payload from the schedule.

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import { fetchContributions, DEFAULT_USER } from '../../../shared/githubContributions.js'

const TABLE = process.env.TABLE_NAME
const SHARED_KEY = process.env.PORTFOLIO_KEY
const MAX_AGE_MS = Number(process.env.MAX_AGE_SECONDS || 3600) * 1000

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const keyFor = (user, year) => ({ pk: `CONTRIB#${user}#${year}`, sk: 'SNAPSHOT' })

const reply = (statusCode, body, source) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'X-Origin-Source': source },
  body: JSON.stringify(body),
})

async function readSnapshot(user, year) {
  const res = await ddb.send(new GetCommand({ TableName: TABLE, Key: keyFor(user, year) }))
  return res.Item || null
}

async function writeSnapshot(user, year, payload) {
  await ddb.send(new PutCommand({
    TableName: TABLE,
    Item: {
      ...keyFor(user, year),
      payload: JSON.stringify(payload),
      total: payload.total,
      fetchedAt: Date.now(),
      // Snapshots for past years stop being refreshed; let them age out rather
      // than accumulate forever.
      ttl: Math.floor(Date.now() / 1000) + 400 * 24 * 3600,
    },
  }))
}

// Returns the payload, refreshing from GitHub only when the snapshot is missing
// or stale. A failed scrape is non-fatal as long as we still hold a snapshot —
// a slightly old graph beats a broken one.
async function resolve(user, year, force) {
  const snapshot = await readSnapshot(user, year)
  const fresh = snapshot && Date.now() - snapshot.fetchedAt < MAX_AGE_MS

  if (snapshot && fresh && !force) {
    return { payload: JSON.parse(snapshot.payload), source: 'ddb-fresh' }
  }

  try {
    const payload = await fetchContributions(user, year)
    await writeSnapshot(user, year, payload)
    return { payload, source: 'github' }
  } catch (err) {
    if (snapshot) {
      console.warn('scrape failed, serving stale snapshot:', err.message)
      return { payload: JSON.parse(snapshot.payload), source: 'ddb-stale' }
    }
    throw err
  }
}

export async function handler(event = {}) {
  const year = Number(event.year) || new Date().getFullYear()
  const scheduled = !event.requestContext

  // Scheduled warm-up: no HTTP contract, just refresh and report.
  if (scheduled) {
    const { payload, source } = await resolve(
      event.user || process.env.GITHUB_USER || DEFAULT_USER,
      year,
      event.refresh !== false,
    )
    console.log(JSON.stringify({ msg: 'warmed', source, total: payload.total, year }))
    return { ok: true, source, total: payload.total }
  }

  // Only Cloudflare should reach the Function URL. This is a throttle, not a
  // security boundary — the data is public either way.
  const headers = event.headers || {}
  if (SHARED_KEY && headers['x-portfolio-key'] !== SHARED_KEY) {
    return reply(403, { error: 'forbidden' }, 'auth')
  }

  const q = event.queryStringParameters || {}
  const user = q.user || process.env.GITHUB_USER || DEFAULT_USER
  const wanted = Number(q.year) || year

  try {
    const { payload, source } = await resolve(user, wanted, false)
    return reply(200, payload, source)
  } catch (err) {
    console.error('no snapshot and scrape failed:', err)
    return reply(502, { error: String(err.message || err) }, 'error')
  }
}
