<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { OButton, OSelect, OTooltip, ODrawer } from '@ousi-ui/vue'
import type { SelectOption } from '@ousi-ui/vue'

definePageMeta({ layout: false })
useSeoMeta({ title: 'Playground — Ousi UI' })

const DEFAULTS = {
  hue: 220, base: 240, font: 'Inter',
  radius: 'md', formRadius: 'lg', theme: 'light',
} as const

// ── Read URL params on load (only non-defaults are in the URL) ──
const route = useRoute()
const q = route.query

const accentHue = ref(q.hue ? parseInt(String(q.hue)) : DEFAULTS.hue)
const baseHue = ref(q.base ? parseInt(String(q.base)) : DEFAULTS.base)
const fontFamily = ref<string | number>(q.font ? String(q.font) : DEFAULTS.font)
const radius = ref<string | number>(q.radius ? String(q.radius) : DEFAULTS.radius)
const radiusForm = ref<string | number>(q.formRadius ? String(q.formRadius) : DEFAULTS.formRadius)
const theme = ref<string | number>(q.theme ? String(q.theme) : DEFAULTS.theme)

const accent = ref(accentHue.value === DEFAULTS.hue ? '#006FEE' : `hsl(${accentHue.value}, 70%, 50%)`)
const base = ref(baseHue.value === DEFAULTS.base ? '#71717A' : `hsl(${baseHue.value}, 10%, 45%)`)
const copied = ref(false)
const linkCopied = ref(false)
const drawerOpen = ref(false)

// ── Sync state → URL params (debounced, only non-defaults) ──
let syncTimer: ReturnType<typeof setTimeout> | null = null
watch([accentHue, baseHue, fontFamily, radius, radiusForm, theme], () => {
  if (syncTimer) clearTimeout(syncTimer)
  syncTimer = setTimeout(() => {
    const p = new URLSearchParams()
    if (accentHue.value !== DEFAULTS.hue) p.set('hue', String(accentHue.value))
    if (baseHue.value !== DEFAULTS.base) p.set('base', String(baseHue.value))
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
const fontSelectOptions: SelectOption[] = [
  { value: 'Inter', label: 'Inter' }, { value: 'Figtree', label: 'Figtree' },
  { value: 'Geist', label: 'Geist' }, { value: 'DM Sans', label: 'DM Sans' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono' }, { value: 'system-ui', label: 'System UI' },
]

const radiusMap: Record<string, string> = {
  none: '0px', xs: '0.125rem', sm: '0.25rem', md: '0.5rem', lg: '0.75rem', xl: '1rem',
}

function updateAccentHue(e: Event) {
  const h = parseInt((e.target as HTMLInputElement).value)
  accentHue.value = h
  accent.value = `hsl(${h}, 70%, 50%)`
}
function updateBaseHue(e: Event) {
  const h = parseInt((e.target as HTMLInputElement).value)
  baseHue.value = h
  base.value = `hsl(${h}, 10%, 45%)`
}
function resetTheme() {
  accentHue.value = DEFAULTS.hue; baseHue.value = DEFAULTS.base
  accent.value = '#006FEE'; base.value = '#71717A'
  fontFamily.value = DEFAULTS.font; radius.value = DEFAULTS.radius
  radiusForm.value = DEFAULTS.formRadius; theme.value = DEFAULTS.theme
  window.history.replaceState(null, '', '/playground')
}

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

const cssOutput = computed(() => {
  const r = radiusMap[String(radius.value)] ?? '0.5rem'
  const rf = radiusMap[String(radiusForm.value)] ?? '0.5rem'
  const a = accent.value
  const b = base.value
  const f = fontFamily.value
  const isDark = String(theme.value) === 'dark'
  const selector = isDark ? '[data-theme="dark"]' : ':root'

  return `/*
 * Ousi UI — Custom Theme
 * Generated from Playground
 * https://ousiui.com/playground
 */

${selector} {
  /* ── Accent ── */
  --ousi-accent: ${a};
  --ousi-accent-hover: color-mix(in oklab, ${a} 90%, ${isDark ? 'white' : 'black'} 10%);
  --ousi-accent-soft: color-mix(in oklab, ${a} 15%, transparent);
  --ousi-accent-soft-foreground: ${a};
  --ousi-accent-soft-hover: color-mix(in oklab, ${a} 20%, transparent);
  --ousi-accent-foreground: #ffffff;
  --ousi-focus: ${a};

  /* ── Base ── */
  --ousi-muted: ${b};

  /* ── Typography ── */
  --ousi-font-sans: '${f}', system-ui, sans-serif;

  /* ── Radius ── */
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

const previewTheme = computed(() => String(theme.value) as 'light' | 'dark')
const previewRadius = computed(() => radiusMap[String(radius.value)] ?? '0.5rem')
const previewRadiusField = computed(() => radiusMap[String(radiusForm.value)] ?? '0.5rem')
const previewFont = computed(() => String(fontFamily.value))
</script>

<template>
  <div class="flex flex-col h-dvh bg-ousi-background overflow-hidden" :data-theme="theme">

    <!-- Header -->
    <div class="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 py-2 sm:py-3">
      <div class="flex items-center gap-2 sm:gap-3">
        <NuxtLink to="/" class="flex items-center gap-2">
          <img src="/logo-dark.png" alt="Ousi UI" class="h-6 w-auto" />
          <span class="text-lg font-bold tracking-tight text-ousi-foreground">Playground</span>
        </NuxtLink>
        <OTooltip content="Reset to defaults">
          <button class="size-8 flex items-center justify-center rounded-full text-ousi-muted hover:bg-ousi-default transition-colors" @click="resetTheme">
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
          </button>
        </OTooltip>
      </div>
      <div class="flex items-center gap-1">
        <!-- Theme toggle -->
        <div class="flex items-center rounded-full bg-ousi-default p-0.5">
          <button :class="['size-7 flex items-center justify-center rounded-full transition-all duration-150', theme === 'light' ? 'bg-ousi-surface shadow-sm text-ousi-foreground' : 'text-ousi-muted']" @click="theme = 'light'">
            <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
          </button>
          <button :class="['size-7 flex items-center justify-center rounded-full transition-all duration-150', theme === 'dark' ? 'bg-ousi-surface shadow-sm text-ousi-foreground' : 'text-ousi-muted']" @click="theme = 'dark'">
            <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
          </button>
        </div>
        <OTooltip :content="linkCopied ? 'Copied!' : 'Share link'">
          <button class="size-8 flex items-center justify-center rounded-full text-ousi-muted hover:bg-ousi-default transition-colors" @click="copyLink">
            <svg v-if="!linkCopied" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
            <svg v-else class="size-4 text-ousi-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" /></svg>
          </button>
        </OTooltip>
        <button class="h-8 flex items-center gap-1.5 rounded-full px-3 text-xs font-medium text-ousi-muted hover:text-ousi-foreground hover:bg-ousi-default transition-colors" @click="drawerOpen = true">
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
          <span class="hidden sm:inline">Download</span>
        </button>
      </div>
    </div>

    <!-- Preview -->
    <div class="flex-1 min-h-0 px-4 sm:px-6">
      <ClientOnly>
        <PlaygroundPreview
          :accent-color="accent"
          :base-color="base"
          :font-family="previewFont"
          :radius="previewRadius"
          :radius-field="previewRadiusField"
          :theme="previewTheme"
          height="100%"
          class="mx-auto w-full max-w-[1400px] h-full"
        />
      </ClientOnly>
    </div>

    <!-- Bottom controls — sticky bar -->
    <div class="shrink-0 border-t border-ousi-border bg-ousi-background overflow-x-auto py-4 sm:py-5 px-4 sm:px-6">
      <div class="flex items-end gap-4 sm:gap-6 sm:justify-center min-w-max sm:min-w-0">
        <div class="flex flex-col gap-1.5 shrink-0">
          <span class="text-xs font-medium text-ousi-foreground">Accent</span>
          <div class="flex items-center gap-2">
            <input type="range" min="0" max="360" :value="accentHue" @input="updateAccentHue"
              class="w-28 sm:w-36 h-4 rounded-full cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-gray-300"
              :style="{ background: 'linear-gradient(to right, hsl(0,70%,55%), hsl(60,70%,55%), hsl(120,70%,55%), hsl(180,70%,55%), hsl(240,70%,55%), hsl(300,70%,55%), hsl(360,70%,55%))' }" />
            <div class="size-5 rounded-full shrink-0 border border-ousi-border" :style="{ backgroundColor: accent }" />
          </div>
        </div>
        <div class="flex flex-col gap-1.5 shrink-0">
          <span class="text-xs font-medium text-ousi-foreground">Base</span>
          <input type="range" min="0" max="360" :value="baseHue" @input="updateBaseHue"
            class="w-24 sm:w-28 h-4 rounded-full cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-gray-300"
            :style="{ background: 'linear-gradient(to right, hsl(0,10%,50%), hsl(60,10%,50%), hsl(120,10%,50%), hsl(180,10%,50%), hsl(240,10%,50%), hsl(300,10%,50%))' }" />
        </div>
        <div class="flex flex-col gap-1.5 shrink-0" style="width: 150px">
          <span class="text-xs font-medium text-ousi-foreground">Font</span>
          <OSelect v-model="fontFamily" :options="fontSelectOptions" size="sm" variant="secondary" full-width />
        </div>
        <div class="flex flex-col gap-1.5 shrink-0" style="width: 130px">
          <span class="text-xs font-medium text-ousi-foreground">Radius</span>
          <OSelect v-model="radius" :options="radiusSelectOptions" size="sm" variant="secondary" full-width />
        </div>
        <div class="flex flex-col gap-1.5 shrink-0" style="width: 130px">
          <span class="text-xs font-medium text-ousi-foreground">Field Radius</span>
          <OSelect v-model="radiusForm" :options="formRadiusSelectOptions" size="sm" variant="secondary" full-width />
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
  </div>
</template>
