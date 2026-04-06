<script setup lang="ts">
import { computed, useId } from 'vue'
import { cn } from '@ousi-ui/core'
import { vHaptic } from '@ousi-ui/haptics'
import { buttonTheme } from './button.theme'
import type { ButtonProps } from './button.types'

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  isIconOnly: false,
  fullWidth: false,
  type: 'button',
  as: 'button',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const id = useId()

const isDisabled = computed(() => props.disabled || props.loading)

const classes = computed(() =>
  cn(
    buttonTheme({
      variant: props.variant,
      size: props.size,
      isIconOnly: props.isIconOnly || undefined,
      fullWidth: props.fullWidth || undefined,
    }),
    props.class,
  ),
)

const resolvedHaptic = computed(() => {
  if (isDisabled.value) return 'none'
  if (props.haptic !== undefined) return props.haptic
  return 'none' // No haptic by default — user opts in via haptic prop
})

function handleClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<template>
  <component
    :is="as"
    v-haptic="resolvedHaptic"
    :id="id"
    :type="as === 'button' ? type : undefined"
    :class="classes"
    :disabled="as === 'button' ? isDisabled : undefined"
    :aria-disabled="isDisabled || undefined"
    :aria-busy="loading || undefined"
    :data-loading="loading || undefined"
    :tabindex="isDisabled ? -1 : undefined"
    :role="as !== 'button' ? 'button' : undefined"
    @click="handleClick"
  >
    <!-- Loading spinner overlay -->
    <span
      v-if="loading"
      class="ousi-button-spinner absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      <slot name="loading">
        <svg
          class="animate-spin"
          :class="{
            'h-4 w-4': size === 'sm',
            'h-5 w-5': size === 'md',
            'h-6 w-6': size === 'lg',
          }"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </slot>
    </span>

    <span
      :class="{ 'opacity-0': loading }"
      class="inline-flex items-center gap-2"
    >
      <slot name="start" />
      <slot />
      <slot name="end" />
    </span>
  </component>
</template>
