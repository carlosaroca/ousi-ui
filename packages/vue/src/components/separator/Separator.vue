<script setup lang="ts">
import { useSlots } from 'vue'
import { cn } from '@ousi-ui/core'
import {
  separatorTheme,
  separatorContainerTheme,
  separatorLineTheme,
  separatorContentTheme,
} from './separator.theme'
import type { SeparatorProps } from './separator.types'

const props = withDefaults(defineProps<SeparatorProps>(), {
  orientation: 'horizontal',
  variant: 'default',
})

const slots = useSlots()
const hasContent = !!slots.default
</script>

<template>
  <!-- Simple line -->
  <div
    v-if="!hasContent"
    :class="cn(separatorTheme({ orientation, variant }), props.class)"
    role="separator"
    :aria-orientation="orientation"
  />

  <!-- Line + content + line -->
  <div
    v-else
    :class="cn(separatorContainerTheme({ orientation }), props.class)"
    role="separator"
    :aria-orientation="orientation"
  >
    <div :class="separatorLineTheme({ orientation, variant })" />
    <span :class="separatorContentTheme">
      <slot />
    </span>
    <div :class="separatorLineTheme({ orientation, variant })" />
  </div>
</template>
