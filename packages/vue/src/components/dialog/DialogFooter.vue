<script setup lang="ts">
import { cn } from '@ousi-ui/core'
import { dialogFooterTheme } from './dialog.theme'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <div :class="cn(dialogFooterTheme, props.class)">
    <slot />
  </div>
</template>
