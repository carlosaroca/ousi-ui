import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// The light theme sets :root, which weighs the same as .dark and [data-theme="dark"]. On <html>
// the one imported last wins, so with light after dark the dark mode did nothing there.
describe('theme entry point', () => {
  const entry = readFileSync(resolve(__dirname, '../../theme/src/index.css'), 'utf8')
  const importsOf = (name: string) => entry.indexOf(`@import "./themes/${name}.css";`)

  it('imports the dark theme after the light one, so dark mode works on <html>', () => {
    expect(importsOf('ousi-light')).toBeGreaterThan(-1)
    expect(importsOf('ousi-dark')).toBeGreaterThan(importsOf('ousi-light'))
  })
})
