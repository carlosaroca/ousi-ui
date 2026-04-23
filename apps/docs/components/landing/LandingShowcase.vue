<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  OButton,
  OInput,
  OSelect,
  OChart,
  OSwitch,
  OAvatar,
  OCheckbox,
  OProgressCircle,
  OAccordion,
  OTooltip,
  OSlider,
  ODatePicker,
  OAnimatedNumber,
  OCard
} from '@ousi-ui/vue'
import type { ChartPoint, SelectOption, AccordionItem, DateFieldValue } from '@ousi-ui/vue'

/**
 * Landing-page component showcase — masonry collage on desktop, stacked cards on mobile.
 * Inherits theme from parent via CSS variables (--ousi-accent etc).
 */

const chartData = ref<ChartPoint[]>([])
const chartValue = ref(0)
let chartInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  const now = Date.now() / 1000
  let v = 100
  const pts: ChartPoint[] = []
  for (let i = 60; i >= 0; i--) {
    v += (Math.random() - 0.3) * 1.4
    pts.push({ time: now - i * 5, value: Math.max(v, 0) })
  }
  chartData.value = pts
  chartValue.value = v

  chartInterval = setInterval(() => {
    chartValue.value += (Math.random() - 0.3) * 1.2
    chartData.value = [
      ...chartData.value.slice(-120),
      { time: Date.now() / 1000, value: Math.max(chartValue.value, 0) },
    ]
  }, 1200)
})

onUnmounted(() => {
  if (chartInterval) clearInterval(chartInterval)
})

const darkMode = ref(false)
const notifications = ref(true)

const locations = ref<string[]>(['Spain', 'Germany'])
const commentValue = ref('')

const nameOptions: SelectOption[] = [
  { value: 'bruno',  label: 'Bruno Hoffman' },
  { value: 'chad',   label: 'Chad Kerley' },
  { value: 'summer', label: 'Summer Rose' },
]
const selectedName = ref('bruno')

const accordionItems: AccordionItem[] = [
  { key: 'included',   title: "What's included?",    description: '70+ Vue 3 components.' },
  { key: 'theming',    title: 'How does theming work?', description: 'CSS vars + Tailwind v4.' },
  { key: 'license',    title: 'Is it free?',          description: 'Yes — MIT licensed.' },
]
const accordionKey = ref<string | null>('theming')

const sliderValue = ref(65)
const selectedDate = ref<DateFieldValue | null>({ year: 2026, month: 6, day: 15 })
</script>

<template>
  <ClientOnly>
    <!-- Mobile/tablet stacked showcase (<lg) -->
    <div class="lg:hidden flex flex-col gap-4 w-full max-w-md mx-auto">
      <div class="rounded-ousi-3xl bg-ousi-surface p-4 shadow-ousi-lg">
        <div class="flex items-baseline justify-between mb-0.5">
          <span class="text-[10px] font-semibold text-ousi-muted uppercase tracking-wider">Revenue</span>
          <span class="text-[10px] text-ousi-success font-mono">+12.4%</span>
        </div>
        <div class="flex items-baseline gap-1.5 mb-2">
          <OAnimatedNumber
            :value="Math.floor(chartValue)"
            animation="count"
            :duration="500"
            prefix="$"
            :format-options="{ useGrouping: true }"
            class="text-xl font-bold text-ousi-foreground tabular-nums"
          />
          <span class="text-[10px] text-ousi-muted">last 30d</span>
        </div>
        <div class="h-[150px] -mx-1">
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
      </div>

      <div class="rounded-ousi-3xl bg-ousi-surface p-4 shadow-ousi-lg">
        <div class="flex items-start gap-3">
          <div class="relative shrink-0">
            <OAvatar name="Ana Torres" size="lg" />
            <div class="absolute -bottom-1 -right-1 size-5 flex items-center justify-center rounded-full bg-ousi-danger text-[10px] font-bold text-white ring-2 ring-ousi-surface">8</div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-ousi-foreground leading-tight">Ana Torres</p>
            <p class="text-xs text-ousi-muted leading-snug mt-1">Wants to join your workspace.</p>
            <div class="flex items-center gap-1.5 mt-3">
              <OButton size="sm">Accept</OButton>
              <OButton size="sm" variant="text">Decline</OButton>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-ousi-3xl bg-ousi-surface p-4 shadow-ousi-lg">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold text-ousi-foreground">Location</span>
        </div>
        <div class="space-y-2.5 mb-4">
          <OCheckbox :model-value="locations.includes('Spain')"   @update:model-value="(v) => locations = v ? [...locations, 'Spain']   : locations.filter(x => x !== 'Spain')"   label="Spain"   size="sm" />
          <OCheckbox :model-value="locations.includes('Germany')" @update:model-value="(v) => locations = v ? [...locations, 'Germany'] : locations.filter(x => x !== 'Germany')" label="Germany" size="sm" />
          <OCheckbox :model-value="locations.includes('Italy')"   @update:model-value="(v) => locations = v ? [...locations, 'Italy']   : locations.filter(x => x !== 'Italy')"   label="Italy"   size="sm" />
        </div>
        <OButton size="sm" class="w-full">Let's Go!</OButton>
      </div>

      <div class="shadow-ousi-lg">
        <OAccordion v-model="accordionKey" :items="accordionItems" />
      </div>
    </div>

    <!-- Desktop masonry collage (≥lg) -->
    <div class="collage-wrap hidden lg:block relative h-[900px] w-full">
      <!-- TILE 1 — Invite card -->
      <div class="tile tile-a absolute top-[10px] left-[10px] w-[300px] rounded-ousi-3xl bg-ousi-surface p-4 shadow-ousi-xl">
        <div class="flex items-start gap-3">
          <div class="relative shrink-0">
            <OAvatar name="Ana Torres" size="lg" />
            <div class="absolute -bottom-1 -right-1 size-5 flex items-center justify-center rounded-full bg-ousi-danger text-[10px] font-bold text-white ring-2 ring-ousi-surface">
              8
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-ousi-foreground leading-tight">Ana Torres</p>
            <p class="text-xs text-ousi-muted leading-snug mt-1">Wants to join your workspace.</p>
            <div class="flex items-center gap-1.5 mt-3">
              <OButton size="sm">Accept</OButton>
              <OButton size="sm" variant="text">Decline</OButton>
            </div>
          </div>
        </div>
      </div>

      <!-- TILE 2 — Widget Pro product -->
      <div class="tile tile-b absolute top-[20px] left-[360px] w-[140px] rounded-ousi-3xl bg-ousi-surface p-2.5 shadow-ousi-xl">
        <div class="aspect-square rounded-ousi-2xl bg-gradient-to-br from-emerald-100 to-emerald-300 flex items-center justify-center overflow-hidden mb-2">
          <svg class="size-14 text-emerald-700/70" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L4 12h3v8h10v-8h3L12 2z"/>
          </svg>
        </div>
        <p class="text-xs font-semibold text-ousi-foreground px-1 leading-tight">Widget Pro</p>
        <OButton size="sm" class="w-full mt-2">Buy now</OButton>
      </div>

      <!-- TILE 3 — Dark mode switch -->
      <div class="tile tile-c absolute top-[50px] right-[20px] w-[170px] rounded-ousi-3xl bg-ousi-surface px-4 py-3 shadow-ousi-md">
        <div class="flex items-center justify-between gap-3">
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold text-ousi-foreground leading-tight">Dark mode</p>
            <p class="text-[10px] text-ousi-muted mt-0.5">System</p>
          </div>
          <OSwitch v-model="darkMode" />
        </div>
        <div class="flex items-center justify-between gap-3 mt-2">
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold text-ousi-foreground leading-tight">Notifications</p>
            <p class="text-[10px] text-ousi-muted mt-0.5">Enabled</p>
          </div>
          <OSwitch v-model="notifications" />
        </div>
      </div>

      <OCard class="tile tile-e absolute top-[180px] left-[0px] w-[230px]">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold text-ousi-foreground">Location</span>
          <div class="size-6 rounded-full bg-ousi-default flex items-center justify-center">
            <svg class="size-3 text-ousi-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>
        <div class="space-y-2.5 mb-4">
          <OCheckbox :model-value="locations.includes('Spain')"   @update:model-value="(v) => locations = v ? [...locations, 'Spain']   : locations.filter(x => x !== 'Spain')"   label="Spain"   size="sm" />
          <OCheckbox :model-value="locations.includes('Germany')" @update:model-value="(v) => locations = v ? [...locations, 'Germany'] : locations.filter(x => x !== 'Germany')" label="Germany" size="sm" />
          <OCheckbox :model-value="locations.includes('Italy')"   @update:model-value="(v) => locations = v ? [...locations, 'Italy']   : locations.filter(x => x !== 'Italy')"   label="Italy"   size="sm" />
          <OCheckbox :model-value="locations.includes('Japan')"   @update:model-value="(v) => locations = v ? [...locations, 'Japan']   : locations.filter(x => x !== 'Japan')"   label="Japan"   size="sm" />
        </div>
        <OButton size="sm" class="w-full">Let's Go!</OButton>
      </OCard>

      <!-- TILE 6 — Chart dashboard -->
      <div class="tile tile-f absolute top-[240px] left-[275px] w-[260px] rounded-ousi-3xl bg-ousi-surface p-4 shadow-ousi-xl">
        <div class="flex items-baseline justify-between mb-0.5">
          <span class="text-[10px] font-semibold text-ousi-muted uppercase tracking-wider">Revenue</span>
          <span class="text-[10px] text-ousi-success font-mono">+12.4%</span>
        </div>
        <div class="flex items-baseline gap-1.5 mb-2">
          <OAnimatedNumber
            :value="Math.floor(chartValue)"
            animation="roll"
            :duration="500"
            prefix="$"
            :format-options="{ useGrouping: true }"
            class="text-xl font-bold text-ousi-foreground tabular-nums"
          />
          <span class="text-[10px] text-ousi-muted">last 30d</span>
        </div>
        <div class="h-[150px] -mx-1">
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
        <div class="flex items-center justify-between mt-3 pt-2 border-t border-ousi-border/50">
          <span class="text-[11px] font-medium text-ousi-muted">Team</span>
          <div class="flex -space-x-2.5">
            <OTooltip
              v-for="n in ['Ana Torres', 'Bob Martinez', 'Carlos Roca']"
              :key="n"
              :content="n"
              :delay="0"
            >
              <OAvatar
                :name="n"
                size="sm"
                class="ring-[1.5px] ring-ousi-surface transition-transform duration-200 ease-out hover:-translate-y-1 cursor-pointer"
              />
            </OTooltip>
            <OTooltip content="+2 more" :delay="0">
              <div class="flex size-7 items-center justify-center rounded-full bg-ousi-default ring-[1.5px] ring-ousi-surface text-[10px] font-medium text-ousi-muted transition-transform duration-200 ease-out hover:-translate-y-1 cursor-pointer">
                +2
              </div>
            </OTooltip>
          </div>
        </div>
      </div>

      <!-- TILE 7 — Ousi UI info card -->
      <div class="tile tile-h absolute top-[180px] right-[-50px] w-[210px] rounded-ousi-3xl bg-ousi-surface p-4 shadow-ousi-xl">
        <div class="flex items-start justify-between mb-3">
          <div class="size-9 rounded-ousi-xl bg-gradient-to-br from-ousi-accent-soft to-ousi-accent/10 flex items-center justify-center">
            <span class="text-base font-black text-ousi-accent">O</span>
          </div>
          <svg class="size-4 text-ousi-muted/40" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <p class="text-sm font-semibold text-ousi-foreground mb-1">Ousi UI</p>
        <p class="text-[11px] text-ousi-muted leading-snug">
          70+ accessible Vue 3 components. Tree-shakeable, type-safe, SSR-ready.
        </p>
      </div>

      <!-- TILE 9 — Progress circle -->
      <div class="tile tile-i absolute top-[430px] right-[0px] size-[100px] rounded-ousi-3xl bg-ousi-surface shadow-ousi-lg flex items-center justify-center">
        <OProgressCircle :value="65" size="md" />
      </div>

      <!-- TILE 10 — Get Started card -->
      <div class="tile tile-j absolute top-[560px] right-[20px] w-[270px] rounded-ousi-3xl bg-ousi-surface shadow-ousi-xl overflow-hidden">
        <div class="h-[80px] bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center relative">
          <svg class="size-9 text-white/80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 10.5V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-3.5l4 4v-11l-4 4z"/>
          </svg>
        </div>
        <div class="p-3.5">
          <div class="flex items-center gap-3 mb-2">
            <div class="flex items-center gap-1 text-ousi-muted">
              <svg class="size-3.5 text-ousi-danger" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              <span class="text-xs">24</span>
            </div>
            <div class="flex items-center gap-1 text-ousi-muted">
              <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              <span class="text-xs">12</span>
            </div>
          </div>
          <p class="text-sm font-semibold text-ousi-foreground mb-0.5">Get Started</p>
          <p class="text-[11px] text-ousi-muted leading-snug mb-3">
            Ousi is an open source component library.
          </p>
          <div class="flex items-center gap-2">
            <div class="flex-1 min-w-0">
              <OInput v-model="commentValue" placeholder="Comment" size="sm" variant="secondary" animated />
            </div>
            <button class="size-8 shrink-0 rounded-ousi-xl bg-ousi-accent-soft text-ousi-accent flex items-center justify-center hover:bg-ousi-accent hover:text-ousi-accent-foreground transition-colors">
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- TILE 11 — Accordion -->
      <div class="tile tile-k absolute top-[500px] left-[0px] w-[260px] rounded-ousi-3xl">
        <OAccordion v-model="accordionKey" :items="accordionItems" />
      </div>

      <!-- TILE 12 — Slider card -->
      <div class="tile tile-l absolute top-[740px] left-[100px] w-[230px] rounded-ousi-3xl bg-ousi-surface px-4 py-3 shadow-ousi-lg">
        <div class="flex items-baseline justify-between mb-1">
          <span class="text-[11px] font-semibold text-ousi-foreground">Volume</span>
          <span class="text-[11px] text-ousi-muted tabular-nums">{{ sliderValue }}%</span>
        </div>
        <OSlider v-model="sliderValue" :min="0" :max="100" />
      </div>

      <!-- TILE 13 — Date picker -->
      <div class="tile tile-m absolute top-[840px] left-[60px] w-[200px]">
        <ODatePicker
          v-model="selectedDate"
          animated
          size="sm"
        />
      </div>

      <!-- TILE 14 — Names select -->
      <div class="tile tile-n absolute top-[840px] left-[320px] w-[210px]">
        <OSelect
          v-model="selectedName"
          :options="nameOptions"
          size="sm"
          variant="primary"
          animated
        />
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.tile {
  transform-origin: center;
  will-change: transform;
}

@keyframes float-1 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes float-2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes float-3 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes float-4 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }

.tile-a { animation: float-1 6s   ease-in-out infinite 0.0s; }
.tile-b { animation: float-3 5s   ease-in-out infinite 0.4s; }
.tile-c { animation: float-2 5.5s ease-in-out infinite 0.2s; }
.tile-e { animation: float-1 6.5s ease-in-out infinite 0.3s; }
.tile-f { animation: float-2 6s   ease-in-out infinite 0.1s; }
.tile-h { animation: float-4 5.5s ease-in-out infinite 0.8s; }
.tile-i { animation: float-2 4.5s ease-in-out infinite 0.6s; }
.tile-j { animation: float-1 6s   ease-in-out infinite 0.2s; }
.tile-k { animation: float-4 4.5s ease-in-out infinite 0.9s; }
.tile-l { animation: float-3 5s   ease-in-out infinite 0.4s; }
.tile-m { animation: float-2 4.5s ease-in-out infinite 0.6s; }
.tile-n { animation: float-1 5.5s ease-in-out infinite 0.3s; }

@media (prefers-reduced-motion: reduce) {
  .tile { animation: none !important; }
}
</style>
