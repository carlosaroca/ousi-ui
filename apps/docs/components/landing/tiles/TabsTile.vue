<script setup lang="ts">
import { computed } from 'vue'
import { OTabs } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { slot } = useShowcase()

const items = [
  { key: 'all', label: 'All' },
  { key: 'design', label: 'Design' },
  { key: 'code', label: 'Code' },
  { key: 'ship', label: 'Ship' },
]
const step = slot(1.7)
const current = computed(() => items[step.value % items.length].key)
</script>

<template>
  <ShowcaseTile class="!p-2.5">
    <OTabs :model-value="current" :items="items" size="sm" full-width />
  </ShowcaseTile>
</template>
