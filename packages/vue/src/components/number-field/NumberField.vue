<script setup lang="ts">
import { ref, computed, toRef, onBeforeUnmount } from 'vue'
import { cn, useControllableState, generateId } from '@ousi-ui/core'
import { useFormContext } from '../form/form.context'
import {
  numberFieldWrapperTheme,
  numberFieldGroupTheme,
  numberFieldInputTheme,
  numberFieldDecrementTheme,
  numberFieldIncrementTheme,
  numberFieldLabelTheme,
  numberFieldDescriptionTheme,
  numberFieldErrorTheme,
} from './number-field.theme'
import type { NumberFieldProps, NumberFieldEmits } from './number-field.types'

const props = withDefaults(defineProps<NumberFieldProps>(), {
  step: 1,
  variant: 'primary',
  size: 'md',
  disabled: false,
  readonly: false,
  required: false,
  showButtons: true,
  locale: 'en-US',
  shadow: 'xs',
  animated: false,
})

const emit = defineEmits<NumberFieldEmits>()

const inputId = `nf-${generateId()}`
const descId = `nf-desc-${generateId()}`
const errorId = `nf-err-${generateId()}`

const inputRef = ref<HTMLInputElement | null>(null)
const formCtx = useFormContext()

const value = useControllableState<number | null>({
  prop: toRef(props, 'modelValue') as any,
  defaultValue: props.defaultValue ?? null,
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

// Error from prop or form context
const resolvedError = computed(() => {
  if (props.errorMessage) return props.errorMessage
  if (props.name && formCtx?.validationErrors.value[props.name]) {
    const err = formCtx.validationErrors.value[props.name]
    return Array.isArray(err) ? err[0] : err
  }
  return undefined
})

const isInvalid = computed(() => !!resolvedError.value)

const describedBy = computed(() =>
  isInvalid.value ? errorId : props.description ? descId : undefined,
)

// Formatter
const formatter = computed(() =>
  props.formatOptions
    ? new Intl.NumberFormat(props.locale, props.formatOptions)
    : null,
)

const displayValue = computed(() => {
  if (value.value === null || value.value === undefined) return ''
  return formatter.value ? formatter.value.format(value.value) : String(value.value)
})

// Clamp
function clamp(val: number): number {
  let r = val
  if (props.min !== undefined) r = Math.max(props.min, r)
  if (props.max !== undefined) r = Math.min(props.max, r)
  return r
}

const canDecrement = computed(() =>
  !props.disabled && !props.readonly &&
  (props.min === undefined || (value.value ?? 0) > props.min),
)

const canIncrement = computed(() =>
  !props.disabled && !props.readonly &&
  (props.max === undefined || (value.value ?? 0) < props.max),
)

function decrement() {
  if (!canDecrement.value) return
  value.value = clamp((value.value ?? 0) - props.step)
}

function increment() {
  if (!canIncrement.value) return
  value.value = clamp((value.value ?? 0) + props.step)
}

function handleInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value
  if (raw === '' || raw === '-') {
    value.value = null
    return
  }
  const cleaned = raw.replace(/[^0-9.\-]/g, '')
  const num = parseFloat(cleaned)
  if (!isNaN(num)) {
    value.value = clamp(num)
  }
}

function handleBlur(e: FocusEvent) {
  if (inputRef.value) inputRef.value.value = displayValue.value
  emit('blur', e)
}

function handleKeydown(e: KeyboardEvent) {
  if (props.disabled || props.readonly) return
  if (e.key === 'ArrowUp') { e.preventDefault(); increment() }
  if (e.key === 'ArrowDown') { e.preventDefault(); decrement() }
  if (e.key === 'PageUp') { e.preventDefault(); value.value = clamp((value.value ?? 0) + props.step * 10) }
  if (e.key === 'PageDown') { e.preventDefault(); value.value = clamp((value.value ?? 0) - props.step * 10) }
  if (e.key === 'Home' && props.min !== undefined) { e.preventDefault(); value.value = props.min }
  if (e.key === 'End' && props.max !== undefined) { e.preventDefault(); value.value = props.max }
}

// Hold to repeat
let holdTimer: ReturnType<typeof setTimeout> | null = null
let holdInterval: ReturnType<typeof setInterval> | null = null

function startHold(action: 'increment' | 'decrement') {
  const fn = action === 'increment' ? increment : decrement
  fn()
  holdTimer = setTimeout(() => {
    holdInterval = setInterval(fn, 80)
  }, 400)
}

function stopHold() {
  if (holdTimer) { clearTimeout(holdTimer); holdTimer = null }
  if (holdInterval) { clearInterval(holdInterval); holdInterval = null }
}

onBeforeUnmount(stopHold)
</script>

<template>
  <div :class="cn(numberFieldWrapperTheme, props.class)">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      :class="numberFieldLabelTheme({ required, disabled, invalid: isInvalid })"
    >
      {{ label }}
    </label>

    <!-- Group: [−] [input] [+] -->
    <div
      :class="numberFieldGroupTheme({ variant, size, showButtons, shadow, animated })"
      :data-invalid="isInvalid || undefined"
      :data-disabled="disabled || undefined"
    >
      <!-- Decrement -->
      <button
        v-if="showButtons"
        type="button"
        :class="numberFieldDecrementTheme"
        :disabled="!canDecrement || disabled"
        aria-label="Decrease"
        @mousedown="startHold('decrement')"
        @mouseup="stopHold"
        @mouseleave="stopHold"
        @touchstart.prevent="startHold('decrement')"
        @touchend="stopHold"
      >
        <slot name="decrement-icon">
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M5 12h14" />
          </svg>
        </slot>
      </button>

      <!-- Input -->
      <input
        :id="inputId"
        ref="inputRef"
        type="text"
        inputmode="decimal"
        :name="name"
        :class="numberFieldInputTheme"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-label="label ?? 'Number'"
        :aria-describedby="describedBy"
        :aria-invalid="isInvalid || undefined"
        :aria-valuenow="value ?? undefined"
        :aria-valuemin="min"
        :aria-valuemax="max"
        @input="handleInput"
        @blur="handleBlur"
        @focus="emit('focus', $event)"
        @keydown="handleKeydown"
      />

      <!-- Increment -->
      <button
        v-if="showButtons"
        type="button"
        :class="numberFieldIncrementTheme"
        :disabled="!canIncrement || disabled"
        aria-label="Increase"
        @mousedown="startHold('increment')"
        @mouseup="stopHold"
        @mouseleave="stopHold"
        @touchstart.prevent="startHold('increment')"
        @touchend="stopHold"
      >
        <slot name="increment-icon">
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </slot>
      </button>
    </div>

    <!-- Description -->
    <p v-if="description && !resolvedError" :id="descId" :class="numberFieldDescriptionTheme">
      {{ description }}
    </p>

    <!-- Error -->
    <p v-if="resolvedError" :id="errorId" :class="numberFieldErrorTheme" role="alert" aria-live="polite">
      {{ resolvedError }}
    </p>
  </div>
</template>
