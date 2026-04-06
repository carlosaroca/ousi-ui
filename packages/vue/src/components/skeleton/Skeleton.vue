<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@ousi-ui/core'
import { skeletonBaseTheme } from './skeleton.theme'
import type { SkeletonProps } from './skeleton.types'

const props = withDefaults(defineProps<SkeletonProps>(), {
  animation: 'shimmer',
})

const isPulse = computed(() => props.animation === 'pulse')

// Background uses token via inline style (token references work in inline styles)
const bgStyle = computed(() => ({
  backgroundColor: 'var(--ousi-surface-tertiary)',
  ...(isPulse.value ? {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  } : {}),
}))
</script>

<template>
  <div
    :class="cn(skeletonBaseTheme, props.class)"
    :style="bgStyle"
    role="status"
    aria-busy="true"
    aria-label="Loading..."
  >
    <!-- Shimmer overlay -->
    <div
      v-if="animation === 'shimmer'"
      class="absolute inset-0"
      style="
        background: linear-gradient(90deg, transparent 0%, var(--ousi-surface-secondary) 50%, transparent 100%);
        animation: skeleton 2s linear infinite;
      "
    />

    <!-- Slot for child skeletons or content -->
    <slot />
  </div>
</template>
