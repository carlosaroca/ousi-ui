<script setup lang="ts">
import { provide } from 'vue'
import { cn } from '@ousi-ui/core'
import { buttonGroupBaseTheme } from './button-group.theme'
import type { ButtonGroupProps } from './button-group.types'

const props = withDefaults(defineProps<ButtonGroupProps>(), {
  orientation: 'horizontal',
  fullWidth: false,
  shadow: 'none',
})

provide('button-group-orientation', props.orientation)
</script>

<template>
  <div
    :class="cn(
      buttonGroupBaseTheme({ shadow }),
      // A column stretches its buttons to one width: with the row's items-center each kept the width of its text.
      orientation === 'vertical' ? 'flex-col items-stretch' : 'flex-row',
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
