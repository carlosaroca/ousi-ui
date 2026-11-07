import type { ComponentData } from './types'

export const segmentedGaugeData: ComponentData = {
  title: 'Segmented Gauge',
  description: 'An arc split into segments whose length follows each maximum, filled up to the value. Good for scores made of sub-scores.',
  category: 'Charts',
  importCode: "import { OSegmentedGauge } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'SegmentedGaugeBasic',
        code: `<script setup lang="ts">
import { OSegmentedGauge } from '@ousi-ui/vue'

const segments = [
  { label: 'Duration', value: 49, max: 50, color: 'accent' },
  { label: 'Bedtime', value: 29, max: 30, color: 'violet' },
  { label: 'Interruptions', value: 20, max: 20, color: 'success' },
]
</script>
<template>
  <OSegmentedGauge :segments="segments" :size="220">
    <template #default="{ total, max }">
      <div class="text-center">
        <div class="text-4xl font-semibold tabular-nums text-ousi-foreground">{{ total }}</div>
        <div class="text-xs text-ousi-muted">of {{ max }}</div>
      </div>
    </template>
  </OSegmentedGauge>
</template>`,
      },
    },
    {
      id: 'kpis',
      title: 'Half-circle KPIs',
      example: {
        component: 'SegmentedGaugeKpis',
        code: `<script setup lang="ts">
import { OCard, OSegmentedGauge } from '@ousi-ui/vue'

// sweep=180 draws a half circle. The default slot gets the hovered segment, so no v-model is needed.
const kpis = [
  { label: 'CPU', unit: '%', parts: [{ label: 'User', value: 38, max: 60, color: 'accent' }, { label: 'System', value: 14, max: 40, color: 'violet' }] },
  { label: 'Memory', unit: 'GB', parts: [{ label: 'Apps', value: 9, max: 12, color: 'orange' }, { label: 'Cache', value: 3, max: 4, color: 'warning' }] },
  { label: 'Disk', unit: 'GB', parts: [{ label: 'Data', value: 210, max: 300, color: 'success' }, { label: 'Logs', value: 18, max: 100, color: 'danger' }] },
]
</script>
<template>
  <div class="grid gap-4 sm:grid-cols-3">
    <OCard v-for="k in kpis" :key="k.label" class="items-center gap-1 p-4">
      <OSegmentedGauge :segments="k.parts" :size="150" :sweep="180" :stroke-width="9" :gap="6" class="!h-[88px]">
        <template #default="{ total, focusedSegment }">
          <div class="mt-9 text-center">
            <div class="text-xl font-semibold tabular-nums text-ousi-foreground">{{ focusedSegment ? focusedSegment.value : total }}<span class="ml-0.5 text-xs font-normal text-ousi-muted">{{ k.unit }}</span></div>
            <div class="text-[11px] text-ousi-muted">{{ focusedSegment ? focusedSegment.label : k.label }}</div>
          </div>
        </template>
      </OSegmentedGauge>
    </OCard>
  </div>
</template>`,
      },
    },
    {
      id: 'week',
      title: 'Recipe: day picker',
      example: {
        component: 'SegmentedGaugeWeek',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OCard, OSegmentedGauge } from '@ousi-ui/vue'

const days = [
  { day: 'Mon', d: 44, b: 24, i: 15 }, { day: 'Tue', d: 48, b: 28, i: 18 }, { day: 'Wed', d: 39, b: 20, i: 12 },
  { day: 'Thu', d: 50, b: 30, i: 20 }, { day: 'Fri', d: 46, b: 25, i: 17 }, { day: 'Sat', d: 49, b: 29, i: 19 }, { day: 'Sun', d: 49, b: 29, i: 20 },
]
const selected = ref(6)
const focused = ref<number | null>(null)

const segs = (r: (typeof days)[number]) => [
  { label: 'Duration', value: r.d, max: 50, color: 'accent' },
  { label: 'Bedtime', value: r.b, max: 30, color: 'violet' },
  { label: 'Interruptions', value: r.i, max: 20, color: 'success' },
]
const score = (r: (typeof days)[number]) => r.d + r.b + r.i
const current = computed(() => days[selected.value])
const rating = computed(() => (score(current.value) >= 95 ? 'Excellent' : score(current.value) >= 85 ? 'Good' : 'Fair'))
</script>
<template>
  <OCard class="w-full max-w-lg gap-5 p-5">
    <div class="flex items-center justify-between">
      <div class="text-sm font-medium text-ousi-muted">Sleep score · {{ rating }}</div>
      <div class="text-xs text-ousi-muted">{{ current.day }}</div>
    </div>
    <div class="flex flex-wrap items-center gap-6">
      <OSegmentedGauge v-model:focused="focused" :key="selected" :segments="segs(current)" :size="190">
        <template #default="{ total, focusedSegment }">
          <div class="text-center">
            <div class="text-4xl font-semibold tabular-nums text-ousi-foreground">{{ focusedSegment ? focusedSegment.value : total }}</div>
            <div class="text-xs text-ousi-muted">{{ focusedSegment ? focusedSegment.label : 'of 100' }}</div>
          </div>
        </template>
      </OSegmentedGauge>
      <ul class="min-w-40 flex-1 space-y-2 text-sm">
        <li
          v-for="(s, i) in segs(current)" :key="s.label"
          class="flex items-center justify-between transition-opacity"
          :class="focused != null && focused !== i && 'opacity-40'"
          @mouseenter="focused = i" @mouseleave="focused = null"
        >
          <span class="flex items-center gap-2 text-ousi-foreground"><span class="inline-block size-2 rounded-full" :style="{ backgroundColor: \`var(--ousi-\${s.color})\` }" />{{ s.label }}</span>
          <span class="tabular-nums text-ousi-muted"><b class="text-ousi-foreground">{{ s.value }}</b>/{{ s.max }}</span>
        </li>
      </ul>
    </div>
    <!-- Seven small gauges act as the day picker -->
    <div class="grid grid-cols-7 gap-1.5">
      <button
        v-for="(r, i) in days" :key="r.day" type="button"
        class="flex flex-col items-center gap-1 rounded-xl p-1.5 transition-colors"
        :class="selected === i ? 'bg-ousi-default' : 'hover:bg-ousi-default/60'"
        @click="selected = i"
      >
        <OSegmentedGauge :segments="segs(r)" :size="38" :stroke-width="14" :gap="14" :interactive="false" :animated="false" />
        <span class="text-[11px]" :class="selected === i ? 'font-medium text-ousi-foreground' : 'text-ousi-muted'">{{ r.day }}</span>
      </button>
    </div>
  </OCard>
</template>`,
      },
    },
    {
      id: 'rows',
      title: 'Recipe: linked rows',
      example: {
        component: 'SegmentedGaugeRows',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OCard, OSegmentedGauge } from '@ousi-ui/vue'

const segments = [
  { label: 'Duration', value: 49, max: 50, color: 'accent', valueLabel: '7h 50m' },
  { label: 'Bedtime', value: 29, max: 30, color: 'violet', valueLabel: '20m earlier' },
  { label: 'Interruptions', value: 20, max: 20, color: 'success', valueLabel: '5m awake' },
]
const focused = ref<number | null>(null)
const status = computed(() => (focused.value == null ? 'Excellent' : segments[focused.value].label))
</script>
<template>
  <OCard class="w-full max-w-sm items-center gap-5 p-5">
    <div class="w-full text-sm font-medium text-ousi-muted">Sleep score · {{ status }}</div>
    <OSegmentedGauge v-model:focused="focused" :segments="segments" :size="200">
      <template #default="{ total, focusedSegment }">
        <div class="text-center">
          <div class="text-4xl font-semibold tabular-nums text-ousi-foreground">{{ focusedSegment ? focusedSegment.value : total }}</div>
          <div class="text-xs text-ousi-muted">{{ focusedSegment ? \`of \${focusedSegment.max}\` : 'of 100' }}</div>
        </div>
      </template>
    </OSegmentedGauge>

    <!-- The rows share v-model:focused with the gauge -->
    <ul class="w-full divide-y divide-ousi-border/50">
      <li
        v-for="(s, i) in segments"
        :key="s.label"
        class="flex cursor-default items-center justify-between py-2.5 text-sm transition-opacity"
        :class="focused != null && focused !== i && 'opacity-40'"
        @mouseenter="focused = i"
        @mouseleave="focused = null"
      >
        <span class="flex items-center gap-2 text-ousi-foreground">
          <span class="inline-block size-2 rounded-full" :style="{ backgroundColor: \`var(--ousi-\${s.color})\` }" />{{ s.label }}
        </span>
        <span class="tabular-nums text-ousi-muted">{{ s.valueLabel }} · <span class="font-medium text-ousi-foreground">{{ s.value }}/{{ s.max }}</span></span>
      </li>
    </ul>
  </OCard>
</template>`,
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'SegmentedGaugeVariants',
        code: `<script setup lang="ts">
import { OSegmentedGauge } from '@ousi-ui/vue'

const segments = [
  { label: 'A', value: 38, max: 50, color: 'accent' },
  { label: 'B', value: 12, max: 30, color: 'orange' },
  { label: 'C', value: 20, max: 20, color: 'success' },
]
</script>
<template>
  <div class="flex flex-wrap items-center gap-10">
    <div class="flex flex-col items-center gap-2"><OSegmentedGauge :segments="segments" :size="130" /><span class="text-xs text-ousi-muted">sweep 270 (default)</span></div>
    <div class="flex flex-col items-center gap-2"><OSegmentedGauge :segments="segments" :size="130" :sweep="360" :gap="10" /><span class="text-xs text-ousi-muted">full ring</span></div>
    <div class="flex flex-col items-center gap-2"><OSegmentedGauge :segments="segments" :size="130" :sweep="220" :stroke-width="14" /><span class="text-xs text-ousi-muted">sweep 220, thicker</span></div>
    <div class="flex flex-col items-center gap-2"><OSegmentedGauge :segments="segments" :size="130" :stroke-width="5" :gap="14" /><span class="text-xs text-ousi-muted">thin, wide gaps</span></div>
  </div>
</template>`,
      },
    },
    {
      id: 'events',
      title: 'Events',
      example: {
        component: 'SegmentedGaugeEvents',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { OSegmentedGauge } from '@ousi-ui/vue'
import type { GaugeItem } from '@ousi-ui/vue'

const segments = [
  { label: 'Move', value: 520, max: 600, color: 'danger', valueLabel: '520 kcal' },
  { label: 'Exercise', value: 24, max: 30, color: 'success', valueLabel: '24 min' },
  { label: 'Stand', value: 7, max: 12, color: 'accent', valueLabel: '7 h' },
]
const picked = ref<GaugeItem | null>(null)
</script>
<template>
  <div class="flex flex-wrap items-center gap-8">
    <OSegmentedGauge :segments="segments" :size="180" :sweep="360" :gap="12" @segment-click="(s) => (picked = s)" />
    <div class="rounded-xl bg-ousi-default px-4 py-3 text-xs">
      <div class="text-ousi-muted">Click a segment</div>
      <div v-if="picked" class="mt-1">
        <div class="text-base font-semibold text-ousi-foreground">{{ picked.label }} · {{ picked.valueLabel }}</div>
        <div class="tabular-nums text-ousi-muted">{{ picked.percent }}% of goal</div>
      </div>
    </div>
  </div>
</template>`,
      },
    },
  ],

  props: [
    { name: 'segments', type: 'GaugeSegment[]', description: 'Segments: { id?, label, value, max, color?, valueLabel? }. Arc length is proportional to max.' },
    { name: 'size', type: 'number', default: '200', description: 'Diameter in px.' },
    { name: 'strokeWidth', type: 'number', default: '10', description: 'Thickness (0-100 viewBox scale).' },
    { name: 'sweep', type: 'number', default: '270', description: 'Total angle in degrees. 360 draws a full ring.' },
    { name: 'gap', type: 'number', default: '8', description: 'Gap between segments in degrees.' },
    { name: 'interactive', type: 'boolean', default: 'true', description: 'Enable hover and click reactions.' },
    { name: 'focused', type: 'number | null', default: 'null', description: 'Highlighted segment index. Optional: the chart tracks hover by itself; bind v-model:focused to read or drive it.' },
    { name: 'animated', type: 'boolean', default: 'true', description: 'Animate on mount.' },
    { name: 'label', type: 'string', description: 'Accessible label.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'default', type: '{ total, max, focusedSegment }', description: 'Center of the gauge.' },
  ],

  emits: [
    { name: 'update:focused', type: '(index: number | null)', description: 'Highlighted segment changed (v-model:focused).' },
    { name: 'segment-enter', type: '(item: GaugeItem, event: Event)', description: 'Pointer enters a segment.' },
    { name: 'segment-leave', type: '(item: GaugeItem, event: Event)', description: 'Pointer leaves a segment.' },
    { name: 'segment-click', type: '(item: GaugeItem, event: Event)', description: 'A segment is clicked.' },
  ],
}
