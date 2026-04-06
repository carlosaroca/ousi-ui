<script setup lang="ts">
import { cn } from '@ousi-ui/core'
import { spinnerTheme } from './spinner.theme'
import type { SpinnerProps } from './spinner.types'

const props = withDefaults(defineProps<SpinnerProps>(), {
  size: 'md',
  color: 'current',
  label: 'Loading',
})
</script>

<template>
  <svg
    :class="cn(spinnerTheme({ size, color }), props.class)"
    style="animation: spin 0.75s linear infinite"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="status"
    :aria-label="label"
    data-slot="spinner"
  >
    <!-- Track -->
    <circle
      cx="12" cy="12" r="10"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-opacity="0.25"
    />
    <!-- Arc -->
    <path
      d="M12 2a10 10 0 0 1 10 10"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      data-slot="spinner-icon"
    />
  </svg>
</template>
