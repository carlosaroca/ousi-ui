<script setup lang="ts">
import { cn } from '@ousi-ui/core'
import { dialogBodyTheme } from './dialog.theme'

const props = defineProps<{
  scrollBehavior?: 'inside' | 'outside'
  class?: string
}>()
</script>

<template>
  <div :class="cn(dialogBodyTheme({ scrollBehavior: props.scrollBehavior ?? 'inside' }), props.class)">
    <slot />
  </div>
</template>
