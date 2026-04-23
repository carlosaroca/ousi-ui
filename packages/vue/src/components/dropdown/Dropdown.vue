<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useEscapeKey } from '@ousi-ui/core'
import { provideDropdown } from './dropdown.context'
import type { DropdownProps, DropdownEmits } from './dropdown.types'

const props = withDefaults(defineProps<DropdownProps>(), {
  defaultOpen: false,
  shadow: 'lg',
})
const emit = defineEmits<DropdownEmits>()

const triggerRef = ref<HTMLElement | null>(null)
const isOpen = ref(props.modelValue ?? props.defaultOpen)

watch(() => props.modelValue, (v) => { if (v !== undefined) isOpen.value = v })

function setOpen(val: boolean) {
  isOpen.value = val
  emit('update:modelValue', val)
  emit('openChange', val)
}

function close() { setOpen(false); triggerRef.value?.focus() }
function toggle() { setOpen(!isOpen.value) }

useEscapeKey({ handler: () => close(), enabled: isOpen })

provideDropdown({ isOpen, triggerRef, shadow: computed(() => props.shadow), close, toggle })
</script>

<template>
  <div :class="['relative inline-flex', props.class]">
    <slot />
  </div>
</template>
