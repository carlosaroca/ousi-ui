<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@ousi-ui/core'
import { statusDotTheme, statusTheme } from './status.theme'
import type { StatusProps } from './status.types'

const props = withDefaults(defineProps<StatusProps>(), {
  color: 'default',
  variant: 'dot',
  size: 'md',
})

const variants = computed(() => ({ variant: props.variant, color: props.color, size: props.size }))
const classes = computed(() => cn(statusTheme(variants.value), props.class))
const dotClasses = computed(() => statusDotTheme(variants.value))
</script>

<template>
  <span :class="classes">
    <span :class="dotClasses" aria-hidden="true" />
    <slot />
  </span>
</template>
