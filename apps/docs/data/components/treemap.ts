import type { ComponentData } from './types'

export const treemapData: ComponentData = {
  title: 'Treemap',
  description: 'Proportions as nested rectangles (squarified layout). Add children for a second level; tiles animate to their new position when the data changes.',
  category: 'Charts',
  importCode: "import { OTreemap } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'TreemapBasic',
        code: `<script setup lang="ts">
import { OTreemap } from '@ousi-ui/vue'

const data = [
  { name: 'Cloud', value: 4200, color: '#4f8ff7' },
  { name: 'Payroll', value: 3600, color: '#b57bff' },
  { name: 'Marketing', value: 2400, color: '#ec6fb5' },
  { name: 'Tools', value: 1500, color: '#f2b93b' },
  { name: 'Travel', value: 1100, color: '#aee637' },
  { name: 'Legal', value: 700, color: '#38b2d8' },
  { name: 'Misc', value: 420, color: '#9ca3af' },
]
</script>
<template>
  <OTreemap :data="data" :height="300" :format-value="(v) => \`$\${(v / 1000).toFixed(1)}k\`" />
</template>`,
      },
    },
    {
      id: 'nested',
      title: 'Nested groups',
      example: {
        component: 'TreemapNested',
        code: `<script setup lang="ts">
import { OTreemap } from '@ousi-ui/vue'

// Nodes with children become frames; their sum is the size.
const data = [
  { name: 'Engineering', color: '#4f8ff7', children: [
    { name: 'Platform', value: 1800 }, { name: 'Mobile', value: 1300 }, { name: 'Data', value: 900 }, { name: 'QA', value: 500 },
  ] },
  { name: 'Go to market', color: '#ec6fb5', children: [
    { name: 'Ads', value: 1500 }, { name: 'Events', value: 700 }, { name: 'Content', value: 600 },
  ] },
  { name: 'Operations', color: '#f2b93b', children: [
    { name: 'Support', value: 900 }, { name: 'Finance', value: 500 }, { name: 'People', value: 450 },
  ] },
  { name: 'Legal', value: 700, color: '#aee637' },
]
</script>
<template>
  <OTreemap :data="data" :height="360" :format-value="(v) => \`$\${(v / 1000).toFixed(1)}k\`" />
</template>`,
      },
    },
    {
      id: 'portfolio',
      title: 'Recipe: portfolio with period switch',
      example: {
        component: 'TreemapPortfolio',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, OTreemap } from '@ousi-ui/vue'
import type { TreemapItem } from '@ousi-ui/vue'

const sets = {
  Today: [
    { name: 'Apple', value: 3200, color: '#4f8ff7' }, { name: 'Microsoft', value: 2900, color: '#b57bff' },
    { name: 'NVIDIA', value: 2600, color: '#aee637' }, { name: 'Amazon', value: 1900, color: '#f2b93b' },
    { name: 'Alphabet', value: 1700, color: '#ec6fb5' }, { name: 'Meta', value: 1100, color: '#38b2d8' },
    { name: 'Tesla', value: 800, color: '#f08a3c' }, { name: 'Others', value: 640, color: '#9ca3af' },
  ],
  'This year': [
    { name: 'NVIDIA', value: 4800, color: '#aee637' }, { name: 'Apple', value: 3000, color: '#4f8ff7' },
    { name: 'Microsoft', value: 2500, color: '#b57bff' }, { name: 'Alphabet', value: 1600, color: '#ec6fb5' },
    { name: 'Amazon', value: 1500, color: '#f2b93b' }, { name: 'Meta', value: 1400, color: '#38b2d8' },
    { name: 'Tesla', value: 500, color: '#f08a3c' }, { name: 'Others', value: 520, color: '#9ca3af' },
  ],
} as const
type Range = keyof typeof sets

const range = ref<Range>('Today')
const hovered = ref<TreemapItem | null>(null)
const total = computed(() => sets[range.value].reduce((s, d) => s + d.value, 0))
const usd = { style: 'currency', currency: 'USD', maximumFractionDigits: 0 } as const
</script>
<template>
  <OCard class="w-full max-w-3xl gap-4 p-5">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div class="text-sm font-medium text-ousi-muted">{{ hovered ? \`\${hovered.name} · \${hovered.percent}% of portfolio\` : 'Portfolio' }}</div>
        <OAnimatedNumber locale="en-US" :value="hovered ? hovered.value : total" :format-options="usd" animation="count" :duration="300" class="mt-1 text-3xl font-semibold tabular-nums text-ousi-foreground" />
      </div>
      <div class="flex rounded-full bg-ousi-default p-0.5">
        <button
          v-for="(_, r) in sets" :key="r" type="button"
          class="rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
          :class="range === r ? 'bg-ousi-background text-ousi-foreground shadow-sm' : 'text-ousi-muted hover:text-ousi-foreground'"
          @click="range = r as Range"
        >{{ r }}</button>
      </div>
    </div>
    <!-- Tiles move to their new position when the data changes -->
    <OTreemap :data="[...sets[range]]" :height="320" :tooltip="false" @node-enter="(n) => (hovered = n)" @node-leave="hovered = null" />
  </OCard>
</template>`,
      },
    },
    {
      id: 'drill',
      title: 'Drill down on click',
      example: {
        component: 'TreemapDrill',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OTreemap } from '@ousi-ui/vue'

// Click a tile to drill into its children; the breadcrumb takes you back.
interface Node { name: string; value?: number; color?: string; children?: Node[] }
const root: Node[] = [
  { name: 'Europe', color: '#4f8ff7', children: [{ name: 'Spain', value: 820 }, { name: 'France', value: 640 }, { name: 'Germany', value: 910 }, { name: 'Italy', value: 480 }] },
  { name: 'Americas', color: '#aee637', children: [{ name: 'Mexico', value: 760 }, { name: 'Brazil', value: 980 }, { name: 'Colombia', value: 420 }, { name: 'Chile', value: 260 }] },
  { name: 'Asia', color: '#b57bff', children: [{ name: 'Japan', value: 700 }, { name: 'India', value: 1100 }, { name: 'Korea', value: 380 }] },
  { name: 'Africa', color: '#f2b93b', children: [{ name: 'Kenya', value: 150 }, { name: 'Nigeria', value: 320 }] },
]
const path = ref<string[]>([])
const current = computed(() => {
  if (!path.value.length) return root
  const group = root.find((n) => n.name === path.value[0])!
  return (group.children ?? []).map((c) => ({ ...c, color: group.color }))
})
</script>
<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-1.5 text-sm">
      <button type="button" class="font-medium" :class="path.length ? 'text-ousi-muted hover:text-ousi-foreground' : 'text-ousi-foreground'" @click="path = []">All regions</button>
      <template v-if="path.length"><span class="text-ousi-muted">/</span><span class="font-medium text-ousi-foreground">{{ path[0] }}</span></template>
    </div>
    <OTreemap
      :data="current"
      :height="300"
      @node-click="(n) => { if (!path.length) path = [n.name] }"
    />
    <p class="text-xs text-ousi-muted">{{ path.length ? 'Click “All regions” to go back.' : 'Click a region to see its countries.' }}</p>
  </div>
</template>`,
      },
    },
    {
      id: 'labels',
      title: 'Custom labels and tooltip',
      example: {
        component: 'TreemapLabels',
        code: `<script setup lang="ts">
import { OTreemap } from '@ousi-ui/vue'

const data = [
  { name: 'Subscriptions', value: 5200, color: '#4f8ff7' }, { name: 'Services', value: 2600, color: '#b57bff' },
  { name: 'Hardware', value: 1900, color: '#f08a3c' }, { name: 'Licensing', value: 1300, color: '#aee637' },
  { name: 'Training', value: 800, color: '#ec6fb5' }, { name: 'Other', value: 420, color: '#9ca3af' },
]
</script>
<template>
  <!-- \`label\` replaces the content of every tile; \`tooltip\` replaces the floating card -->
  <OTreemap :data="data" :height="300" :show-labels="false">
    <template #label="{ item, focused }">
      <div v-if="item.w > 90 && item.h > 60" class="flex h-full flex-col justify-between p-3 text-white">
        <div class="flex items-center justify-between text-xs font-medium">
          <span class="truncate">{{ item.name }}</span>
          <span class="rounded-full bg-white/25 px-1.5 py-0.5 text-[10px] tabular-nums">{{ item.percent }}%</span>
        </div>
        <div class="text-xl font-semibold tabular-nums" :class="focused && 'underline decoration-white/60 underline-offset-4'">\${{ (item.value / 1000).toFixed(1) }}k</div>
      </div>
    </template>
    <template #tooltip="{ item }">
      <div class="w-36">
        <div class="font-semibold text-ousi-foreground">{{ item.name }}</div>
        <div class="text-ousi-muted">{{ item.percent }}% of revenue</div>
        <div class="mt-1 text-sm font-semibold tabular-nums text-ousi-foreground">\${{ item.value.toLocaleString() }}</div>
      </div>
    </template>
  </OTreemap>
</template>`,
      },
    },
  ],

  props: [
    { name: 'data', type: 'TreemapNode[]', description: 'Nodes: { id?, name, value?, color?, children? }. A node with children is sized by their sum.' },
    { name: 'height', type: 'number', default: '320', description: 'Chart height in px. Width is fluid.' },
    { name: 'gap', type: 'number', default: '3', description: 'Space between tiles in px.' },
    { name: 'radius', type: 'number', default: '12', description: 'Corner radius of the tiles in px.' },
    { name: 'showLabels', type: 'boolean', default: 'true', description: 'Show the name and value inside tiles large enough.' },
    { name: 'formatValue', type: '(value: number) => string', description: 'Formats values.' },
    { name: 'interactive', type: 'boolean', default: 'true', description: 'Enable hover, focus and click reactions.' },
    { name: 'tooltip', type: 'boolean', default: 'true', description: 'Show the built-in tooltip.' },
    { name: 'focused', type: 'string | null', default: 'null', description: 'Highlighted tile: "2" or "2.1". Optional: the chart tracks hover by itself; bind v-model:focused to read or drive it.' },
    { name: 'animated', type: 'boolean', default: 'true', description: 'Animate on mount. Respects prefers-reduced-motion.' },
    { name: 'label', type: 'string', description: 'Accessible label.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'label', type: '{ item, focused }', description: 'Content of each tile. item has name, value, percent, color, depth, parent and its x, y, w, h.' },
    { name: 'tooltip', type: '{ item }', description: 'Replaces the tooltip content.' },
  ],

  emits: [
    { name: 'update:focused', type: '(key: string | null)', description: 'Highlighted tile changed (v-model:focused).' },
    { name: 'node-enter', type: '(item: TreemapItem, event: Event)', description: 'Pointer or keyboard focus enters a tile.' },
    { name: 'node-leave', type: '(item: TreemapItem, event: Event)', description: 'Pointer or keyboard focus leaves a tile.' },
    { name: 'node-click', type: '(item: TreemapItem, event: Event)', description: 'A tile is clicked or activated with Enter/Space.' },
  ],

  keyboard: [
    { key: 'Tab', description: 'Moves focus into the chart and out of it. The chart is a single tab stop, however many items it has.' },
    { key: 'Arrow keys', description: 'Moves between tiles.' },
    { key: 'Home / End', description: 'Jumps to the first or the last item.' },
    { key: 'Enter / Space', description: 'Emits the click event of the focused item.' },
  ],
}
