<script setup lang="ts">
import { cn } from '@ousi-ui/core'
import { dialogHeaderTheme, dialogHeadingTheme } from './dialog.theme'

const props = defineProps<{
  title?: string
  titleId?: string
  class?: string
}>()
</script>

<template>
  <div :class="cn(dialogHeaderTheme, props.class)">
    <h2
      v-if="title"
      :id="titleId"
      :class="dialogHeadingTheme"
    >
      {{ title }}
    </h2>
    <slot />
  </div>
</template>
