<script setup lang="ts">
import { computed, toRef, useId } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import { inputGroupTheme, inputInnerTheme, labelTheme } from './input.theme'
import { useFormContext } from '../form/form.context'
import type { InputProps, InputEmits } from './input.types'

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  size: 'md',
  variant: 'primary',
  disabled: false,
  readonly: false,
  required: false,
  clearable: false,
  loading: false,
  fullWidth: false,
})

const emit = defineEmits<InputEmits>()

const inputId = useId()
const descriptionId = useId()
const errorId = useId()

const formCtx = useFormContext()

const value = useControllableState<string | number>({
  prop: toRef(props, 'modelValue'),
  defaultValue: props.defaultValue ?? '',
  onChange: (val) => emit('update:modelValue', val),
})

// Error from prop takes priority, then form context by name
const resolvedError = computed(() => {
  if (props.errorMessage) return props.errorMessage
  if (props.name && formCtx?.validationErrors.value[props.name]) {
    const err = formCtx.validationErrors.value[props.name]
    return Array.isArray(err) ? err[0] : err
  }
  return undefined
})

const isInvalid = computed(() => !!resolvedError.value)
const showClear = computed(() =>
  props.clearable && !!value.value && !props.disabled && !props.readonly,
)

const describedBy = computed(() => {
  if (isInvalid.value) return errorId
  if (props.description) return descriptionId
  return undefined
})

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  const val = props.type === 'number' ? target.valueAsNumber : target.value
  value.value = val
  emit('change', val)
}

function handleClear() {
  value.value = ''
  emit('clear')
}
</script>

<template>
  <div :class="cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : 'w-fit', props.class)">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      :class="labelTheme({
        required: required || undefined,
        disabled: disabled || undefined,
        invalid: isInvalid || undefined,
      })"
    >
      {{ label }}
    </label>

    <!-- Input group wrapper -->
    <div
      :class="inputGroupTheme({ variant, fullWidth })"
      :data-invalid="isInvalid || undefined"
      :data-disabled="disabled || undefined"
    >
      <!-- Slot start -->
      <div v-if="$slots.start" class="flex items-center pl-3 pr-1 text-ousi-muted shrink-0">
        <slot name="start" />
      </div>

      <!-- Native input -->
      <input
        :id="inputId"
        :name="name"
        :class="inputInnerTheme({ size, hasStart: !!$slots.start || undefined })"
        :type="type"
        :value="value"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-invalid="isInvalid || undefined"
        :aria-required="required || undefined"
        :aria-disabled="disabled || undefined"
        :aria-describedby="describedBy"
        data-slot="input-group-input"
        @input="handleInput"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      />

      <!-- Loading spinner -->
      <div v-if="loading" class="flex items-center pr-3 text-ousi-muted shrink-0">
        <svg
          data-slot="spinner"
          class="h-4 w-4 animate-spin text-ousi-muted"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>

      <!-- Clear button -->
      <button
        v-else-if="showClear"
        type="button"
        class="flex items-center pr-3 text-ousi-muted hover:text-ousi-foreground transition-colors"
        aria-label="Clear input"
        @click="handleClear"
      >
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <!-- Slot end (only when not loading and not clearing) -->
      <div v-else-if="$slots.end" class="flex items-center pr-3 text-ousi-muted">
        <slot name="end" />
      </div>
    </div>

    <!-- Description -->
    <p
      v-if="description && !resolvedError"
      :id="descriptionId"
      class="text-xs text-ousi-muted"
    >
      {{ description }}
    </p>

    <!-- Error message -->
    <p
      v-if="resolvedError"
      :id="errorId"
      class="text-xs text-ousi-danger"
      role="alert"
      aria-live="polite"
    >
      {{ resolvedError }}
    </p>
  </div>
</template>
