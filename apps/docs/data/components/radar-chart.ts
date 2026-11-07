import type { ComponentData } from './types'

export const radarChartData: ComponentData = {
  title: 'Radar Chart',
  description: 'Compare several measures on a polygon grid. Filled, dots, lines and score variants.',
  category: 'Charts',
  importCode: "import { ORadarChart } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'RadarChartBasic',
        code: `<script setup lang="ts">
import { ORadarChart } from '@ousi-ui/vue'

const data = [
  { label: 'Speed', you: 82 }, { label: 'Power', you: 64 }, { label: 'Range', you: 91 },
  { label: 'Agility', you: 58 }, { label: 'Defense', you: 73 }, { label: 'Stamina', you: 86 },
]
</script>
<template>
  <ORadarChart :data="data" :series="[{ key: 'you', label: 'You' }]" :max="100" />
</template>`,
      },
    },
    {
      id: 'compare',
      title: 'Recipe: compare and filter series',
      example: {
        component: 'RadarChartCompare',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OCard, ORadarChart } from '@ousi-ui/vue'

const data = [
  { label: 'Speed', ana: 82, leo: 60 }, { label: 'Power', ana: 64, leo: 78 }, { label: 'Range', ana: 91, leo: 55 },
  { label: 'Agility', ana: 58, leo: 84 }, { label: 'Defense', ana: 73, leo: 66 }, { label: 'Stamina', ana: 86, leo: 70 },
]
const all = [
  { key: 'ana', label: 'Ana', color: 'accent' },
  { key: 'leo', label: 'Leo', color: 'orange' },
]
// Click a legend chip to hide or show a series
const hidden = ref<string[]>([])
const series = computed(() => all.filter((s) => !hidden.value.includes(s.key)))
const focused = ref<number | null>(null)
const toggle = (k: string) => { hidden.value = hidden.value.includes(k) ? hidden.value.filter((x) => x !== k) : [...hidden.value, k] }
const avg = (k: 'ana' | 'leo') => Math.round(data.reduce((s, r) => s + r[k], 0) / data.length)
</script>
<template>
  <OCard class="w-full max-w-md items-center gap-4 p-5">
    <div class="flex w-full items-center justify-between">
      <span class="text-sm font-medium text-ousi-muted">{{ focused == null ? 'Skills' : data[focused].label }}</span>
      <div class="flex gap-2">
        <button
          v-for="s in all" :key="s.key" type="button"
          class="flex items-center gap-1.5 rounded-full bg-ousi-default px-2.5 py-1 text-xs font-medium transition-opacity"
          :class="hidden.includes(s.key) && 'opacity-40'"
          @click="toggle(s.key)"
        >
          <span class="inline-block size-2 rounded-full" :style="{ backgroundColor: \`var(--ousi-\${s.color})\` }" />{{ s.label }}
        </button>
      </div>
    </div>
    <ORadarChart v-model:focused="focused" :data="data" :series="series" variant="dots" :max="100" :size="210" />
    <div class="grid w-full grid-cols-3 gap-2">
      <div
        v-for="(r, i) in data" :key="r.label"
        class="rounded-xl bg-ousi-default px-3 py-2 text-xs transition-opacity"
        :class="focused != null && focused !== i && 'opacity-40'"
        @mouseenter="focused = i" @mouseleave="focused = null"
      >
        <div class="text-ousi-muted">{{ r.label }}</div>
        <div class="mt-0.5 flex gap-2 font-semibold tabular-nums text-ousi-foreground">
          <span v-if="!hidden.includes('ana')" :style="{ color: 'var(--ousi-accent)' }">{{ r.ana }}</span>
          <span v-if="!hidden.includes('leo')" :style="{ color: 'var(--ousi-orange)' }">{{ r.leo }}</span>
        </div>
      </div>
    </div>
    <div class="flex w-full justify-between text-xs text-ousi-muted">
      <span>Ana avg <b class="tabular-nums text-ousi-foreground">{{ avg('ana') }}</b></span>
      <span>Leo avg <b class="tabular-nums text-ousi-foreground">{{ avg('leo') }}</b></span>
    </div>
  </OCard>
</template>`,
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'RadarChartVariants',
        code: `<script setup lang="ts">
import { ORadarChart } from '@ousi-ui/vue'

const data = [
  { label: 'Speed', a: 82, b: 60 }, { label: 'Power', a: 64, b: 78 }, { label: 'Range', a: 91, b: 55 },
  { label: 'Agility', a: 58, b: 84 }, { label: 'Defense', a: 73, b: 66 }, { label: 'Stamina', a: 86, b: 70 },
]
const series = [{ key: 'a', label: 'Player A', color: 'accent' }, { key: 'b', label: 'Player B', color: 'orange' }]
</script>
<template>
  <div class="flex flex-wrap items-start gap-6">
    <div class="flex flex-col items-center gap-1"><ORadarChart :data="data" :series="[series[0]]" :max="100" :size="170" /><span class="text-xs text-ousi-muted">filled</span></div>
    <div class="flex flex-col items-center gap-1"><ORadarChart :data="data" :series="[series[0]]" :max="100" :size="170" variant="dots" /><span class="text-xs text-ousi-muted">dots</span></div>
    <div class="flex flex-col items-center gap-1"><ORadarChart :data="data" :series="series" :max="100" :size="170" variant="lines" /><span class="text-xs text-ousi-muted">lines (compare)</span></div>
  </div>
</template>`,
      },
    },
    {
      id: 'score',
      title: 'Score variant',
      example: {
        component: 'RadarChartScore',
        code: `<script setup lang="ts">
import { ORadarChart } from '@ousi-ui/vue'

const data = [
  { label: 'Sleep', v: 78 }, { label: 'Activity', v: 91 }, { label: 'Nutrition', v: 54 },
  { label: 'Focus', v: 83 }, { label: 'Mood', v: 70 }, { label: 'Recovery', v: 88 },
]
</script>
<template>
  <!-- Axes below alert-below turn red; the center shows the average, or the hovered axis. -->
  <ORadarChart :data="data" :series="[{ key: 'v', label: 'Score', color: 'violet' }]" variant="score" :max="100" :alert-below="60" :size="220" />
</template>`,
      },
    },
    {
      id: 'hover',
      title: 'Recipe: header reacts to hover',
      example: {
        component: 'RadarChartHover',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OCard, ORadarChart } from '@ousi-ui/vue'

const data = [
  { label: 'Speed', a: 82, b: 60 }, { label: 'Power', a: 64, b: 78 }, { label: 'Range', a: 91, b: 55 },
  { label: 'Agility', a: 58, b: 84 }, { label: 'Defense', a: 73, b: 66 },
]
const series = [{ key: 'a', label: 'Player A', color: 'accent' }, { key: 'b', label: 'Player B', color: 'orange' }]
const focused = ref<number | null>(null)
const row = computed(() => (focused.value == null ? null : data[focused.value]))
</script>
<template>
  <OCard class="w-full max-w-md items-center gap-3 p-5">
    <div class="w-full">
      <div class="text-sm font-medium text-ousi-muted">{{ row ? row.label : 'Skill comparison' }}</div>
      <div class="mt-1 flex gap-6 text-sm tabular-nums">
        <span v-for="s in series" :key="s.key" class="flex items-center gap-2">
          <span class="inline-block size-2 rounded-full" :style="{ backgroundColor: \`var(--ousi-\${s.color})\` }" />
          <span class="text-ousi-muted">{{ s.label }}</span>
          <span class="font-semibold text-ousi-foreground">{{ row ? row[s.key as 'a' | 'b'] : '—' }}</span>
        </span>
      </div>
    </div>
    <ORadarChart v-model:focused="focused" :data="data" :series="series" variant="lines" :max="100" :size="200" />
  </OCard>
</template>`,
      },
    },
    {
      id: 'events',
      title: 'Events',
      example: {
        component: 'RadarChartEvents',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { ORadarChart } from '@ousi-ui/vue'
import type { RadarAxisItem } from '@ousi-ui/vue'

const data = [
  { label: 'Speed', v: 82 }, { label: 'Power', v: 64 }, { label: 'Range', v: 91 },
  { label: 'Agility', v: 58 }, { label: 'Defense', v: 73 },
]
const picked = ref<RadarAxisItem | null>(null)
</script>
<template>
  <div class="flex flex-wrap items-center gap-8">
    <ORadarChart :data="data" :series="[{ key: 'v', label: 'Score', color: 'success' }]" variant="dots" :max="100" :size="190" @axis-click="(a) => (picked = a)" />
    <div class="rounded-xl bg-ousi-default px-4 py-3 text-xs">
      <div class="text-ousi-muted">Click an axis</div>
      <div v-if="picked" class="mt-1 text-base font-semibold text-ousi-foreground">{{ picked.label }} · {{ picked.values[0].formatted }}</div>
    </div>
  </div>
</template>`,
      },
    },
  ],

  props: [
    { name: 'data', type: 'Record<string, unknown>[]', description: 'One row per axis.' },
    { name: 'labelKey', type: 'string', default: '\'label\'', description: 'Field holding the axis label.' },
    { name: 'series', type: 'RadarSeries[]', description: 'Series: { key, label?, color? }.' },
    { name: 'variant', type: '\'filled\' | \'dots\' | \'lines\' | \'score\'', default: '\'filled\'', description: 'Visual style. score prints values beside labels and an average in the center.' },
    { name: 'max', type: 'number', default: 'largest value', description: 'Radius ceiling.' },
    { name: 'rings', type: 'number', default: '4', description: 'Number of concentric grid polygons.' },
    { name: 'size', type: 'number', default: '240', description: 'Diameter of the chart area in px (labels excluded).' },
    { name: 'alertBelow', type: 'number', default: '0', description: 'Values below this turn red in the score variant.' },
    { name: 'showLabels', type: 'boolean', default: 'true', description: 'Show axis labels.' },
    { name: 'formatValue', type: '(value: number) => string', description: 'Formats values.' },
    { name: 'interactive', type: 'boolean', default: 'true', description: 'Enable hover, focus and click reactions.' },
    { name: 'focused', type: 'number | null', default: 'null', description: 'Highlighted axis index. Optional: the chart tracks hover by itself; bind v-model:focused to read or drive it.' },
    { name: 'animated', type: 'boolean', default: 'true', description: 'Animate on mount.' },
    { name: 'label', type: 'string', description: 'Accessible label.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'center', type: '{ average, focusedAxis }', description: 'Center of the chart. Always rendered in the score variant.' },
  ],

  emits: [
    { name: 'update:focused', type: '(index: number | null)', description: 'Highlighted axis changed (v-model:focused).' },
    { name: 'axis-enter', type: '(axis: RadarAxisItem, event: Event)', description: 'Pointer or keyboard focus enters an axis.' },
    { name: 'axis-leave', type: '(axis: RadarAxisItem, event: Event)', description: 'Pointer or keyboard focus leaves an axis.' },
    { name: 'axis-click', type: '(axis: RadarAxisItem, event: Event)', description: 'An axis is clicked or activated with Enter/Space.' },
  ],

  keyboard: [
    { key: 'Tab', description: 'Moves focus into the chart and out of it. The chart is a single tab stop, however many items it has.' },
    { key: 'Arrow keys', description: 'Moves between axes.' },
    { key: 'Home / End', description: 'Jumps to the first or the last item.' },
    { key: 'Enter / Space', description: 'Emits the click event of the focused item.' },
  ],
}
