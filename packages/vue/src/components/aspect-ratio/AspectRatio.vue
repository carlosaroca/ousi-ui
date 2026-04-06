<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@ousi-ui/core'
import type { AspectRatioProps } from './aspect-ratio.types'

const props = withDefaults(defineProps<AspectRatioProps>(), {
  ratio: 16 / 9,
})
</script>

<template>
  <div
    :class="cn('relative w-full overflow-hidden', props.class)"
    :style="{ aspectRatio: String(ratio) }"
  >
    <div class="absolute inset-0">
      <slot />
    </div>
  </div>
</template>
