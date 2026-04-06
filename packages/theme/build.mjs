import { cpSync, mkdirSync, rmSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const src = resolve(__dirname, 'src')
const dist = resolve(__dirname, 'dist')

// Clean
rmSync(dist, { recursive: true, force: true })

// Copy entire src tree to dist (CSS files only structure)
cpSync(src, dist, {
  recursive: true,
  filter: (source) => {
    // Skip .ts files — only copy .css
    if (source.endsWith('.ts')) return false
    return true
  },
})

console.log('@ousi-ui/theme: CSS files copied to dist/')
