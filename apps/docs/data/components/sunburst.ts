import type { ComponentData } from './types'

export const sunburstData: ComponentData = {
  title: 'Sunburst',
  description: 'A hierarchy as rings around a centre, each part inside its parent. Click a branch to look into it.',
  category: 'Charts',
  importCode: 'import { OSunburst } from \'@ousi-ui/vue\'',

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'SunburstBasic',
        code: `<script setup lang="ts">
import { OSunburst } from '@ousi-ui/vue'

// The same shape as a treemap's data. Click a sector with parts to bring it to the middle.
const data = [
  {
    name: 'Product',
    children: [
      { name: 'Design', value: 42 },
      { name: 'Web', children: [{ name: 'App', value: 60 }, { name: 'Docs', value: 18 }] },
      { name: 'Mobile', children: [{ name: 'iOS', value: 34 }, { name: 'Android', value: 30 }] },
    ],
  },
  { name: 'Sales', children: [{ name: 'Direct', value: 70 }, { name: 'Partners', value: 28 }] },
  { name: 'Support', children: [{ name: 'Tickets', value: 44 }, { name: 'Training', value: 16 }] },
  { name: 'Legal', value: 22 },
]
</script>
<template>
  <OSunburst :data="data" :size="380" root-label="Budget" :format-value="(v) => \`$\${v}k\`" />
</template>`,
      },
    },
    {
      id: 'controlled',
      title: 'Controlled zoom',
      example: {
        component: 'SunburstControlled',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OButton, OSunburst } from '@ousi-ui/vue'

const data = [
  {
    name: 'Product',
    children: [
      { name: 'Design', value: 42 },
      { name: 'Web', children: [{ name: 'App', value: 60 }, { name: 'Docs', value: 18 }] },
      { name: 'Mobile', children: [{ name: 'iOS', value: 34 }, { name: 'Android', value: 30 }] },
    ],
  },
  { name: 'Sales', children: [{ name: 'Direct', value: 70 }, { name: 'Partners', value: 28 }] },
  { name: 'Support', children: [{ name: 'Tickets', value: 44 }, { name: 'Training', value: 16 }] },
  { name: 'Legal', value: 22 },
]

// A key is the position in the data: '0.1' is the second part of the first.
const zoom = ref<string | null>(null)
const trail = computed(() => {
  const crumbs = [{ key: null as string | null, name: 'Company' }]
  let nodes: { name: string; children?: any[] }[] = data
  const path = zoom.value?.split('.') ?? []
  path.forEach((position, depth) => {
    const node = nodes[Number(position)]
    crumbs.push({ key: path.slice(0, depth + 1).join('.'), name: node.name })
    nodes = node.children ?? []
  })
  return crumbs
})
</script>
<template>
  <div class="flex flex-col items-center gap-4">
    <nav class="flex flex-wrap items-center gap-1" aria-label="Level">
      <OButton v-for="(c, i) in trail" :key="c.name" size="xs" :variant="i === trail.length - 1 ? 'secondary' : 'text'" @click="zoom = c.key">{{ c.name }}</OButton>
    </nav>
    <OSunburst v-model:zoom="zoom" :data="data" :levels="2" root-label="Company" />
  </div>
</template>`,
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'SunburstVariants',
        code: `<script setup lang="ts">
import { OSunburst } from '@ousi-ui/vue'

const data = [
  {
    name: 'Product',
    children: [
      { name: 'Design', value: 42 },
      { name: 'Web', children: [{ name: 'App', value: 60 }, { name: 'Docs', value: 18 }] },
      { name: 'Mobile', children: [{ name: 'iOS', value: 34 }, { name: 'Android', value: 30 }] },
    ],
  },
  { name: 'Sales', children: [{ name: 'Direct', value: 70 }, { name: 'Partners', value: 28 }] },
  { name: 'Support', children: [{ name: 'Tickets', value: 44 }, { name: 'Training', value: 16 }] },
  { name: 'Legal', value: 22 },
]
</script>
<template>
  <div class="flex w-full flex-wrap items-start justify-center gap-8">
    <div class="flex flex-col items-center gap-2">
      <OSunburst :data="data" :size="220" :levels="1" :inner-radius="0.62" :corner-radius="4" :gap="1.2" />
      <span class="text-xs text-ousi-muted">one ring, rounder</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <OSunburst :data="data" :size="220" :corner-radius="0" :gap="0.4" :show-labels="false" />
      <span class="text-xs text-ousi-muted">sharp, no names</span>
    </div>
  </div>
</template>`,
      },
    },
  ],

  props: [
    { name: 'data', type: 'SunburstNode[]', default: '-', description: 'Each: { id?, name, value?, color?, children? }, as for Treemap. A node with children is worth what they add up to.' },
    { name: 'size', type: 'number', default: '320', description: 'Diameter in px. It shrinks to fit.' },
    { name: 'levels', type: 'number', default: '3', description: 'Rings drawn at once.' },
    { name: 'innerRadius', type: 'number', default: '0.36', description: 'Size of the hole as a share of the radius, from 0.2 to 0.8.' },
    { name: 'gap', type: 'number', default: '0.7', description: 'Space between sectors and rings, in viewBox units (0-100).' },
    { name: 'cornerRadius', type: 'number', default: '1.4', description: 'Roundness of the corners, in viewBox units. 0 makes them sharp.' },
    { name: 'showLabels', type: 'boolean', default: 'true', description: 'Names on the sectors with room for them.' },
    { name: 'zoomable', type: 'boolean', default: 'true', description: 'Clicking a branch brings it to the centre; the centre goes back.' },
    { name: 'zoom', type: 'string | null', default: '-', description: 'Key of the node at the centre (v-model:zoom), or null for the whole. Keys are positions: "0.1" is the second part of the first.' },
    { name: 'rootLabel', type: 'string', default: '\'Total\'', description: 'Name of the whole, in the centre.' },
    { name: 'formatValue', type: '(value: number) => string', default: '-', description: 'Formats values.' },
    { name: 'interactive', type: 'boolean', default: 'true', description: 'Hover, keyboard and click.' },
    { name: 'focused', type: 'string | null', default: 'null', description: 'The highlighted one. Optional: the chart tracks hover by itself; bind v-model:focused to read or drive it.' },
    { name: 'animated', type: 'boolean', default: 'true', description: 'Animates in. Off with prefers-reduced-motion.' },
    { name: 'label', type: 'string', default: '-', description: 'Accessible name, instead of the one made from the data.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'default', type: '{ total, formattedTotal, focusedItem, current }', description: 'The centre.' },
  ],

  emits: [
    { name: 'update:focused', type: '(key: string | null)', description: 'Highlighted sector changed.' },
    { name: 'update:zoom', type: '(key: string | null)', description: 'The node at the centre changed.' },
    { name: 'node-enter', type: '(item, event)', description: 'Pointer or focus enters a sector.' },
    { name: 'node-leave', type: '(item, event)', description: 'And leaves it.' },
    { name: 'node-click', type: '(item, event)', description: 'A sector was clicked.' },
  ],

  methods: [
    { name: 'zoomTo', type: '(key: string | null) => void', description: 'Brings a node to the centre.' },
    { name: 'back', type: '() => void', description: 'Goes up one level.' },
  ],

  keyboard: [
    { key: 'left', description: 'Previous sector.' },
    { key: 'right', description: 'Next sector.' },
    { key: 'enter', description: 'Looks into the branch.' },
    { key: 'escape', description: 'Goes up a level. At the top it is left to the page.' },
    { key: 'backspace', description: 'The same.' },
  ],
}
