<script setup lang="ts">
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
</template>
