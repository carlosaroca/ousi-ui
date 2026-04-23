<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@ousi-ui/core'
import { bentoGridItemTheme } from './bento-grid.theme'
import type { BentoGridItemProps } from './bento-grid.types'

const props = withDefaults(defineProps<BentoGridItemProps>(), {
  colSpan: 1,
  rowSpan: 1,
  shadow: 'none',
})

const itemStyle = computed(() => ({
  gridColumn: `span ${props.colSpan}`,
  gridRow: `span ${props.rowSpan}`,
}))
</script>

<template>
  <div
    :class="cn(bentoGridItemTheme({ shadow }), props.class)"
    :style="itemStyle"
  >
    <slot />
  </div>
</template>
