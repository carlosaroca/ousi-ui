<script setup lang="ts">
import { computed, useId } from 'vue'
import { cn } from '@ousi-ui/core'
import { chipTheme } from './chip.theme'
import type { ChipProps } from './chip.types'

const props = withDefaults(defineProps<ChipProps>(), {
  variant: 'solid',
  color: 'accent',
  size: 'md',
})

const id = useId()

const classes = computed(() =>
  cn(
    chipTheme({
      variant: props.variant,
      color: props.color,
      size: props.size,
    }),
    props.class,
  ),
)

const addonSizeMap: Record<string, string> = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
}

const addonSize = computed(() => addonSizeMap[props.size] || addonSizeMap.md)
</script>

<template>
  <span :id="id" :class="classes" role="status">
    <span
      v-if="$slots.start"
      :class="['chip-slot shrink-0 rounded-full overflow-hidden -ml-0.5 inline-flex items-center justify-center', addonSize]"
    >
      <slot name="start" />
    </span>
    <slot />
    <span
      v-if="$slots.end"
      :class="['chip-slot shrink-0 rounded-full overflow-hidden -mr-0.5 inline-flex items-center justify-center', addonSize]"
    >
      <slot name="end" />
    </span>
  </span>
</template>

<style>
.chip-slot > * {
  width: 100% !important;
  height: 100% !important;
  min-width: 0 !important;
  min-height: 0 !important;
}
</style>
