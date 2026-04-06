<script setup lang="ts">
import { cn } from '@ousi-ui/core'
import { cardTheme } from './card.theme'
import type { CardProps } from './card.types'

const props = withDefaults(defineProps<CardProps>(), {
  variant: 'default',
  as: 'div',
})
</script>

<template>
  <component
    :is="as"
    :class="cn(cardTheme({ variant }), props.class)"
  >
    <slot />
  </component>
</template>
