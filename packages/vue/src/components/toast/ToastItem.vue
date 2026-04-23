<script setup lang="ts">
import { ref } from 'vue'
import { toastItemTheme, toastIndicatorTheme, toastTitleTheme } from './toast.theme'
import type { ToastItem, ToastShadow } from './toast.types'

withDefaults(defineProps<{
  item: ToastItem
  isFrontmost: boolean
  shadow?: ToastShadow
}>(), {
  shadow: 'lg',
})

const emit = defineEmits<{ close: [id: string] }>()

const isHovered = ref(false)
const isXHovered = ref(false)

const icons: Record<string, string> = {
  default: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  accent: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  success: '<polyline points="20 6 9 17 4 12"/>',
  warning: '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  danger: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
}

const spinnerSvg = '<circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0110 10" stroke-linecap="round"/>'
</script>

<template>
  <div
    :class="toastItemTheme({ variant: item.variant, shadow })"
    role="alert"
    aria-live="polite"
    aria-atomic="true"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Indicator -->
    <span :class="toastIndicatorTheme({ variant: item.variant })">
      <svg
        class="size-5"
        :class="item.isLoading && 'animate-spin'"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        v-html="item.isLoading ? spinnerSvg : (item.icon ?? icons[item.variant ?? 'default'])"
        aria-hidden="true"
      />
    </span>

    <!-- Content -->
    <div class="flex min-w-0 grow flex-col items-start self-center">
      <p :class="toastTitleTheme({ variant: item.variant })">{{ item.title }}</p>
      <p v-if="item.description" class="text-sm text-ousi-muted">{{ item.description }}</p>
    </div>

    <!-- Action button -->
    <div v-if="item.action" class="ml-auto flex shrink-0 items-center self-center">
      <button
        class="inline-flex h-8 items-center justify-center rounded-full px-3 text-sm font-medium bg-ousi-default text-ousi-default-foreground hover:bg-ousi-default-hover transition-colors"
        @click="item.action?.onClick(); emit('close', item.id)"
      >
        {{ item.action.label }}
      </button>
    </div>

    <!-- Close button — JS-driven visibility, no CSS hover needed -->
    <button
      v-if="isFrontmost"
      type="button"
      aria-label="Dismiss"
      class="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full border border-ousi-border bg-ousi-surface text-ousi-muted transition-all duration-150"
      :style="{
        opacity: isHovered ? '1' : '0',
        transform: isHovered ? (isXHovered ? 'scale(1.15)' : 'scale(1)') : 'scale(0.5)',
        pointerEvents: isHovered ? 'auto' : 'none',
        color: isXHovered ? 'var(--ousi-foreground)' : undefined,
      }"
      @mouseenter="isXHovered = true"
      @mouseleave="isXHovered = false"
      @click="emit('close', item.id)"
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</template>
