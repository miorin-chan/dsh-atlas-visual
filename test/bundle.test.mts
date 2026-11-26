import assert from 'node:assert/strict'
import { readFile, realpath, stat } from 'node:fs/promises'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const root = new URL('../', import.meta.url)
const members = [
  { id: 'dsh-claudelike-ui', dir: 'dsh-claudelike-ui', name: '@miorin/dsh-claudelike-ui' },
  { id: 'dsh-hide-signed-in-card', dir: 'dsh-hide-signed-in-card', name: '@miorin/dsh-hide-signed-in-card' },
  { id: 'dsh-sidebar-brand', dir: 'dsh-sidebar-brand', name: '@miorin/dsh-sidebar-brand' },
  { id: 'dsh-aggressive-sidebar', dir: 'dsh-aggressive-sidebar', name: '@miorin/dsh-aggressive-sidebar' },
  { id: 'dsh-subtle-sidebar', dir: 'dsh-subtle-sidebar', name: '@miorin/dsh-subtle-sidebar' },
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

test('inserts the six plugin rows in order plus the aggregate runtime row', async () => {
  const manifest = JSON.parse(await read('package.json'))
  const names = members.map(member => member.name)
  assert.notEqual(manifest.private, true)
  assert.equal(manifest.publishConfig?.access, 'public')
  assert.equal(manifest.exports['.'], './index.js')
  assert.equal(manifest.exports['./client'], './client.js')
  assert.deepEqual(manifest.dsh.bundle, { patch: './cordis.patch.yml' })
  assert.equal(manifest.dsh.client.platform, 'web')
  assert.equal(manifest.dsh.client.immediately, true)
  assert.deepEqual(manifest.dsh.aggregate, {
    version: 1,
    runtimeRowId: 'dsh-atlas-visual',
    plugins: names,
    defaults: Object.fromEntries(names.map(name => [name, true])),
  })
  const rows = parseInsertRows(await read(manifest.dsh.bundle.patch))
  assert.deepEqual(rows, [
    ...members.map(({ id, name }) => ({ id, name })),
    { id: 'dsh-atlas-visual', name: '@miorin/dsh-atlas-visual' },
  ])
  assert.equal(new Set(rows.map(row => row.id)).size, rows.length)
})

for (const { dir, name } of members) {
  test(`resolves ${name} runtime exports`, async () => {
    const pkg = JSON.parse(await read('package.json'))
    const spec = pkg.dependencies?.[name]
    const installed = await realpath(new URL(`node_modules/${name}/`, root))
    if (typeof spec === 'string' && spec.startsWith('link:')) {
      const checkout = await realpath(new URL(`../${dir}/`, root))
      assert.equal(installed, checkout)
    }
    const manifest = JSON.parse(await read(`node_modules/${name}/package.json`))
    assert.equal(manifest.name, name)
    for (const entry of [name, `${name}/client`, `${name}/locale/en.json`, `${name}/icon`]) {
      assert.ok((await stat(fileURLToPath(import.meta.resolve(entry)))).isFile(), entry)
    }
  })
}

test('declares packaged English and Chinese meta.detail documents', async () => {
  const manifest = JSON.parse(await read('package.json'))
  const en = JSON.parse(await read('locale/en.json'))
  const zh = JSON.parse(await read('locale/zh.json'))
  assert.equal(en.meta.detail, 'README.md')
  assert.equal(zh.meta.detail, 'README.zh.md')
  for (const detail of [en.meta.detail, zh.meta.detail]) {
    assert.ok(manifest.files.includes(detail), `${detail} should be listed in package.json files`)
    assert.ok((await stat(fileURLToPath(new URL(detail, root)))).isFile(), detail)
  }
})

test('loads built index.js and client.js via ModuleLoader envelope', async () => {
  const hostMod = await import(new URL('index.js', root).href) as { name?: unknown; apply?: unknown }
  assert.equal(hostMod.name, '@miorin/dsh-atlas-visual')
  assert.equal(typeof hostMod.apply, 'function')

  const clientCode = await read('client.js')
  let loaded: { id: string; factory: (req: (id: string) => unknown) => Record<string, unknown> } | undefined
  vm.runInNewContext(clientCode, {
    window: { __ModuleLoader__: { load(payload: typeof loaded) { loaded = payload } } },
  })
  assert.equal(loaded?.id, '@miorin/dsh-atlas-visual')
  const mod = loaded!.factory(id => {
    if (id === 'react') {
      return {
        Fragment: Symbol('Fragment'),
        createElement: () => null,
        useEffect: () => {},
        useId: () => 'id',
        useRef: (v: unknown) => ({ current: v }),
        useState: (v: unknown) => [v, () => {}],
        useSyncExternalStore: (_sub: unknown, get: () => unknown) => get(),
      }
    }
    if (id === '@deepseek-ai/dsh-client-ui-primitives') {
      return {
        Button: () => null,
        IconChevronRightOutlineRegular: () => null,
        IconChevronsUpDownOutlineMedium: () => null,
        Modal: () => null,
        PluginArtworkSubagent: () => null,
        Switch: () => null,
        Tooltip: ({ children }: { children: unknown }) => children,
      }
    }
    throw new Error(`unexpected require: ${id}`)
  }) as { inject: readonly string[]; apply: (ctx: unknown) => void }
  assert.deepEqual([...mod.inject], ['locale', 'slots', 'remote', 'remote.pluginManager'])
  assert.equal(typeof mod.apply, 'function')
})
