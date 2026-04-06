<script setup lang="ts">
import { useItemContext } from './dropdown.context'
import { dropdownItemIndicatorTheme } from './dropdown.theme'

const item = useItemContext()
</script>

<template>
  <span
    v-if="item?.isSelected.value"
    :class="dropdownItemIndicatorTheme"
    aria-hidden="true"
  >
    <slot>
      <svg class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </slot>
  </span>
  <span v-else :class="dropdownItemIndicatorTheme" aria-hidden="true">
    <span class="size-3" />
  </span>
</template>
