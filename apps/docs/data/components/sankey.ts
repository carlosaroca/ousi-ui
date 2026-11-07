import type { ComponentData } from './types'

export const sankeyData: ComponentData = {
  title: 'Sankey',
  description: 'Flows between nodes as ribbons. Hover a node or a link to isolate it and its relations.',
  category: 'Charts',
  importCode: "import { OSankey } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'SankeyBasic',
        code: `<script setup lang="ts">
import { OSankey } from '@ousi-ui/vue'

const nodes = [
  { name: 'Search' }, { name: 'Social' }, { name: 'Email' },
  { name: 'Landing' }, { name: 'Signup' }, { name: 'Bounce' },
]
const links = [
  { source: 'Search', target: 'Landing', value: 520 },
  { source: 'Social', target: 'Landing', value: 310 },
  { source: 'Email', target: 'Landing', value: 170 },
  { source: 'Landing', target: 'Signup', value: 380 },
  { source: 'Landing', target: 'Bounce', value: 620 },
]
</script>
<template>
  <OSankey :nodes="nodes" :links="links" />
</template>`,
      },
    },
    {
      id: 'budget',
      title: 'Recipe: budget with period switch',
      example: {
        component: 'SankeyBudget',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, OSankey } from '@ousi-ui/vue'
import type { SankeyLinkItem, SankeyNodeItem } from '@ousi-ui/vue'

const nodes = [
  { name: 'Salary', color: 'accent' }, { name: 'Freelance', color: 'violet' },
  { name: 'Income' },
  { name: 'Housing' }, { name: 'Food' }, { name: 'Transport' }, { name: 'Savings', color: 'success' },
]
const periods = {
  Monthly: [
    { source: 'Salary', target: 'Income', value: 3200 }, { source: 'Freelance', target: 'Income', value: 800 },
    { source: 'Income', target: 'Housing', value: 1400 }, { source: 'Income', target: 'Food', value: 620 },
    { source: 'Income', target: 'Transport', value: 280 }, { source: 'Income', target: 'Savings', value: 1700 },
  ],
  Yearly: [
    { source: 'Salary', target: 'Income', value: 38400 }, { source: 'Freelance', target: 'Income', value: 12600 },
    { source: 'Income', target: 'Housing', value: 16800 }, { source: 'Income', target: 'Food', value: 7600 },
    { source: 'Income', target: 'Transport', value: 3900 }, { source: 'Income', target: 'Savings', value: 22700 },
  ],
} as const
type Period = keyof typeof periods

const period = ref<Period>('Monthly')
const node = ref<SankeyNodeItem | null>(null)
const link = ref<SankeyLinkItem | null>(null)
const total = computed(() => periods[period.value].filter((l) => l.target === 'Income').reduce((s, l) => s + l.value, 0))
const title = computed(() => (link.value ? \`\${link.value.source.name} → \${link.value.target.name}\` : node.value ? node.value.name : 'Where your money goes'))
const value = computed(() => link.value?.value ?? node.value?.value ?? total.value)
const usd = { style: 'currency', currency: 'USD', maximumFractionDigits: 0 } as const
</script>
<template>
  <OCard class="w-full max-w-3xl gap-4 p-5">
    <div class="flex items-start justify-between">
      <div>
        <div class="text-sm font-medium text-ousi-muted">{{ title }}</div>
        <OAnimatedNumber locale="en-US" :value="value" :format-options="usd" animation="count" :duration="300" class="mt-1 text-3xl font-semibold tabular-nums text-ousi-foreground" />
      </div>
      <div class="flex rounded-full bg-ousi-default p-0.5">
        <button
          v-for="(_, p) in periods" :key="p" type="button"
          class="rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
          :class="period === p ? 'bg-ousi-background text-ousi-foreground shadow-sm' : 'text-ousi-muted hover:text-ousi-foreground'"
          @click="period = p as Period"
        >{{ p }}</button>
      </div>
    </div>
    <OSankey
      :key="period" :nodes="nodes" :links="[...periods[period]]" :height="280"
      :format-value="(v) => \`$\${v.toLocaleString()}\`"
      @node-enter="(n) => (node = n)" @node-leave="node = null"
      @link-enter="(l) => (link = l)" @link-leave="link = null"
    />
  </OCard>
</template>`,
      },
    },
    {
      id: 'levels',
      title: 'Multiple levels',
      example: {
        component: 'SankeyMultiLevel',
        code: `<script setup lang="ts">
import { OSankey } from '@ousi-ui/vue'

const nodes = [
  { name: 'Revenue', color: 'accent' },
  { name: 'Subscriptions', color: 'violet' }, { name: 'Services', color: 'orange' },
  { name: 'Payroll' }, { name: 'Cloud' }, { name: 'Marketing' }, { name: 'Profit', color: 'success' },
]
const links = [
  { source: 'Revenue', target: 'Subscriptions', value: 640 },
  { source: 'Revenue', target: 'Services', value: 260 },
  { source: 'Subscriptions', target: 'Payroll', value: 300 },
  { source: 'Subscriptions', target: 'Cloud', value: 110 },
  { source: 'Subscriptions', target: 'Profit', value: 230 },
  { source: 'Services', target: 'Payroll', value: 120 },
  { source: 'Services', target: 'Marketing', value: 60 },
  { source: 'Services', target: 'Profit', value: 80 },
]
</script>
<template>
  <OSankey :nodes="nodes" :links="links" :height="340" :format-value="(v) => \`$\${v}k\`" />
</template>`,
      },
    },
    {
      id: 'hover',
      title: 'Recipe: header reacts to hover',
      example: {
        component: 'SankeyHover',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, OSankey } from '@ousi-ui/vue'
import type { SankeyLinkItem, SankeyNodeItem } from '@ousi-ui/vue'

const nodes = [
  { name: 'Search' }, { name: 'Social' }, { name: 'Email' },
  { name: 'Landing' }, { name: 'Signup' }, { name: 'Bounce' },
]
const links = [
  { source: 'Search', target: 'Landing', value: 520 },
  { source: 'Social', target: 'Landing', value: 310 },
  { source: 'Email', target: 'Landing', value: 170 },
  { source: 'Landing', target: 'Signup', value: 380 },
  { source: 'Landing', target: 'Bounce', value: 620 },
]

// The card reacts to the events: nodes and links report what is under the pointer.
const node = ref<SankeyNodeItem | null>(null)
const link = ref<SankeyLinkItem | null>(null)
const title = computed(() => (link.value ? \`\${link.value.source.name} → \${link.value.target.name}\` : node.value ? node.value.name : 'Traffic flow'))
const value = computed(() => link.value?.value ?? node.value?.value ?? 1000)
</script>
<template>
  <OCard class="w-full max-w-2xl gap-4 p-5">
    <div>
      <div class="text-sm font-medium text-ousi-muted">{{ title }}</div>
      <OAnimatedNumber :value="value" animation="count" class="mt-1 text-3xl font-semibold tabular-nums text-ousi-foreground" />
    </div>
    <OSankey
      :nodes="nodes" :links="links" :height="260"
      @node-enter="(n) => (node = n)" @node-leave="node = null"
      @link-enter="(l) => (link = l)" @link-leave="link = null"
    />
  </OCard>
</template>`,
      },
    },
    {
      id: 'controlled',
      title: 'Controlled focus',
      example: {
        component: 'SankeyControlled',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { OButton, OSankey } from '@ousi-ui/vue'

const nodes = [
  { name: 'Search' }, { name: 'Social' }, { name: 'Email' },
  { name: 'Landing' }, { name: 'Signup' }, { name: 'Bounce' },
]
const links = [
  { source: 'Search', target: 'Landing', value: 520 },
  { source: 'Social', target: 'Landing', value: 310 },
  { source: 'Email', target: 'Landing', value: 170 },
  { source: 'Landing', target: 'Signup', value: 380 },
  { source: 'Landing', target: 'Bounce', value: 620 },
]
// focused is "node:<index>" or "link:<index>"
const focused = ref<string | null>('node:4')
const options = [{ label: 'Signup', key: 'node:4' }, { label: 'Bounce', key: 'node:5' }, { label: 'Search → Landing', key: 'link:0' }]
</script>
<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap gap-2">
      <OButton v-for="o in options" :key="o.key" size="sm" :variant="focused === o.key ? 'primary' : 'secondary'" @click="focused = focused === o.key ? null : o.key">
        {{ o.label }}
      </OButton>
    </div>
    <OSankey v-model:focused="focused" :nodes="nodes" :links="links" :height="240" />
  </div>
</template>`,
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'SankeyVariants',
        code: `<script setup lang="ts">
import { OSankey } from '@ousi-ui/vue'

const nodes = [{ name: 'A', color: 'accent' }, { name: 'B', color: 'orange' }, { name: 'X' }, { name: 'Y' }, { name: 'Z' }]
const links = [
  { source: 'A', target: 'X', value: 40 }, { source: 'A', target: 'Y', value: 25 },
  { source: 'B', target: 'Y', value: 30 }, { source: 'B', target: 'Z', value: 20 },
]
</script>
<template>
  <div class="grid gap-8 md:grid-cols-2">
    <div>
      <p class="mb-2 text-xs text-ousi-muted">No labels, thin nodes</p>
      <OSankey :nodes="nodes" :links="links" :height="180" :show-labels="false" :node-width="6" />
    </div>
    <div>
      <p class="mb-2 text-xs text-ousi-muted">Wide nodes, large padding</p>
      <OSankey :nodes="nodes" :links="links" :height="180" :node-width="22" :node-padding="28" />
    </div>
    <div>
      <p class="mb-2 text-xs text-ousi-muted">Static, custom format</p>
      <OSankey :nodes="nodes" :links="links" :height="180" :interactive="false" :format-value="(v) => \`\${v} GB\`" />
    </div>
  </div>
</template>`,
      },
    },
  ],

  props: [
    { name: 'nodes', type: 'SankeyNode[]', description: 'Nodes: { name, color? }.' },
    { name: 'links', type: 'SankeyLink[]', description: 'Links: { source, target, value }. source and target are node names or indexes.' },
    { name: 'height', type: 'number', default: '320', description: 'Chart height in px. Width is fluid.' },
    { name: 'nodeWidth', type: 'number', default: '14', description: 'Width of the node bars in px.' },
    { name: 'nodePadding', type: 'number', default: '14', description: 'Vertical gap between nodes of a column in px.' },
    { name: 'showLabels', type: 'boolean', default: 'true', description: 'Show node labels on the sides.' },
    { name: 'formatValue', type: '(value: number) => string', description: 'Formats values.' },
    { name: 'interactive', type: 'boolean', default: 'true', description: 'Enable hover, focus and click reactions.' },
    { name: 'focused', type: 'string | null', default: 'null', description: 'Highlighted element: "node:<index>" or "link:<index>". Optional: the chart tracks hover by itself; bind v-model:focused to read or drive it.' },
    { name: 'animated', type: 'boolean', default: 'true', description: 'Animate on mount.' },
    { name: 'padding', type: '{ left?, right? }', default: '110 / 96', description: 'Space for the labels on the sides, in px.' },
    { name: 'label', type: 'string', description: 'Accessible label.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'update:focused', type: '(key: string | null)', description: 'Highlighted element changed (v-model:focused).' },
    { name: 'node-enter / node-leave / node-click', type: '(node: SankeyNodeItem, event: Event)', description: 'Reactions on a node.' },
    { name: 'link-enter / link-leave / link-click', type: '(link: SankeyLinkItem, event: Event)', description: 'Reactions on a link.' },
  ],

  keyboard: [
    { key: 'Tab', description: 'Moves focus into the chart and out of it. The chart is a single tab stop, however many items it has.' },
    { key: 'Arrow keys', description: 'Moves between nodes and then links.' },
    { key: 'Home / End', description: 'Jumps to the first or the last item.' },
    { key: 'Enter / Space', description: 'Emits the click event of the focused item.' },
  ],
}
