<script setup lang="ts">
import { computed, inject, onBeforeUnmount, watch } from 'vue'
import { cn } from '@ousi-ui/core'
import { dialogHeaderTheme, dialogHeadingTheme } from './dialog.theme'
import { DIALOG_CONTEXT } from './dialog-context'

const props = defineProps<{
  title?: string
  /** Not needed inside ODialog, which wires the id on its own. */
  titleId?: string
  class?: string
}>()

const dialog = inject(DIALOG_CONTEXT, null)
const headingId = computed(() => props.titleId ?? dialog?.titleId)

let unregister: (() => void) | null = null
watch(
  () => !!props.title,
  (hasTitle) => {
    if (hasTitle && !unregister && dialog) unregister = dialog.registerTitle()
    else if (!hasTitle && unregister) {
      unregister()
      unregister = null
    }
  },
  { immediate: true },
)
onBeforeUnmount(() => unregister?.())
</script>

<template>
  <div :class="cn(dialogHeaderTheme, props.class)">
    <h2
      v-if="title"
      :id="headingId"
      :class="dialogHeadingTheme"
    >
      {{ title }}
    </h2>
    <slot />
  </div>
</template>
