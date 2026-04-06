<script setup lang="ts">
import { useDropdownContext } from './dropdown.context'

const { toggle, triggerRef, isOpen } = useDropdownContext()
</script>

<template>
  <span
    ref="triggerRef"
    class="inline-flex"
    :aria-expanded="isOpen"
    aria-haspopup="menu"
    @click="toggle"
  >
    <slot />
  </span>
</template>
