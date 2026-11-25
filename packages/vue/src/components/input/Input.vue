<script setup lang="ts">
import { useOusiMessages } from '../../config'
import { computed, nextTick, onBeforeUnmount, ref, toRef, useId, watch } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import { inputGroupTheme, inputInnerTheme, labelTheme } from './input.theme'
import { useFormContext } from '../form/form.context'
import { fieldFocus, useFieldAttrs } from '../shared/field-attrs'
import type { InputProps, InputEmits } from './input.types'

defineOptions({ inheritAttrs: false })

const ousiText = useOusiMessages()

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  size: 'md',
  variant: 'primary',
  disabled: false,
  readonly: false,
  required: false,
  clearable: false,
  revealable: false,
  loading: false,
  shadow: 'xs',
  animated: false,
})

const emit = defineEmits<InputEmits>()

const descriptionId = useId()
const errorId = useId()
const { rootAttrs, controlAttrs, controlId, describedBy } = useFieldAttrs(useId(), () => {
  if (isInvalid.value) return errorId
  if (props.description) return descriptionId
  return undefined
})
const inputRef = ref<HTMLInputElement | null>(null)

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

/* ── Showing a password ────────────────────────────────────────── */

const isPassword = computed(() => props.type === 'password')
const canReveal = computed(() => isPassword.value && props.revealable)
const revealed = ref(false)
const shownType = computed(() => (canReveal.value && revealed.value ? 'text' : props.type))
watch(canReveal, (can) => !can && (revealed.value = false))

async function toggleReveal() {
  const input = inputRef.value
  if (!input) return
  // Browsers may move the caret when the type changes.
  const { selectionStart, selectionEnd } = input
  const typing = document.activeElement === input
  revealed.value = !revealed.value
  await nextTick()
  // Chromium moves it only after the click is over, so it is put back in the next frame.
  if (typing) requestAnimationFrame(() => input.setSelectionRange(selectionStart, selectionEnd))
}

// A form is sent with the password hidden again: sent as plain text, a browser may keep it among the
// words it offers to complete. At once, without waiting for Vue to patch.
function hideOnSubmit() {
  revealed.value = false
  if (inputRef.value) inputRef.value.type = 'password'
}
let form: HTMLFormElement | null = null
watch(revealed, (on) => {
  form?.removeEventListener('submit', hideOnSubmit, true)
  form = on ? (inputRef.value?.form ?? null) : null
  form?.addEventListener('submit', hideOnSubmit, true)
})
onBeforeUnmount(() => form?.removeEventListener('submit', hideOnSubmit, true))

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

defineExpose(fieldFocus(() => inputRef.value))
</script>

<template>
  <div v-bind="rootAttrs" :class="cn('flex w-full flex-col gap-1.5', props.class)">
    <!-- Label -->
    <label
      v-if="label"
      :for="controlId"
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
      :class="inputGroupTheme({ variant, shadow, animated })"
      :data-invalid="isInvalid || undefined"
      :data-disabled="disabled || undefined"
    >
      <!-- Slot start -->
      <div v-if="$slots.start" class="flex items-center pl-3 pr-1 text-ousi-muted shrink-0">
        <slot name="start" />
      </div>

      <!-- Native input -->
      <input
        ref="inputRef"
        :name="name"
        :class="[inputInnerTheme({ size, hasStart: !!$slots.start || undefined }), canReveal && '[&::-ms-reveal]:hidden']"
        :type="shownType"
        :spellcheck="isPassword ? 'false' : undefined"
        :autocapitalize="isPassword ? 'off' : undefined"
        :autocorrect="isPassword ? 'off' : undefined"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-invalid="isInvalid || undefined"
        :aria-required="required || undefined"
        :aria-disabled="disabled || undefined"
        v-bind="controlAttrs"
        :id="controlId"
        :value="value"
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
        :aria-label="ousiText.clearInput"
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

      <!-- Show or hide the password. The press leaves focus where it was, so someone typing carries
           on, and leaving the field is not reported. -->
      <button
        v-if="canReveal"
        type="button"
        data-slot="input-reveal"
        class="mr-1.5 flex size-7 shrink-0 items-center justify-center rounded-full text-ousi-muted transition-colors hover:text-ousi-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ousi-focus"
        :aria-label="ousiText.showPassword"
        :aria-pressed="revealed"
        :aria-controls="controlId"
        :disabled="disabled"
        @mousedown.prevent
        @click="toggleReveal"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
          <circle cx="12" cy="12" r="2.75" />
          <!-- A stroke across the eye while the password is in view: pressing hides it. -->
          <path v-if="revealed" data-part="slash" d="M4.5 4.5l15 15" />
        </svg>
      </button>
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
