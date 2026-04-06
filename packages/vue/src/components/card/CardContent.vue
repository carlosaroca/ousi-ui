<script setup lang="ts">
import { cn } from '@ousi-ui/core'
import { cardContentTheme } from './card.theme'
import type { CardSubProps } from './card.types'

const props = withDefaults(defineProps<CardSubProps>(), { as: 'div' })
</script>

<template>
  <component :is="as" :class="cn(cardContentTheme, props.class)">
    <slot />
  </component>
</template>
