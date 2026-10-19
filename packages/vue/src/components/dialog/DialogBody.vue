<script setup lang="ts">
import { computed, inject } from 'vue'
import { cn } from '@ousi-ui/core'
import { dialogBodyTheme } from './dialog.theme'
import { DIALOG_CONTEXT } from './dialog-context'

const props = defineProps<{
  /** Defaults to the dialog's own `scrollBehavior`. */
  scrollBehavior?: 'inside' | 'outside'
  class?: string
}>()

const dialog = inject(DIALOG_CONTEXT, null)
const resolved = computed(() => props.scrollBehavior ?? dialog?.scrollBehavior.value ?? 'inside')
</script>

<template>
  <div :class="cn(dialogBodyTheme({ scrollBehavior: resolved }), props.class)">
    <slot />
  </div>
</template>
