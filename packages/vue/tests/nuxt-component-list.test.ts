import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { App } from 'vue'
import { install } from '../src/plugin/install'

// The Nuxt module auto-imports from a list of its own. A component missing there works with the
// Vue plugin and silently renders as an unknown element in Nuxt.
describe('Nuxt module', () => {
  it('auto-imports the same components the Vue plugin registers', () => {
    const registered: string[] = []
    install({ component: (name: string) => registered.push(name), directive: () => {} } as unknown as App)

    const source = readFileSync(resolve(__dirname, '../../nuxt/src/module.ts'), 'utf8')
    const list = source.match(/const COMPONENTS = \[([\s\S]*?)\] as const/)
    const autoImported = [...(list?.[1] ?? '').matchAll(/'(\w+)'/g)].map((m) => m[1])

    expect(registered.length).toBeGreaterThan(100)
    expect([...autoImported].sort()).toEqual([...registered].sort())
  })
})
