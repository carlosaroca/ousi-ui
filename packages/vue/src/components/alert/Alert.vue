<script setup lang="ts">
import { cn } from '@ousi-ui/core'
import {
  alertTheme,
  alertIndicatorTheme,
  alertTitleTheme,
  alertDescriptionTheme,
  alertContentTheme,
} from './alert.theme'
import type { AlertProps, AlertEmits } from './alert.types'

const props = withDefaults(defineProps<AlertProps>(), {
  variant: 'default',
  closable: false,
})

const emit = defineEmits<AlertEmits>()

const icons: Record<string, string> = {
  default: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  accent: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  warning: '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  danger: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
}
</script>

<template>
  <div
    :class="cn(alertTheme({ variant }), props.class)"
    role="alert"
  >
    <!-- Indicator -->
    <span :class="alertIndicatorTheme({ variant })">
      <slot name="indicator">
        <svg
          class="size-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          v-html="icons[variant]"
        />
      </slot>
    </span>

    <!-- Content -->
    <div :class="alertContentTheme">
      <p :class="alertTitleTheme({ variant })">{{ title }}</p>
      <p v-if="description" :class="alertDescriptionTheme">{{ description }}</p>
      <div v-if="$slots.default" class="mt-2">
        <slot />
      </div>
    </div>

    <!-- Close button -->
    <button
      v-if="closable"
      type="button"
      class="ml-auto shrink-0 flex items-center justify-center size-6 rounded-full text-ousi-muted hover:text-ousi-foreground hover:bg-ousi-default transition-colors duration-150"
      aria-label="Dismiss alert"
      @click="emit('close')"
    >
      <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</template>
