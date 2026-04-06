<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@ousi-ui/core'
import { useRadioGroupContext } from './radio.context'
import {
  radioLabelTheme,
  radioDescriptionTheme,
  radioContentTheme,
} from './radio.theme'
import type { RadioProps } from './radio.types'

const props = withDefaults(defineProps<RadioProps>(), {
  disabled: false,
})

const group = useRadioGroupContext()

const isSelected = computed(() => group?.selectedValue.value === props.value)
const isDisabled = computed(() => props.disabled || (group?.disabled.value ?? false))
const isInvalid = computed(() => group?.isInvalid.value ?? false)

function select() {
  if (isDisabled.value) return
  group?.select(props.value)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    select()
  }
}

// Control circle — inline styles for dimensions + animated state
const controlStyle = computed(() => ({
  width: '18px',
  height: '18px',
  borderRadius: '9999px',
  border: `2px solid ${isSelected.value
    ? (isInvalid.value ? 'var(--ousi-danger)' : 'var(--ousi-accent)')
    : (isInvalid.value ? 'var(--ousi-danger)' : 'var(--ousi-border)')
  }`,
  backgroundColor: isSelected.value
    ? (isInvalid.value ? 'var(--ousi-danger)' : 'var(--ousi-accent)')
    : 'var(--ousi-field-background)',
  transition: 'background-color 200ms ease, border-color 200ms ease',
}))

// Inner dot — scales from 0 to 1 when selected
const dotStyle = computed(() => ({
  width: '8px',
  height: '8px',
  borderRadius: '9999px',
  backgroundColor: 'white',
  transform: isSelected.value ? 'scale(1)' : 'scale(0)',
  opacity: isSelected.value ? '1' : '0',
  transition: 'transform 200ms cubic-bezier(0.32, 0.72, 0, 1), opacity 150ms ease',
}))
</script>

<template>
  <div
    :class="cn(
      'group relative flex items-start gap-3 outline-none select-none',
      isDisabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer',
      props.class,
    )"
    :data-selected="isSelected || undefined"
    :data-disabled="isDisabled || undefined"
    :data-invalid="isInvalid || undefined"
    data-slot="radio"
    role="radio"
    :aria-checked="isSelected"
    :aria-disabled="isDisabled || undefined"
    tabindex="0"
    @click="select"
    @keydown="handleKeydown"
  >
    <!-- Control circle -->
    <div
      class="relative mt-px inline-flex shrink-0 items-center justify-center group-focus-visible:ring-2 group-focus-visible:ring-ousi-focus group-focus-visible:ring-offset-2 rounded-full"
      :style="controlStyle"
    >
      <!-- Custom indicator slot or default dot -->
      <slot name="indicator" :is-selected="isSelected">
        <div :style="dotStyle" />
      </slot>
    </div>

    <!-- Content -->
    <div v-if="label || description || $slots.default" :class="radioContentTheme">
      <span v-if="label" :class="radioLabelTheme">{{ label }}</span>
      <slot v-else />
      <span v-if="description" :class="radioDescriptionTheme">{{ description }}</span>
    </div>
  </div>
</template>
