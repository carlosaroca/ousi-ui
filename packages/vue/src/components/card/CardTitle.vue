<script setup lang="ts">
import { cn } from '@ousi-ui/core'
import { cardTitleTheme } from './card.theme'
import type { CardSubProps } from './card.types'

const props = withDefaults(defineProps<CardSubProps>(), { as: 'h3' })
</script>

<template>
  <component :is="as" :class="cn(cardTitleTheme, props.class)">
    <slot />
  </component>
</template>
