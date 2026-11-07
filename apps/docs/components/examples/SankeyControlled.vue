<script setup lang="ts">
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
</template>
