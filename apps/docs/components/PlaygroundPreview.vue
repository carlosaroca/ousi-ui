<script setup lang="ts">
import {
  OButton, OInput, OSelect, OCheckbox, OSwitch, ORadio, ORadioGroup,
  OSpinner, OSlider, OInputOtp, OAccordion, OAnimatedNumber, OChart,
  OAvatar, OTooltip, OSeparator, OKbd, OTabs, OCard, OCardHeader, OCardTitle, OCardDescription, OCardContent, OScrollShadow,
} from '@ousi-ui/vue'
import type { SelectOption, TabItem, ChartPoint } from '@ousi-ui/vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  accentColor?: string
  baseColor?: string
  fontFamily?: string
  radius?: string
  radiusField?: string
  theme?: 'light' | 'dark'
  height?: string
}>(), {
  accentColor: undefined,
  baseColor: undefined,
  fontFamily: undefined,
  radius: undefined,
  radiusField: undefined,
  theme: undefined,
  height: '600px',
})

// ── Scoped inline styles from props ──
const scopedStyles = computed(() => {
  const s: Record<string, string> = {}
  if (props.accentColor) {
    s['--ousi-accent'] = props.accentColor
    s['--ousi-focus'] = props.accentColor
    s['--ousi-accent-hover'] = `color-mix(in oklab, ${props.accentColor}, black 10%)`
    s['--ousi-accent-soft'] = `color-mix(in oklab, ${props.accentColor}, transparent 85%)`
    s['--ousi-accent-soft-foreground'] = `color-mix(in oklab, ${props.accentColor}, black 20%)`
    s['--ousi-accent-foreground'] = '#ffffff'
  }
  if (props.baseColor) {
    s['--ousi-muted'] = props.baseColor
  }
  if (props.fontFamily) {
    s['--font-sans'] = `'${props.fontFamily}', system-ui, sans-serif`
  }
  if (props.radius) {
    s['--ousi-radius'] = props.radius
  }
  if (props.radiusField) {
    s['--ousi-radius-field'] = props.radiusField
  }
  return s
})

// ── Demo interactive state ──
const demoCheck = ref(true)
const demoSwitch1 = ref(true)
const demoNotif = ref(true)
const demoRadio = ref('b')
const demoSlider = ref(250)
const demoTab1 = ref('1d')
const demoTab2 = ref('chats')
const demoOtp = ref('432')
const demoSelect = ref<string | number>('')
const accordionKey = ref<string | null>('features')

const stateOptions: SelectOption[] = [
  { value: 'florida', label: 'Florida' },
  { value: 'delaware', label: 'Delaware' },
  { value: 'california', label: 'California' },
  { value: 'texas', label: 'Texas' },
  { value: 'new-york', label: 'New York' },
  { value: 'washington', label: 'Washington' },
]

const tabItems1: TabItem[] = [
  { key: '1d', label: '1D' }, { key: '7d', label: '7D' },
  { key: '1m', label: '1M' }, { key: '1y', label: '1Y' },
  { key: 'all', label: 'All' },
]
const tabItems2: TabItem[] = [
  { key: 'chats', label: 'Chats' },
  { key: 'emails', label: 'Emails' },
]

// ── Animated Numbers — cycle through 5 animations ──
const animations = ['roll', 'count', 'slide', 'fade', 'flip'] as const
const animIndex = ref(0)
const animValue = ref(1284)
let animInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  animInterval = setInterval(() => {
    animIndex.value = (animIndex.value + 1) % animations.length
    animValue.value = Math.round(Math.random() * 9000 + 1000)
  }, 1000)
})
onUnmounted(() => { if (animInterval) clearInterval(animInterval) })

// ── Chart data ──
const chartData = ref<ChartPoint[]>([])
const chartValue = ref(100)
let chartInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  const now = Date.now() / 1000
  let v = 100
  const pts: ChartPoint[] = []
  for (let i = 60; i >= 0; i--) {
    v += (Math.random() - 0.5) * 0.4
    pts.push({ time: now - i, value: v })
  }
  chartData.value = pts
  chartValue.value = v

  chartInterval = setInterval(() => {
    chartValue.value += (Math.random() - 0.5) * 0.3
    chartData.value = [...chartData.value.slice(-120), { time: Date.now() / 1000, value: chartValue.value }]
  }, 500)
})
onUnmounted(() => { if (chartInterval) clearInterval(chartInterval) })
</script>

<template>
  <div
    :style="{ height, ...scopedStyles }"
    :data-theme="theme"
    :class="{ dark: theme === 'dark' }"
    class="flex w-full flex-col gap-0.5 rounded-2xl sm:rounded-3xl bg-ousi-surface-secondary/80 p-1.5 sm:p-2 pt-0"
  >
    <!-- Window dots -->
    <div class="hidden sm:flex h-9 shrink-0 items-center pt-1 pl-2">
      <div class="flex items-center gap-2.5">
        <div class="size-3 rounded-full bg-ousi-muted opacity-30" />
        <div class="size-3 rounded-full bg-ousi-muted opacity-30" />
        <div class="size-3 rounded-full bg-ousi-muted opacity-30" />
      </div>
    </div>

    <!-- Scrollable content -->
    <OScrollShadow orientation="vertical" :size="60" class="min-h-0 w-full flex-1 rounded-xl sm:rounded-2xl border border-ousi-border/50 bg-ousi-background">
      <div class="flex w-full justify-center px-3 py-6 sm:px-5 sm:py-8">

        <!-- 3-column grid -->
        <div class="mx-auto grid w-full max-w-[360px] grid-cols-1 gap-8 md:max-w-none md:w-fit md:grid-cols-2 lg:grid-cols-[auto_auto_auto]">

          <!-- ═══ LEFT COLUMN ═══ -->
          <div class="order-2 flex w-full max-w-[360px] flex-col items-center gap-10 md:order-1">
            <!-- TextField -->
            <div class="w-[256px]">
              <OInput label="Your email" placeholder="john@email.com" description="We won't share your email" :required="true" full-width />
            </div>

            <!-- Select -->
            <div class="w-[256px]">
              <OSelect v-model="demoSelect" label="State" placeholder="Select one" :options="stateOptions" :required="true" full-width />
            </div>

            <!-- UI Components row -->
            <div class="flex w-full items-center justify-center gap-8">
              <OCheckbox v-model="demoCheck" />
              <OSwitch v-model="demoSwitch1" />
              <ORadioGroup v-model="demoRadio" class="flex-row gap-8">
                <ORadio value="a" />
                <ORadio value="b" />
              </ORadioGroup>
              <OSpinner size="sm" />
            </div>

            <!-- Slider -->
            <div class="w-[256px] px-1">
              <OSlider
                v-model="demoSlider"
                :min="0" :max="500" :step="10"
                label="Price"
                :show-output="true"
                :format-options="{ style: 'currency', currency: 'USD' }"
              />
            </div>

            <!-- Tabs 1 -->
            <div class="w-[256px]">
              <OTabs :items="tabItems1" v-model="demoTab1" />
            </div>

            <!-- Tabs 2 -->
            <div class="w-[256px]">
              <OTabs :items="tabItems2" v-model="demoTab2" />
            </div>

            <!-- Animated Numbers -->
            <OCard class="w-[256px]">
              <OCardHeader>
                <OCardTitle class="text-xs font-medium text-ousi-muted">Animated Numbers</OCardTitle>
              </OCardHeader>
              <OCardContent class="gap-3">
                <div v-for="(anim, i) in animations" :key="anim" class="flex items-center justify-between">
                  <span class="text-xs text-ousi-muted capitalize">{{ anim }}</span>
                  <OAnimatedNumber
                    :value="animIndex === i ? animValue : (1000 + i * 500)"
                    :animation="anim"
                    :duration="600"
                    prefix="$"
                    :format-options="{ useGrouping: true }"
                    class="text-sm font-semibold text-ousi-foreground tabular-nums"
                  />
                </div>
              </OCardContent>
            </OCard>
          </div>

          <!-- ═══ CENTER COLUMN ═══ -->
          <div class="order-1 flex w-full max-w-[360px] flex-col items-center gap-10 md:order-2">
            <!-- Avatar group with tooltips + hover lift -->
            <div class="flex w-full justify-center">
              <div class="flex -space-x-2.5">
                <OTooltip v-for="n in ['Ana Torres', 'Bob Martinez', 'Carlos Roca', 'Diana Chen', 'Erik Holm']" :key="n" :content="n" :delay="0">
                  <OAvatar :name="n" size="md" class="ring-[1.5px] ring-ousi-background transition-transform duration-200 ease-out hover:-translate-y-1.5 cursor-pointer relative" />
                </OTooltip>
                <OTooltip content="5 more" :delay="0">
                  <div class="flex size-10 items-center justify-center rounded-full bg-ousi-surface ring-[1.5px] ring-ousi-background text-xs font-medium text-ousi-muted transition-transform duration-200 ease-out hover:-translate-y-1.5 cursor-pointer">+5</div>
                </OTooltip>
              </div>
            </div>

            <!-- InputOTP -->
            <div class="flex w-full justify-center">
              <div class="flex w-[280px] flex-col items-start gap-2">
                <div class="flex flex-col gap-1">
                  <span class="text-sm font-medium text-ousi-foreground">Verify account</span>
                  <p class="text-sm text-ousi-muted">We've sent a code to a****@gmail.com</p>
                </div>
                <OInputOtp v-model="demoOtp" :length="6" :groups="[{ slots: 3 }, { slots: 3 }]" />
                <div class="flex items-center gap-1 px-1 pt-1">
                  <p class="text-sm text-ousi-muted">Didn't receive a code?</p>
                  <a href="#" class="text-sm font-medium text-ousi-foreground underline">Resend</a>
                </div>
              </div>
            </div>

            <!-- Buttons grid -->
            <div class="grid grid-cols-3 gap-x-3 gap-y-2">
              <OButton size="sm">Click me</OButton>
              <OButton size="sm" variant="secondary">Click me</OButton>
              <OButton size="sm" variant="outline">Click me</OButton>
              <OButton size="sm" variant="danger">Click me</OButton>
              <OButton size="sm" variant="danger-soft">Click me</OButton>
              <OButton size="sm" variant="text">Click me</OButton>
            </div>

            <!-- Accordion -->
            <div class="w-full xl:w-[400px]">
              <OAccordion
                v-model="accordionKey"
                :items="[
                  { key: 'features', title: 'What\'s included?', description: '74+ accessible components for Vue 3 and Flutter, with dark mode, OKLCH colors, and tree-shaking support.' },
                  { key: 'theming', title: 'How does theming work?', description: 'CSS custom properties with Tailwind v4. Switch themes via data-theme attribute — no rebuild needed.' },
                  { key: 'license', title: 'Is it free to use?', description: 'Yes! Ousi UI is open source under the MIT license. Use it in personal and commercial projects.' },
                ]"
              />
            </div>

            <!-- Alert / Credits -->
            <OCard class="w-full xl:w-[400px] flex-row items-center gap-3">
              <div class="flex size-8 items-center justify-center rounded-full bg-ousi-default shrink-0">
                <svg class="size-4 text-ousi-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium leading-5 text-ousi-foreground">You have 2 credits left</p>
                <p class="text-xs text-ousi-muted">Get a paid plan for more credits</p>
              </div>
              <OButton variant="secondary" size="sm" class="shrink-0">Upgrade</OButton>
            </OCard>

            <!-- Allow notifications -->
            <div class="flex w-full justify-center">
              <div class="flex items-center gap-8 p-4">
                <div class="-mt-0.5 flex flex-col justify-start gap-1">
                  <span class="text-sm font-medium text-ousi-foreground">Allow notifications</span>
                  <span class="text-xs text-ousi-muted">Receive push notifications from Ousi UI</span>
                </div>
                <OSwitch v-model="demoNotif" />
              </div>
            </div>
          </div>

          <!-- ═══ RIGHT COLUMN ═══ -->
          <div class="order-3 grid w-full max-w-[360px] grid-cols-1 justify-items-center gap-5 self-start md:col-span-2 md:grid-cols-2 lg:col-span-1 lg:grid-cols-1">
            <!-- Login card -->
            <OCard class="w-full max-w-[320px]">
              <OCardHeader class="flex w-full items-center justify-center gap-2">
                <div class="flex size-10 items-center justify-center rounded-full bg-ousi-default">
                  <svg class="size-5 text-ousi-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
              </OCardHeader>
              <OCardContent class="gap-2">
                <OCardTitle class="text-center">Create an account</OCardTitle>
                <p class="text-center text-sm font-medium text-ousi-muted">Start your free 7-day trial. No credit card required.</p>
                <OButton class="w-full">Get Started</OButton>
                <div class="flex w-full items-center gap-2 py-2">
                  <OSeparator class="flex-1" />
                  <p class="text-center text-xs font-medium text-ousi-muted uppercase">Or</p>
                  <OSeparator class="flex-1" />
                </div>
                <OButton class="w-full" variant="secondary">
                  <svg class="size-4 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 01-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09a7 7 0 010-4.18V7.07H2.18A11 11 0 001 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </OButton>
                <OButton class="w-full" variant="secondary">
                  <svg class="size-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Continue with Apple
                </OButton>
              </OCardContent>
            </OCard>

            <!-- Chart -->
            <OCard class="w-full max-w-[320px] !p-0 overflow-hidden">
              <OCardHeader class="px-4 pt-4 pb-1">
                <OCardDescription class="text-xs">Revenue</OCardDescription>
                <OCardTitle class="text-lg tabular-nums">${{ chartValue.toFixed(2) }}</OCardTitle>
              </OCardHeader>
              <div class="h-[140px] w-full">
                <OChart
                  :data="chartData"
                  :value="chartValue"
                  theme="light"
                  :grid="false"
                  :badge="false"
                  :momentum="false"
                  :scrub="false"
                  :padding="{ top: 8, right: 8, bottom: 4, left: 8 }"
                  :format-value="(v: number) => `$${v.toFixed(2)}`"
                />
              </div>
            </OCard>
          </div>

        </div>
      </div>
    </OScrollShadow>
  </div>
</template>
