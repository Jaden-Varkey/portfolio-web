// Bundles the Lambda handlers into self-contained artefacts under infra/build/.
//
// SAM's own `BuildMethod: esbuild` needs CodeUri to cover both the handler and
// the shared parser it imports, which means pointing it at the repo root — and
// SAM then copies the whole tree (node_modules included) into a temp dir. On
// Windows that reliably fails cleaning that dir up again. Bundling here instead
// keeps each artefact to a few KB, makes the deploy fast, and means `sam deploy`
// only ever zips two tiny folders.
//
// Run via `npm run infra:build` from the repo root.

import { build } from 'esbuild'
import { mkdir, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const out = resolve(here, 'build')

await rm(out, { recursive: true, force: true })

const fns = ['contrib', 'events']

for (const name of fns) {
  const dir = resolve(out, name)
  await mkdir(dir, { recursive: true })
  await build({
    entryPoints: [resolve(here, 'lambda', name, 'index.mjs')],
    outfile: resolve(dir, 'index.mjs'),
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node22',
    minify: true,
    sourcemap: false,
    // Provided by the managed Node 22 runtime; bundling it would only inflate
    // the artefact.
    external: ['@aws-sdk/*'],
  })
  console.log(`built infra/build/${name}/index.mjs`)
}
