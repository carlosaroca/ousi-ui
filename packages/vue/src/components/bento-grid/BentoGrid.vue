<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@ousi-ui/core'
import { bentoGridTheme } from './bento-grid.theme'
import type { BentoGridProps } from './bento-grid.types'

const props = withDefaults(defineProps<BentoGridProps>(), {
  cols: 3,
  gap: 16,
})

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.cols}, minmax(0, 1fr))`,
  gap: `${props.gap}px`,
}))
</script>

<template>
  <div
    :class="cn(bentoGridTheme, props.class)"
    :style="gridStyle"
  >
    <slot />
  </div>
</template>
