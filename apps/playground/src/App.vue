<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import {
  OButton, OSelect, OTooltip, ODrawer,
} from '@ousi-ui/vue'
import type { SelectOption } from '@ousi-ui/vue'
import ComponentPreview from '../../shared/ComponentPreview.vue'

// ── Defaults ──────────────────────────────────────────────────
const DEFAULTS = {
  hue: 220,
  base: 240,
  font: 'Inter',
  radius: 'md',
  formRadius: 'lg',
  theme: 'light',
} as const

// ── Read URL params (only non-defaults are in the URL) ────────
const params = new URLSearchParams(window.location.search)

const accentHue = ref(parseInt(params.get('hue') || String(DEFAULTS.hue)))
const baseHue = ref(parseInt(params.get('base') || String(DEFAULTS.base)))
const fontFamily = ref<string | number>(params.get('font') || DEFAULTS.font)
const radius = ref<string | number>(params.get('radius') || DEFAULTS.radius)
const radiusForm = ref<string | number>(params.get('formRadius') || DEFAULTS.formRadius)
const theme = ref<string | number>(params.get('theme') || DEFAULTS.theme)

// Derive accent/base colors from hue values
const accent = ref(`hsl(${accentHue.value}, 70%, 50%)`)
const base = ref(`hsl(${baseHue.value}, 10%, 45%)`)

// Reset to default blue if hue is default
if (accentHue.value === DEFAULTS.hue) accent.value = '#006FEE'
if (baseHue.value === DEFAULTS.base) base.value = '#71717A'

const copied = ref(false)
const linkCopied = ref(false)
const drawerOpen = ref(false)

// ── Options ───────────────────────────────────────────────────
const radiusSelectOptions: SelectOption[] = [
  { value: 'none', label: 'None' },
  { value: 'xs', label: 'Extra Small' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
]

const formRadiusSelectOptions: SelectOption[] = [
  { value: 'none', label: 'None' },
  { value: 'xs', label: 'Extra Small' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
]

const fontSelectOptions: SelectOption[] = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Figtree', label: 'Figtree' },
  { value: 'Hanken Grotesk', label: 'Hanken Grotesk' },
  { value: 'Geist', label: 'Geist' },
  { value: 'DM Sans', label: 'DM Sans' },
  { value: 'Public Sans', label: 'Public Sans' },
  { value: 'Bricolage Grotesque', label: 'Bricolage Grotesque' },
  { value: 'Varela Round', label: 'Varela Round' },
  { value: 'Fraunces', label: 'Fraunces' },
  { value: 'IBM Plex Mono', label: 'IBM Plex Mono' },
  { value: 'Fredoka', label: 'Fredoka' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono' },
  { value: 'system-ui', label: 'System UI' },
]

const radiusMap: Record<string, string> = {
  none: '0px', xs: '0.125rem', sm: '0.25rem', md: '0.5rem', lg: '0.75rem', xl: '1rem',
}

// ── Apply to :root (for header/footer theming) ───────────────
function applyTheme() {
  const root = document.documentElement
  root.setAttribute('data-theme', String(theme.value))
  if (theme.value === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')

  root.style.setProperty('--ousi-accent', accent.value)
  root.style.setProperty('--ousi-focus', accent.value)
  root.style.setProperty('--ousi-accent-hover', `color-mix(in oklab, ${accent.value}, black 10%)`)
  root.style.setProperty('--ousi-accent-soft', `color-mix(in oklab, ${accent.value}, transparent 85%)`)
  root.style.setProperty('--ousi-accent-soft-foreground', `color-mix(in oklab, ${accent.value}, black 20%)`)
  root.style.setProperty('--ousi-accent-foreground', '#ffffff')
  root.style.setProperty('--ousi-muted', base.value)
  root.style.setProperty('--font-sans', `'${fontFamily.value}', system-ui, sans-serif`)
  root.style.setProperty('--ousi-radius', radiusMap[String(radius.value)] ?? '0.5rem')
  root.style.setProperty('--ousi-radius-field', radiusMap[String(radiusForm.value)] ?? '0.5rem')
}
watch([accent, base, fontFamily, radius, radiusForm, theme], applyTheme, { deep: true })
onMounted(applyTheme)

// ── Google Fonts ──────────────────────────────────────────────
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

// ── Reset to defaults ─────────────────────────────────────────
function resetTheme() {
  accentHue.value = DEFAULTS.hue
  baseHue.value = DEFAULTS.base
  accent.value = '#006FEE'
  base.value = '#71717A'
  fontFamily.value = DEFAULTS.font
  radius.value = DEFAULTS.radius
  radiusForm.value = DEFAULTS.formRadius
  theme.value = DEFAULTS.theme
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

// ── Sync state → URL params (only non-defaults, debounced) ────
let syncTimer: ReturnType<typeof setTimeout> | null = null
watch([fontFamily, radius, radiusForm, theme, accentHue, baseHue], () => {
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
    const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname
    window.history.replaceState(null, '', url)
  }, 300)
})

function copyLink() {
  navigator.clipboard.writeText(window.location.href)
  linkCopied.value = true
  setTimeout(() => (linkCopied.value = false), 2000)
}

// ── CSS output + export ───────────────────────────────────────
const cssOutput = computed(() => `:root {
  /* Accent */
  --ousi-accent: ${accent.value};
  --ousi-accent-hover: color-mix(in oklab, ${accent.value}, black 10%);
  --ousi-accent-soft: color-mix(in oklab, ${accent.value}, transparent 85%);
  --ousi-accent-soft-foreground: color-mix(in oklab, ${accent.value}, black 20%);
  --ousi-accent-foreground: #ffffff;
  --ousi-focus: ${accent.value};

  /* Base */
  --ousi-muted: ${base.value};

  /* Typography */
  --font-sans: '${fontFamily.value}', system-ui, sans-serif;

  /* Radius */
  --ousi-radius: ${radiusMap[String(radius.value)] ?? '0.5rem'};
  --ousi-radius-field: ${radiusMap[String(radiusForm.value)] ?? '0.5rem'};
}`)

function copyCss() {
  navigator.clipboard.writeText(cssOutput.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
function downloadCss() {
  const blob = new Blob([cssOutput.value], { type: 'text/css' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'ousi-theme.css'
  a.click()
  URL.revokeObjectURL(url)
}

// ── Computed props for preview ────────────────────────────────
const previewTheme = computed(() => String(theme.value) as 'light' | 'dark')
const previewRadius = computed(() => radiusMap[String(radius.value)] ?? '0.5rem')
const previewRadiusField = computed(() => radiusMap[String(radiusForm.value)] ?? '0.5rem')
const previewFont = computed(() => String(fontFamily.value))
</script>

<template>
  <div class="grid h-dvh grid-rows-[auto_1fr_auto] bg-ousi-background px-3 sm:px-6 overflow-hidden">

    <!-- ── Top header bar ── -->
    <div class="mx-auto flex w-full max-w-[1400px] items-center justify-between py-2 sm:py-3">
      <!-- Left: Logo + action icons -->
      <div class="flex items-center gap-2 sm:gap-3">
        <span class="text-lg font-bold text-ousi-foreground tracking-tight">ousi</span>
        <div class="hidden sm:flex items-center gap-1 ml-1">
          <OTooltip content="Undo">
            <button class="size-8 flex items-center justify-center rounded-ousi-lg text-ousi-muted hover:bg-ousi-default transition-colors">
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6.69 3L3 13" /></svg>
            </button>
          </OTooltip>
          <OTooltip content="Redo">
            <button class="size-8 flex items-center justify-center rounded-ousi-lg text-ousi-muted hover:bg-ousi-default transition-colors">
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 019-9 9 9 0 016.69 3L21 13" /></svg>
            </button>
          </OTooltip>
        </div>
        <OTooltip content="Reset to defaults">
          <button
            class="size-8 flex items-center justify-center rounded-ousi-lg text-ousi-muted hover:bg-ousi-default transition-colors"
            @click="resetTheme"
          >
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
          </button>
        </OTooltip>
      </div>

      <div class="flex-1" />

      <!-- Right: Theme tabs + Share + Export -->
      <div class="flex items-center gap-1">
        <div class="flex items-center rounded-ousi-xl bg-ousi-default p-0.5">
          <OTooltip content="Light mode">
            <button
              :class="[
                'size-7 flex items-center justify-center rounded-ousi-lg transition-all duration-150',
                theme === 'light'
                  ? 'bg-ousi-surface shadow-sm text-ousi-foreground'
                  : 'text-ousi-muted hover:text-ousi-foreground',
              ]"
              @click="theme = 'light'"
            >
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
            </button>
          </OTooltip>
          <OTooltip content="Dark mode">
            <button
              :class="[
                'size-7 flex items-center justify-center rounded-ousi-lg transition-all duration-150',
                theme === 'dark'
                  ? 'bg-ousi-surface shadow-sm text-ousi-foreground'
                  : 'text-ousi-muted hover:text-ousi-foreground',
              ]"
              @click="theme = 'dark'"
            >
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
            </button>
          </OTooltip>
        </div>
        <OTooltip :content="linkCopied ? 'Copied!' : 'Copy shareable link'">
          <button
            class="size-8 flex items-center justify-center rounded-ousi-lg text-ousi-muted hover:text-ousi-foreground hover:bg-ousi-default transition-colors"
            @click="copyLink"
          >
            <svg v-if="!linkCopied" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
            <svg v-else class="size-4 text-ousi-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 6L9 17l-5-5" /></svg>
          </button>
        </OTooltip>
        <OTooltip content="Export theme CSS">
          <button
            class="h-8 flex items-center gap-1.5 rounded-ousi-lg px-3 text-xs font-medium text-ousi-muted hover:text-ousi-foreground hover:bg-ousi-default transition-colors"
            @click="drawerOpen = true"
          >
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
            <span class="hidden sm:inline">Download Theme</span>
          </button>
        </OTooltip>
      </div>
    </div>

    <!-- ── Preview window (shared component) ── -->
    <ComponentPreview
      :accent-color="accent"
      :base-color="base"
      :font-family="previewFont"
      :radius="previewRadius"
      :radius-field="previewRadiusField"
      :theme="previewTheme"
      height="100%"
      class="mx-auto w-full max-w-[1400px]"
    />

    <!-- ── BOTTOM BAR ── -->
    <div class="overflow-x-auto py-4 sm:py-6">
      <div class="flex items-end gap-4 sm:gap-6 px-2 sm:px-0 sm:justify-center min-w-max sm:min-w-0">

        <!-- Accent -->
        <div class="flex flex-col gap-1.5 shrink-0">
          <span class="text-xs font-medium text-ousi-foreground">Accent</span>
          <div class="flex items-center gap-2">
            <input
              type="range" min="0" max="360"
              :value="accentHue"
              @input="updateAccentHue"
              class="w-28 sm:w-36 h-4 rounded-full cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-gray-300"
              :style="{ background: 'linear-gradient(to right, hsl(0,70%,55%), hsl(60,70%,55%), hsl(120,70%,55%), hsl(180,70%,55%), hsl(240,70%,55%), hsl(300,70%,55%), hsl(360,70%,55%))' }"
            />
            <div class="size-5 rounded-full shrink-0 border border-ousi-border" :style="{ backgroundColor: accent }" />
          </div>
        </div>

        <!-- Base -->
        <div class="flex flex-col gap-1.5 shrink-0">
          <span class="text-xs font-medium text-ousi-foreground">Base</span>
          <div class="flex items-center gap-2">
            <input
              type="range" min="0" max="360"
              :value="baseHue"
              @input="updateBaseHue"
              class="w-24 sm:w-28 h-4 rounded-full cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-gray-300"
              :style="{ background: 'linear-gradient(to right, hsl(0,10%,50%), hsl(60,10%,50%), hsl(120,10%,50%), hsl(180,10%,50%), hsl(240,10%,50%), hsl(300,10%,50%))' }"
            />
          </div>
        </div>

        <!-- Font Family -->
        <div class="flex flex-col gap-1.5 shrink-0" style="width: 150px">
          <span class="text-xs font-medium text-ousi-foreground">Font Family</span>
          <OSelect v-model="fontFamily" :options="fontSelectOptions" placeholder="Font" size="sm" variant="secondary" full-width />
        </div>

        <!-- Radius -->
        <div class="flex flex-col gap-1.5 shrink-0" style="width: 140px">
          <span class="text-xs font-medium text-ousi-foreground">Radius</span>
          <OSelect v-model="radius" :options="radiusSelectOptions" placeholder="Radius" size="sm" variant="secondary" full-width />
        </div>

        <!-- Radius Form -->
        <div class="flex flex-col gap-1.5 shrink-0" style="width: 140px">
          <span class="text-xs font-medium text-ousi-foreground">Radius Form</span>
          <OSelect v-model="radiusForm" :options="formRadiusSelectOptions" placeholder="Field" size="sm" variant="secondary" full-width />
        </div>

      </div>
    </div>

    <!-- ── CSS Export Drawer ── -->
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
            <svg class="size-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke-linecap="round" /></svg>
            {{ copied ? 'Copied!' : 'Copy to clipboard' }}
          </OButton>
          <OButton variant="secondary" @click="downloadCss">
            <svg class="size-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke-linecap="round" stroke-linejoin="round" /></svg>
            Download
          </OButton>
        </div>
      </div>
    </ODrawer>
  </div>
</template>
