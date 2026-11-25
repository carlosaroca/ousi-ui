#!/usr/bin/env node
/**
 * Builds everything an AI assistant needs to use Ousi UI correctly, from the same data the docs use:
 *
 *   public/llms.txt                      index, following the llms.txt convention
 *   public/llms-full.txt                 conventions + every component, in one file
 *   public/ai/conventions.md             setup, rules, tokens and known quirks
 *   public/ai/components/<slug>.md       one file per component (also what "Copy for AI" copies)
 *   public/skills/ousi-ui/...            a Claude skill (SKILL.md + references)
 *   public/skills/ousi-ui.tar.gz         the same skill, installable with one command
 *
 * It runs before dev, build and generate, so the output never goes stale. Nothing here is committed:
 * the single sources are data/components/*.ts, ai/*.md, and the theme package.
 *
 * It also compares the documented props of each component with the real props in the component's
 * `*.types.ts` and prints what differs: an assistant is only as right as the docs it reads.
 * `node scripts/build-ai.mjs --drift` prints the full list.
 */
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const ts = require('typescript')

const docs = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const repo = path.resolve(docs, '../..')
const SITE = (process.env.SITE_URL || 'https://ousiui.com').replace(/\/$/, '')
const SHOW_DRIFT = process.argv.includes('--drift')

// The data files are TypeScript. A tiny loader is enough: they only import types and each other.
require.extensions['.ts'] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    fileName: filename,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  })
  module._compile(outputText, filename)
}
const { componentRegistry } = require(path.join(docs, 'data/components/index.ts'))

const slugs = Object.keys(componentRegistry)
const COUNT = slugs.length

const fill = (text) => text.replaceAll('{{COUNT}}', String(COUNT)).replaceAll('{{SITE}}', SITE)
const read = (rel) => fs.readFileSync(path.join(docs, rel), 'utf8')

// ───────────────────────── component markdown ─────────────────────────

const hasDefault = (p) => p.default !== undefined && p.default !== '' && p.default !== '-'
const propLine = (p) =>
  `- \`${p.name}\` (\`${p.type}\`${hasDefault(p) ? `, default \`${p.default}\`` : ''}): ${p.description}`

function section(title, defs) {
  return defs?.length ? `\n## ${title}\n\n${defs.map(propLine).join('\n')}\n` : ''
}

function componentMd(slug, d) {
  const out = []
  out.push(`# ${d.title}`)
  out.push(`\n${d.description}\n`)
  out.push(`Category: ${d.category}. Docs: ${SITE}/vue/components/${slug}\n`)
  out.push(`## Import\n\n\`\`\`ts\n${d.importCode}\n\`\`\`\n`)

  if (d.sections?.length) {
    out.push('## Examples\n')
    for (const s of d.sections) out.push(`### ${s.title}\n\n\`\`\`vue\n${s.example.code}\n\`\`\`\n`)
  }

  out.push(section('Props', d.props).trimEnd() + '\n')
  const extra = undocumentedProps(slug)
  if (extra.length) {
    out.push(`## Also accepted\n\nThese props exist in the component's type definition but are not yet described on its docs page. Types are exact; descriptions come from the source comments when there are any.\n\n${extra.map((p) => `- \`${p.name}\` (\`${p.type}\`)${p.doc ? `: ${p.doc}` : ''}`).join('\n')}\n`)
  }
  out.push(section('Slots', d.slots).trimEnd() + '\n')
  out.push(section('Events', d.emits).trimEnd() + '\n')
  out.push(section('Methods (via template ref)', d.methods).trimEnd() + '\n')
  if (d.parts?.length) {
    out.push('## Parts\n\nThis is a compound component: each part is its own export with its own API.\n')
    for (const part of d.parts) {
      const block = [`### ${part.name}\n\n${part.description}\n`]
      for (const [title, defs] of [['Props', part.props], ['Slots', part.slots], ['Events', part.emits]]) {
        if (defs?.length) block.push(`${title}:\n\n${defs.map(propLine).join('\n')}\n`)
      }
      out.push(block.join('\n'))
    }
  }

  if (d.keyboard?.length) {
    out.push(`## Keyboard\n\n${d.keyboard.map((k) => `- \`${k.key}\`: ${k.description}`).join('\n')}\n`)
  }
  if (d.aria?.length) {
    out.push(`## ARIA\n\n${d.aria.map((a) => `- \`${a.attribute}\` (${a.condition}): ${a.description}`).join('\n')}\n`)
  }
  if (d.bestPractices?.length) {
    out.push(`## Best practices\n\n${d.bestPractices.map((b) => `- ${b.good ? 'Do' : 'Avoid'}: ${b.text}`).join('\n')}\n`)
  }
  if (d.haptics) {
    out.push(`## Haptics\n\nDefault preset \`${d.haptics.defaultPreset}\`. Fires: ${d.haptics.trigger}.${d.haptics.notes ? ` ${d.haptics.notes}` : ''}\n`)
  }
  return out.filter(Boolean).join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'
}

// ───────────────────────── tokens (from the theme package) ─────────────────────────

function tokensMd() {
  const css = fs.readFileSync(path.join(repo, 'packages/theme/src/shared/theme.css'), 'utf8')
  const names = (kind) => [...css.matchAll(new RegExp(`--${kind}-ousi-([\\w-]+):`, 'g'))].map((m) => m[1])
  const colors = names('color')
  const radii = names('radius')
  const shadows = names('shadow')

  const core = [
    ['background', 'page background'],
    ['foreground', 'main text'],
    ['surface', 'cards and panels'],
    ['default', 'subtle fills: tracks, secondary buttons, hover'],
    ['muted', 'secondary text'],
    ['border', 'borders and dividers'],
    ['accent', 'brand and primary actions'],
    ['success', 'positive'],
    ['warning', 'caution'],
    ['danger', 'errors and destructive actions'],
    ['orange', 'pending'],
    ['violet', 'sent or submitted'],
    ['focus', 'focus ring'],
  ]
  const lines = ['## Design tokens', '']
  lines.push('Every color is a CSS variable `--ousi-<name>` and a Tailwind utility (`bg-ousi-<name>`, `text-ousi-<name>`, `border-ousi-<name>`, `ring-ousi-<name>`). Override the variables to retheme; the dark theme redefines the same names.', '')
  lines.push('Core tokens:', '')
  for (const [n, what] of core) if (colors.includes(n)) lines.push(`- \`${n}\`: ${what}`)
  lines.push('', `All color utilities: ${colors.map((c) => `\`${c}\``).join(', ')}.`)
  if (radii.length) lines.push('', `Radius utilities (\`rounded-ousi-*\`): ${radii.map((c) => `\`${c}\``).join(', ')}.`)
  if (shadows.length) lines.push('', `Shadow utilities (\`shadow-ousi-*\`): ${shadows.map((c) => `\`${c}\``).join(', ')}.`)
  return lines.join('\n') + '\n'
}

// ───────────────────────── catalogue ─────────────────────────

function exportsOf(d) {
  const m = d.importCode.match(/import\s*\{([^}]+)\}/)
  return m ? m[1].split(',').map((s) => s.trim()).filter(Boolean) : []
}

function catalogueMd() {
  const byCategory = new Map()
  for (const slug of slugs) {
    const d = componentRegistry[slug]
    if (!byCategory.has(d.category)) byCategory.set(d.category, [])
    byCategory.get(d.category).push(slug)
  }
  const out = ['# Components', '', `${COUNT} components. The reference of each one is \`references/components/<slug>.md\`.`, '']
  for (const [category, list] of byCategory) {
    out.push(`## ${category}`, '')
    for (const slug of list) {
      const d = componentRegistry[slug]
      out.push(`- \`${exportsOf(d).join('`, `')}\` (${slug}): ${d.description}`)
    }
    out.push('')
  }
  return out.join('\n')
}

// ───────────────────────── drift between docs and the real types ─────────────────────────

const typedCache = new Map()

/** Props declared in the component's `*.types.ts`: name -> { type, doc }. */
function typedProps(slug) {
  if (typedCache.has(slug)) return typedCache.get(slug)
  const dir = path.join(repo, 'packages/vue/src/components', slug)
  let props = null
  if (fs.existsSync(dir)) {
    const found = new Map()
    for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.types.ts'))) {
      const source = ts.createSourceFile(f, fs.readFileSync(path.join(dir, f), 'utf8'), ts.ScriptTarget.ES2020, true)
      source.forEachChild((node) => {
        if (ts.isInterfaceDeclaration(node) && /Props$/.test(node.name.text)) {
          for (const m of node.members) {
            if (!ts.isPropertySignature(m) || !m.name) continue
            const doc = (m.jsDoc ?? []).map((d) => (typeof d.comment === 'string' ? d.comment : '')).join(' ').replace(/\s+/g, ' ').trim()
            found.set(m.name.getText(source), { type: (m.type?.getText(source) ?? 'unknown').replace(/\s+/g, ' '), doc })
          }
        }
      })
    }
    if (found.size) props = found
  }
  typedCache.set(slug, props)
  return props
}

/** Props the component really has that its docs page does not describe. */
function undocumentedProps(slug) {
  const real = typedProps(slug)
  if (!real) return []
  const d = componentRegistry[slug]
  const documented = new Set([...d.props, ...(d.parts ?? []).flatMap((part) => part.props ?? [])].map((p) => p.name.replace(/^v-model:?/, 'modelValue')))
  // `haptic` has its own section on pages that support it, and `class` is universal.
  return [...real].filter(([n]) => !documented.has(n) && n !== 'class' && !(n === 'haptic' && d.haptics)).map(([name, v]) => ({ name, ...v }))
}

function drift() {
  const rows = []
  for (const slug of slugs) {
    const real = typedProps(slug)
    if (!real) continue
    const documented = new Set([...componentRegistry[slug].props, ...(componentRegistry[slug].parts ?? []).flatMap((part) => part.props ?? [])].map((p) => p.name.replace(/^v-model:?/, 'modelValue')))
    const missing = undocumentedProps(slug).map((p) => p.name)
    const extra = [...documented].filter((n) => !real.has(n) && !['modelValue', 'class'].includes(n))
    if (missing.length || extra.length) rows.push({ slug, missing, extra })
  }
  return rows
}

// ───────────────────────── tar.gz, without dependencies ─────────────────────────

function tarGz(entries) {
  const blocks = []
  for (const { name, data } of entries) {
    if (Buffer.byteLength(name) > 100) throw new Error(`path too long for tar: ${name}`)
    const h = Buffer.alloc(512)
    h.write(name, 0, 'utf8')
    h.write('0000644\0', 100)
    h.write('0000000\0', 108)
    h.write('0000000\0', 116)
    h.write(data.length.toString(8).padStart(11, '0') + '\0', 124)
    h.write('14000000000\0', 136) // fixed time: the output is the same on every build
    h.write('        ', 148)
    h.write('0', 156)
    h.write('ustar\0', 257)
    h.write('00', 263)
    let sum = 0
    for (const b of h) sum += b
    h.write(sum.toString(8).padStart(6, '0') + '\0 ', 148)
    blocks.push(h, data, Buffer.alloc((512 - (data.length % 512)) % 512))
  }
  blocks.push(Buffer.alloc(1024))
  return zlib.gzipSync(Buffer.concat(blocks), { level: 9 })
}

// ───────────────────────── write everything ─────────────────────────

const pub = path.join(docs, 'public')
for (const p of ['ai', 'skills', 'llms.txt', 'llms-full.txt']) fs.rmSync(path.join(pub, p), { recursive: true, force: true })

const write = (rel, text) => {
  const file = path.join(pub, rel)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, text)
}

const conventions = fill(read('ai/conventions.md')) + '\n' + tokensMd()
const catalogue = catalogueMd()
const perComponent = Object.fromEntries(slugs.map((s) => [s, componentMd(s, componentRegistry[s])]))

write('ai/conventions.md', conventions)
for (const s of slugs) write(`ai/components/${s}.md`, perComponent[s])

// llms.txt: the index
const byCategory = new Map()
for (const s of slugs) {
  const c = componentRegistry[s].category
  if (!byCategory.has(c)) byCategory.set(c, [])
  byCategory.get(c).push(s)
}
const llms = [
  '# Ousi UI',
  '',
  `> Vue 3 component library with ${COUNT} accessible components, built on Tailwind CSS v4 and OKLCH design tokens. Dark mode, TypeScript types and built-in i18n.`,
  '',
  'Import components by name from `@ousi-ui/vue` (they start with `O`) and import the theme once with `@import "@ousi-ui/theme";`. Read a component reference before using it: props, variants and sizes differ between components.',
  '',
  '## Start here',
  '',
  `- [Conventions and setup](${SITE}/ai/conventions.md): installation, rules, design tokens and known quirks`,
  `- [Full documentation in one file](${SITE}/llms-full.txt): conventions plus every component reference`,
  `- [Claude skill](${SITE}/vue/getting-started/ai): how to install the Ousi UI skill for Claude Code`,
  '',
  '## Components',
  '',
]
for (const [category, list] of byCategory) {
  llms.push(`### ${category}`, '')
  for (const s of list) llms.push(`- [${componentRegistry[s].title}](${SITE}/ai/components/${s}.md): ${componentRegistry[s].description}`)
  llms.push('')
}
llms.push('## Optional', '', `- [Playground](${SITE}/playground): live theme editor`, `- [Changelog](${SITE}/changelog)`, '')
write('llms.txt', llms.join('\n'))

// llms-full.txt
write('llms-full.txt', [conventions, ...slugs.map((s) => perComponent[s])].join('\n---\n\n'))

// The skill
const skillMd = `---
name: ousi-ui
description: Build Vue 3 interfaces with Ousi UI (@ousi-ui/vue). Use when a project imports from @ousi-ui/vue, uses O-prefixed components such as OButton, OInput, OSelect, ODatePicker, OTabs, ODialog or OBarChart, uses ousi-* Tailwind classes, or when asked to add, style, theme or migrate UI with Ousi UI. Gives the exact props, variants, tokens and known quirks so they are not guessed.
---

${fill(read('ai/skill.md'))}`
const skillFiles = [
  ['ousi-ui/SKILL.md', skillMd],
  ['ousi-ui/references/conventions.md', conventions],
  ['ousi-ui/references/components.md', catalogue],
  ...slugs.map((s) => [`ousi-ui/references/components/${s}.md`, perComponent[s]]),
]
for (const [rel, text] of skillFiles) write(`skills/${rel}`, text)
fs.writeFileSync(path.join(pub, 'skills/ousi-ui.tar.gz'), tarGz(skillFiles.map(([name, text]) => ({ name, data: Buffer.from(text) }))))

// ───────────────────────── report ─────────────────────────

const kb = (rel) => (fs.statSync(path.join(pub, rel)).size / 1024).toFixed(0)
console.log(`[ai] ${COUNT} components -> llms.txt, llms-full.txt (${kb('llms-full.txt')} KB), ai/, skills/ousi-ui (${kb('skills/ousi-ui.tar.gz')} KB tar.gz)`)

const rows = drift()
if (rows.length) {
  console.log(`[ai] docs vs types: ${rows.length} of ${slugs.length} components document different props than their types define${SHOW_DRIFT ? ':' : ' (run with --drift to list them)'}`)
  if (SHOW_DRIFT) {
    for (const r of rows) {
      console.log(`  ${r.slug}${r.missing.length ? `\n    not documented: ${r.missing.join(', ')}` : ''}${r.extra.length ? `\n    documented but not in types: ${r.extra.join(', ')}` : ''}`)
    }
  }
} else {
  console.log('[ai] docs and types agree on every component prop')
}
