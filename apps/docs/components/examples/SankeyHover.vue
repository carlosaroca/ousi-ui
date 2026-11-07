<script setup lang="ts">
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
const title = computed(() => (link.value ? `${link.value.source.name} → ${link.value.target.name}` : node.value ? node.value.name : 'Traffic flow'))
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
</template>
