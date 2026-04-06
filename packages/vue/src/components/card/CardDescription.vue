<script setup lang="ts">
import { cn } from '@ousi-ui/core'
import { cardDescriptionTheme } from './card.theme'
import type { CardSubProps } from './card.types'

const props = withDefaults(defineProps<CardSubProps>(), { as: 'p' })
</script>

<template>
  <component :is="as" :class="cn(cardDescriptionTheme, props.class)">
    <slot />
  </component>
</template>
