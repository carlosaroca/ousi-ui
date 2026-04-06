<script setup lang="ts">
import { computed, toRef, useId } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import { vHaptic } from '@ousi-ui/haptics'
import {
  checkboxWrapperTheme,
  checkboxContentTheme,
  checkboxLabelTheme,
  checkboxDescriptionTheme,
  checkboxErrorTheme,
} from './checkbox.theme'
import type { CheckboxProps, CheckboxEmits } from './checkbox.types'

const props = withDefaults(defineProps<CheckboxProps>(), {
  variant: 'primary',
  disabled: false,
  readonly: false,
  required: false,
  indeterminate: false,
})

const emit = defineEmits<CheckboxEmits>()

const descriptionId = useId()
const errorId = useId()

const checked = useControllableState<boolean>({
  prop: toRef(props, 'modelValue'),
  defaultValue: props.defaultValue ?? false,
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

const isInvalid = computed(() => !!props.errorMessage || props.invalid)
const isActive = computed(() => checked.value || props.indeterminate)

const describedBy = computed(() => {
  if (isInvalid.value && props.errorMessage) return errorId
  if (props.description) return descriptionId
  return undefined
})

const resolvedHaptic = computed(() => {
  if (props.disabled) return 'none'
  return props.haptic ?? 'selection'
})

function handleClick() {
  if (props.disabled || props.readonly) return
  if (props.indeterminate) {
    emit('update:indeterminate', false)
    checked.value = true
  } else {
    checked.value = !checked.value
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === ' ') {
    e.preventDefault()
    handleClick()
  }
}

const controlStyle = computed(() => {
  const accentColor = isInvalid.value ? 'var(--ousi-danger)' : 'var(--ousi-accent)'
  const inactiveColor = isInvalid.value ? 'var(--ousi-danger)' : 'var(--ousi-border)'
  const inactiveBg = props.variant === 'secondary'
    ? 'var(--ousi-surface-secondary)'
    : 'var(--ousi-field-background)'

  return {
    width: 'var(--ousi-checkbox-size, 20px)',
    height: 'var(--ousi-checkbox-size, 20px)',
    borderRadius: 'var(--ousi-radius-md)',
    border: `var(--ousi-border-width) solid ${isActive.value ? accentColor : inactiveColor}`,
    backgroundColor: isActive.value ? accentColor : inactiveBg,
    transition: 'background-color 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
  }
})

const indicatorStyle = computed(() => ({
  opacity: isActive.value ? '1' : '0',
  transform: isActive.value ? 'scale(1)' : 'scale(0.5)',
  transition: 'opacity 150ms ease, transform 200ms cubic-bezier(0.32, 0.72, 0, 1)',
}))
</script>

<template>
  <div
    v-haptic="resolvedHaptic"
    :class="cn(checkboxWrapperTheme({ hasDescription: !!description }), props.class)"
    :data-selected="checked || undefined"
    :data-indeterminate="indeterminate || undefined"
    :data-disabled="disabled || undefined"
    :data-invalid="isInvalid || undefined"
    role="checkbox"
    :aria-checked="indeterminate ? 'mixed' : checked"
    :aria-required="required || undefined"
    :aria-disabled="disabled || undefined"
    :aria-invalid="isInvalid || undefined"
    :aria-describedby="describedBy"
    tabindex="0"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <!-- Control box -->
    <div
      class="relative inline-flex shrink-0 items-center justify-center outline-none"
      :style="controlStyle"
    >
      <!-- Checkmark -->
      <svg
        v-if="!indeterminate"
        class="absolute"
        :style="indicatorStyle"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline
          points="2,6 5,9 10,3"
          :stroke-dasharray="20"
          :stroke-dashoffset="checked ? 0 : 20"
          style="transition: stroke-dashoffset 200ms ease 50ms"
        />
      </svg>

      <!-- Indeterminate line -->
      <svg
        v-else
        class="absolute"
        :style="indicatorStyle"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        stroke="white"
        stroke-width="2.5"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <line x1="2" y1="6" x2="10" y2="6" />
      </svg>
    </div>

    <!-- Content -->
    <div v-if="label || description || $slots.default" :class="checkboxContentTheme">
      <span v-if="label" :class="checkboxLabelTheme">
        {{ label }}
        <span v-if="required" class="ml-0.5 text-ousi-danger" aria-hidden="true">*</span>
      </span>

      <slot v-if="!label" />

      <p
        v-if="description && !errorMessage"
        :id="descriptionId"
        :class="checkboxDescriptionTheme"
      >
        {{ description }}
      </p>

      <p
        v-if="errorMessage"
        :id="errorId"
        :class="checkboxErrorTheme"
        role="alert"
        aria-live="polite"
      >
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>
