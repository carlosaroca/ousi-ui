<script setup lang="ts">
import { useOusiConfig, useOusiMessages } from '../../config'
import { ref, computed, toRef, watch, onBeforeUnmount } from 'vue'
import { cn, useControllableState, generateId } from '@ousi-ui/core'
import { useFormContext } from '../form/form.context'
import { fieldFocus, useFieldAttrs } from '../shared/field-attrs'
import { createNumberFormat } from './number-format'
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

defineOptions({ inheritAttrs: false })

const ousiText = useOusiMessages()

const props = withDefaults(defineProps<NumberFieldProps>(), {
  step: 1,
  variant: 'primary',
  size: 'md',
  disabled: false,
  readonly: false,
  required: false,
  showButtons: true,
  shadow: 'xs',
  animated: false,
})

const emit = defineEmits<NumberFieldEmits>()

const descId = `nf-desc-${generateId()}`
const errorId = `nf-err-${generateId()}`
const { rootAttrs, controlAttrs, controlId, describedBy } = useFieldAttrs(`nf-${generateId()}`, () =>
  isInvalid.value ? errorId : props.description ? descId : undefined,
)

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

const config = useOusiConfig()
const effectiveLocale = computed(() => props.locale ?? config.locale.value)
// Keyed by content, so an inline `formatOptions` object doesn't rebuild the format on every render.
const formatKey = computed(() => JSON.stringify(props.formatOptions ?? null))
const numberFormat = computed(() =>
  createNumberFormat(effectiveLocale.value, JSON.parse(formatKey.value) ?? undefined),
)
const inputMode = computed(() => (numberFormat.value.integerOnly ? 'numeric' : 'decimal'))

function formatNumber(n: number | null | undefined): string {
  return numberFormat.value.format(n)
}

function parse(text: string): number | null {
  return numberFormat.value.parse(text)
}

// The input keeps the user's text while it is focused and still stands for the value; any other
// change of the value (buttons, arrows, the parent, a new locale) shows it formatted.
const text = ref(formatNumber(value.value))
const isFocused = ref(false)
let typed: { value: number | null } | null = null

watch(value, (v) => {
  if (isFocused.value && typed && typed.value === v) return
  typed = null
  text.value = formatNumber(v)
})

watch(numberFormat, () => {
  if (!(isFocused.value && typed)) text.value = formatNumber(value.value)
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

/**
 * Refuses a keystroke or paste that can no longer become a valid number: letters, a minus sign
 * when negatives are out of range, or digits past the maximum (more digits only grow it).
 */
function handleBeforeInput(e: InputEvent) {
  if (!e.inputType.startsWith('insert')) return
  const input = e.target as HTMLInputElement
  const inserted = e.data ?? e.dataTransfer?.getData('text/plain') ?? ''
  if (!props.formatOptions && ![...inserted].every(numberFormat.value.accepts)) {
    e.preventDefault()
    return
  }
  const start = input.selectionStart ?? input.value.length
  const end = input.selectionEnd ?? input.value.length
  const next = input.value.slice(0, start) + inserted + input.value.slice(end)
  if (/[-\u2212]/.test(next) && props.min !== undefined && props.min >= 0) {
    e.preventDefault()
    return
  }
  const num = parse(next)
  if (num === null) return
  if (Number.isNaN(num)) e.preventDefault()
  else if (props.max !== undefined && num >= 0 && num > props.max) e.preventDefault()
  else if (props.min !== undefined && num < 0 && num < props.min) e.preventDefault()
}

// Values in range update the model as they are typed; one below the minimum waits for the
// commit, since the next digit may still bring it in range ("1" on the way to "15").
function handleInput(e: Event) {
  text.value = (e.target as HTMLInputElement).value
  const num = parse(text.value)
  if (Number.isNaN(num)) return
  typed = { value: num }
  if (num === null) value.value = null
  else if (clamp(num) === num) value.value = num
}

// An untouched text keeps the exact value, which the format may round or scale.
function commit() {
  let next: number | null
  if (text.value === formatNumber(value.value)) {
    next = value.value
  } else {
    const num = parse(text.value)
    next = Number.isNaN(num) ? value.value : num
  }
  if (next !== null) next = clamp(next)
  typed = null
  if (next !== value.value) value.value = next
  text.value = formatNumber(next)
}

function handleFocus(e: FocusEvent) {
  isFocused.value = true
  emit('focus', e)
}

function handleBlur(e: FocusEvent) {
  commit()
  isFocused.value = false
  emit('blur', e)
}

function handleKeydown(e: KeyboardEvent) {
  if (props.disabled || props.readonly) return
  if (e.key === 'Enter') commit()
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

defineExpose(fieldFocus(() => inputRef.value))
</script>

<template>
  <div v-bind="rootAttrs" :class="cn(numberFieldWrapperTheme, props.class)">
    <!-- Label -->
    <label
      v-if="label"
      :for="controlId"
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
        :aria-label="ousiText.decrease"
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
        ref="inputRef"
        type="text"
        :inputmode="inputMode"
        :name="name"
        :class="numberFieldInputTheme"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-label="label ?? ousiText.number"
        :aria-invalid="isInvalid || undefined"
        :aria-valuenow="value ?? undefined"
        :aria-valuemin="min"
        :aria-valuemax="max"
        v-bind="controlAttrs"
        :id="controlId"
        :value="text"
        :aria-describedby="describedBy"
        @beforeinput="handleBeforeInput"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keydown="handleKeydown"
      />

      <!-- Increment -->
      <button
        v-if="showButtons"
        type="button"
        :class="numberFieldIncrementTheme"
        :disabled="!canIncrement || disabled"
        :aria-label="ousiText.increase"
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
