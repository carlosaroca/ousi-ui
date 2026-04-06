<script setup lang="ts">
import { provide } from 'vue'
import { cn } from '@ousi-ui/core'
import { buttonGroupBaseTheme } from './button-group.theme'
import type { ButtonGroupProps } from './button-group.types'

const props = withDefaults(defineProps<ButtonGroupProps>(), {
  orientation: 'horizontal',
  fullWidth: false,
})

provide('button-group-orientation', props.orientation)
</script>

<template>
  <div
    :class="cn(
      buttonGroupBaseTheme,
      orientation === 'vertical' ? 'flex-col' : 'flex-row',
      fullWidth && 'w-full',
      'ousi-btn-group',
      orientation === 'vertical' ? 'ousi-btn-group--vertical' : 'ousi-btn-group--horizontal',
      props.class,
    )"
    role="group"
  >
    <slot />
  </div>
</template>
