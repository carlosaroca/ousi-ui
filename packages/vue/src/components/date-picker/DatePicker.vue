<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, toRef, nextTick } from 'vue'
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/vue'
import { AnimatePresence, Motion } from 'motion-v'
import { cn, useControllableState, useMounted, useEscapeKey, generateId } from '@ousi-ui/core'
import { OCalendar } from '../calendar'
import {
  dateFieldSegmentTheme,
  dateFieldLiteralTheme,
  dateFieldPlaceholderTheme,
} from '../date-field/date-field.theme'
import {
  datePickerWrapperTheme,
  datePickerTriggerTheme,
  datePickerIndicatorTheme,
  datePickerPopoverTheme,
  datePickerLabelTheme,
  datePickerDescriptionTheme,
  datePickerErrorTheme,
} from './date-picker.theme'
import type { DatePickerProps, DatePickerEmits } from './date-picker.types'
import type { DateFieldValue } from '../date-field/date-field.types'
import type { Segment, SegmentType } from '../date-field/date-field.types'

const props = withDefaults(defineProps<DatePickerProps>(), {
  locale: 'en-US',
  showOutsideDays: true,
  placement: 'bottom-start',
  disabled: false,
  readonly: false,
  required: false,
  fullWidth: false,
})

const emit = defineEmits<DatePickerEmits>()

// ── Accessible IDs ──
const fieldId = `dp-${generateId()}`
const descId = `dp-desc-${generateId()}`
const errorId = `dp-err-${generateId()}`

const isMounted = useMounted()
const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const popoverRef = ref<HTMLElement | null>(null)

// ── Controlled value ──
const value = useControllableState<DateFieldValue | null>({
  prop: toRef(props, 'modelValue') as any,
  defaultValue: props.defaultValue ?? null,
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

// ── Segment logic (inlined from DateField) ──
const filledSegments = ref<Set<string>>(
  new Set(props.modelValue || props.defaultValue ? ['year', 'month', 'day'] : []),
)
const focusedIndex = ref<number>(-1)
const segmentRefs = ref<(HTMLElement | null)[]>([])

const segmentOrder = computed(() => {
  try {
    const fmt = new Intl.DateTimeFormat(props.locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    const parts = fmt.formatToParts(new Date(2000, 0, 15))
    const segments: Segment[] = []
    for (const part of parts) {
      if (part.type === 'year') {
        segments.push({ type: 'year', text: '', placeholder: 'yyyy', value: undefined })
      } else if (part.type === 'month') {
        segments.push({ type: 'month', text: '', placeholder: 'mm', value: undefined })
      } else if (part.type === 'day') {
        segments.push({ type: 'day', text: '', placeholder: 'dd', value: undefined })
      } else if (part.type === 'literal') {
        segments.push({ type: 'literal', text: part.value, placeholder: part.value })
      }
    }
    return segments
  } catch {
    return [
      { type: 'month' as SegmentType, text: '', placeholder: 'mm', value: undefined },
      { type: 'literal' as SegmentType, text: '/', placeholder: '/' },
      { type: 'day' as SegmentType, text: '', placeholder: 'dd', value: undefined },
      { type: 'literal' as SegmentType, text: '/', placeholder: '/' },
      { type: 'year' as SegmentType, text: '', placeholder: 'yyyy', value: undefined },
    ]
  }
})

const editableIndices = computed(() =>
  segmentOrder.value
    .map((seg, i) => (seg.type !== 'literal' ? i : -1))
    .filter((i) => i !== -1),
)

const internalYear = ref(value.value?.year ?? new Date().getFullYear())
const internalMonth = ref(value.value?.month ?? new Date().getMonth() + 1)
const internalDay = ref(value.value?.day ?? new Date().getDate())

watch(value, (v) => {
  if (v) {
    internalYear.value = v.year
    internalMonth.value = v.month
    internalDay.value = v.day
    filledSegments.value = new Set(['year', 'month', 'day'])
  }
})

function getSegmentValue(type: SegmentType): string {
  if (!filledSegments.value.has(type)) return ''
  if (type === 'year') return String(internalYear.value).padStart(4, '0')
  if (type === 'month') return String(internalMonth.value).padStart(2, '0')
  if (type === 'day') return String(internalDay.value).padStart(2, '0')
  return ''
}

function daysInMonth(y: number, m: number): number {
  return new Date(y, m, 0).getDate()
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val))
}

function getMinMax(type: SegmentType): [number, number] {
  if (type === 'year') return [1, 9999]
  if (type === 'month') return [1, 12]
  if (type === 'day') return [1, daysInMonth(internalYear.value, internalMonth.value)]
  return [0, 0]
}

function setSegmentValue(type: SegmentType, val: number) {
  const [min, max] = getMinMax(type)
  const clamped = clamp(val, min, max)
  filledSegments.value.add(type)

  if (type === 'year') internalYear.value = clamped
  else if (type === 'month') internalMonth.value = clamped
  else if (type === 'day') internalDay.value = clamped

  if (type === 'month' || type === 'year') {
    const maxDay = daysInMonth(internalYear.value, internalMonth.value)
    if (internalDay.value > maxDay) internalDay.value = maxDay
  }

  emitIfComplete()
}

function emitIfComplete() {
  const needed = ['year', 'month', 'day']
  if (needed.every((s) => filledSegments.value.has(s))) {
    value.value = {
      year: internalYear.value,
      month: internalMonth.value,
      day: internalDay.value,
    }
  }
}

const digitBuf = ref('')
const digitTimer = ref<ReturnType<typeof setTimeout> | null>(null)

function focusSegment(idx: number) {
  focusedIndex.value = idx
  digitBuf.value = ''
  nextTick(() => segmentRefs.value[idx]?.focus())
}

function focusNext() {
  const ei = editableIndices.value
  const cur = ei.indexOf(focusedIndex.value)
  if (cur < ei.length - 1) focusSegment(ei[cur + 1])
}

function focusPrev() {
  const ei = editableIndices.value
  const cur = ei.indexOf(focusedIndex.value)
  if (cur > 0) focusSegment(ei[cur - 1])
}

function handleKeydown(e: KeyboardEvent, idx: number) {
  if (props.readonly || props.disabled) return

  const seg = segmentOrder.value[idx]
  if (!seg || seg.type === 'literal') return

  const type = seg.type as 'year' | 'month' | 'day'

  if (e.key === 'ArrowUp') {
    e.preventDefault()
    const current = filledSegments.value.has(type)
      ? (type === 'year' ? internalYear.value : type === 'month' ? internalMonth.value : internalDay.value)
      : getMinMax(type)[0]
    setSegmentValue(type, current + 1 > getMinMax(type)[1] ? getMinMax(type)[0] : current + 1)
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    const current = filledSegments.value.has(type)
      ? (type === 'year' ? internalYear.value : type === 'month' ? internalMonth.value : internalDay.value)
      : getMinMax(type)[1]
    setSegmentValue(type, current - 1 < getMinMax(type)[0] ? getMinMax(type)[1] : current - 1)
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    focusNext()
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    focusPrev()
  } else if (e.key === 'Tab') {
    const ei = editableIndices.value
    const cur = ei.indexOf(idx)
    if (!e.shiftKey && cur < ei.length - 1) {
      e.preventDefault()
      focusNext()
    } else if (e.shiftKey && cur > 0) {
      e.preventDefault()
      focusPrev()
    } else {
      focusedIndex.value = -1
    }
  } else if (e.key === 'Backspace') {
    e.preventDefault()
    digitBuf.value = ''
    filledSegments.value.delete(type)
    if (!['year', 'month', 'day'].some((s) => filledSegments.value.has(s))) {
      value.value = null
    }
  } else if (/^\d$/.test(e.key)) {
    e.preventDefault()
    handleDigit(type, e.key)
  }
}

function handleDigit(type: 'year' | 'month' | 'day', digit: string) {
  if (digitTimer.value) clearTimeout(digitTimer.value)

  digitBuf.value += digit
  const maxLen = type === 'year' ? 4 : 2
  const num = parseInt(digitBuf.value, 10)

  if (digitBuf.value.length >= maxLen) {
    setSegmentValue(type, num)
    digitBuf.value = ''
    nextTick(() => focusNext())
    return
  }

  const [, max] = getMinMax(type)
  if (num * 10 > max && type !== 'year') {
    setSegmentValue(type, num)
    digitBuf.value = ''
    nextTick(() => focusNext())
    return
  }

  setSegmentValue(type, num)

  digitTimer.value = setTimeout(() => {
    digitBuf.value = ''
  }, 1000)
}

function handleSegmentFocus(idx: number) {
  focusedIndex.value = idx
  digitBuf.value = ''
}

function handleSegmentBlur() {
  focusedIndex.value = -1
  digitBuf.value = ''
}

function setSegmentRef(el: any, idx: number) {
  segmentRefs.value[idx] = el
}

// ── Floating UI ──
const { floatingStyles } = useFloating(triggerRef, popoverRef, {
  placement: computed(() => props.placement),
  strategy: 'fixed',
  whileElementsMounted: autoUpdate,
  middleware: [offset(4), flip(), shift({ padding: 8 })],
})

// ── Open / close ──
function open() {
  if (props.disabled || props.readonly) return
  isOpen.value = true
}

function close() {
  isOpen.value = false
  triggerRef.value?.focus()
}

function toggle() {
  isOpen.value ? close() : open()
}

useEscapeKey({ handler: () => { if (isOpen.value) close() }, enabled: isOpen })

function handleClickOutside(e: MouseEvent) {
  const t = e.target as Node
  if (!triggerRef.value?.contains(t) && !popoverRef.value?.contains(t)) {
    close()
  }
}

watch(isOpen, (v) => {
  if (v) document.addEventListener('pointerdown', handleClickOutside, true)
  else document.removeEventListener('pointerdown', handleClickOutside, true)
})
onBeforeUnmount(() => document.removeEventListener('pointerdown', handleClickOutside, true))

// Calendar selection → update value and close popover
function handleCalendarSelect(date: DateFieldValue | null) {
  value.value = date
  if (date) {
    setTimeout(close, 120)
  }
}

const isInvalid = computed(() => !!props.errorMessage)
const describedBy = computed(() =>
  isInvalid.value ? errorId : props.description ? descId : undefined,
)
</script>

<template>
  <div :class="cn(datePickerWrapperTheme({ fullWidth }), props.class)">
    <!-- Label -->
    <label
      v-if="label"
      :for="fieldId"
      :class="datePickerLabelTheme({ required, disabled, invalid: isInvalid })"
    >
      {{ label }}
    </label>

    <!-- Trigger — single unified field: segments + calendar icon, ONE border -->
    <div
      ref="triggerRef"
      :id="fieldId"
      :class="datePickerTriggerTheme"
      :data-disabled="disabled || undefined"
      :data-invalid="isInvalid || undefined"
      :aria-describedby="describedBy"
      role="group"
      :aria-label="label ?? 'Date picker'"
      tabindex="-1"
    >
      <!-- Date segments rendered directly -->
      <template v-for="(seg, idx) in segmentOrder" :key="idx">
        <span v-if="seg.type === 'literal'" :class="dateFieldLiteralTheme">
          {{ seg.text }}
        </span>
        <span
          v-else
          :ref="(el) => setSegmentRef(el, idx)"
          :class="dateFieldSegmentTheme(focusedIndex === idx)"
          role="spinbutton"
          tabindex="0"
          :aria-label="seg.type"
          :aria-valuenow="filledSegments.has(seg.type) ? (seg.type === 'year' ? internalYear : seg.type === 'month' ? internalMonth : internalDay) : undefined"
          :aria-valuemin="getMinMax(seg.type)[0]"
          :aria-valuemax="getMinMax(seg.type)[1]"
          @keydown="handleKeydown($event, idx)"
          @focus="handleSegmentFocus(idx)"
          @blur="handleSegmentBlur"
        >
          <template v-if="filledSegments.has(seg.type)">
            {{ getSegmentValue(seg.type) }}
          </template>
          <span v-else :class="dateFieldPlaceholderTheme">{{ seg.placeholder }}</span>
        </span>
      </template>

      <!-- Spacer to push icon right -->
      <span class="flex-1" />

      <!-- Calendar icon button -->
      <button
        type="button"
        :class="datePickerIndicatorTheme"
        aria-label="Open calendar"
        :aria-expanded="isOpen"
        aria-haspopup="dialog"
        :disabled="disabled || readonly"
        tabindex="-1"
        @click.stop="toggle"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-4"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>
    </div>

    <!-- Description -->
    <p
      v-if="description && !errorMessage"
      :id="descId"
      :class="datePickerDescriptionTheme"
    >
      {{ description }}
    </p>

    <!-- Error -->
    <p
      v-if="errorMessage"
      :id="errorId"
      :class="datePickerErrorTheme"
      role="alert"
      aria-live="polite"
    >
      {{ errorMessage }}
    </p>
  </div>

  <!-- Popover with Calendar -->
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
          :class="datePickerPopoverTheme"
          :style="{ borderRadius: 'calc(var(--ousi-radius, 0.5rem) * 2.5)' }"
          :initial="{ opacity: 0, scale: 0.95, y: -4 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.95 }"
          :transition="{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }"
          role="dialog"
          :aria-label="label ?? 'Calendar'"
          aria-modal="true"
        >
          <OCalendar
            :model-value="value"
            :locale="locale"
            :min-value="minValue"
            :max-value="maxValue"
            :unavailable-dates="unavailableDates"
            :show-outside-days="showOutsideDays"
            show-year-picker
            @update:model-value="handleCalendarSelect"
          />
        </Motion>
      </AnimatePresence>
    </div>
  </Teleport>
</template>
