<script setup lang="ts">
import { ref, computed, watch, toRef, onBeforeUnmount, nextTick, useId } from 'vue'
import { useFloating, autoUpdate, offset, flip, shift, size as floatingSize } from '@floating-ui/vue'
import { AnimatePresence, Motion } from 'motion-v'
import { cn, useControllableState, useMounted, useEscapeKey } from '@ousi-ui/core'
import OScrollShadow from '../scroll-shadow/ScrollShadow.vue'
import {
  autocompleteWrapperTheme,
  autocompleteTriggerTheme,
  autocompleteInputTheme,
  autocompleteLabelTheme,
  autocompletePopoverTheme,
  autocompleteListboxTheme,
  autocompleteOptionTheme,
  autocompleteEmptyTheme,
  autocompleteDescriptionTheme,
  autocompleteErrorTheme,
} from './autocomplete.theme'
import type { AutocompleteProps, AutocompleteEmits } from './autocomplete.types'

const props = withDefaults(defineProps<AutocompleteProps>(), {
  variant: 'primary',
  disabled: false,
  readonly: false,
  required: false,
  clearable: true,
  allowCustomValue: false,
  emptyMessage: 'No results found',
  shadow: 'xs',
  animated: false,
  scrollShadow: true,
})

const emit = defineEmits<AutocompleteEmits>()

const inputId = useId()
const listboxId = useId()
const descId = useId()
const errorId = useId()

const isMounted = useMounted()
const isOpen = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const popoverRef = ref<HTMLElement | null>(null)
const focusedIndex = ref(0)
const query = ref('')

const selectedValue = useControllableState<string | number>({
  prop: toRef(props, 'modelValue'),
  defaultValue: props.defaultValue ?? '',
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

const selectedOption = computed(() =>
  props.options.find((o) => o.value === selectedValue.value),
)

const filteredOptions = computed(() => {
  if (!query.value) return props.options
  const q = query.value.toLowerCase()
  return props.options.filter((o) => o.label.toLowerCase().includes(q))
})

const isInvalid = computed(() => !!props.errorMessage)
const hasValue = computed(() => !!selectedValue.value || !!query.value)

const describedBy = computed(() => {
  if (isInvalid.value) return errorId
  if (props.description) return descId
  return undefined
})

// Floating UI
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
        Object.assign(elements.floating.style, { minWidth: `${rects.reference.width}px` })
      },
    }),
  ],
})

function openDropdown() {
  if (props.disabled || props.readonly) return
  isOpen.value = true
  focusedIndex.value = 0
}

function closeDropdown() {
  isOpen.value = false
  if (!props.allowCustomValue && query.value && !selectedOption.value) {
    query.value = ''
  }
  if (selectedOption.value) query.value = ''
}

function selectOption(option: typeof props.options[0]) {
  if (!option || option.disabled) return
  selectedValue.value = option.value
  query.value = ''
  closeDropdown()
  inputRef.value?.blur()
}

function clearValue() {
  selectedValue.value = '' as any
  query.value = ''
  emit('clear')
  nextTick(() => inputRef.value?.focus())
}

function handleInput(e: Event) {
  query.value = (e.target as HTMLInputElement).value
  emit('inputChange', query.value)
  if (!isOpen.value) openDropdown()
  focusedIndex.value = 0
}

function handleKeydown(e: KeyboardEvent) {
  if (!isOpen.value) {
    if (['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) {
      e.preventDefault()
      openDropdown()
    }
    return
  }
  switch (e.key) {
    case 'ArrowDown': {
      e.preventDefault()
      let next = focusedIndex.value + 1
      while (next < filteredOptions.value.length && filteredOptions.value[next]?.disabled) next++
      if (next < filteredOptions.value.length) focusedIndex.value = next
      break
    }
    case 'ArrowUp': {
      e.preventDefault()
      let prev = focusedIndex.value - 1
      while (prev >= 0 && filteredOptions.value[prev]?.disabled) prev--
      if (prev >= 0) focusedIndex.value = prev
      break
    }
    case 'Enter':
      e.preventDefault()
      if (filteredOptions.value[focusedIndex.value]) {
        selectOption(filteredOptions.value[focusedIndex.value])
      }
      break
    case 'Tab':
      closeDropdown()
      break
  }
}

useEscapeKey({ handler: () => closeDropdown(), enabled: isOpen })

function handleClickOutside(e: MouseEvent) {
  const t = e.target as Node
  if (!triggerRef.value?.contains(t) && !popoverRef.value?.contains(t)) closeDropdown()
}

watch(isOpen, (v) => {
  if (v) document.addEventListener('pointerdown', handleClickOutside, true)
  else document.removeEventListener('pointerdown', handleClickOutside, true)
})
onBeforeUnmount(() => document.removeEventListener('pointerdown', handleClickOutside, true))
</script>

<template>
  <div :class="cn(autocompleteWrapperTheme, props.class)">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      :class="autocompleteLabelTheme({ required: required || undefined, disabled: disabled || undefined, invalid: isInvalid || undefined })"
    >
      {{ label }}
    </label>

    <!-- Trigger -->
    <div
      ref="triggerRef"
      :class="autocompleteTriggerTheme({ variant, shadow, animated })"
      :data-invalid="isInvalid || undefined"
      :data-disabled="disabled || undefined"
      @click="inputRef?.focus()"
    >
      <!-- Input -->
      <input
        :id="inputId"
        ref="inputRef"
        :class="autocompleteInputTheme"
        type="text"
        :value="query || (isOpen ? '' : selectedOption?.label ?? '')"
        :placeholder="isOpen ? (selectedOption?.label ?? placeholder) : placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-expanded="isOpen"
        :aria-controls="listboxId"
        aria-autocomplete="list"
        :aria-invalid="isInvalid || undefined"
        :aria-describedby="describedBy"
        autocomplete="off"
        role="combobox"
        @input="handleInput"
        @focus="openDropdown(); emit('focus', $event)"
        @blur="emit('blur', $event)"
        @keydown="handleKeydown"
      />

      <!-- Right controls -->
      <div class="flex items-center gap-1.5 pr-3 shrink-0">
        <!-- Clear button -->
        <button
          v-if="clearable && hasValue && !disabled"
          type="button"
          class="rounded-full p-0.5 text-ousi-muted hover:text-ousi-foreground hover:bg-ousi-default transition-colors"
          aria-label="Clear"
          @click.stop="clearValue"
        >
          <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <!-- Chevron -->
        <span
          class="text-ousi-field-placeholder transition-transform duration-150"
          :class="isOpen ? 'rotate-180' : ''"
          aria-hidden="true"
        >
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </div>
    </div>

    <!-- Description -->
    <p v-if="description && !errorMessage" :id="descId" :class="autocompleteDescriptionTheme">{{ description }}</p>

    <!-- Error -->
    <p v-if="errorMessage" :id="errorId" :class="autocompleteErrorTheme" role="alert" aria-live="polite">{{ errorMessage }}</p>
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
          :class="autocompletePopoverTheme"
          :initial="{ opacity: 0, scale: 0.95, y: -4 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.95 }"
          :transition="{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }"
        >
          <component
            :is="scrollShadow ? OScrollShadow : 'div'"
            :class="[
              'max-h-60',
              !scrollShadow && 'overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            ]"
            v-bind="scrollShadow ? { size: 24 } : {}"
          >
            <ul :id="listboxId" role="listbox" :aria-label="label ?? 'Options'" :class="autocompleteListboxTheme">
              <li
                v-for="(option, index) in filteredOptions"
                :key="option.value"
                role="option"
                :aria-selected="option.value === selectedValue"
                :aria-disabled="option.disabled || undefined"
                :data-disabled="option.disabled || undefined"
                :class="autocompleteOptionTheme({ selected: option.value === selectedValue || undefined, focused: focusedIndex === index || undefined })"
                @click="selectOption(option)"
                @mouseenter="focusedIndex = index"
              >
                <span class="flex-1">{{ option.label }}</span>
                <svg
                  v-if="option.value === selectedValue"
                  class="size-3.5 shrink-0 text-ousi-accent"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                >
                  <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </li>

              <li v-if="filteredOptions.length === 0" :class="autocompleteEmptyTheme" role="option" aria-disabled="true">
                {{ emptyMessage }}
              </li>
            </ul>
          </component>
        </Motion>
      </AnimatePresence>
    </div>
  </Teleport>
</template>
