import assert from 'node:assert/strict'
import { readFile, realpath, stat } from 'node:fs/promises'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
const members = [
  { id: 'dsh-claudelike-ui', dir: 'dsh-claudelike-ui', name: '@miorin/dsh-claudelike-ui' },
  { id: 'dsh-hide-signed-in-card', dir: 'dsh-hide-signed-in-card', name: '@miorin/dsh-hide-signed-in-card' },
  { id: 'dsh-sidebar-brand', dir: 'dsh-sidebar-brand', name: '@miorin/dsh-sidebar-brand' },
  { id: 'dsh-aggressive-sidebar', dir: 'dsh-aggressive-sidebar', name: '@miorin/dsh-aggressive-sidebar' },
  { id: 'dsh-peak-pricing-sidebar', dir: 'dsh-peak-pricing-sidebar', name: '@miorin/dsh-peak-pricing-sidebar' },
]

const read = (path: string) => readFile(new URL(path, root), 'utf8')

function parseInsertRows(patch: string) {
  const rows: Array<{ id: string; name: string }> = []
  let current: { id?: string; name?: string } | undefined
  for (const rawLine of patch.split(/\r?\n/u)) {
    const line = rawLine.trim()
    if (line === '' || line.startsWith('#') || line === '- insert:') continue
    const idMatch = line.match(/^- id:\s*(.+)$/u)
    if (idMatch) {
      if (current !== undefined) rows.push({ id: current.id ?? '', name: current.name ?? '' })
      current = { id: idMatch[1].replace(/^['"]|['"]$/gu, '') }
      continue
    }
    const nameMatch = line.match(/^name:\s*(.+)$/u)
    if (nameMatch && current !== undefined) {
      current.name = nameMatch[1].replace(/^['"]|['"]$/gu, '')
    }
  }
  if (current !== undefined) rows.push({ id: current.id ?? '', name: current.name ?? '' })
  return rows
}

test('inserts the five original plugin rows in order plus the aggregate runtime row', async () => {
  const manifest = JSON.parse(await read('package.json'))
  const names = members.map(member => member.name)
  assert.equal(manifest.private, true)
  assert.equal(manifest.exports['.'], './index.js')
  assert.equal(manifest.exports['./client'], './client.js')
  assert.deepEqual(manifest.dsh.bundle, { patch: './cordis.patch.yml' })
  assert.equal(manifest.dsh.client.platform, 'web')
  assert.equal(manifest.dsh.client.immediately, true)
  assert.deepEqual(manifest.dsh.aggregate, {
    version: 1,
    runtimeRowId: 'dsh-atlas-visual',
    plugins: names,
  })
  const rows = parseInsertRows(await read(manifest.dsh.bundle.patch))
  assert.deepEqual(rows, [
    ...members.map(({ id, name }) => ({ id, name })),
    { id: 'dsh-atlas-visual', name: '@miorin/dsh-atlas-visual' },
  ])
  assert.equal(new Set(rows.map(row => row.id)).size, rows.length)
})

for (const { dir, name } of members) {
  test(`resolves ${name} from its sibling checkout`, async () => {
    const checkout = await realpath(new URL(`../${dir}/`, root))
    const installed = await realpath(new URL(`node_modules/${name}/`, root))
    assert.equal(installed, checkout)
    const manifest = JSON.parse(await read(`node_modules/${name}/package.json`))
    assert.equal(manifest.name, name)
    for (const entry of [name, `${name}/client`, `${name}/locale/en.json`, `${name}/icon`]) {
      assert.ok((await stat(fileURLToPath(import.meta.resolve(entry)))).isFile(), entry)
    }
  })
}
