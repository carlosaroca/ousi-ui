<script setup lang="ts">
import { ref, watch, toRef, nextTick } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import type { CollapsibleProps, CollapsibleEmits } from './collapsible.types'
import { collapsibleTheme, collapsibleContentTheme } from './collapsible.theme'

const props = withDefaults(defineProps<CollapsibleProps>(), {
  defaultOpen: false,
  disabled: false,
})

const emit = defineEmits<CollapsibleEmits>()

const isOpen = useControllableState<boolean>({
  prop: toRef(props, 'modelValue') as any,
  defaultValue: props.defaultOpen,
  onChange: (val) => emit('update:modelValue', val),
})

const contentRef = ref<HTMLElement | null>(null)
const contentStyle = ref<Record<string, string>>({})

function toggle() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

watch(isOpen, (open) => {
  const el = contentRef.value
  if (!el) return

  if (open) {
    // Opening: measure and expand
    contentStyle.value = {
      maxHeight: '0px',
      overflow: 'hidden',
      transition: 'max-height 300ms cubic-bezier(0.16, 1, 0.3, 1)',
    }
    requestAnimationFrame(() => {
      contentStyle.value = {
        maxHeight: `${el.scrollHeight}px`,
        overflow: 'hidden',
        transition: 'max-height 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      }
      // After transition, remove max-height constraint
      setTimeout(() => {
        if (isOpen.value) {
          contentStyle.value = {}
        }
      }, 310)
    })
  } else {
    // Closing: set current height then collapse to 0
    contentStyle.value = {
      maxHeight: `${el.scrollHeight}px`,
      overflow: 'hidden',
      transition: 'none',
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        contentStyle.value = {
          maxHeight: '0px',
          overflow: 'hidden',
          transition: 'max-height 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        }
      })
    })
  }
}, { flush: 'post' })

// Init: if open on mount, show content; if closed, hide
watch(() => props.defaultOpen, () => {}, { immediate: true })

const initStyle = ref<Record<string, string>>(props.defaultOpen || props.modelValue ? {} : { maxHeight: '0px', overflow: 'hidden' })
// Use initStyle only initially
contentStyle.value = initStyle.value
</script>

<template>
  <div :class="cn(collapsibleTheme, props.class)">
    <slot name="trigger" :is-open="isOpen" :toggle="toggle" />
    <div
      ref="contentRef"
      :class="collapsibleContentTheme"
      :style="contentStyle"
      role="region"
    >
      <slot />
    </div>
  </div>
</template>
