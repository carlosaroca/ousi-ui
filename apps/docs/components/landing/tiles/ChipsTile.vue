<script setup lang="ts">
import { computed } from 'vue'
import { OChip } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { slot } = useShowcase()

const filters = ['Design', 'Code', 'Ship', 'Docs', 'Tests']
const active = computed(() => slot(1.4).value % filters.length)
</script>

<template>
  <ShowcaseTile>
    <p class="mb-2.5 text-xs font-medium text-ousi-muted">Filters</p>
    <div class="flex flex-wrap gap-1.5">
      <OChip
        v-for="(name, i) in filters"
        :key="name"
        size="sm"
        :variant="active === i ? 'solid' : 'soft'"
        :color="active === i ? 'accent' : 'default'"
        class="transition-colors duration-300"
      >{{ name }}</OChip>
    </div>
  </ShowcaseTile>
</template>
