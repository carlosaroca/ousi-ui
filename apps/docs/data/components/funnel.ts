import type { ComponentData } from './types'

export const funnelData: ComponentData = {
  title: 'Funnel',
  description: 'A conversion funnel as one continuous flow, each stage blending into the next, or as rows of pills. Hover a stage to dim the rest; bring your own header and card.',
  category: 'Charts',
  importCode: "import { OFunnel } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Flow',
      example: {
        component: 'FunnelBasic',
        code: `<script setup lang="ts">
import { OFunnel } from '@ousi-ui/vue'

const stages = [
  { label: 'Visitors', value: 48200, color: '#aee637' },
  { label: 'Sign-ups', value: 18400, color: '#4f8ff7' },
  { label: 'Trials', value: 9200, color: '#b57bff' },
  { label: 'Paid', value: 3100, color: '#ec6fb5' },
]
</script>
<template>
  <OFunnel :stages="stages" />
</template>`,
      },
    },
    {
      id: 'signup',
      title: 'Recipe: sign-up funnel',
      example: {
        component: 'FunnelSignup',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, ODropdown, ODropdownItem, ODropdownMenu, ODropdownPopover, ODropdownTrigger, OFunnel } from '@ousi-ui/vue'

const colors = ['#aee637', '#4f8ff7', '#b57bff', '#ec6fb5']
const labels = ['Call opened', 'Started', 'Completed', 'Converted']
const ranges = [
  { key: '7d', label: 'Last 7 days', values: [197, 110, 77, 38], delta: 5.2 },
  { key: '30d', label: 'Last 30 days', values: [812, 470, 301, 164], delta: 8.9 },
  { key: '90d', label: 'Last 90 days', values: [2390, 1304, 880, 452], delta: -2.1 },
]
const range = ref(ranges[0])
const focused = ref<number | null>(null)

const stages = computed(() => range.value.values.map((value, i) => ({ label: labels[i], value, color: colors[i] })))
const active = computed(() => (focused.value == null ? null : stages.value[focused.value]))
</script>
<template>
  <!-- The header is plain markup: a title, the number that follows the hovered stage, a delta chip and a period dropdown -->
  <OCard class="w-full max-w-2xl gap-4 p-5">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div class="text-sm font-medium text-ousi-muted">{{ active ? active.label : 'Sign-up funnel' }}</div>
        <div class="mt-1 flex items-center gap-3">
          <OAnimatedNumber :value="active ? active.value : stages[0].value" animation="count" :duration="300" class="text-3xl font-semibold tabular-nums text-ousi-foreground" />
          <span
            class="rounded-lg px-2 py-0.5 text-sm font-medium tabular-nums"
            :class="range.delta >= 0 ? 'bg-ousi-success/20 text-ousi-success-soft-strong' : 'bg-ousi-danger/15 text-ousi-danger-soft-strong'"
          >
            {{ range.delta >= 0 ? '+' : '' }}{{ range.delta }}%
          </span>
        </div>
      </div>
      <ODropdown>
        <ODropdownTrigger>
          <button type="button" class="flex items-center gap-2 rounded-xl bg-ousi-background px-3 py-2 text-sm font-medium text-ousi-foreground shadow-sm">
            <svg viewBox="0 0 24 24" class="size-4 text-ousi-muted" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M8 3v4M16 3v4M3.5 10h17" /></svg>
            {{ range.label }}
            <svg viewBox="0 0 12 12" class="size-3 text-ousi-muted" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.5 6 7.5 9 4.5" /></svg>
          </button>
        </ODropdownTrigger>
        <ODropdownPopover placement="bottom-end">
          <ODropdownMenu @action="(k) => (range = ranges.find((r) => r.key === k)!)">
            <ODropdownItem v-for="r in ranges" :id="r.key" :key="r.key">{{ r.label }}</ODropdownItem>
          </ODropdownMenu>
        </ODropdownPopover>
      </ODropdown>
    </div>
    <OFunnel v-model:focused="focused" :key="range.key" :stages="stages" :height="230" />
  </OCard>
</template>`,
      },
    },
    {
      id: 'bars',
      title: 'Bars',
      example: {
        component: 'FunnelBars',
        code: `<script setup lang="ts">
import { OFunnel } from '@ousi-ui/vue'

const stages = [
  { label: 'Leads', value: 1240, color: 'accent' },
  { label: 'Qualified', value: 860, color: 'violet' },
  { label: 'Proposal', value: 410, color: 'orange' },
  { label: 'Negotiation', value: 190, color: 'warning' },
  { label: 'Won', value: 96, color: 'success' },
]
</script>
<template>
  <OFunnel :stages="stages" variant="bars" />
</template>`,
      },
    },
    {
      id: 'variants',
      title: 'Shape, mono and halo',
      example: {
        component: 'FunnelVariants',
        code: `<script setup lang="ts">
import { OFunnel } from '@ousi-ui/vue'

const stages = [
  { label: 'Impressions', value: 120000, color: '#aee637' },
  { label: 'Clicks', value: 21000, color: '#4f8ff7' },
  { label: 'Add to cart', value: 6400, color: '#b57bff' },
  { label: 'Purchase', value: 1800, color: '#ec6fb5' },
]
</script>
<template>
  <div class="grid gap-10 md:grid-cols-2">
    <div>
      <p class="mb-3 text-xs text-ousi-muted">shape="sharp"</p>
      <OFunnel :stages="stages" shape="sharp" :height="150" :show-legend="false" />
    </div>
    <div>
      <p class="mb-3 text-xs text-ousi-muted">mono</p>
      <OFunnel :stages="stages" mono :height="150" :show-legend="false" />
    </div>
    <div>
      <p class="mb-3 text-xs text-ousi-muted">no halo</p>
      <OFunnel :stages="stages" :halo="false" :height="150" :show-legend="false" />
    </div>
    <div>
      <p class="mb-3 text-xs text-ousi-muted">bars + mono, no percentages</p>
      <OFunnel :stages="stages" variant="bars" mono :show-percent="false" />
    </div>
  </div>
</template>`,
      },
    },
    {
      id: 'hover',
      title: 'Recipe: header reacts to hover',
      example: {
        component: 'FunnelHover',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, OFunnel } from '@ousi-ui/vue'

const stages = [
  { label: 'Visitors', value: 48200, color: '#aee637' },
  { label: 'Sign-ups', value: 18400, color: '#4f8ff7' },
  { label: 'Trials', value: 9200, color: '#b57bff' },
  { label: 'Paid', value: 3100, color: '#ec6fb5' },
]
const focused = ref<number | null>(null)
const active = computed(() => (focused.value == null ? null : stages[focused.value]))
</script>
<template>
  <!-- The header reacts to the hovered stage through v-model:focused. -->
  <OCard class="w-full max-w-xl gap-5 p-5">
    <div>
      <div class="text-sm font-medium text-ousi-muted">{{ active ? active.label : 'Conversion funnel' }}</div>
      <OAnimatedNumber
        :value="active ? active.value : stages[0].value"
        animation="count"
        class="mt-1 text-3xl font-semibold tabular-nums text-ousi-foreground"
      />
    </div>
    <OFunnel v-model:focused="focused" :stages="stages" :height="200" />
  </OCard>
</template>`,
      },
    },
    {
      id: 'playground',
      title: 'Recipe: range, variant and mono',
      example: {
        component: 'FunnelPlayground',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, OFunnel } from '@ousi-ui/vue'

const ranges = {
  '7d': [
    { label: 'Visitors', value: 12400 }, { label: 'Sign-ups', value: 4200 },
    { label: 'Trials', value: 2100 }, { label: 'Paid', value: 640 },
  ],
  '30d': [
    { label: 'Visitors', value: 48200 }, { label: 'Sign-ups', value: 18400 },
    { label: 'Trials', value: 9200 }, { label: 'Paid', value: 3100 },
  ],
  '90d': [
    { label: 'Visitors', value: 141000 }, { label: 'Sign-ups', value: 52000 },
    { label: 'Trials', value: 24800 }, { label: 'Paid', value: 8700 },
  ],
} as const
const colors = ['#aee637', '#4f8ff7', '#b57bff', '#ec6fb5']
type Range = keyof typeof ranges

const range = ref<Range>('30d')
const variant = ref<'columns' | 'bars'>('columns')
const mono = ref(false)
const focused = ref<number | null>(null)

const stages = computed(() => ranges[range.value].map((s, i) => ({ ...s, color: colors[i] })))
const active = computed(() => (focused.value == null ? null : stages.value[focused.value]))
const conversion = computed(() => (stages.value[3].value / stages.value[0].value) * 100)

const pill = (on: boolean) => on ? 'bg-ousi-background text-ousi-foreground shadow-sm' : 'text-ousi-muted hover:text-ousi-foreground'
</script>
<template>
  <OCard class="w-full max-w-2xl gap-5 p-5">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div class="text-sm font-medium text-ousi-muted">{{ active ? active.label : 'Conversion' }}</div>
        <div class="mt-1 flex items-baseline gap-3">
          <OAnimatedNumber :value="active ? active.value : stages[0].value" animation="count" class="text-3xl font-semibold tabular-nums text-ousi-foreground" />
          <span v-if="!active" class="rounded-full bg-ousi-success/15 px-2 py-0.5 text-xs font-medium tabular-nums text-ousi-success-soft-strong">
            {{ conversion.toFixed(1) }}% convert
          </span>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <div class="flex rounded-full bg-ousi-default p-0.5">
          <button v-for="(_, r) in ranges" :key="r" type="button" class="rounded-full px-2.5 py-1 text-xs font-medium" :class="pill(range === r)" @click="range = r as Range">{{ r }}</button>
        </div>
        <div class="flex rounded-full bg-ousi-default p-0.5">
          <button type="button" class="rounded-full px-2.5 py-1 text-xs font-medium" :class="pill(variant === 'columns')" @click="variant = 'columns'">Columns</button>
          <button type="button" class="rounded-full px-2.5 py-1 text-xs font-medium" :class="pill(variant === 'bars')" @click="variant = 'bars'">Bars</button>
        </div>
        <button type="button" class="rounded-full bg-ousi-default px-3 py-1 text-xs font-medium" :class="mono ? 'text-ousi-foreground' : 'text-ousi-muted'" @click="mono = !mono">Mono</button>
      </div>
    </div>
    <OFunnel v-model:focused="focused" :key="variant" :stages="stages" :variant="variant" :mono="mono" :height="190" />
  </OCard>
</template>`,
      },
    },
    {
      id: 'custom',
      title: 'Custom legend tiles',
      example: {
        component: 'FunnelCustomStage',
        code: `<script setup lang="ts">
import { OFunnel } from '@ousi-ui/vue'

const stages = [
  { label: 'Visitors', value: 48200, color: '#aee637' },
  { label: 'Sign-ups', value: 18400, color: '#4f8ff7' },
  { label: 'Trials', value: 9200, color: '#b57bff' },
  { label: 'Paid', value: 3100, color: '#ec6fb5' },
]
</script>
<template>
  <div class="flex flex-col gap-10">
    <!-- \`stage\` replaces the content of each legend tile -->
    <OFunnel :stages="stages" :height="180">
      <template #stage="{ item, focused }">
        <div class="flex items-center justify-between gap-2">
          <span class="flex items-center gap-2 text-sm text-ousi-muted">
            <span class="inline-block size-2.5 rounded-full" :style="{ backgroundColor: item.color }" />{{ item.label }}
          </span>
          <span v-if="item.index > 0" class="text-[11px] tabular-nums" :style="{ color: focused ? item.color : undefined }">{{ item.stepPercent }}%</span>
        </div>
        <div class="mt-1 text-lg font-semibold tabular-nums text-ousi-foreground">{{ (item.value / 1000).toFixed(1) }}k</div>
        <div class="text-[11px] text-ousi-muted">{{ item.index === 0 ? 'top of funnel' : \`\${100 - item.stepPercent}% drop-off\` }}</div>
      </template>
    </OFunnel>

    <!-- Without the legend, using the percentage pills only -->
    <OFunnel :stages="stages" :height="140" :show-legend="false" />

    <!-- In the bars variant \`stage\` replaces the right side, and \`icon\` adds content to the pill -->
    <OFunnel :stages="stages" variant="bars">
      <template #icon="{ item }">
        <span class="text-xs font-semibold">{{ item.index + 1 }}</span>
      </template>
      <template #stage="{ item }">
        <span class="text-sm font-semibold tabular-nums text-ousi-foreground">{{ item.formatted }}</span>
        <span class="ml-2 text-xs text-ousi-muted">{{ item.stepPercent }}%</span>
      </template>
    </OFunnel>
  </div>
</template>`,
      },
    },
    {
      id: 'events',
      title: 'Events',
      example: {
        component: 'FunnelEvents',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { OFunnel } from '@ousi-ui/vue'
import type { FunnelItem } from '@ousi-ui/vue'

const stages = [
  { label: 'Leads', value: 1240 },
  { label: 'Qualified', value: 860 },
  { label: 'Proposal', value: 410 },
  { label: 'Won', value: 96 },
]
const log = ref<string[]>([])
const selected = ref<FunnelItem | null>(null)
const push = (m: string) => { log.value = [m, ...log.value].slice(0, 4) }
</script>
<template>
  <div class="flex flex-col gap-5">
    <OFunnel
      :stages="stages"
      variant="bars"
      @stage-enter="(s) => push(\`enter · \${s.label}\`)"
      @stage-leave="(s) => push(\`leave · \${s.label}\`)"
      @stage-click="(s) => { selected = s; push(\`click · \${s.label}\`) }"
    />
    <div class="flex flex-wrap items-start justify-between gap-4 text-xs">
      <ul class="min-h-16 space-y-1 font-mono text-ousi-muted">
        <li v-if="!log.length">Hover or click a stage…</li>
        <li v-for="(l, i) in log" :key="\`\${i}-\${l}\`" :class="i === 0 && 'text-ousi-foreground'">{{ l }}</li>
      </ul>
      <div v-if="selected" class="rounded-xl bg-ousi-default px-4 py-3">
        <div class="text-ousi-muted">Selected</div>
        <div class="text-base font-semibold text-ousi-foreground">{{ selected.label }}</div>
        <div class="tabular-nums text-ousi-muted">{{ selected.formatted }} · {{ selected.percent }}% of top</div>
      </div>
    </div>
  </div>
</template>`,
      },
    },
  ],

  props: [
    { name: 'stages', type: 'FunnelStage[]', description: 'Stages, top of the funnel first: { id?, label, value, color? }.' },
    { name: 'variant', type: '\'columns\' | \'bars\'', default: '\'columns\'', description: 'Tapered columns side by side, or one pill per row.' },
    { name: 'shape', type: '\'smooth\' | \'sharp\'', default: '\'smooth\'', description: 'Transition between stages: S-curves or straight lines (columns only).' },
    { name: 'mono', type: 'boolean', default: 'false', description: 'Use a single neutral tone for every stage.' },
    { name: 'height', type: 'number', default: '240', description: 'Height of the flow in px (columns only).' },
    { name: 'showPercent', type: 'boolean', default: 'true', description: 'Show the share of the first stage.' },
    { name: 'showLegend', type: 'boolean', default: 'true', description: 'Show a tile per stage under the flow (columns only).' },
    { name: 'halo', type: 'boolean', default: 'true', description: 'Soft halo around the flow, in layers (columns only).' },
    { name: 'formatValue', type: '(value: number) => string', description: 'Formats stage values.' },
    { name: 'interactive', type: 'boolean', default: 'true', description: 'Enable hover, focus and click reactions.' },
    { name: 'focused', type: 'number | null', default: 'null', description: 'Highlighted stage index. Optional: the chart tracks hover by itself; bind v-model:focused to read or drive it.' },
    { name: 'animated', type: 'boolean', default: 'true', description: 'Animate on mount. Respects prefers-reduced-motion.' },
    { name: 'label', type: 'string', description: 'Accessible label.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'stage', type: '{ item, focused, dimmed }', description: 'Content of each legend tile (columns), or the right side of each row (bars).' },
    { name: 'icon', type: '{ item }', description: 'Content at the left end of each bar. Bars variant only.' },
  ],

  emits: [
    { name: 'update:focused', type: '(index: number | null)', description: 'Highlighted stage changed (v-model:focused).' },
    { name: 'stage-enter', type: '(item: FunnelItem, event: Event)', description: 'Pointer or keyboard focus enters a stage.' },
    { name: 'stage-leave', type: '(item: FunnelItem, event: Event)', description: 'Pointer or keyboard focus leaves a stage.' },
    { name: 'stage-click', type: '(item: FunnelItem, event: Event)', description: 'A stage is clicked or activated with Enter/Space.' },
  ],

  keyboard: [
    { key: 'Tab', description: 'Moves focus into the chart and out of it. The chart is a single tab stop, however many items it has.' },
    { key: 'Arrow keys', description: 'Moves between stages.' },
    { key: 'Home / End', description: 'Jumps to the first or the last item.' },
    { key: 'Enter / Space', description: 'Emits the click event of the focused item.' },
  ],
}
