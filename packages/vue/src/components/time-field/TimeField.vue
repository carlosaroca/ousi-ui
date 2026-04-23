<script setup lang="ts">
import { ref, computed, watch, toRef, nextTick } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import {
  dateFieldWrapperTheme,
  dateFieldSegmentTheme,
  dateFieldLiteralTheme,
  dateFieldPlaceholderTheme,
} from '../date-field/date-field.theme'
import type {
  TimeFieldProps,
  TimeFieldEmits,
  TimeFieldValue,
  TimeSegment,
  TimeSegmentType,
} from './time-field.types'

const props = withDefaults(defineProps<TimeFieldProps>(), {
  hour12: false,
  granularity: 'minute',
  disabled: false,
  readOnly: false,
  shadow: 'xs',
  animated: false,
})

const emit = defineEmits<TimeFieldEmits>()

const value = useControllableState<TimeFieldValue | null>({
  prop: toRef(props, 'modelValue') as any,
  defaultValue: props.defaultValue ?? null,
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

const filledSegments = ref<Set<string>>(new Set(
  props.modelValue || props.defaultValue ? ['hour', 'minute', 'second'] : []
))
const focusedIndex = ref<number>(-1)
const segmentRefs = ref<(HTMLElement | null)[]>([])

// Internal state
const internalHour = ref(value.value?.hour ?? 0)
const internalMinute = ref(value.value?.minute ?? 0)
const internalSecond = ref(value.value?.second ?? 0)
const internalPeriod = ref<'AM' | 'PM'>(
  value.value && value.value.hour >= 12 ? 'PM' : 'AM'
)

watch(value, (v) => {
  if (v) {
    internalHour.value = v.hour
    internalMinute.value = v.minute
    internalSecond.value = v.second ?? 0
    internalPeriod.value = v.hour >= 12 ? 'PM' : 'AM'
    filledSegments.value = new Set(['hour', 'minute', 'second'])
  }
})

const segmentOrder = computed(() => {
  const segments: TimeSegment[] = []
  const showSeconds = props.granularity === 'second'

  segments.push({ type: 'hour', text: '', placeholder: props.hour12 ? 'hh' : 'HH', value: undefined })
  segments.push({ type: 'literal', text: ':', placeholder: ':' })
  segments.push({ type: 'minute', text: '', placeholder: 'mm', value: undefined })

  if (showSeconds) {
    segments.push({ type: 'literal', text: ':', placeholder: ':' })
    segments.push({ type: 'second', text: '', placeholder: 'ss', value: undefined })
  }

  if (props.hour12) {
    segments.push({ type: 'literal', text: ' ', placeholder: ' ' })
    segments.push({ type: 'dayPeriod', text: '', placeholder: 'AM', value: undefined })
  }

  return segments
})

const editableIndices = computed(() =>
  segmentOrder.value
    .map((seg, i) => (seg.type !== 'literal' ? i : -1))
    .filter((i) => i !== -1)
)

function displayHour(h: number): number {
  if (!props.hour12) return h
  if (h === 0) return 12
  if (h > 12) return h - 12
  return h
}

function getSegmentValue(type: TimeSegmentType): string {
  if (type === 'dayPeriod') return internalPeriod.value
  if (!filledSegments.value.has(type)) return ''
  if (type === 'hour') return String(displayHour(internalHour.value)).padStart(2, '0')
  if (type === 'minute') return String(internalMinute.value).padStart(2, '0')
  if (type === 'second') return String(internalSecond.value).padStart(2, '0')
  return ''
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val))
}

function getMinMax(type: TimeSegmentType): [number, number] {
  if (type === 'hour') return props.hour12 ? [1, 12] : [0, 23]
  if (type === 'minute') return [0, 59]
  if (type === 'second') return [0, 59]
  return [0, 0]
}

function setSegmentValue(type: TimeSegmentType, val: number | string) {
  if (type === 'dayPeriod') {
    const newPeriod = val as 'AM' | 'PM'
    if (newPeriod !== internalPeriod.value) {
      internalPeriod.value = newPeriod
      // Adjust hour: if switching to PM add 12, to AM subtract 12
      if (newPeriod === 'PM' && internalHour.value < 12) {
        internalHour.value += 12
      } else if (newPeriod === 'AM' && internalHour.value >= 12) {
        internalHour.value -= 12
      }
    }
    emitIfComplete()
    return
  }

  const [min, max] = getMinMax(type)
  const clamped = clamp(val as number, min, max)
  filledSegments.value.add(type)

  if (type === 'hour') {
    if (props.hour12) {
      // Convert display hour back to 24h
      let h24 = clamped
      if (internalPeriod.value === 'PM' && h24 !== 12) h24 += 12
      if (internalPeriod.value === 'AM' && h24 === 12) h24 = 0
      internalHour.value = h24
    } else {
      internalHour.value = clamped
    }
  } else if (type === 'minute') {
    internalMinute.value = clamped
  } else if (type === 'second') {
    internalSecond.value = clamped
  }

  emitIfComplete()
}

function emitIfComplete() {
  const needed = props.granularity === 'second' ? ['hour', 'minute', 'second'] : ['hour', 'minute']
  if (needed.every((s) => filledSegments.value.has(s))) {
    value.value = {
      hour: internalHour.value,
      minute: internalMinute.value,
      ...(props.granularity === 'second' ? { second: internalSecond.value } : {}),
    }
  }
}

// Digit accumulator
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
  if (props.readOnly || props.disabled) return

  const seg = segmentOrder.value[idx]
  if (!seg || seg.type === 'literal') return

  const type = seg.type

  // Day period toggle
  if (type === 'dayPeriod') {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      setSegmentValue('dayPeriod', internalPeriod.value === 'AM' ? 'PM' : 'AM')
    } else if (e.key === 'a' || e.key === 'A') {
      e.preventDefault()
      setSegmentValue('dayPeriod', 'AM')
    } else if (e.key === 'p' || e.key === 'P') {
      e.preventDefault()
      setSegmentValue('dayPeriod', 'PM')
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      focusNext()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      focusPrev()
    } else if (e.key === 'Tab') {
      handleTab(e, idx)
    }
    return
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault()
    const current = filledSegments.value.has(type)
      ? (type === 'hour' ? displayHour(internalHour.value) : type === 'minute' ? internalMinute.value : internalSecond.value)
      : getMinMax(type)[0]
    const [min, max] = getMinMax(type)
    setSegmentValue(type, current + 1 > max ? min : current + 1)
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    const current = filledSegments.value.has(type)
      ? (type === 'hour' ? displayHour(internalHour.value) : type === 'minute' ? internalMinute.value : internalSecond.value)
      : getMinMax(type)[1]
    const [min, max] = getMinMax(type)
    setSegmentValue(type, current - 1 < min ? max : current - 1)
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    focusNext()
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    focusPrev()
  } else if (e.key === 'Tab') {
    handleTab(e, idx)
  } else if (e.key === 'Backspace') {
    e.preventDefault()
    digitBuf.value = ''
    filledSegments.value.delete(type)
    const needed = props.granularity === 'second' ? ['hour', 'minute', 'second'] : ['hour', 'minute']
    if (!needed.some((s) => filledSegments.value.has(s))) {
      value.value = null
    }
  } else if (/^\d$/.test(e.key)) {
    e.preventDefault()
    handleDigit(type as 'hour' | 'minute' | 'second', e.key)
  }
}

function handleTab(e: KeyboardEvent, idx: number) {
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
}

function handleDigit(type: 'hour' | 'minute' | 'second', digit: string) {
  if (digitTimer.value) clearTimeout(digitTimer.value)

  digitBuf.value += digit
  const num = parseInt(digitBuf.value, 10)

  if (digitBuf.value.length >= 2) {
    setSegmentValue(type, num)
    digitBuf.value = ''
    nextTick(() => focusNext())
    return
  }

  const [, max] = getMinMax(type)
  if (num * 10 > max) {
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
</script>

<template>
  <div
    :class="cn(dateFieldWrapperTheme({ shadow, animated }), 'gap-0 px-3 py-2', props.class)"
    :data-disabled="disabled || undefined"
    role="group"
    :aria-label="label ?? 'Time field'"
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
        :aria-label="seg.type"
        @keydown="handleKeydown($event, idx)"
        @focus="handleFocus(idx)"
        @blur="handleBlur"
      >
        <template v-if="seg.type === 'dayPeriod'">
          {{ internalPeriod }}
        </template>
        <template v-else-if="filledSegments.has(seg.type)">
          {{ getSegmentValue(seg.type) }}
        </template>
        <span v-else :class="dateFieldPlaceholderTheme">{{ seg.placeholder }}</span>
      </span>
    </template>
  </div>
</template>
