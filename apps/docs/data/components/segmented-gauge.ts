import type { ComponentData } from './types'

export const segmentedGaugeData: ComponentData = {
  title: 'Segmented Gauge',
  description: 'An arc split into segments whose length follows each maximum, filled up to the value. For how a total splits, quotas and budgets by category, and scores made of sub-scores.',
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
      id: 'distribution',
      title: 'Parts of a total',
      example: {
        component: 'SegmentedGaugeDistribution',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { OCard, OSegmentedGauge } from '@ousi-ui/vue'

const priorities = [
  { label: 'Critical', count: 3, color: 'danger' },
  { label: 'High', count: 128, color: 'orange' },
  { label: 'Medium', count: 640, color: 'warning' },
  { label: 'Low', count: 285, color: 'success' },
  { label: 'No priority', count: 96, color: 'var(--ousi-muted)' },
]
// Parts of a total: each max is its own value, so each arc takes its share and comes out full.
const segments = priorities.map((p) => ({ label: p.label, value: p.count, max: p.count, color: p.color }))
const total = priorities.reduce((sum, p) => sum + p.count, 0)
const focused = ref<number | null>(null)

// A tiny part is drawn bigger than it is, so the numbers carry the truth.
const share = (count: number) => (count / total < 0.01 ? '<1%' : \`\${Math.round((count / total) * 100)}%\`)
const dot = (color: string) => (color.startsWith('var') ? color : \`var(--ousi-\${color})\`)
</script>
<template>
  <OCard class="w-full max-w-xl flex-row flex-wrap items-center gap-6 p-5">
    <OSegmentedGauge v-model:focused="focused" :segments="segments" :size="190">
      <template #default="{ focusedSegment }">
        <div class="text-center">
          <div class="text-3xl font-semibold tabular-nums text-ousi-foreground">{{ (focusedSegment ? focusedSegment.value : total).toLocaleString('en-US') }}</div>
          <div class="text-xs text-ousi-muted">{{ focusedSegment ? focusedSegment.label : 'open tickets' }}</div>
        </div>
      </template>
    </OSegmentedGauge>
    <ul class="min-w-52 flex-1 space-y-2 text-sm">
      <li
        v-for="(p, i) in priorities"
        :key="p.label"
        class="flex items-center justify-between gap-3 transition-opacity"
        :class="focused != null && focused !== i && 'opacity-40'"
        @mouseenter="focused = i"
        @mouseleave="focused = null"
      >
        <span class="flex items-center gap-2 text-ousi-muted"><span class="size-2 rounded-full" :style="{ backgroundColor: dot(p.color) }" />{{ p.label }}</span>
        <span class="tabular-nums"><b class="font-semibold text-ousi-foreground">{{ p.count }}</b> <span class="inline-block w-10 text-right text-ousi-muted">{{ share(p.count) }}</span></span>
      </li>
    </ul>
  </OCard>
</template>`,
      },
    },
    {
      id: 'quotas',
      title: 'Quotas by category',
      example: {
        component: 'SegmentedGaugeQuota',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { OCard, OSegmentedGauge } from '@ousi-ui/vue'

// A quota per category: the arc is as long as the quota, filled with what is used.
const segments = [
  { label: 'Photos', value: 34, max: 50, color: 'accent' },
  { label: 'Documents', value: 12, max: 30, color: 'violet' },
  { label: 'Videos', value: 52, max: 60, color: 'orange' },
  { label: 'Backups', value: 6, max: 20, color: 'success' },
]
const focused = ref<number | null>(null)
</script>
<template>
  <OCard class="w-full max-w-sm items-center gap-4 p-5">
    <div class="w-full text-sm font-medium text-ousi-muted">Storage plan</div>
    <OSegmentedGauge v-model:focused="focused" :segments="segments" :size="200">
      <template #default="{ total, max, focusedSegment }">
        <div class="text-center">
          <div class="text-3xl font-semibold tabular-nums text-ousi-foreground">{{ focusedSegment ? focusedSegment.value : total }}<span class="ml-1 text-sm font-normal text-ousi-muted">GB</span></div>
          <div class="text-xs text-ousi-muted">{{ focusedSegment ? \`of \${focusedSegment.max} GB\` : \`of \${max} GB used\` }}</div>
        </div>
      </template>
    </OSegmentedGauge>
    <ul class="w-full divide-y divide-ousi-border/50 text-sm">
      <li
        v-for="(s, i) in segments"
        :key="s.label"
        class="flex items-center justify-between py-2 transition-opacity"
        :class="focused != null && focused !== i && 'opacity-40'"
        @mouseenter="focused = i"
        @mouseleave="focused = null"
      >
        <span class="flex items-center gap-2 text-ousi-foreground"><span class="size-2 rounded-full" :style="{ backgroundColor: \`var(--ousi-\${s.color})\` }" />{{ s.label }}</span>
        <span class="tabular-nums text-ousi-muted">{{ s.max - s.value }} GB free</span>
      </li>
    </ul>
  </OCard>
</template>`,
      },
    },
    {
      id: 'budget',
      title: 'Budget with a limit',
      example: {
        component: 'SegmentedGaugeBudget',
        code: `<script setup lang="ts">
import { OCard, OSegmentedGauge } from '@ousi-ui/vue'

const teams = [
  { name: 'Marketing', spent: 42, budget: 50, color: 'accent' },
  { name: 'Product', spent: 61, budget: 55, color: 'violet' },
  { name: 'Operations', spent: 18, budget: 30, color: 'success' },
  { name: 'Sales', spent: 33, budget: 40, color: 'orange' },
]
const isOver = (t: (typeof teams)[number]) => t.spent > t.budget
// Over its limit a segment comes out full, no longer: the color and the list say by how much.
const segments = teams.map((t) => ({ label: t.name, value: t.spent, max: t.budget, color: isOver(t) ? 'danger' : t.color }))
const over = teams.filter(isOver).length
</script>
<template>
  <OCard class="w-full max-w-xl flex-row flex-wrap items-center gap-6 p-5">
    <OSegmentedGauge :segments="segments" :size="190">
      <template #default="{ total, max, focusedSegment }">
        <div class="text-center">
          <div class="text-3xl font-semibold tabular-nums text-ousi-foreground">\${{ focusedSegment ? focusedSegment.value : total }}k</div>
          <div class="text-xs text-ousi-muted">{{ focusedSegment ? focusedSegment.label : \`of $\${max}k\` }}</div>
        </div>
      </template>
    </OSegmentedGauge>
    <div class="min-w-52 flex-1">
      <p class="mb-2 text-sm font-medium" :class="over ? 'text-ousi-danger' : 'text-ousi-foreground'">{{ over ? \`\${over} team over budget\` : 'All within budget' }}</p>
      <ul class="space-y-2 text-sm">
        <li v-for="(t, i) in teams" :key="t.name" class="flex items-center justify-between gap-3">
          <span class="flex items-center gap-2 text-ousi-muted"><span class="size-2 rounded-full" :style="{ backgroundColor: \`var(--ousi-\${segments[i].color})\` }" />{{ t.name }}</span>
          <span class="tabular-nums" :class="isOver(t) ? 'font-medium text-ousi-danger' : 'text-ousi-muted'">{{ isOver(t) ? \`$\${t.spent - t.budget}k over\` : \`$\${t.spent}k of $\${t.budget}k\` }}</span>
        </li>
      </ul>
    </div>
  </OCard>
</template>`,
      },
    },
    {
      id: 'survey',
      title: 'Survey score',
      example: {
        component: 'SegmentedGaugeNps',
        code: `<script setup lang="ts">
import { OCard, OSegmentedGauge } from '@ousi-ui/vue'

const answers = [
  { label: 'Detractors', value: 60, color: 'danger' },
  { label: 'Passives', value: 115, color: 'warning' },
  { label: 'Promoters', value: 325, color: 'success' },
]
const segments = answers.map((a) => ({ ...a, max: a.value }))
const total = answers.reduce((sum, a) => sum + a.value, 0)
const percent = (value: number) => Math.round((value / total) * 100)
const score = Math.round(((answers[2].value - answers[0].value) / total) * 100)
</script>
<template>
  <OCard class="w-full max-w-xs items-center gap-3 p-5">
    <div class="w-full text-sm font-medium text-ousi-muted">Net Promoter Score</div>
    <!-- joined: one band, for a single answer split in three. -->
    <OSegmentedGauge :segments="segments" :size="200" :sweep="180" joined class="!h-[112px]">
      <template #default="{ focusedSegment }">
        <div class="mt-12 text-center">
          <div class="text-4xl font-semibold tabular-nums text-ousi-foreground">{{ focusedSegment ? \`\${percent(focusedSegment.value)}%\` : score }}</div>
          <div class="text-xs text-ousi-muted">{{ focusedSegment ? focusedSegment.label : \`\${total} answers\` }}</div>
        </div>
      </template>
    </OSegmentedGauge>
    <ul class="grid w-full grid-cols-3 gap-2 text-center">
      <li v-for="a in answers" :key="a.label">
        <div class="text-sm font-semibold tabular-nums text-ousi-foreground">{{ percent(a.value) }}%</div>
        <div class="flex items-center justify-center gap-1.5 text-[11px] text-ousi-muted"><span class="size-1.5 rounded-full" :style="{ backgroundColor: \`var(--ousi-\${a.color})\` }" />{{ a.label }}</div>
      </li>
    </ul>
  </OCard>
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
      <OSegmentedGauge :segments="k.parts" :size="150" :sweep="180" :stroke-width="9" class="!h-[88px]">
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
      title: 'Day picker',
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
    <div class="flex flex-wrap items-center justify-between gap-3">
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
        <OSegmentedGauge :segments="segs(r)" :size="38" :stroke-width="14" :gap="7" :interactive="false" :animated="false" />
        <span class="text-[11px]" :class="selected === i ? 'font-medium text-ousi-foreground' : 'text-ousi-muted'">{{ r.day }}</span>
      </button>
    </div>
  </OCard>
</template>`,
      },
    },
    {
      id: 'rows',
      title: 'Linked rows',
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
  <div class="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
    <div class="flex flex-col items-center gap-2"><OSegmentedGauge :segments="segments" :size="130" /><span class="text-xs text-ousi-muted">sweep 270 (default)</span></div>
    <div class="flex flex-col items-center gap-2"><OSegmentedGauge :segments="segments" :size="130" joined /><span class="text-xs text-ousi-muted">joined</span></div>
    <div class="flex flex-col items-center gap-2"><OSegmentedGauge :segments="segments" :size="130" :sweep="360" /><span class="text-xs text-ousi-muted">full ring</span></div>
    <div class="flex flex-col items-center gap-2"><OSegmentedGauge :segments="segments" :size="130" :sweep="220" :stroke-width="14" /><span class="text-xs text-ousi-muted">sweep 220, thicker</span></div>
    <div class="flex flex-col items-center gap-2"><OSegmentedGauge :segments="segments" :size="130" :stroke-width="5" :gap="7" /><span class="text-xs text-ousi-muted">thin, wider gaps</span></div>
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
    <OSegmentedGauge :segments="segments" :size="180" :sweep="360" @segment-click="(s) => (picked = s)" />
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
    { name: 'segments', type: 'GaugeSegment[]', description: 'Segments: { id?, label, value, max, color?, valueLabel? }. Arc length is proportional to max, and the segment fills up to value. To show how a total splits, set each max to its own value.' },
    { name: 'size', type: 'number', default: '200', description: 'Diameter in px.' },
    { name: 'strokeWidth', type: 'number', default: '10', description: 'Thickness (0-100 viewBox scale).' },
    { name: 'sweep', type: 'number', default: '270', description: 'Total angle in degrees. 360 draws a full ring.' },
    { name: 'gap', type: 'number', default: '2', description: 'Space between segments, in degrees: a curve of even width around the round end of the next one. 0 is the same as joined. Small gauges need more to be seen.' },
    { name: 'joined', type: 'boolean', default: 'false', description: 'Segments touch, with no space between them. By default a thin curved space separates them.' },
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
