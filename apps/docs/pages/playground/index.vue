<script setup lang="ts">
import { ref, computed, watch, watchEffect, onBeforeUnmount } from 'vue'
import { OButton, OSelect, OTooltip, ODrawer, OColorSlider } from '@ousi-ui/vue'
import type { SelectOption } from '@ousi-ui/vue'
import LandingShowcase from '~/components/landing/LandingShowcase.vue'

definePageMeta({ layout: 'landing' })
useSeoMeta({ title: 'Playground — Ousi UI' })

const DEFAULTS = {
  hue: 220, base: 240, shadow: 220,
  shadowScale: 'subtle',
  font: 'Inter',
  radius: 'md', formRadius: 'lg',
  theme: 'light',
} as const

// ── URL params on load ──
const route = useRoute()
const q = route.query

const accentHue = ref(q.hue ? parseInt(String(q.hue)) : DEFAULTS.hue)
const baseHue = ref(q.base ? parseInt(String(q.base)) : DEFAULTS.base)
const shadowHue = ref(q.shadow ? parseInt(String(q.shadow)) : DEFAULTS.shadow)
const shadowScale = ref<string | number>(q.shadowScale ? String(q.shadowScale) : DEFAULTS.shadowScale)
const fontFamily = ref<string | number>(q.font ? String(q.font) : DEFAULTS.font)
const radius = ref<string | number>(q.radius ? String(q.radius) : DEFAULTS.radius)
const radiusForm = ref<string | number>(q.formRadius ? String(q.formRadius) : DEFAULTS.formRadius)
const theme = ref<string | number>(q.theme ? String(q.theme) : DEFAULTS.theme)

const accent = computed(() =>
  accentHue.value === DEFAULTS.hue ? '#1b5cff' : `hsl(${accentHue.value}, 70%, 50%)`,
)
const base = computed(() =>
  baseHue.value === DEFAULTS.base ? '#71717A' : `hsl(${baseHue.value}, 10%, 45%)`,
)

const copied = ref(false)
const linkCopied = ref(false)
const drawerOpen = ref(false)

// ── URL sync ──
let syncTimer: ReturnType<typeof setTimeout> | null = null
watch([accentHue, baseHue, shadowHue, shadowScale, fontFamily, radius, radiusForm, theme], () => {
  if (syncTimer) clearTimeout(syncTimer)
  syncTimer = setTimeout(() => {
    const p = new URLSearchParams()
    if (accentHue.value !== DEFAULTS.hue) p.set('hue', String(accentHue.value))
    if (baseHue.value !== DEFAULTS.base) p.set('base', String(baseHue.value))
    if (shadowHue.value !== DEFAULTS.shadow) p.set('shadow', String(shadowHue.value))
    if (String(shadowScale.value) !== DEFAULTS.shadowScale) p.set('shadowScale', String(shadowScale.value))
    if (String(fontFamily.value) !== DEFAULTS.font) p.set('font', String(fontFamily.value))
    if (String(radius.value) !== DEFAULTS.radius) p.set('radius', String(radius.value))
    if (String(radiusForm.value) !== DEFAULTS.formRadius) p.set('formRadius', String(radiusForm.value))
    if (String(theme.value) !== DEFAULTS.theme) p.set('theme', String(theme.value))
    const qs = p.toString()
    const url = qs ? `/playground?${qs}` : '/playground'
    window.history.replaceState(null, '', url)
  }, 300)
})

const radiusSelectOptions: SelectOption[] = [
  { value: 'none', label: 'None' }, { value: 'xs', label: 'Extra Small' },
  { value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' },
]
const formRadiusSelectOptions: SelectOption[] = [
  { value: 'none', label: 'None' }, { value: 'xs', label: 'Extra Small' },
  { value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' }, { value: 'xl', label: 'Extra Large' },
]
const shadowScaleOptions: SelectOption[] = [
  { value: 'none',     label: 'None' },
  { value: 'subtle',   label: 'Subtle' },
  { value: 'normal',   label: 'Normal' },
  { value: 'strong',   label: 'Strong' },
  { value: 'dramatic', label: 'Dramatic' },
]

const shadowScaleMap: Record<string, number> = {
  none: 0,
  subtle: 0.5,
  normal: 1,
  strong: 1.5,
  dramatic: 2.2,
}

const fontSelectOptions: SelectOption[] = [
  { value: 'Inter', label: 'Inter' }, { value: 'Figtree', label: 'Figtree' },
  { value: 'Geist', label: 'Geist' }, { value: 'DM Sans', label: 'DM Sans' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono' }, { value: 'system-ui', label: 'System UI' },
]

const radiusMap: Record<string, string> = {
  none: '0px', xs: '0.125rem', sm: '0.25rem', md: '0.5rem', lg: '0.75rem', xl: '1rem',
}

function resetTheme() {
  accentHue.value = DEFAULTS.hue
  baseHue.value = DEFAULTS.base
  shadowHue.value = DEFAULTS.shadow
  shadowScale.value = DEFAULTS.shadowScale
  fontFamily.value = DEFAULTS.font
  radius.value = DEFAULTS.radius
  radiusForm.value = DEFAULTS.formRadius
  theme.value = DEFAULTS.theme
  window.history.replaceState(null, '', '/playground')
}

// ── Dynamic font loading ──
const loadedFonts = new Set<string>()
watch(fontFamily, (font) => {
  const f = String(font)
  if (f === 'system-ui' || loadedFonts.has(f)) return
  loadedFonts.add(f)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${f.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`
  document.head.appendChild(link)
})

// ── Apply theme CSS vars on the section (for tiles) AND html (for teleported popovers) ──
// - Tiles live inside <section>. Applying inline vars there beats the layout's
//   [data-theme="X"] stylesheet rules which would otherwise reset them.
// - Popovers (OSelect, ODatePicker) teleport to <body>, direct children of <html>.
//   Applying the same vars on html covers those.
const sectionRef = ref<HTMLElement | null>(null)

const VAR_KEYS = [
  '--ousi-accent', '--ousi-muted', '--ousi-shadow-color', '--ousi-font-sans',
  '--ousi-radius', '--ousi-radius-xs', '--ousi-radius-sm', '--ousi-radius-md',
  '--ousi-radius-lg', '--ousi-radius-xl', '--ousi-radius-2xl', '--ousi-radius-3xl',
  '--ousi-radius-4xl', '--ousi-radius-field',
  '--ousi-shadow-xs', '--ousi-shadow-sm', '--ousi-shadow-md',
  '--ousi-shadow-lg', '--ousi-shadow-xl', '--ousi-shadow-2xl',
]

// Base alphas per shadow level (matches themes/ousi-light.css).
const SHADOW_ALPHAS = { xs: 0.15, sm: 0.25, md: 0.17, lg: 0.13, xl: 0.10, xl2: 0.09 }

function buildShadow(scale: number): Record<string, string> {
  const a = (v: number) => (v * scale).toFixed(4)
  return {
    '--ousi-shadow-xs':
      `0.5px 1px 1px hsl(var(--ousi-shadow-color) / ${a(SHADOW_ALPHAS.xs)})`,
    '--ousi-shadow-sm':
      `1px 2px 2px hsl(var(--ousi-shadow-color) / ${a(SHADOW_ALPHAS.sm)})`,
    '--ousi-shadow-md': [
      `1px 2px 2px hsl(var(--ousi-shadow-color) / ${a(SHADOW_ALPHAS.md)})`,
      `2px 4px 4px hsl(var(--ousi-shadow-color) / ${a(SHADOW_ALPHAS.md)})`,
      `3px 6px 6px hsl(var(--ousi-shadow-color) / ${a(SHADOW_ALPHAS.md)})`,
    ].join(', '),
    '--ousi-shadow-lg': [
      `1px 2px 2px hsl(var(--ousi-shadow-color) / ${a(SHADOW_ALPHAS.lg)})`,
      `2px 4px 4px hsl(var(--ousi-shadow-color) / ${a(SHADOW_ALPHAS.lg)})`,
      `4px 8px 8px hsl(var(--ousi-shadow-color) / ${a(SHADOW_ALPHAS.lg)})`,
      `8px 16px 16px hsl(var(--ousi-shadow-color) / ${a(SHADOW_ALPHAS.lg)})`,
    ].join(', '),
    '--ousi-shadow-xl': [
      `1px 2px 2px hsl(var(--ousi-shadow-color) / ${a(SHADOW_ALPHAS.xl)})`,
      `2px 4px 4px hsl(var(--ousi-shadow-color) / ${a(SHADOW_ALPHAS.xl)})`,
      `4px 8px 8px hsl(var(--ousi-shadow-color) / ${a(SHADOW_ALPHAS.xl)})`,
      `8px 16px 16px hsl(var(--ousi-shadow-color) / ${a(SHADOW_ALPHAS.xl)})`,
      `16px 32px 32px hsl(var(--ousi-shadow-color) / ${a(SHADOW_ALPHAS.xl)})`,
    ].join(', '),
    '--ousi-shadow-2xl': [
      `1.5px 3px 3px hsl(var(--ousi-shadow-color) / ${a(SHADOW_ALPHAS.xl2)})`,
      `3px 6px 6px hsl(var(--ousi-shadow-color) / ${a(SHADOW_ALPHAS.xl2)})`,
      `6px 12px 12px hsl(var(--ousi-shadow-color) / ${a(SHADOW_ALPHAS.xl2)})`,
      `12px 24px 24px hsl(var(--ousi-shadow-color) / ${a(SHADOW_ALPHAS.xl2)})`,
      `24px 48px 48px hsl(var(--ousi-shadow-color) / ${a(SHADOW_ALPHAS.xl2)})`,
    ].join(', '),
  }
}

function applyVars(el: HTMLElement | null) {
  if (!el) return
  const r = radiusMap[String(radius.value)] ?? '0.5rem'
  const rf = radiusMap[String(radiusForm.value)] ?? '0.5rem'
  const scale = shadowScaleMap[String(shadowScale.value)] ?? 1
  const shadows = buildShadow(scale)

  el.style.setProperty('--ousi-accent', accent.value)
  el.style.setProperty('--ousi-muted', base.value)
  el.style.setProperty('--ousi-shadow-color', `${shadowHue.value} 40% 10%`)
  el.style.setProperty('--ousi-font-sans', `'${fontFamily.value}', system-ui, sans-serif`)
  el.style.setProperty('--ousi-radius', r)
  el.style.setProperty('--ousi-radius-xs', `calc(${r} * 0.25)`)
  el.style.setProperty('--ousi-radius-sm', `calc(${r} * 0.5)`)
  el.style.setProperty('--ousi-radius-md', `calc(${r} * 0.75)`)
  el.style.setProperty('--ousi-radius-lg', r)
  el.style.setProperty('--ousi-radius-xl', `calc(${r} * 1.5)`)
  el.style.setProperty('--ousi-radius-2xl', `calc(${r} * 2)`)
  el.style.setProperty('--ousi-radius-3xl', `calc(${r} * 3)`)
  el.style.setProperty('--ousi-radius-4xl', `calc(${r} * 4)`)
  el.style.setProperty('--ousi-radius-field', rf)
  for (const [k, v] of Object.entries(shadows)) el.style.setProperty(k, v)
}

watchEffect(() => {
  if (typeof document === 'undefined') return
  applyVars(sectionRef.value)
  applyVars(document.documentElement)
})

// Clean up html-level vars when leaving the playground so other pages aren't polluted.
onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  for (const key of VAR_KEYS) document.documentElement.style.removeProperty(key)
})

// ── CSS output for download ──
const cssOutput = computed(() => {
  const r = radiusMap[String(radius.value)] ?? '0.5rem'
  const rf = radiusMap[String(radiusForm.value)] ?? '0.5rem'
  const a = accent.value
  const b = base.value
  const f = fontFamily.value
  const sh = `${shadowHue.value} 40% 10%`
  const isDark = String(theme.value) === 'dark'
  const selector = isDark ? '[data-theme="dark"]' : ':root'

  return `/*
 * Ousi UI — Custom Theme
 * Generated from Playground
 */

${selector} {
  --ousi-accent: ${a};
  --ousi-accent-hover: color-mix(in oklab, ${a} 90%, ${isDark ? 'white' : 'black'} 10%);
  --ousi-accent-soft: color-mix(in oklab, ${a} 15%, transparent);
  --ousi-accent-soft-foreground: ${a};
  --ousi-accent-foreground: #ffffff;
  --ousi-focus: ${a};
  --ousi-muted: ${b};
  --ousi-shadow-color: ${sh};
  --ousi-font-sans: '${f}', system-ui, sans-serif;
  --ousi-radius: ${r};
  --ousi-radius-field: ${rf};
}`
})

function copyCss() {
  navigator.clipboard.writeText(cssOutput.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
function downloadCss() {
  const blob = new Blob([cssOutput.value], { type: 'text/css' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'ousi-theme.css'
  a.click()
}
function copyLink() {
  navigator.clipboard.writeText(window.location.href)
  linkCopied.value = true
  setTimeout(() => (linkCopied.value = false), 2000)
}
</script>

<template>
  <section ref="sectionRef" class="relative overflow-hidden" :data-theme="theme">
    <div class="absolute inset-0 -z-10 pointer-events-none">
      <div
        class="absolute top-1/3 left-1/4 w-[700px] h-[500px] rounded-full blur-3xl opacity-30"
        :style="{ background: `radial-gradient(circle, ${accent}22, transparent 70%)` }"
      />
      <div class="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full bg-ousi-accent/5 blur-3xl" />
    </div>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 pt-6 md:pt-10 pb-16 md:pb-24">
      <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-12 lg:gap-8 items-start">

        <!-- ═══ LEFT — Theme controls ═══ -->
        <div class="relative lg:sticky lg:top-24 max-w-sm space-y-5">
          <!-- Title + description -->
          <div>
            <p class="text-xs font-semibold text-ousi-muted uppercase tracking-wide mb-1">Playground</p>
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-ousi-foreground leading-tight">
              Theme your Ousi UI
            </h1>
            <p class="text-sm text-ousi-muted mt-2">
              Adjust the tokens. The showcase updates in real time.
            </p>
          </div>

          <div class="rounded-ousi-2xl border border-ousi-border/60 bg-ousi-surface p-5 space-y-4">

            <!-- Hue sliders (using OColorSlider) -->
            <div class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-3 items-center">
              <label class="text-xs font-semibold text-ousi-foreground">Accent</label>
              <OColorSlider
                v-model="accentHue"
                channel="hue"
                :context-color="{ s: 70, l: 50 }"
              />

              <label class="text-xs font-semibold text-ousi-foreground">Base</label>
              <OColorSlider
                v-model="baseHue"
                channel="hue"
                :context-color="{ s: 10, l: 50 }"
              />

              <label class="text-xs font-semibold text-ousi-foreground">Shadow</label>
              <OColorSlider
                v-model="shadowHue"
                channel="hue"
                :context-color="{ s: 40, l: 30 }"
              />
            </div>

            <div class="h-px bg-ousi-border/60" />

            <!-- Font + Radius + Shadow scale selects -->
            <div class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2.5 items-center">
              <label class="text-xs font-semibold text-ousi-foreground">Font</label>
              <OSelect v-model="fontFamily" :options="fontSelectOptions" size="sm" variant="secondary" />

              <label class="text-xs font-semibold text-ousi-foreground">Radius</label>
              <OSelect v-model="radius" :options="radiusSelectOptions" size="sm" variant="secondary" />

              <label class="text-xs font-semibold text-ousi-foreground">Field</label>
              <OSelect v-model="radiusForm" :options="formRadiusSelectOptions" size="sm" variant="secondary" />

              <label class="text-xs font-semibold text-ousi-foreground">Shadows</label>
              <OSelect v-model="shadowScale" :options="shadowScaleOptions" size="sm" variant="secondary" />
            </div>

            <div class="h-px bg-ousi-border/60" />

            <!-- Theme + Actions row -->
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center rounded-full bg-ousi-default p-0.5">
                <button :class="['size-6 flex items-center justify-center rounded-full transition-all duration-150', theme === 'light' ? 'bg-ousi-surface shadow-sm text-ousi-foreground' : 'text-ousi-muted']" @click="theme = 'light'" aria-label="Light">
                  <svg class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
                </button>
                <button :class="['size-6 flex items-center justify-center rounded-full transition-all duration-150', theme === 'dark' ? 'bg-ousi-surface shadow-sm text-ousi-foreground' : 'text-ousi-muted']" @click="theme = 'dark'" aria-label="Dark">
                  <svg class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
                </button>
              </div>

              <div class="flex items-center gap-1">
                <OTooltip :content="linkCopied ? 'Copied!' : 'Share'">
                  <button class="size-7 flex items-center justify-center rounded-full text-ousi-muted hover:bg-ousi-default/60 transition" @click="copyLink">
                    <svg v-if="!linkCopied" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
                    <svg v-else class="size-3.5 text-ousi-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" /></svg>
                  </button>
                </OTooltip>
                <OTooltip content="Reset">
                  <button class="size-7 flex items-center justify-center rounded-full text-ousi-muted hover:bg-ousi-default/60 transition" @click="resetTheme">
                    <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                  </button>
                </OTooltip>
                <OButton size="sm" @click="drawerOpen = true">Export theme</OButton>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══ RIGHT — Showcase (inherits theme from :root) ═══ -->
        <div class="space-y-8">
          <!-- Button variants — quick visual check across the full set -->
          <div class="rounded-ousi-2xl">
            <div class="flex flex-wrap items-center gap-2.5">
              <OButton variant="primary">Primary</OButton>
              <OButton variant="secondary">Secondary</OButton>
              <OButton variant="outline">Outline</OButton>
              <OButton variant="text">Text</OButton>
              <OButton variant="soft">Soft</OButton>
              <OButton variant="danger">Danger</OButton>
              <OButton variant="danger-soft">Danger Soft</OButton>
            </div>
          </div>

          <LandingShowcase />
        </div>
      </div>
    </div>

    <!-- CSS Export Drawer -->
    <ClientOnly>
      <ODrawer v-model="drawerOpen" placement="right" class="!w-[90vw] sm:!w-[60vw] lg:!w-[40vw] !max-w-[600px]">
        <template #trigger><span /></template>
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between px-6 py-4 border-b border-ousi-border">
            <div>
              <h2 class="text-lg font-semibold text-ousi-foreground">Theme CSS</h2>
              <p class="text-xs text-ousi-muted mt-0.5">Copy or download your custom tokens</p>
            </div>
            <button class="text-ousi-muted hover:text-ousi-foreground transition-colors" @click="drawerOpen = false">
              <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" /></svg>
            </button>
          </div>
          <div class="flex-1 overflow-auto p-6">
            <pre class="text-xs font-mono text-ousi-foreground bg-ousi-default rounded-ousi-xl p-4 overflow-x-auto whitespace-pre">{{ cssOutput }}</pre>
          </div>
          <div class="flex items-center gap-3 px-6 py-4 border-t border-ousi-border">
            <OButton variant="primary" class="flex-1" @click="copyCss">
              {{ copied ? 'Copied!' : 'Copy to clipboard' }}
            </OButton>
            <OButton variant="secondary" @click="downloadCss">Download</OButton>
          </div>
        </div>
      </ODrawer>
    </ClientOnly>
  </section>
</template>
