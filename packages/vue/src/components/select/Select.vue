<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount, useId } from 'vue'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  size as floatingSize,
} from '@floating-ui/vue'
import { AnimatePresence, Motion } from 'motion-v'
import { cn, useMounted, useEscapeKey } from '@ousi-ui/core'
import { useHaptics } from '@ousi-ui/haptics'
import {
  selectWrapperTheme,
  selectTriggerTheme,
  selectPopoverTheme,
  listboxTheme,
  menuItemTheme,
} from './select.theme'
import { labelTheme } from '../input/input.theme'
import { useFormContext } from '../form/form.context'
import type { SelectProps, SelectEmits, SelectOption, SelectValue } from './select.types'

const props = withDefaults(defineProps<SelectProps>(), {
  variant: 'primary',
  size: 'md',
  multiple: false,
  disabled: false,
  required: false,
  shadow: 'xs',
  animated: false,
})

const emit = defineEmits<SelectEmits>()

const isMounted = useMounted()
const selectId = useId()
const descriptionId = useId()
const errorId = useId()
const listboxId = useId()

// Internal value — always work with arrays internally, normalize on emit
const internalValue = ref<(string | number)[]>(normalizeToArray(props.modelValue ?? props.defaultValue))

watch(
  () => props.modelValue,
  (v) => {
    if (v !== undefined) internalValue.value = normalizeToArray(v)
  },
)

function normalizeToArray(v: SelectValue | undefined): (string | number)[] {
  if (v === undefined || v === '') return []
  return Array.isArray(v) ? [...v] : [v]
}

function emitValue(arr: (string | number)[]) {
  const out: SelectValue = props.multiple ? arr : (arr[0] ?? '')
  emit('update:modelValue', out)
  emit('change', out)
}

function isSelected(optionValue: string | number): boolean {
  return internalValue.value.includes(optionValue)
}

const { trigger: triggerHaptic } = useHaptics()

function selectOption(option: SelectOption | undefined) {
  if (!option || option.disabled) return
  const preset = props.haptic !== undefined ? props.haptic : 'selection' as const
  triggerHaptic(preset)

  if (props.multiple) {
    const idx = internalValue.value.indexOf(option.value)
    if (idx >= 0) {
      internalValue.value.splice(idx, 1)
    } else {
      internalValue.value.push(option.value)
    }
    emitValue([...internalValue.value])
    // Don't close in multi mode
  } else {
    internalValue.value = [option.value]
    emitValue(internalValue.value)
    close()
  }
}

// Display text
const displayText = computed(() => {
  if (internalValue.value.length === 0) return ''
  const labels = internalValue.value
    .map((v) => props.options.find((o) => o.value === v)?.label)
    .filter(Boolean)
  return labels.join(', ')
})

const hasValue = computed(() => internalValue.value.length > 0)

// Open / close
const isOpen = ref(false)
const focusedIndex = ref(0)

function open() {
  if (props.disabled) return
  isOpen.value = true
  emit('open')
  nextTick(() => {
    const idx = props.options.findIndex((o) => isSelected(o.value))
    focusedIndex.value = idx >= 0 ? idx : 0
  })
}

function close() {
  isOpen.value = false
  emit('close')
  triggerRef.value?.focus()
}

function toggle() {
  isOpen.value ? close() : open()
}

useEscapeKey({
  handler: () => { if (isOpen.value) close() },
  enabled: isOpen,
})

const formCtx = useFormContext()

const resolvedError = computed(() => {
  if (props.errorMessage) return props.errorMessage
  if (props.name && formCtx?.validationErrors.value[props.name]) {
    const err = formCtx.validationErrors.value[props.name]
    return Array.isArray(err) ? err[0] : err
  }
  return undefined
})

const isInvalid = computed(() => !!resolvedError.value)

const describedBy = computed(() => {
  if (isInvalid.value) return errorId
  if (props.description) return descriptionId
  return undefined
})

// Keyboard navigation
function handleKeydown(e: KeyboardEvent) {
  if (!isOpen.value) {
    if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
      e.preventDefault()
      open()
    }
    return
  }

  switch (e.key) {
    case 'ArrowDown': {
      e.preventDefault()
      let next = focusedIndex.value + 1
      while (next < props.options.length && props.options[next]?.disabled) next++
      if (next < props.options.length) focusedIndex.value = next
      break
    }
    case 'ArrowUp': {
      e.preventDefault()
      let prev = focusedIndex.value - 1
      while (prev >= 0 && props.options[prev]?.disabled) prev--
      if (prev >= 0) focusedIndex.value = prev
      break
    }
    case 'Home': {
      e.preventDefault()
      let first = 0
      while (first < props.options.length && props.options[first]?.disabled) first++
      focusedIndex.value = first
      break
    }
    case 'End': {
      e.preventDefault()
      let last = props.options.length - 1
      while (last >= 0 && props.options[last]?.disabled) last--
      if (last >= 0) focusedIndex.value = last
      break
    }
    case 'Enter':
    case ' ':
      e.preventDefault()
      selectOption(props.options[focusedIndex.value])
      break
    case 'Tab':
      close()
      break
  }
}

// Floating UI
const triggerRef = ref<HTMLElement | null>(null)
const popoverRef = ref<HTMLElement | null>(null)

const { floatingStyles } = useFloating(triggerRef, popoverRef, {
  placement: 'bottom-start',
  strategy: 'fixed',
  whileElementsMounted: autoUpdate,
  middleware: [
    offset(4),
    flip(),
    shift({ padding: 8 }),
    floatingSize({
      apply({ rects, elements }) {
        Object.assign(elements.floating.style, {
          minWidth: `${rects.reference.width}px`,
        })
      },
    }),
  ],
})

// Click outside
function handleClickOutside(e: MouseEvent) {
  const target = e.target as Node
  if (!triggerRef.value?.contains(target) && !popoverRef.value?.contains(target)) {
    close()
  }
}

watch(isOpen, (val) => {
  if (val) {
    document.addEventListener('pointerdown', handleClickOutside, true)
  } else {
    document.removeEventListener('pointerdown', handleClickOutside, true)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleClickOutside, true)
})
</script>

<template>
  <div
    :class="cn(selectWrapperTheme, props.class)"
  >
    <!-- Label -->
    <label
      v-if="label"
      :for="selectId"
      :class="labelTheme({
        required: required || undefined,
        disabled: disabled || undefined,
        invalid: isInvalid || undefined,
      })"
    >
      {{ label }}
    </label>

    <!-- Trigger -->
    <button
      :id="selectId"
      ref="triggerRef"
      type="button"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-controls="listboxId"
      :aria-required="required || undefined"
      :aria-disabled="disabled || undefined"
      :aria-invalid="isInvalid || undefined"
      :aria-describedby="describedBy"
      :aria-multiselectable="multiple || undefined"
      :data-disabled="disabled || undefined"
      :data-invalid="isInvalid || undefined"
      :class="selectTriggerTheme({ variant, size, shadow, animated })"
      @click="toggle"
      @keydown="handleKeydown"
    >
      <span
        class="flex-1 text-left truncate"
        :class="!hasValue ? 'text-ousi-field-placeholder' : 'text-ousi-field-foreground'"
      >
        {{ hasValue ? displayText : (placeholder ?? 'Select an option') }}
      </span>

      <!-- Chevron -->
      <span
        class="absolute inset-y-0 right-2 my-auto flex items-center text-ousi-field-placeholder transition-transform duration-150"
        :class="isOpen ? 'rotate-180' : ''"
        aria-hidden="true"
      >
        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </button>

    <!-- Description -->
    <p v-if="description && !resolvedError" :id="descriptionId" class="text-xs text-ousi-muted px-1">
      {{ description }}
    </p>

    <!-- Error -->
    <p v-if="resolvedError" :id="errorId" class="text-xs text-ousi-danger px-1" role="alert" aria-live="polite">
      {{ resolvedError }}
    </p>
  </div>

  <!-- Popover -->
  <Teleport to="body">
    <div
      v-if="isOpen && isMounted"
      ref="popoverRef"
      :style="floatingStyles"
      class="z-50"
    >
      <AnimatePresence>
        <Motion
          tag="div"
          :class="selectPopoverTheme"
          :initial="{ opacity: 0, scale: 0.95, y: -4 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.95 }"
          :transition="{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }"
        >
          <ul
            :id="listboxId"
            role="listbox"
            :aria-label="label ?? 'Options'"
            :aria-multiselectable="multiple || undefined"
            :class="listboxTheme"
          >
            <li
              v-for="(option, index) in options"
              :key="option.value"
              role="option"
              :aria-selected="isSelected(option.value)"
              :aria-disabled="option.disabled || undefined"
              :data-disabled="option.disabled || undefined"
              :class="cn(
                menuItemTheme({ selected: isSelected(option.value) || undefined }),
                focusedIndex === index && 'bg-ousi-default',
              )"
              @click="selectOption(option)"
              @mouseenter="focusedIndex = index"
            >
              <span class="flex-1 text-sm">{{ option.label }}</span>

              <!-- Checkmark (right side) -->
              <span
                v-if="isSelected(option.value)"
                class="flex size-4 shrink-0 items-center justify-center text-ousi-accent"
                aria-hidden="true"
              >
                <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </li>
          </ul>
        </Motion>
      </AnimatePresence>
    </div>
  </Teleport>
</template>
