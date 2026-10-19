<script setup lang="ts">
import { useOusiMessages } from '../../config'
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
import type { AutocompleteOption, AutocompleteProps, AutocompleteEmits } from './autocomplete.types'

const ousiText = useOusiMessages()
// Same prompt as OSelect when the field gives none, so choice fields read alike.
const resolvedPlaceholder = computed(() => props.placeholder ?? ousiText.value.selectPlaceholder)

const props = withDefaults(defineProps<AutocompleteProps>(), {
  variant: 'primary',
  disabled: false,
  readonly: false,
  required: false,
  clearable: true,
  allowCustomValue: false,
  emptyMessage: undefined,
  filter: true,
  loading: false,
  search: undefined,
  minChars: 2,
  debounce: 250,
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

// Server search: results replace `options` in the list; the picked option is remembered so its
// label stays while later searches return other rows.
const remoteOptions = ref<AutocompleteOption[] | null>(null)
const remoteLoading = ref(false)
const pickedOption = ref<AutocompleteOption | null>(null)
let searchTimer: ReturnType<typeof setTimeout> | null = null
let searchId = 0

const isRemote = computed(() => !!props.search)
const isLoading = computed(() => props.loading || remoteLoading.value)
const queryTooShort = computed(() => isRemote.value && query.value.trim().length < props.minChars)

function runSearch(text: string) {
  if (!props.search) return
  if (searchTimer) clearTimeout(searchTimer)
  const term = text.trim()
  const id = ++searchId
  if (term.length < props.minChars) {
    remoteOptions.value = null
    remoteLoading.value = false
    return
  }
  remoteLoading.value = true
  searchTimer = setTimeout(async () => {
    try {
      const rows = await props.search!(term)
      if (id === searchId) remoteOptions.value = rows
    } catch {
      if (id === searchId) remoteOptions.value = []
    } finally {
      if (id === searchId) remoteLoading.value = false
    }
  }, props.debounce)
}

onBeforeUnmount(() => {
  if (searchTimer) clearTimeout(searchTimer)
})

const selectedOption = computed(
  () =>
    [...(remoteOptions.value ?? []), ...props.options].find((o) => o.value === selectedValue.value) ??
    (pickedOption.value?.value === selectedValue.value ? pickedOption.value : undefined),
)

function normalize(text: string) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

const filteredOptions = computed(() => {
  if (isRemote.value) return queryTooShort.value ? [] : (remoteOptions.value ?? [])
  if (!props.filter || !query.value) return props.options
  const q = normalize(query.value)
  return props.options.filter((o) => normalize(o.label).includes(q))
})

const resolvedEmptyMessage = computed(() => {
  if (queryTooShort.value) {
    return ousiText.value.typeToSearch.replace('{count}', String(props.minChars))
  }
  return props.emptyMessage ?? ousiText.value.noResults
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
      // The list matches the field; long options wrap instead of widening it past the field.
      apply({ rects, elements }) {
        Object.assign(elements.floating.style, { width: `${rects.reference.width}px` })
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

function selectOption(option: AutocompleteOption) {
  if (!option || option.disabled) return
  pickedOption.value = option
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
  runSearch(query.value)
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
        :placeholder="isOpen ? (selectedOption?.label ?? resolvedPlaceholder) : resolvedPlaceholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-expanded="isOpen"
        :aria-controls="listboxId"
        aria-autocomplete="list"
        :aria-invalid="isInvalid || undefined"
        :aria-describedby="describedBy"
        :aria-busy="isLoading || undefined"
        autocomplete="off"
        role="combobox"
        @input="handleInput"
        @focus="openDropdown(); emit('focus', $event)"
        @blur="emit('blur', $event)"
        @keydown="handleKeydown"
      />

      <!-- Right controls -->
      <div class="flex items-center gap-1.5 pr-3 shrink-0">
        <svg
          v-if="isLoading"
          class="size-4 animate-spin text-ousi-muted"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity="0.25" stroke-width="2.5" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
        </svg>
        <!-- Clear button -->
        <button
          v-if="clearable && hasValue && !disabled"
          type="button"
          class="rounded-full p-0.5 text-ousi-muted hover:text-ousi-foreground hover:bg-ousi-default transition-colors"
          :aria-label="ousiText.clear"
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
            <ul :id="listboxId" role="listbox" :aria-label="label ?? ousiText.options" :class="autocompleteListboxTheme">
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
                <slot name="option" :option="option" :selected="option.value === selectedValue">
                  <span class="flex-1">{{ option.label }}</span>
                </slot>
                <svg
                  v-if="option.value === selectedValue"
                  class="size-3.5 shrink-0 text-ousi-accent"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                >
                  <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </li>

              <li v-if="filteredOptions.length === 0" :class="autocompleteEmptyTheme" role="option" aria-disabled="true">
                {{ isLoading ? ousiText.loading : resolvedEmptyMessage }}
              </li>
            </ul>
          </component>
        </Motion>
      </AnimatePresence>
    </div>
  </Teleport>
</template>
