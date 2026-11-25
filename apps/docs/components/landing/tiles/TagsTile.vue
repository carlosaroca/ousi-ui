<script setup lang="ts">
import { computed } from 'vue'
import { OTagInput } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { t } = useShowcase()

const all = ['Vue', 'Nuxt', 'Tailwind', 'TypeScript']
const CYCLE = 7

// A tag lands every 1.1 s, the field holds all of them for a moment, then empties.
const tags = computed(() => {
  const p = t.value % CYCLE
  if (p >= 6.2) return []
  return all.slice(0, Math.min(all.length, Math.max(0, Math.floor((p - 0.5) / 1.1) + 1)))
})
</script>

<template>
  <ShowcaseTile class="justify-center">
    <p class="mb-2 text-xs font-medium text-ousi-muted">Stack</p>
    <div class="min-h-[72px]">
      <OTagInput :model-value="tags" placeholder="Add a tag" size="sm" variant="primary" animated />
    </div>
  </ShowcaseTile>
</template>
