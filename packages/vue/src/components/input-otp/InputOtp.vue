<script setup lang="ts">
import { ref, computed, watch, nextTick, toRef } from 'vue'
import { cn, useControllableState, generateId } from '@ousi-ui/core'
import {
  inputOtpTheme,
  inputOtpGroupTheme,
  inputOtpSlotTheme,
  inputOtpSeparatorTheme,
  inputOtpLabelTheme,
  inputOtpDescriptionTheme,
  inputOtpErrorTheme,
} from './input-otp.theme'
import type { InputOtpProps, InputOtpEmits } from './input-otp.types'

const props = withDefaults(defineProps<InputOtpProps>(), {
  length: 6,
  type: 'digit',
  variant: 'primary',
  size: 'md',
  disabled: false,
  readonly: false,
  required: false,
  shakeOnError: true,
  clearOnError: false,
  clearDelay: 80,
  mask: false,
})

const emit = defineEmits<InputOtpEmits>()

const inputId = `otp-${generateId()}`
const descId = `otp-desc-${generateId()}`
const errorId = `otp-err-${generateId()}`

const inputRef = ref<HTMLInputElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const isFocused = ref(false)

// Controlled value
const value = useControllableState<string>({
  prop: toRef(props, 'modelValue') as any,
  defaultValue: props.defaultValue ?? '',
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

// ── Track which slots should animate on next render ──
// Only newly filled slots get the entry animation, not existing ones.
const pendingAnimSlots = ref<Set<number>>(new Set())

let prevLen = value.value.length
watch(value, (newVal) => {
  const newLen = newVal.length
  if (newLen > prevLen) {
    // Mark only the newly added slots for animation
    for (let i = prevLen; i < newLen; i++) {
      pendingAnimSlots.value.add(i)
    }
  }
  prevLen = newLen
})

// Derived slot values
const slots = computed(() => {
  const chars = value.value.split('')
  return Array.from({ length: props.length }, (_, i) => chars[i] ?? null)
})

// Active index
const activeIndex = computed(() =>
  Math.min(value.value.length, props.length - 1),
)

// Groups
const slotGroups = computed(() => {
  if (!props.groups?.length) {
    return [{ indices: Array.from({ length: props.length }, (_, i) => i), separator: false }]
  }
  const groups: { indices: number[]; separator: boolean }[] = []
  let idx = 0
  props.groups.forEach((g, gi) => {
    const indices = Array.from({ length: g.slots }, (_, i) => idx + i)
    idx += g.slots
    groups.push({ indices, separator: gi < props.groups!.length - 1 })
  })
  return groups
})

// Size helpers
const caretHeight = computed(() =>
  props.size === 'sm' ? '12px' : props.size === 'lg' ? '20px' : '16px',
)

const dotSize = computed(() =>
  props.size === 'sm' ? 'size-1' : props.size === 'lg' ? 'size-2' : 'size-1.5',
)

const separatorSize = computed(() => {
  if (props.size === 'sm') return { width: '4px', height: '2px' }
  if (props.size === 'lg') return { width: '8px', height: '3px' }
  return { width: '6px', height: '2px' }
})

// Validation
function isValidChar(char: string): boolean {
  if (props.type === 'digit') return /^\d$/.test(char)
  if (props.type === 'alpha') return /^[a-zA-Z]$/.test(char)
  if (props.type === 'alphanumeric') return /^[a-zA-Z0-9]$/.test(char)
  return true
}

function handleInput(e: Event) {
  if (props.disabled || props.readonly) return
  const input = e.target as HTMLInputElement
  const raw = props.type === 'digit' ? input.value : input.value.toUpperCase()
  const filtered = raw.split('').filter(isValidChar).slice(0, props.length).join('')
  value.value = filtered
  input.value = filtered
  if (filtered.length === props.length) emit('complete', filtered)
}

function handleKeydown(e: KeyboardEvent) {
  if (props.disabled || props.readonly) return
  if (e.key === 'Backspace') {
    e.preventDefault()
    if (value.value.length > 0) {
      value.value = value.value.slice(0, -1)
      if (inputRef.value) inputRef.value.value = value.value
    }
  }
}

function handlePaste(e: ClipboardEvent) {
  if (props.disabled || props.readonly) return
  e.preventDefault()
  const pasted = e.clipboardData?.getData('text') ?? ''
  const raw = props.type === 'digit' ? pasted : pasted.toUpperCase()
  const filtered = raw.split('').filter(isValidChar).slice(0, props.length).join('')
  value.value = filtered
  if (inputRef.value) inputRef.value.value = filtered
  if (filtered.length === props.length) emit('complete', filtered)
}

function handleFocus() { isFocused.value = true }
function handleBlur() { isFocused.value = false }
function handleSlotClick() { inputRef.value?.focus() }

// ── Shake: DOM reflow approach — does NOT destroy/recreate children ──
function triggerShake() {
  if (!props.shakeOnError) return
  const el = containerRef.value
  if (!el) return
  el.style.animation = 'none'
  void el.offsetWidth
  el.style.animation = 'otp-shake 400ms cubic-bezier(0, 0, 0.2, 1) both'
  const onEnd = () => {
    el.style.animation = ''
    el.removeEventListener('animationend', onEnd)
  }
  el.addEventListener('animationend', onEnd)
}

// ── Auto-clear ──
async function triggerClearOnError() {
  if (!props.clearOnError) return
  const len = value.value.length
  for (let i = len; i >= 0; i--) {
    await new Promise((r) => setTimeout(r, props.clearDelay))
    value.value = value.value.slice(0, i)
    if (inputRef.value) inputRef.value.value = value.value
  }
  emit('clear')
}

watch(() => props.errorMessage, async (err) => {
  if (err) {
    triggerShake()
    await nextTick()
    await triggerClearOnError()
    if (props.clearOnError) {
      setTimeout(() => inputRef.value?.focus(), props.clearDelay * (value.value.length + 2))
    }
  }
})

defineExpose({ triggerShake, triggerClearOnError, focus: () => inputRef.value?.focus() })

const isInvalid = computed(() => !!props.errorMessage)
const describedBy = computed(() =>
  isInvalid.value ? errorId : props.description ? descId : undefined,
)

function getSlotDisplay(val: string | null): string {
  if (val === null) return ''
  return props.mask ? '●' : val
}

// ── Entry animation: only for slots in pendingAnimSlots ──
function onValueRef(el: Element | null, slotIndex: number) {
  if (!(el instanceof HTMLElement)) return
  if (!pendingAnimSlots.value.has(slotIndex)) return
  // Consume — animate only once
  pendingAnimSlots.value.delete(slotIndex)
  if (typeof el.animate !== 'function') return
  el.animate(
    [
      { opacity: 0, transform: 'translateY(6px) scale(0.85)' },
      { opacity: 1, transform: 'translateY(0) scale(1)' },
    ],
    { duration: 200, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'both' },
  )
}
</script>

<template>
  <div class="flex flex-col">
    <!-- Label -->
    <label v-if="label" :for="inputId" :class="inputOtpLabelTheme">
      {{ label }}
      <span v-if="required" class="ml-0.5 text-ousi-danger" aria-hidden="true">*</span>
    </label>

    <div class="relative" @click="handleSlotClick">
      <!-- Hidden native input -->
      <input
        :id="inputId"
        ref="inputRef"
        type="text"
        :inputmode="type === 'digit' ? 'numeric' : 'text'"
        :pattern="type === 'digit' ? '[0-9]*' : undefined"
        :maxlength="length"
        :value="value"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-label="label ?? 'OTP input'"
        :aria-describedby="describedBy"
        :aria-invalid="isInvalid || undefined"
        autocomplete="one-time-code"
        class="absolute inset-0 h-0 w-0 opacity-0 pointer-events-none"
        @input="handleInput"
        @keydown="handleKeydown"
        @paste="handlePaste"
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <!-- Slots container — no :key, so children persist across shake -->
      <div
        ref="containerRef"
        :class="cn(inputOtpTheme({ disabled }), props.class)"
        :data-disabled="disabled || undefined"
      >
        <template v-for="(group, gi) in slotGroups" :key="gi">
          <div :class="inputOtpGroupTheme({ size })">
            <div
              v-for="slotIndex in group.indices"
              :key="slotIndex"
              :class="inputOtpSlotTheme({ variant, size })"
              :data-active="(isFocused && slotIndex === activeIndex) || undefined"
              :data-filled="slots[slotIndex] !== null || undefined"
              :data-invalid="isInvalid || undefined"
              :data-disabled="disabled || undefined"
            >
              <!-- Filled value — ref callback checks pendingAnimSlots before animating -->
              <span
                v-if="slots[slotIndex] !== null"
                :ref="(el) => onValueRef(el, slotIndex)"
                class="font-semibold"
              >
                {{ getSlotDisplay(slots[slotIndex]) }}
              </span>

              <!-- Blinking caret -->
              <span
                v-else-if="isFocused && slotIndex === activeIndex"
                class="absolute rounded-sm bg-ousi-foreground"
                :style="{ width: '2px', height: caretHeight, animation: 'otp-caret-blink 1.2s ease-out infinite' }"
                aria-hidden="true"
              />

              <!-- Placeholder dot -->
              <div
                v-else
                :class="[dotSize, 'rounded-full bg-ousi-muted/40']"
                aria-hidden="true"
              />
            </div>
          </div>

          <div
            v-if="group.separator"
            :class="inputOtpSeparatorTheme"
            :style="separatorSize"
            aria-hidden="true"
          />
        </template>
      </div>
    </div>

    <!-- Description -->
    <p v-if="description && !errorMessage" :id="descId" :class="inputOtpDescriptionTheme">
      {{ description }}
    </p>

    <!-- Error -->
    <p v-if="errorMessage" :id="errorId" :class="inputOtpErrorTheme" role="alert" aria-live="polite">
      {{ errorMessage }}
    </p>
  </div>
</template>
