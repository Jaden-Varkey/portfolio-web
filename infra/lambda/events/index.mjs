// Anonymous usage counters.
//
// Counters only — no raw event rows, no identifiers, no IP, no user agent.
// At this traffic a monthly tally answers every question raw rows would, at a
// fraction of the writes, and there is nothing stored that could identify a
// visitor even in principle.

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb'

const TABLE = process.env.TABLE_NAME
const SHARED_KEY = process.env.PORTFOLIO_KEY

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const NO_CONTENT = { statusCode: 204, body: '' }

// These strings become DynamoDB sort keys and the sender is the open internet,
// so each field gets the narrowest character set that still does its job.
// Paths and hostnames need separators; section ids are plain slugs.
const cleanPath = (s, max = 48) =>
  typeof s === 'string' ? s.replace(/[^a-zA-Z0-9._/-]/g, '').slice(0, max) : ''
const cleanId = (s, max = 32) =>
  typeof s === 'string' ? s.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, max) : ''

const month = () => new Date().toISOString().slice(0, 7)

async function bump(sk) {
  await ddb.send(new UpdateCommand({
    TableName: TABLE,
    Key: { pk: `STATS#${month()}`, sk },
    UpdateExpression: 'ADD #n :one SET #ttl = if_not_exists(#ttl, :ttl)',
    ExpressionAttributeNames: { '#n': 'count', '#ttl': 'ttl' },
    ExpressionAttributeValues: {
      ':one': 1,
      ':ttl': Math.floor(Date.now() / 1000) + 400 * 24 * 3600,
    },
  }))
}

export async function handler(event = {}) {
  const headers = event.headers || {}
  if (SHARED_KEY && headers['x-portfolio-key'] !== SHARED_KEY) {
    return { statusCode: 403, body: '' }
  }

  let body
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return NO_CONTENT // malformed input isn't worth an error page
  }

  const targets = []
  if (body.t === 'view') {
    targets.push('TOTAL')
    const path = cleanPath(body.p)
    if (path) targets.push(`PATH#${path}`)
    const ref = cleanPath(body.r)
    if (ref) targets.push(`REF#${ref}`)
  } else if (body.t === 'section') {
    const id = cleanId(body.id)
    if (id) targets.push(`SECTION#${id}`)
  }

  if (!targets.length) return NO_CONTENT

  // One failed counter shouldn't sink the rest.
  await Promise.allSettled(targets.map(bump))
  return NO_CONTENT
}
