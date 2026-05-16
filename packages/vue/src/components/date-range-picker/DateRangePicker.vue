<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, toRef, nextTick, reactive } from 'vue'
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/vue'
import { AnimatePresence, Motion } from 'motion-v'
import { cn, useControllableState, useMounted, useEscapeKey, generateId } from '@ousi-ui/core'
import { useOusiConfig } from '../../config'
import { ORangeCalendar } from '../range-calendar'
import {
  dateFieldSegmentTheme,
  dateFieldLiteralTheme,
  dateFieldPlaceholderTheme,
} from '../date-field/date-field.theme'
import {
  dateRangePickerWrapperTheme,
  dateRangePickerTriggerTheme,
  dateRangePickerSeparatorTheme,
  dateRangePickerIndicatorTheme,
  dateRangePickerPopoverTheme,
  dateRangePickerLabelTheme,
  dateRangePickerDescriptionTheme,
  dateRangePickerErrorTheme,
} from './date-range-picker.theme'
import type { DateRangePickerProps, DateRangePickerEmits, DateRangeValue } from './date-range-picker.types'
import type { DateFieldValue } from '../date-field/date-field.types'
import type { Segment, SegmentType } from '../date-field/date-field.types'

const props = withDefaults(defineProps<DateRangePickerProps>(), {
  showOutsideDays: true,
  placement: 'bottom-start',
  disabled: false,
  readonly: false,
  required: false,
  variant: 'primary',
  size: 'md',
  shadow: 'xs',
  animated: false,
})

const config = useOusiConfig()
const effectiveLocale = computed(() => props.locale ?? config.locale.value)

const emit = defineEmits<DateRangePickerEmits>()

// ── Accessible IDs ──
const fieldId = `drp-${generateId()}`
const descId = `drp-desc-${generateId()}`
const errorId = `drp-err-${generateId()}`

const isMounted = useMounted()
const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const popoverRef = ref<HTMLElement | null>(null)

// ── Controlled value ──
const value = useControllableState<DateRangeValue | null>({
  prop: toRef(props, 'modelValue') as any,
  defaultValue: props.defaultValue ?? null,
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

// ── Segment ordering from Intl (shared by start and end) ──
const segmentOrder = computed(() => {
  try {
    const fmt = new Intl.DateTimeFormat(effectiveLocale.value, {
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

const editableIndicesPerSide = computed(() =>
  segmentOrder.value
    .map((seg, i) => (seg.type !== 'literal' ? i : -1))
    .filter((i) => i !== -1),
)

// ── Segment state for start and end ──
// We use a "side" concept: 'start' | 'end'. Each side has its own filled set and internal values.
// The global focusedKey tracks which segment across both sides is focused: `${side}-${idx}`

interface SideState {
  filled: Set<string>
  year: number
  month: number
  day: number
}

function initSide(val: DateFieldValue | null | undefined): SideState {
  const now = new Date()
  return reactive({
    filled: new Set<string>(val ? ['year', 'month', 'day'] : []),
    year: val?.year ?? now.getFullYear(),
    month: val?.month ?? now.getMonth() + 1,
    day: val?.day ?? now.getDate(),
  })
}

const startState = initSide(props.modelValue?.start ?? props.defaultValue?.start)
const endState = initSide(props.modelValue?.end ?? props.defaultValue?.end)

// Sync external value → internal state (including external clear via v-model = null)
watch(value, (v) => {
  if (v?.start) {
    startState.year = v.start.year
    startState.month = v.start.month
    startState.day = v.start.day
    startState.filled = new Set(['year', 'month', 'day'])
  } else {
    startState.filled = new Set()
  }
  if (v?.end) {
    endState.year = v.end.year
    endState.month = v.end.month
    endState.day = v.end.day
    endState.filled = new Set(['year', 'month', 'day'])
  } else {
    endState.filled = new Set()
  }
})

// Focus tracking: `start-0`, `start-2`, `end-0`, etc.
const focusedKey = ref<string>('')
const segmentRefs = ref<Record<string, HTMLElement | null>>({})

function setSegmentRef(el: any, side: 'start' | 'end', idx: number) {
  segmentRefs.value[`${side}-${idx}`] = el
}

function getSide(side: 'start' | 'end'): SideState {
  return side === 'start' ? startState : endState
}

// ── Segment helpers ──
function daysInMonth(y: number, m: number): number {
  return new Date(y, m, 0).getDate()
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val))
}

function getMinMax(side: 'start' | 'end', type: SegmentType): [number, number] {
  const s = getSide(side)
  if (type === 'year') return [1, 9999]
  if (type === 'month') return [1, 12]
  if (type === 'day') return [1, daysInMonth(s.year, s.month)]
  return [0, 0]
}

function getSegmentDisplay(side: 'start' | 'end', type: SegmentType): string {
  const s = getSide(side)
  if (!s.filled.has(type)) return ''
  if (type === 'year') return String(s.year).padStart(4, '0')
  if (type === 'month') return String(s.month).padStart(2, '0')
  if (type === 'day') return String(s.day).padStart(2, '0')
  return ''
}

function getSegmentNow(side: 'start' | 'end', type: SegmentType): number | undefined {
  const s = getSide(side)
  if (!s.filled.has(type)) return undefined
  if (type === 'year') return s.year
  if (type === 'month') return s.month
  if (type === 'day') return s.day
  return undefined
}

function setSegmentValue(side: 'start' | 'end', type: SegmentType, val: number) {
  const s = getSide(side)
  const [min, max] = getMinMax(side, type)
  const clamped = clamp(val, min, max)
  s.filled.add(type)

  if (type === 'year') s.year = clamped
  else if (type === 'month') s.month = clamped
  else if (type === 'day') s.day = clamped

  if (type === 'month' || type === 'year') {
    const maxDay = daysInMonth(s.year, s.month)
    if (s.day > maxDay) s.day = maxDay
  }

  emitIfComplete()
}

function emitIfComplete() {
  const needed = ['year', 'month', 'day']
  const startOk = needed.every((k) => startState.filled.has(k))
  const endOk = needed.every((k) => endState.filled.has(k))

  if (startOk && endOk) {
    value.value = {
      start: { year: startState.year, month: startState.month, day: startState.day },
      end: { year: endState.year, month: endState.month, day: endState.day },
    }
  } else if (startOk && !endOk) {
    value.value = {
      start: { year: startState.year, month: startState.month, day: startState.day },
      end: null,
    }
  } else if (!startOk && endOk) {
    value.value = {
      start: null,
      end: { year: endState.year, month: endState.month, day: endState.day },
    }
  }
}

// ── Navigation across both sides ──
// Build a flat list of all focusable keys: start-0, start-2, start-4, end-0, end-2, end-4
const allEditableKeys = computed(() => {
  const keys: string[] = []
  for (const idx of editableIndicesPerSide.value) {
    keys.push(`start-${idx}`)
  }
  for (const idx of editableIndicesPerSide.value) {
    keys.push(`end-${idx}`)
  }
  return keys
})

function focusKey(key: string) {
  focusedKey.value = key
  digitBuf.value = ''
  nextTick(() => segmentRefs.value[key]?.focus())
}

function focusNextGlobal() {
  const keys = allEditableKeys.value
  const cur = keys.indexOf(focusedKey.value)
  if (cur < keys.length - 1) focusKey(keys[cur + 1])
}

function focusPrevGlobal() {
  const keys = allEditableKeys.value
  const cur = keys.indexOf(focusedKey.value)
  if (cur > 0) focusKey(keys[cur - 1])
}

// ── Digit accumulator ──
const digitBuf = ref('')
const digitTimer = ref<ReturnType<typeof setTimeout> | null>(null)

function handleKeydown(e: KeyboardEvent, side: 'start' | 'end', idx: number) {
  if (props.readonly || props.disabled) return

  const seg = segmentOrder.value[idx]
  if (!seg || seg.type === 'literal') return

  const type = seg.type as 'year' | 'month' | 'day'
  const s = getSide(side)

  if (e.key === 'ArrowUp') {
    e.preventDefault()
    const current = s.filled.has(type)
      ? (type === 'year' ? s.year : type === 'month' ? s.month : s.day)
      : getMinMax(side, type)[0]
    const [min, max] = getMinMax(side, type)
    setSegmentValue(side, type, current + 1 > max ? min : current + 1)
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    const current = s.filled.has(type)
      ? (type === 'year' ? s.year : type === 'month' ? s.month : s.day)
      : getMinMax(side, type)[1]
    const [min, max] = getMinMax(side, type)
    setSegmentValue(side, type, current - 1 < min ? max : current - 1)
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    focusNextGlobal()
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    focusPrevGlobal()
  } else if (e.key === 'Tab') {
    const keys = allEditableKeys.value
    const cur = keys.indexOf(focusedKey.value)
    if (!e.shiftKey && cur < keys.length - 1) {
      e.preventDefault()
      focusNextGlobal()
    } else if (e.shiftKey && cur > 0) {
      e.preventDefault()
      focusPrevGlobal()
    } else {
      focusedKey.value = ''
    }
  } else if (e.key === 'Backspace') {
    e.preventDefault()
    digitBuf.value = ''
    s.filled.delete(type)
    const needed = ['year', 'month', 'day']
    if (!needed.some((k) => startState.filled.has(k)) && !needed.some((k) => endState.filled.has(k))) {
      value.value = null
    }
  } else if (/^\d$/.test(e.key)) {
    e.preventDefault()
    handleDigit(side, type, e.key)
  }
}

function handleDigit(side: 'start' | 'end', type: 'year' | 'month' | 'day', digit: string) {
  if (digitTimer.value) clearTimeout(digitTimer.value)

  digitBuf.value += digit
  const maxLen = type === 'year' ? 4 : 2
  const num = parseInt(digitBuf.value, 10)

  if (digitBuf.value.length >= maxLen) {
    setSegmentValue(side, type, num)
    digitBuf.value = ''
    nextTick(() => focusNextGlobal())
    return
  }

  const [, max] = getMinMax(side, type)
  if (num * 10 > max && type !== 'year') {
    setSegmentValue(side, type, num)
    digitBuf.value = ''
    nextTick(() => focusNextGlobal())
    return
  }

  setSegmentValue(side, type, num)

  digitTimer.value = setTimeout(() => {
    digitBuf.value = ''
  }, 1000)
}

function handleSegmentFocus(side: 'start' | 'end', idx: number) {
  focusedKey.value = `${side}-${idx}`
  digitBuf.value = ''
}

function handleSegmentBlur() {
  focusedKey.value = ''
  digitBuf.value = ''
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

// ── Calendar selection ──
function handleRangeChange(range: { start: DateFieldValue | null; end: DateFieldValue | null } | null) {
  value.value = range
  if (range?.start && range?.end) {
    setTimeout(close, 150)
  }
}

// Convert value to the shape ORangeCalendar expects
const calendarRange = computed(() => {
  if (!value.value) return null
  return {
    start: value.value.start,
    end: value.value.end,
  }
})

const isInvalid = computed(() => !!props.errorMessage)
const describedBy = computed(() =>
  isInvalid.value ? errorId : props.description ? descId : undefined,
)
</script>

<template>
  <div :class="cn(dateRangePickerWrapperTheme, props.class)">
    <!-- Label -->
    <label
      v-if="label"
      :for="fieldId"
      :class="dateRangePickerLabelTheme({ required, disabled, invalid: isInvalid })"
    >
      {{ label }}
    </label>

    <!-- Trigger — single unified field: start segments + → + end segments + icon -->
    <div
      ref="triggerRef"
      :id="fieldId"
      :class="dateRangePickerTriggerTheme({ variant, size, shadow, animated })"
      :data-disabled="disabled || undefined"
      :data-invalid="isInvalid || undefined"
      :aria-describedby="describedBy"
      role="group"
      :aria-label="label ?? 'Date range picker'"
      tabindex="-1"
    >
      <!-- Start date segments -->
      <template v-for="(seg, idx) in segmentOrder" :key="`start-${idx}`">
        <span v-if="seg.type === 'literal'" :class="dateFieldLiteralTheme">
          {{ seg.text }}
        </span>
        <span
          v-else
          :ref="(el) => setSegmentRef(el, 'start', idx)"
          :class="dateFieldSegmentTheme(focusedKey === `start-${idx}`)"
          role="spinbutton"
          tabindex="0"
          :aria-label="`Start ${seg.type}`"
          :aria-valuenow="getSegmentNow('start', seg.type)"
          :aria-valuemin="getMinMax('start', seg.type)[0]"
          :aria-valuemax="getMinMax('start', seg.type)[1]"
          @keydown="handleKeydown($event, 'start', idx)"
          @focus="handleSegmentFocus('start', idx)"
          @blur="handleSegmentBlur"
        >
          <template v-if="startState.filled.has(seg.type)">
            {{ getSegmentDisplay('start', seg.type) }}
          </template>
          <span v-else :class="dateFieldPlaceholderTheme">{{ seg.placeholder }}</span>
        </span>
      </template>

      <!-- Range separator -->
      <span :class="dateRangePickerSeparatorTheme" aria-hidden="true">→</span>

      <!-- End date segments -->
      <template v-for="(seg, idx) in segmentOrder" :key="`end-${idx}`">
        <span v-if="seg.type === 'literal'" :class="dateFieldLiteralTheme">
          {{ seg.text }}
        </span>
        <span
          v-else
          :ref="(el) => setSegmentRef(el, 'end', idx)"
          :class="dateFieldSegmentTheme(focusedKey === `end-${idx}`)"
          role="spinbutton"
          tabindex="0"
          :aria-label="`End ${seg.type}`"
          :aria-valuenow="getSegmentNow('end', seg.type)"
          :aria-valuemin="getMinMax('end', seg.type)[0]"
          :aria-valuemax="getMinMax('end', seg.type)[1]"
          @keydown="handleKeydown($event, 'end', idx)"
          @focus="handleSegmentFocus('end', idx)"
          @blur="handleSegmentBlur"
        >
          <template v-if="endState.filled.has(seg.type)">
            {{ getSegmentDisplay('end', seg.type) }}
          </template>
          <span v-else :class="dateFieldPlaceholderTheme">{{ seg.placeholder }}</span>
        </span>
      </template>

      <!-- Spacer to push icon right -->
      <span class="flex-1" />

      <!-- Calendar icon button -->
      <button
        type="button"
        :class="dateRangePickerIndicatorTheme"
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
      :class="dateRangePickerDescriptionTheme"
    >
      {{ description }}
    </p>

    <!-- Error -->
    <p
      v-if="errorMessage"
      :id="errorId"
      :class="dateRangePickerErrorTheme"
      role="alert"
      aria-live="polite"
    >
      {{ errorMessage }}
    </p>
  </div>

  <!-- Popover with RangeCalendar -->
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
          :class="dateRangePickerPopoverTheme"
          :style="{ borderRadius: 'calc(var(--ousi-radius, 0.5rem) * 2.5)' }"
          :initial="{ opacity: 0, scale: 0.95, y: -4 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.95 }"
          :transition="{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }"
          role="dialog"
          :aria-label="label ?? 'Date range calendar'"
          aria-modal="true"
        >
          <ORangeCalendar
            :model-value="calendarRange"
            :locale="effectiveLocale"
            :min-value="minValue"
            :max-value="maxValue"
            :unavailable-dates="unavailableDates"
            :show-outside-days="showOutsideDays"
            @update:model-value="handleRangeChange"
          />
        </Motion>
      </AnimatePresence>
    </div>
  </Teleport>
</template>
