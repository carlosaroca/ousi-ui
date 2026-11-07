import type { ComponentData } from './types'

export const activityRingsData: ComponentData = {
  title: 'Activity Rings',
  description: 'Concentric progress rings to compare several goals at a glance. Colors, center, legend and hover reactions are all customizable.',
  category: 'Charts',
  importCode: "import { OActivityRings } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'ActivityRingsBasic',
        code: `<script setup lang="ts">
import { OActivityRings } from '@ousi-ui/vue'

const rings = [
  { label: 'Move', value: 520, max: 600, color: 'danger' },
  { label: 'Exercise', value: 24, max: 30, color: 'success' },
  { label: 'Stand', value: 7, max: 12, color: 'accent' },
]
</script>
<template>
  <OActivityRings :rings="rings" />
</template>`,
      },
    },
    {
      id: 'colors',
      title: 'Colors',
      example: {
        component: 'ActivityRingsColors',
        code: `<script setup lang="ts">
import { OActivityRings } from '@ousi-ui/vue'

// Token names follow the theme; any CSS color works too.
const tokens = [
  { label: 'A', value: 90, color: 'danger' },
  { label: 'B', value: 70, color: 'warning' },
  { label: 'C', value: 50, color: 'success' },
  { label: 'D', value: 30, color: 'accent' },
]
const custom = [
  { label: 'A', value: 90, color: '#f43f5e' },
  { label: 'B', value: 70, color: 'rgb(251 146 60)' },
  { label: 'C', value: 50, color: 'hsl(160 84% 39%)' },
  { label: 'D', value: 30, color: 'var(--ousi-violet)' },
]
</script>
<template>
  <div class="flex flex-wrap items-center gap-10">
    <div class="flex flex-col items-center gap-2">
      <OActivityRings :rings="tokens" :size="150" :stroke-width="9" :gap="3" />
      <span class="text-xs text-ousi-muted">Theme tokens</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <OActivityRings :rings="custom" :size="150" :stroke-width="9" :gap="3" />
      <span class="text-xs text-ousi-muted">hex · rgb · hsl · var()</span>
    </div>
  </div>
</template>`,
      },
    },
    {
      id: 'stats',
      title: 'With stats',
      example: {
        component: 'ActivityRingsStats',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { OActivityRings } from '@ousi-ui/vue'

const focused = ref<string | null>(null)
const rings = [
  { label: 'Move', value: 1592, max: 2000, color: 'danger', valueLabel: '1,592 kcal' },
  { label: 'Exercise', value: 105, max: 120, color: 'success', valueLabel: '1h 45m' },
  { label: 'Running', value: 5.2, max: 8, color: 'accent', valueLabel: '5.2 km' },
]
</script>
<template>
  <OActivityRings v-model:focused="focused" :rings="rings" show-stats />
</template>`,
      },
    },
    {
      id: 'center',
      title: 'Reactive center',
      example: {
        component: 'ActivityRingsCenter',
        code: `<script setup lang="ts">
import { OActivityRings } from '@ousi-ui/vue'

const rings = [
  { label: 'Move', value: 1592, max: 2000, color: 'danger', valueLabel: '1,592 kcal' },
  { label: 'Exercise', value: 105, max: 120, color: 'success', valueLabel: '1h 45m' },
  { label: 'Running', value: 5.2, max: 8, color: 'accent', valueLabel: '5.2 km' },
]
const average = (list: { percent: number }[]) =>
  Math.round(list.reduce((sum, r) => sum + r.percent, 0) / list.length)
</script>
<template>
  <!-- The default slot receives the ring under the pointer, so the center can react. -->
  <OActivityRings :rings="rings" :size="220">
    <template #default="{ focusedRing, rings: items }">
      <div class="text-center">
        <div class="text-2xl font-semibold tabular-nums text-ousi-foreground">
          {{ focusedRing ? focusedRing.percent : average(items) }}%
        </div>
        <div class="mt-0.5 text-xs" :style="{ color: focusedRing?.color }">
          {{ focusedRing ? focusedRing.label : 'Overall' }}
        </div>
        <div v-if="focusedRing" class="text-xs text-ousi-muted">{{ focusedRing.valueLabel }}</div>
      </div>
    </template>
  </OActivityRings>
</template>`,
      },
    },
    {
      id: 'custom-stat',
      title: 'Custom stat item',
      example: {
        component: 'ActivityRingsCustomStat',
        code: `<script setup lang="ts">
import { OActivityRings } from '@ousi-ui/vue'

const rings = [
  { label: 'Move', value: 1592, max: 2000, color: 'danger', valueLabel: '1,592 kcal' },
  { label: 'Exercise', value: 105, max: 120, color: 'success', valueLabel: '1h 45m' },
  { label: 'Running', value: 5.2, max: 8, color: 'accent', valueLabel: '5.2 km' },
]
</script>
<template>
  <!-- \`stat\` replaces the content of each legend item; the wrapper keeps hover and keyboard behavior. -->
  <OActivityRings :rings="rings" :size="160" show-stats class="w-80">
    <template #stat="{ ring, focused }">
      <div class="w-24">
        <div class="flex items-baseline justify-between gap-2">
          <span class="text-xs text-ousi-muted">{{ ring.label }}</span>
          <span class="text-xs font-medium tabular-nums" :style="{ color: ring.color }">{{ ring.percent }}%</span>
        </div>
        <div class="mt-1 h-1 overflow-hidden rounded-full bg-ousi-default">
          <div
            class="h-full rounded-full transition-all duration-300"
            :style="{ width: \`\${ring.percent}%\`, backgroundColor: ring.color, opacity: focused ? 1 : 0.7 }"
          />
        </div>
        <div class="mt-1.5 text-sm font-semibold tabular-nums text-ousi-foreground">{{ ring.valueLabel }}</div>
      </div>
    </template>
  </OActivityRings>
</template>`,
      },
    },
    {
      id: 'custom-legend',
      title: 'Custom legend',
      example: {
        component: 'ActivityRingsCustomLegend',
        code: `<script setup lang="ts">
import { OActivityRings } from '@ousi-ui/vue'

const rings = [
  { label: 'Move', value: 1592, max: 2000, color: '#ff5d73', valueLabel: '1,592 / 2,000 kcal' },
  { label: 'Exercise', value: 105, max: 120, color: '#34d399', valueLabel: '105 / 120 min' },
  { label: 'Running', value: 5.2, max: 8, color: '#60a5fa', valueLabel: '5.2 / 8 km' },
]
</script>
<template>
  <!-- \`stats\` replaces the whole legend: you get the rings and a setFocus helper. -->
  <div class="flex flex-wrap items-center gap-8">
    <OActivityRings :rings="rings" :size="150" :stroke-width="10">
      <template #stats="{ rings: items, focusedKey, setFocus }">
        <table class="text-sm">
          <tbody>
            <tr
              v-for="r in items"
              :key="r.key"
              class="cursor-default transition-opacity"
              :class="focusedKey && focusedKey !== r.key && 'opacity-40'"
              @mouseenter="setFocus(r.key)"
              @mouseleave="setFocus(null)"
            >
              <td class="py-1 pr-4">
                <span class="mr-2 inline-block size-2 rounded-full" :style="{ backgroundColor: r.color }" />
                <span class="text-ousi-muted">{{ r.label }}</span>
              </td>
              <td class="py-1 pr-4 font-medium tabular-nums text-ousi-foreground">{{ r.valueLabel }}</td>
              <td class="py-1 text-right tabular-nums text-ousi-muted">{{ r.percent }}%</td>
            </tr>
          </tbody>
        </table>
      </template>
    </OActivityRings>
  </div>
</template>`,
      },
    },
    {
      id: 'events',
      title: 'Events',
      example: {
        component: 'ActivityRingsEvents',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { OActivityRings } from '@ousi-ui/vue'
import type { ActivityRingItem } from '@ousi-ui/vue'

const rings = [
  { label: 'Move', value: 520, max: 600, color: 'danger' },
  { label: 'Exercise', value: 24, max: 30, color: 'success' },
  { label: 'Stand', value: 7, max: 12, color: 'accent' },
]

const log = ref<string[]>([])
const selected = ref<string | null>(null)

function push(message: string) {
  log.value = [message, ...log.value].slice(0, 5)
}
function onClick(ring: ActivityRingItem) {
  selected.value = selected.value === ring.key ? null : ring.key
  push(\`click · \${ring.label} (\${ring.percent}%)\`)
}
</script>
<template>
  <div class="flex flex-wrap items-center gap-8">
    <OActivityRings
      :rings="rings"
      :size="170"
      @ring-enter="(r) => push(\`enter · \${r.label}\`)"
      @ring-leave="(r) => push(\`leave · \${r.label}\`)"
      @ring-click="onClick"
    />
    <ul class="min-h-24 w-52 space-y-1 font-mono text-xs text-ousi-muted">
      <li v-if="!log.length">Hover or click a ring…</li>
      <li v-for="(line, i) in log" :key="\`\${i}-\${line}\`" :class="i === 0 && 'text-ousi-foreground'">{{ line }}</li>
      <li v-if="selected" class="pt-1 text-ousi-accent">selected: {{ selected }}</li>
    </ul>
  </div>
</template>`,
      },
    },
    {
      id: 'controlled',
      title: 'Controlled focus',
      example: {
        component: 'ActivityRingsControlled',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { OActivityRings, OButton } from '@ousi-ui/vue'

const focused = ref<string | null>('Move')
const rings = [
  { label: 'Move', value: 520, max: 600, color: 'danger' },
  { label: 'Exercise', value: 24, max: 30, color: 'success' },
  { label: 'Stand', value: 7, max: 12, color: 'accent' },
]
</script>
<template>
  <div class="flex flex-col items-center gap-5">
    <OActivityRings v-model:focused="focused" :rings="rings" :size="170" />
    <!-- Any control can drive the focus through v-model:focused. -->
    <div class="flex gap-2">
      <OButton
        v-for="r in rings"
        :key="r.label"
        size="sm"
        :variant="focused === r.label ? 'primary' : 'secondary'"
        @click="focused = focused === r.label ? null : r.label"
      >
        {{ r.label }}
      </OButton>
    </div>
  </div>
</template>`,
      },
    },
    {
      id: 'card',
      title: 'Activity card',
      example: {
        component: 'ActivityRingsCard',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OActivityRings, OCard, OCardContent, OCardDescription, OCardHeader, OCardTitle } from '@ousi-ui/vue'

const days = [
  { id: 'Mon', move: 1240, exercise: 48, running: 2.1 },
  { id: 'Tue', move: 1810, exercise: 92, running: 4.6 },
  { id: 'Wed', move: 960, exercise: 31, running: 0 },
  { id: 'Thu', move: 2120, exercise: 125, running: 7.9 },
  { id: 'Fri', move: 1592, exercise: 105, running: 5.2 },
  { id: 'Sat', move: 2480, exercise: 140, running: 9.4 },
  { id: 'Sun', move: 700, exercise: 20, running: 0 },
]
const day = ref('Fri')
const focused = ref<string | null>(null)

const rings = computed(() => {
  const d = days.find((x) => x.id === day.value)!
  return [
    { label: 'Move', value: d.move, max: 2000, color: 'danger', valueLabel: \`\${d.move.toLocaleString()} kcal\` },
    { label: 'Exercise', value: d.exercise, max: 120, color: 'success', valueLabel: \`\${Math.floor(d.exercise / 60)}h \${d.exercise % 60}m\` },
    { label: 'Running', value: d.running, max: 8, color: 'accent', valueLabel: \`\${d.running} km\` },
  ]
})
</script>
<template>
  <OCard class="w-96">
    <OCardHeader>
      <OCardTitle>Activity</OCardTitle>
      <OCardDescription>Pick a day to compare your goals</OCardDescription>
    </OCardHeader>
    <OCardContent class="flex flex-col items-center gap-5">
      <div class="flex w-full justify-between">
        <button
          v-for="d in days"
          :key="d.id"
          type="button"
          class="rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
          :class="day === d.id ? 'bg-ousi-foreground text-ousi-background' : 'text-ousi-muted hover:bg-ousi-default'"
          @click="day = d.id"
        >
          {{ d.id }}
        </button>
      </div>

      <OActivityRings v-model:focused="focused" :rings="rings" :size="180" show-stats class="w-full">
        <template #default="{ focusedRing }">
          <div class="text-center">
            <div class="text-2xl font-semibold tabular-nums text-ousi-foreground">
              {{ focusedRing ? focusedRing.percent : day }}{{ focusedRing ? '%' : '' }}
            </div>
            <div class="text-xs text-ousi-muted">{{ focusedRing ? focusedRing.label : 'Selected day' }}</div>
          </div>
        </template>
      </OActivityRings>
    </OCardContent>
  </OCard>
</template>`,
      },
    },
    {
      id: 'sizes',
      title: 'Sizes and thickness',
      example: {
        component: 'ActivityRingsSizes',
        code: `<script setup lang="ts">
import { OActivityRings } from '@ousi-ui/vue'

const rings = [
  { label: 'Move', value: 80, color: 'danger' },
  { label: 'Exercise', value: 55, color: 'success' },
  { label: 'Stand', value: 30, color: 'accent' },
]
</script>
<template>
  <div class="flex flex-wrap items-center gap-8">
    <OActivityRings :rings="rings" :size="56" :stroke-width="14" :gap="2" :interactive="false" />
    <OActivityRings :rings="rings" :size="110" :stroke-width="12" :gap="3" />
    <OActivityRings :rings="rings" :size="200" :stroke-width="7" :gap="4" />
  </div>
</template>`,
      },
    },
  ],

  props: [
    { name: 'rings', type: 'ActivityRing[]', description: 'Rings from outermost to innermost: { id?, label, value, max?, color?, valueLabel? }.' },
    { name: 'size', type: 'number', default: '180', description: 'Diameter in px.' },
    { name: 'strokeWidth', type: 'number', default: '8', description: 'Thickness of each ring (0-100 viewBox scale).' },
    { name: 'gap', type: 'number', default: '3', description: 'Space between rings (0-100 viewBox scale).' },
    { name: 'interactive', type: 'boolean', default: 'true', description: 'Enable hover, focus and click reactions and their events.' },
    { name: 'showStats', type: 'boolean', default: 'false', description: 'Show a legend with the value of every ring.' },
    { name: 'focused', type: 'string | null', default: 'null', description: 'Key (id or label) of the highlighted ring; the rest are dimmed. Optional: the chart tracks hover by itself; bind v-model:focused to read or drive it.' },
    { name: 'animated', type: 'boolean', default: 'true', description: 'Animate rings on mount and on value changes. Respects prefers-reduced-motion.' },
    { name: 'label', type: 'string', default: '-', description: 'Accessible label. Defaults to "Move 87%, Exercise 80%, …".' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'default', type: '{ focusedRing, rings }', description: 'Center of the rings. focusedRing is the ring under the pointer (or null).' },
    { name: 'stat', type: '{ ring, index, focused, dimmed }', description: 'Content of each legend item. The wrapper keeps hover, focus and click behavior.' },
    { name: 'stats', type: '{ rings, focusedKey, setFocus }', description: 'Replaces the whole legend. Call setFocus(key | null) to drive the highlight.' },
  ],

  emits: [
    { name: 'update:focused', type: '(key: string | null)', description: 'Highlighted ring changed (v-model:focused).' },
    { name: 'ring-enter', type: '(ring: ActivityRingItem, event: Event)', description: 'Pointer enters a ring or legend item, or it gets keyboard focus.' },
    { name: 'ring-leave', type: '(ring: ActivityRingItem, event: Event)', description: 'Pointer leaves a ring or legend item, or it loses focus.' },
    { name: 'ring-click', type: '(ring: ActivityRingItem, event: Event)', description: 'A ring or legend item is clicked, or activated with Enter/Space.' },
  ],


  keyboard: [
    { key: 'Tab', description: 'Moves focus into the chart and out of it. The chart is a single tab stop, however many items it has.' },
    { key: 'Arrow keys', description: 'Moves between the legend items (with show-stats).' },
    { key: 'Home / End', description: 'Jumps to the first or the last item.' },
    { key: 'Enter / Space', description: 'Emits the click event of the focused item.' },
  ],

  aria: [
    { attribute: 'role="img"', condition: 'always', description: 'The rings are exposed as a single image.' },
    { attribute: 'aria-label', condition: 'always', description: 'Summarizes each ring and its percentage.' },
  ],
}
