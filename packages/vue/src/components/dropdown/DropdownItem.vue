<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@ousi-ui/core'
import { vHaptic } from '@ousi-ui/haptics'
import { useDropdownContext, useMenuContext, provideItem } from './dropdown.context'
import { dropdownItemTheme } from './dropdown.theme'
import type { DropdownItemProps } from './dropdown.types'

const props = withDefaults(defineProps<DropdownItemProps>(), {
  variant: 'default',
  disabled: false,
})

const menu = useMenuContext()
const { close } = useDropdownContext()

const isSelected = computed(() => menu?.selectedKeys.value.has(props.id) ?? false)
const isDisabled = computed(() => props.disabled || (menu?.disabledKeys.value.has(props.id) ?? false))
const hasSelection = computed(() => (menu?.selectionMode.value ?? 'none') !== 'none')

provideItem({ isSelected })

const resolvedHaptic = computed(() => {
  if (isDisabled.value) return 'none'
  return props.haptic ?? 'light'
})

function handleClick() {
  if (isDisabled.value) return
  if (hasSelection.value) {
    menu?.toggleSelection(props.id)
  } else {
    menu?.onAction(props.id)
    close()
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    handleClick()
  }
}
</script>

<template>
  <li
    v-haptic="resolvedHaptic"
    role="menuitem"
    :aria-selected="hasSelection ? isSelected : undefined"
    :aria-disabled="isDisabled || undefined"
    :data-selected="isSelected || undefined"
    :data-disabled="isDisabled || undefined"
    :class="cn(dropdownItemTheme({ variant, disabled: isDisabled }), props.class)"
    :tabindex="isDisabled ? -1 : 0"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <slot />
  </li>
</template>
