<script setup lang="ts">
import { useOusiConfig, useOusiMessages } from '../../config'
import { ref, computed, toRef, watch, watchEffect, onBeforeUnmount, nextTick, useId, h, type FunctionalComponent } from 'vue'
import { useFloating, autoUpdate, offset, flip, shift, size as floatingSize } from '@floating-ui/vue'
import { AnimatePresence, Motion } from 'motion-v'
import { cn, useControllableState, useMounted, useLayer } from '@ousi-ui/core'
import OScrollShadow from '../scroll-shadow/ScrollShadow.vue'
import { chipTheme } from '../chip/chip.theme'
import { fieldFocus, useFieldAttrs } from '../shared/field-attrs'
import {
  autocompleteChipRemoveTheme,
  autocompleteChipTheme,
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
import type { AutocompleteOption, AutocompleteProps, AutocompleteEmits, AutocompleteValue } from './autocomplete.types'

defineOptions({ inheritAttrs: false })

/** A box around its content, or nothing but the content: a field for one value keeps the elements
 *  it has always had, which an app's CSS may rely on. */
const InputBox: FunctionalComponent<{ wrap: boolean }> = (box, { slots, attrs }) =>
  box.wrap ? h('div', attrs, slots.default?.()) : slots.default?.()
InputBox.props = ['wrap']
InputBox.inheritAttrs = false

const ousiText = useOusiMessages()
// Same prompt as OSelect when the field gives none, so choice fields read alike.
const resolvedPlaceholder = computed(() => props.placeholder ?? ousiText.value.selectPlaceholder)

const props = withDefaults(defineProps<AutocompleteProps>(), {
  multiple: false,
  variant: 'primary',
  disabled: false,
  readonly: false,
  required: false,
  autoSelectSingle: undefined,
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

const listboxId = useId()
const descId = useId()
const errorId = useId()
const { attrs, rootAttrs, controlAttrs, controlId, describedBy } = useFieldAttrs(useId(), () => {
  if (isInvalid.value) return errorId
  if (props.description) return descId
  return undefined
})

const isMounted = useMounted()
const isOpen = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const popoverRef = ref<HTMLElement | null>(null)
const focusedIndex = ref(0)
const query = ref('')

const model = useControllableState<AutocompleteValue>({
  prop: toRef(props, 'modelValue'),
  defaultValue: props.defaultValue ?? (props.multiple ? [] : ''),
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

const isNothing = (value: unknown) => value === '' || value === undefined || value === null
/** What is picked, as a list in both modes. The app's array is read, never changed. */
const values = computed<(string | number)[]>(() => {
  const value = model.value
  if (Array.isArray(value)) return props.multiple ? value : value.slice(0, 1)
  return isNothing(value) ? [] : [value]
})
const isSelected = (value: string | number) => values.value.includes(value)
/** The one picked, when only one can be. */
const selectedValue = computed(() => (props.multiple ? undefined : values.value[0]))

// Server search: results replace `options` in the list; the options seen picked are remembered so
// their labels stay while later searches return other rows.
const remoteOptions = ref<AutocompleteOption[] | null>(null)
const remoteLoading = ref(false)
const remembered = new Map<string | number, AutocompleteOption>()
let searchTimer: ReturnType<typeof setTimeout> | null = null
let searchId = 0

const isRemote = computed(() => !!props.search)
const isLoading = computed(() => props.loading || remoteLoading.value)
const queryTooShort = computed(() => isRemote.value && query.value.trim().length < props.minChars)

const ousiConfig = useOusiConfig()
const shouldAutoSelect = computed(
  () =>
    !props.multiple &&
    !isRemote.value &&
    !props.disabled &&
    !props.readonly &&
    (props.autoSelectSingle ?? (props.required && ousiConfig.autoSelectSingle.value)),
)

watch(
  () => [shouldAutoSelect.value, props.options, selectedValue.value] as const,
  () => {
    if (!shouldAutoSelect.value || !isNothing(selectedValue.value)) return
    const enabled = (props.options ?? []).filter((o) => !o.disabled)
    if (enabled.length !== 1) return
    model.value = enabled[0]!.value
  },
  { immediate: true },
)

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

const findOption = (value: string | number) =>
  [...(remoteOptions.value ?? []), ...props.options].find((o) => o.value === value)
const optionOf = (value: string | number) => findOption(value) ?? remembered.get(value)

// A label is kept from the moment its value is picked, however it was picked.
watchEffect(() => {
  for (const value of values.value) {
    const found = findOption(value)
    if (found) remembered.set(value, found)
  }
})

const selectedOption = computed(() => (isNothing(selectedValue.value) ? undefined : optionOf(selectedValue.value!)))

/** A chip for each value. One with no option to name it shows the value, so it can still be removed. */
const chips = computed(() =>
  props.multiple ? values.value.map((value) => optionOf(value) ?? { value, label: String(value) }) : [],
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

/** With `multiple` and custom values, a last row that adds what was typed. */
const customRow = computed(() => {
  const typed = query.value.trim()
  if (!props.multiple || !props.allowCustomValue || !typed || isLoading.value) return undefined
  const same = normalize(typed)
  const known = [...filteredOptions.value, ...chips.value]
  return known.some((o) => normalize(o.label) === same) ? undefined : typed
})
const rowCount = computed(() => filteredOptions.value.length + (customRow.value ? 1 : 0))
const optionId = (index: number) => `${listboxId}-${index}`

const isInvalid = computed(() => !!props.errorMessage)
const isLocked = computed(() => props.disabled || props.readonly)
// 0 is a value like any other.
const hasValue = computed(() => values.value.length > 0 || !!query.value)

// Beside chips, an input that asks for room it does not need drops to a line of its own and leaves
// it empty. At rest it asks for none, with the caret in it for a little, and it grows with the text.
const multipleInputClass = computed(() => {
  if (!props.multiple) return undefined
  if (!chips.value.length) return 'min-w-16 px-1.5 py-1' // room for the placeholder
  return query.value ? 'px-1.5 py-1' : 'min-w-0 px-0 py-1 focus:min-w-8 focus:px-1.5'
})

// With chips, the input holds only what is being typed, so the field says the rest for itself.
const selectionId = useId()
const inputAttrs = computed(() => {
  if (!props.multiple) return controlAttrs.value
  // The name goes to one hidden field per value: the input would send what is typed.
  const { name, ...rest } = controlAttrs.value
  return rest
})
const inputName = computed(() => (props.multiple ? (attrs.name as string | undefined) : undefined))
const inputDescribedBy = computed(
  () => [describedBy.value, chips.value.length ? selectionId : undefined].filter(Boolean).join(' ') || undefined,
)
const selectionText = computed(() =>
  ousiText.value.selectedValues.replace('{values}', chips.value.map((c) => c.label).join(', ')),
)
const announcement = ref('')
const announce = (text: string, value: string) => (announcement.value = text.replace('{value}', value))

function removeValue(value: string | number) {
  if (isLocked.value) return
  const label = optionOf(value)?.label ?? String(value)
  model.value = values.value.filter((v) => v !== value)
  announce(ousiText.value.valueRemoved, label)
}

/** The text has done its job. Where the app filters or searches, it stays: its results hang on it. */
function clearQueryAfterPick() {
  if (!isRemote.value && props.filter) query.value = ''
}

function addCustom() {
  const typed = customRow.value
  if (!typed || isLocked.value) return
  model.value = [...values.value, typed]
  announce(ousiText.value.valueAdded, typed)
  query.value = ''
  runSearch('')
  focusedIndex.value = 0
}

function toggleOption(option: AutocompleteOption) {
  if (isLocked.value) return
  if (isSelected(option.value)) return removeValue(option.value)
  remembered.set(option.value, option)
  model.value = [...values.value, option.value]
  announce(ousiText.value.valueAdded, option.label)
}

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
  if (props.multiple) {
    toggleOption(option)
    clearQueryAfterPick()
    // The list may have changed under the highlight: it stays on the row just picked.
    const at = filteredOptions.value.findIndex((o) => o.value === option.value)
    focusedIndex.value = Math.max(at, 0)
    scrollToFocused()
    return
  }
  remembered.set(option.value, option)
  model.value = option.value
  query.value = ''
  closeDropdown()
  inputRef.value?.blur()
}

function clearValue() {
  model.value = props.multiple ? [] : ''
  query.value = ''
  runSearch('')
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

function scrollToFocused() {
  nextTick(() => document.getElementById(optionId(focusedIndex.value))?.scrollIntoView?.({ block: 'nearest' }))
}

/* ── Chips, from the keyboard ──────────────────────────────────── */

const isRtl = () => !!triggerRef.value && getComputedStyle(triggerRef.value).direction === 'rtl'
const chipButtons = () => [...(triggerRef.value?.querySelectorAll<HTMLElement>('[data-part="chip-remove"]') ?? [])]

/** Focuses a chip, or the input past the last one. */
function focusChip(index: number) {
  const buttons = chipButtons()
  const button = buttons[Math.max(index, 0)]
  if (button) button.focus()
  else inputRef.value?.focus()
}

/** From the input: true when the key was about the chips. */
function chipKeysFromInput(e: KeyboardEvent): boolean {
  if (!props.multiple || !values.value.length || query.value) return false
  if (e.key === 'Backspace') {
    // A key held down to erase what was typed must not go on to erase the picks.
    if (!e.repeat) removeValue(values.value[values.value.length - 1]!)
    return true
  }
  if (e.key === (isRtl() ? 'ArrowRight' : 'ArrowLeft') && chipButtons().length) {
    closeDropdown()
    focusChip(values.value.length - 1)
    return true
  }
  return false
}

function handleChipKeydown(e: KeyboardEvent, index: number) {
  const back = isRtl() ? 'ArrowRight' : 'ArrowLeft'
  const forward = isRtl() ? 'ArrowLeft' : 'ArrowRight'
  if (e.key === back) focusChip(index - 1)
  else if (e.key === forward) focusChip(index + 1)
  else if (e.key === 'Backspace' || e.key === 'Delete') {
    if (e.repeat) return
    removeValue(values.value[index]!)
    // Backspace goes back, as when typing; Delete stays where it was.
    nextTick(() => focusChip(e.key === 'Backspace' ? index - 1 : index))
  } else return
  e.preventDefault()
}

/** The field is left only when focus goes outside it: moving to a chip is not leaving. */
function handleBlur(e: FocusEvent) {
  if (e.relatedTarget instanceof Node && triggerRef.value?.contains(e.relatedTarget)) return
  emit('blur', e)
}

function handleTriggerClick() {
  const input = inputRef.value
  if (!input) return
  // Focused already, as after Escape: focusing again would not open the list.
  if (input.ownerDocument.activeElement === input) openDropdown()
  else input.focus()
}

function handleKeydown(e: KeyboardEvent) {
  if (chipKeysFromInput(e)) {
    e.preventDefault()
    return
  }
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
      while (next < rowCount.value && filteredOptions.value[next]?.disabled) next++
      if (next < rowCount.value) focusedIndex.value = next
      scrollToFocused()
      break
    }
    case 'ArrowUp': {
      e.preventDefault()
      let prev = focusedIndex.value - 1
      while (prev >= 0 && filteredOptions.value[prev]?.disabled) prev--
      if (prev >= 0) focusedIndex.value = prev
      scrollToFocused()
      break
    }
    case 'Enter':
      e.preventDefault()
      if (customRow.value && focusedIndex.value === filteredOptions.value.length) addCustom()
      else if (filteredOptions.value[focusedIndex.value]) {
        selectOption(filteredOptions.value[focusedIndex.value])
      }
      break
    case 'Tab':
      closeDropdown()
      break
  }
}

const { zIndex } = useLayer(isOpen, {
  elements: popoverRef,
  trigger: triggerRef,
  onEscape: () => closeDropdown(),
  onPointerDownOutside: () => closeDropdown(),
})

defineExpose(fieldFocus(() => inputRef.value))
</script>

<template>
  <div v-bind="rootAttrs" :class="cn(autocompleteWrapperTheme, props.class)">
    <!-- Label -->
    <label
      v-if="label"
      :for="controlId"
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
      @click="handleTriggerClick"
    >
      <!-- Slot start -->
      <div v-if="$slots.start" class="flex items-center pl-3 pr-1 text-ousi-muted shrink-0">
        <slot name="start" />
      </div>

      <!-- With `multiple`, the chips and the input share lines, and the field grows with them. -->
      <InputBox :wrap="multiple" :class="['flex min-w-0 flex-1 flex-wrap items-center gap-1 py-1', $slots.start ? 'pl-1' : 'pl-1.5']">
        <span
          v-for="(chip, index) in chips"
          :key="chip.value"
          data-part="chip"
          :class="cn(chipTheme({ variant: 'soft', color: 'default', size: 'sm' }), autocompleteChipTheme, isLocked && 'pr-2')"
        >
          <span class="min-w-0 truncate">
            <slot name="chip" :option="chip" :disabled="isLocked">{{ chip.label }}</slot>
          </span>
          <!-- Reached with the arrows from the input, not with Tab: a field is one stop. -->
          <button
            v-if="!isLocked"
            type="button"
            data-part="chip-remove"
            tabindex="-1"
            :class="autocompleteChipRemoveTheme"
            :aria-label="ousiText.removeValue.replace('{value}', chip.label)"
            @mousedown.prevent
            @click.stop="removeValue(chip.value)"
            @keydown="handleChipKeydown($event, index)"
            @blur="handleBlur"
          >
            <svg class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </span>

        <!-- Input -->
        <input
          ref="inputRef"
          :class="cn(autocompleteInputTheme, $slots.start && 'pl-1', multipleInputClass)"
          :style="multiple && query ? { minWidth: `min(100%, calc(${query.length + 1}ch + 0.75rem))` } : undefined"
          type="text"
          :placeholder="multiple ? (chips.length ? '' : resolvedPlaceholder) : isOpen ? (selectedOption?.label ?? resolvedPlaceholder) : resolvedPlaceholder"
          :disabled="disabled"
          :readonly="readonly"
          :required="required && !(multiple && values.length)"
          :aria-required="required || undefined"
          :aria-invalid="isInvalid || undefined"
          :aria-busy="isLoading || undefined"
          autocomplete="off"
          v-bind="inputAttrs"
          :id="controlId"
          :value="query || (isOpen ? '' : selectedOption?.label ?? '')"
          role="combobox"
          :aria-expanded="isOpen"
          :aria-controls="listboxId"
          :aria-activedescendant="isOpen && focusedIndex < rowCount ? optionId(focusedIndex) : undefined"
          aria-autocomplete="list"
          :aria-describedby="inputDescribedBy"
          @input="handleInput"
          @focus="openDropdown(); emit('focus', $event)"
          @blur="handleBlur"
          @keydown="handleKeydown"
        />
      </InputBox>

      <template v-if="multiple">
        <span :id="selectionId" class="sr-only">{{ selectionText }}</span>
        <span class="sr-only" role="status" data-part="announcement">{{ announcement }}</span>
        <template v-if="inputName">
          <input v-for="value in values" :key="value" type="hidden" :name="inputName" :value="value" :disabled="disabled" />
        </template>
      </template>

      <!-- Right controls -->
      <div class="flex items-center gap-1.5 pr-3 shrink-0">
        <!-- Slot end, before the loading, clear and chevron controls -->
        <span v-if="$slots.end" class="flex items-center text-ousi-muted">
          <slot name="end" />
        </span>
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
      :style="[floatingStyles, { zIndex }]"
    >
      <AnimatePresence>
        <Motion
          tag="div"
          :class="autocompletePopoverTheme"
          :initial="{ opacity: 0, scale: 0.95, y: -4 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.95 }"
          :transition="{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }"
          @mousedown.prevent
        >
          <component
            :is="scrollShadow ? OScrollShadow : 'div'"
            :class="[
              'max-h-60',
              !scrollShadow && 'overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            ]"
            v-bind="scrollShadow ? { size: 24 } : {}"
          >
            <ul
              :id="listboxId"
              role="listbox"
              :aria-label="label ?? (attrs['aria-label'] as string | undefined) ?? ousiText.options"
              :aria-multiselectable="multiple || undefined"
              :class="autocompleteListboxTheme"
            >
              <li
                v-for="(option, index) in filteredOptions"
                :id="optionId(index)"
                :key="option.value"
                role="option"
                :aria-selected="isSelected(option.value)"
                :aria-disabled="option.disabled || undefined"
                :data-disabled="option.disabled || undefined"
                :class="autocompleteOptionTheme({ selected: isSelected(option.value) || undefined, focused: focusedIndex === index || undefined })"
                @click="selectOption(option)"
                @mouseenter="focusedIndex = index"
              >
                <slot name="option" :option="option" :selected="isSelected(option.value)">
                  <span class="flex-1">{{ option.label }}</span>
                </slot>
                <svg
                  v-if="isSelected(option.value)"
                  class="size-3.5 shrink-0 text-ousi-accent"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                >
                  <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </li>

              <li
                v-if="customRow"
                :id="optionId(filteredOptions.length)"
                data-part="add-custom"
                role="option"
                aria-selected="false"
                :class="autocompleteOptionTheme({ focused: focusedIndex === filteredOptions.length || undefined })"
                @click="addCustom"
                @mouseenter="focusedIndex = filteredOptions.length"
              >
                <svg class="size-3.5 shrink-0 text-ousi-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span class="min-w-0 flex-1 truncate">{{ ousiText.addValue.replace('{value}', customRow) }}</span>
              </li>

              <li v-if="rowCount === 0" :class="autocompleteEmptyTheme" role="option" aria-disabled="true">
                {{ isLoading ? ousiText.loading : resolvedEmptyMessage }}
              </li>
            </ul>
          </component>
        </Motion>
      </AnimatePresence>
    </div>
  </Teleport>
</template>
