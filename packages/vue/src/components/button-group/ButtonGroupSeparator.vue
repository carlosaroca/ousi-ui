<script setup lang="ts">
import { inject } from 'vue'

const orientation = inject<string>('button-group-orientation', 'horizontal')
</script>

<template>
  <!-- Renders inside a button, positioned at the start edge -->
  <span
    class="shrink-0 bg-current pointer-events-none"
    :style="{
      opacity: 0.15,
      borderRadius: '2px',
      [orientation === 'horizontal' ? 'width' : 'height']: '1px',
      [orientation === 'horizontal' ? 'height' : 'width']: '50%',
      [orientation === 'horizontal' ? 'minHeight' : 'minWidth']: '12px',
      alignSelf: 'center',
    }"
    aria-hidden="true"
  />
</template>
