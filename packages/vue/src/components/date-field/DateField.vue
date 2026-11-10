<script setup lang="ts">
import { ref, computed, watch, toRef, nextTick } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import { useOusiConfig, useOusiMessages } from '../../config'
import {
  dateFieldWrapperTheme,
  dateFieldSegmentTheme,
  dateFieldLiteralTheme,
  dateFieldPlaceholderTheme,
} from './date-field.theme'
import { fieldFocus, firstSegment } from '../shared/field-attrs'
import type {
  DateFieldProps,
  DateFieldEmits,
  DateFieldValue,
  Segment,
  SegmentType,
} from './date-field.types'

const ousiText = useOusiMessages()

const props = withDefaults(defineProps<DateFieldProps>(), {
  granularity: 'day',
  disabled: false,
  readOnly: false,
  variant: 'primary',
  size: 'md',
  shadow: 'xs',
  animated: false,
})

const config = useOusiConfig()
const effectiveLocale = computed(() => props.locale ?? config.locale.value)

const emit = defineEmits<DateFieldEmits>()

const value = useControllableState<DateFieldValue | null>({
  prop: toRef(props, 'modelValue') as any,
  defaultValue: props.defaultValue ?? null,
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

// Track which segments have been set by the user
const filledSegments = ref<Set<string>>(new Set(props.modelValue || props.defaultValue ? ['year', 'month', 'day'] : []))
const focusedIndex = ref<number>(-1)
const segmentRefs = ref<(HTMLElement | null)[]>([])

// Resolve the segment ordering from Intl
const segmentOrder = computed(() => {
  const granularity = props.granularity
  try {
    const fmt = new Intl.DateTimeFormat(effectiveLocale.value, {
      year: 'numeric',
      month: granularity === 'year' ? undefined : '2-digit',
      day: granularity === 'day' ? '2-digit' : undefined,
    })
    const parts = fmt.formatToParts(new Date(2000, 0, 15))
    const segments: Segment[] = []
    for (const part of parts) {
      if (part.type === 'year') {
        segments.push({ type: 'year', text: '', placeholder: props.placeholder?.year ?? ousiText.value.yearPlaceholder, value: undefined })
      } else if (part.type === 'month' && granularity !== 'year') {
        segments.push({ type: 'month', text: '', placeholder: props.placeholder?.month ?? ousiText.value.monthPlaceholder, value: undefined })
      } else if (part.type === 'day' && granularity === 'day') {
        segments.push({ type: 'day', text: '', placeholder: props.placeholder?.day ?? ousiText.value.dayPlaceholder, value: undefined })
      } else if (part.type === 'literal') {
        segments.push({ type: 'literal', text: part.value, placeholder: part.value })
      }
    }
    return segments
  } catch {
    // Fallback: yyyy/mm/dd
    const segs: Segment[] = [
      { type: 'year', text: '', placeholder: ousiText.value.yearPlaceholder, value: undefined },
    ]
    if (granularity !== 'year') {
      segs.push({ type: 'literal', text: '/', placeholder: '/' })
      segs.push({ type: 'month', text: '', placeholder: ousiText.value.monthPlaceholder, value: undefined })
    }
    if (granularity === 'day') {
      segs.push({ type: 'literal', text: '/', placeholder: '/' })
      segs.push({ type: 'day', text: '', placeholder: ousiText.value.dayPlaceholder, value: undefined })
    }
    return segs
  }
})

const editableIndices = computed(() =>
  segmentOrder.value
    .map((seg, i) => (seg.type !== 'literal' ? i : -1))
    .filter((i) => i !== -1)
)

// Internal working values
const internalYear = ref(value.value?.year ?? new Date().getFullYear())
const internalMonth = ref(value.value?.month ?? new Date().getMonth() + 1)
const internalDay = ref(value.value?.day ?? new Date().getDate())
// The day as typed: 31 over a November date stays 31 until the month or year say otherwise.
const typedDay = ref<number | null>(null)
let emitted: DateFieldValue | null = null

watch(value, (v) => {
  if (v) {
    const own = emitted && emitted.year === v.year && emitted.month === v.month && emitted.day === v.day
    if (!own) typedDay.value = null
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

function maxDay(): number {
  if (!filledSegments.value.has('month')) return 31
  return daysInMonth(filledSegments.value.has('year') ? internalYear.value : 2000, internalMonth.value)
}

function segmentLabel(type: SegmentType): string {
  if (type === 'year') return ousiText.value.year
  if (type === 'month') return ousiText.value.month
  if (type === 'day') return ousiText.value.day
  return ''
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val))
}

function getMinMax(type: SegmentType): [number, number] {
  if (type === 'year') return [1, 9999]
  if (type === 'month') return [1, 12]
  if (type === 'day') return [1, maxDay()]
  return [0, 0]
}

function setSegmentValue(type: SegmentType, val: number) {
  const [min, max] = type === 'day' ? [1, 31] : getMinMax(type)
  const clamped = clamp(val, min, max)
  filledSegments.value.add(type)

  if (type === 'year') internalYear.value = clamped
  else if (type === 'month') internalMonth.value = clamped
  else if (type === 'day') {
    typedDay.value = clamped
    internalDay.value = Math.min(clamped, maxDay())
  }

  // A month or year change fits the day to it, giving back the typed day when it fits again.
  if (type === 'month' || (type === 'year' && clamped >= 1000)) {
    if (filledSegments.value.has('day')) {
      internalDay.value = Math.min(typedDay.value ?? internalDay.value, maxDay())
    }
  }

  emitIfComplete()
}

function emitIfComplete() {
  const needed = props.granularity === 'day' ? ['year', 'month', 'day']
    : props.granularity === 'month' ? ['year', 'month']
    : ['year']
  if (needed.every((s) => filledSegments.value.has(s))) {
    emitted = {
      year: internalYear.value,
      month: internalMonth.value,
      day: props.granularity === 'day' ? internalDay.value : 1,
    }
    value.value = { ...emitted }
  }
}

// Digit accumulator for typing
const digitBuf = ref('')
const digitTimer = ref<ReturnType<typeof setTimeout> | null>(null)

function focusSegment(idx: number) {
  focusedIndex.value = idx
  digitBuf.value = ''
  nextTick(() => {
    segmentRefs.value[idx]?.focus()
  })
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
  if (props.readOnly || props.disabled) return

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
    // Natural tab behavior, but update focusedIndex
    const ei = editableIndices.value
    const cur = ei.indexOf(idx)
    if (!e.shiftKey && cur < ei.length - 1) {
      e.preventDefault()
      focusNext()
    } else if (e.shiftKey && cur > 0) {
      e.preventDefault()
      focusPrev()
    } else {
      // Let it leave the field
      focusedIndex.value = -1
    }
  } else if (e.key === 'Backspace') {
    e.preventDefault()
    digitBuf.value = ''
    filledSegments.value.delete(type)
    // If all cleared, emit null
    const needed = props.granularity === 'day' ? ['year', 'month', 'day']
      : props.granularity === 'month' ? ['year', 'month']
      : ['year']
    if (!needed.some((s) => filledSegments.value.has(s))) {
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
    // Auto-advance to next segment
    nextTick(() => focusNext())
    return
  }

  // Check if no more valid digits can follow
  // A day waits for its second digit up to 31, whatever month the field shows now.
  const max = type === 'day' ? 31 : getMinMax(type)[1]
  if (num * 10 > max && type !== 'year') {
    // e.g. typed "5" for month — max is 12, so 50 > 12, commit immediately
    setSegmentValue(type, num)
    digitBuf.value = ''
    nextTick(() => focusNext())
    return
  }

  // Temporarily show typed digits
  setSegmentValue(type, num)

  digitTimer.value = setTimeout(() => {
    digitBuf.value = ''
  }, 1000)
}

function handleFocus(idx: number) {
  focusedIndex.value = idx
  digitBuf.value = ''
}

function handleBlur() {
  focusedIndex.value = -1
  digitBuf.value = ''
}

function setRef(el: any, idx: number) {
  segmentRefs.value[idx] = el
}

const rootRef = ref<HTMLElement | null>(null)
defineExpose(fieldFocus(() => firstSegment(rootRef.value), () => rootRef.value))
</script>

<template>
  <div
    ref="rootRef"
    :class="cn(dateFieldWrapperTheme({ variant, size, shadow, animated }), props.class)"
    :data-disabled="disabled || undefined"
    role="group"
    :aria-label="label ?? ousiText.dateField"
  >
    <template v-for="(seg, idx) in segmentOrder" :key="idx">
      <!-- Literal separator -->
      <span v-if="seg.type === 'literal'" :class="dateFieldLiteralTheme">
        {{ seg.text }}
      </span>

      <!-- Editable segment -->
      <span
        v-else
        :ref="(el) => setRef(el, idx)"
        :class="dateFieldSegmentTheme(focusedIndex === idx)"
        role="spinbutton"
        tabindex="0"
        :aria-label="segmentLabel(seg.type)"
        :aria-valuenow="filledSegments.has(seg.type) ? (seg.type === 'year' ? internalYear : seg.type === 'month' ? internalMonth : internalDay) : undefined"
        :aria-valuemin="getMinMax(seg.type)[0]"
        :aria-valuemax="getMinMax(seg.type)[1]"
        @keydown="handleKeydown($event, idx)"
        @focus="handleFocus(idx)"
        @blur="handleBlur"
      >
        <template v-if="filledSegments.has(seg.type)">
          {{ getSegmentValue(seg.type) }}
        </template>
        <span v-else :class="dateFieldPlaceholderTheme">{{ seg.placeholder }}</span>
      </span>
    </template>
  </div>
</template>
