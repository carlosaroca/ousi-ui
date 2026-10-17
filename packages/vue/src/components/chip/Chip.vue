<script setup lang="ts">
import { computed, useId } from 'vue'
import { cn } from '@ousi-ui/core'
import { chipTheme } from './chip.theme'
import type { ChipProps } from './chip.types'

const props = withDefaults(defineProps<ChipProps>(), {
  variant: 'soft',
  color: 'accent',
  size: 'md',
  shadow: 'none',
})

const id = useId()

const classes = computed(() =>
  cn(
    chipTheme({
      variant: props.variant,
      color: props.color,
      size: props.size,
      shadow: props.shadow,
    }),
    props.class,
  ),
)

const addonSizeMap: Record<string, string> = {
  xs: 'size-3',
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-[18px]',
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
