import { computed, nextTick, ref, watch, type ComputedRef, type Ref } from 'vue'
import type { TimeFieldValue, TimeSegment, TimeSegmentType } from './time-field.types'

type Unit = 'hour' | 'minute' | 'second'

export interface UseTimeSegmentsOptions {
  /** Committed value: set once every shown unit is filled, null when all are cleared. */
  value: Ref<TimeFieldValue | null>
  hour12: ComputedRef<boolean>
  showMinutes: () => boolean
  showSeconds: () => boolean
  editable: () => boolean
}

/**
 * Keyboard-editable hour, minute, second and day period segments, shared by OTimeField and the
 * field of OTimePicker. Digits fill a segment and move on once it cannot take another digit;
 * arrows step it; `:` jumps to the next one; Backspace clears it.
 */
export function useTimeSegments(options: UseTimeSegmentsOptions) {
  const { value, hour12 } = options

  const filled = ref(new Set<string>(value.value ? ['hour', 'minute', 'second'] : []))
  const focusedIndex = ref(-1)
  const segmentRefs = ref<(HTMLElement | null)[]>([])

  const hour = ref(value.value?.hour ?? 0)
  const minute = ref(value.value?.minute ?? 0)
  const second = ref(value.value?.second ?? 0)
  const period = ref<'AM' | 'PM'>(value.value && value.value.hour >= 12 ? 'PM' : 'AM')

  watch(value, (v) => {
    if (!v) {
      filled.value = new Set()
      return
    }
    hour.value = v.hour
    minute.value = v.minute
    second.value = v.second ?? 0
    period.value = v.hour >= 12 ? 'PM' : 'AM'
    filled.value = new Set(['hour', 'minute', 'second'])
  })

  const segments = computed<TimeSegment[]>(() => {
    const literal = (text: string): TimeSegment => ({ type: 'literal', text, placeholder: text })
    const out: TimeSegment[] = [
      { type: 'hour', text: '', placeholder: hour12.value ? 'hh' : 'HH', value: undefined },
    ]
    if (options.showMinutes()) {
      out.push(literal(':'), { type: 'minute', text: '', placeholder: 'mm', value: undefined })
    }
    if (options.showSeconds()) {
      out.push(literal(':'), { type: 'second', text: '', placeholder: 'ss', value: undefined })
    }
    if (hour12.value) {
      out.push(literal(' '), { type: 'dayPeriod', text: '', placeholder: 'AM', value: undefined })
    }
    return out
  })

  const editableIndices = computed(() =>
    segments.value.map((seg, i) => (seg.type !== 'literal' ? i : -1)).filter((i) => i !== -1),
  )

  const neededUnits = computed<Unit[]>(() => [
    'hour',
    ...(options.showMinutes() ? (['minute'] as const) : []),
    ...(options.showSeconds() ? (['second'] as const) : []),
  ])

  function displayHour(h: number): number {
    if (!hour12.value) return h
    if (h === 0) return 12
    return h > 12 ? h - 12 : h
  }

  function range(type: TimeSegmentType): [number, number] {
    if (type === 'hour') return hour12.value ? [1, 12] : [0, 23]
    if (type === 'minute' || type === 'second') return [0, 59]
    return [0, 0]
  }

  /** The number a segment shows, or undefined while it is empty. */
  function segmentNumber(type: TimeSegmentType): number | undefined {
    if (!filled.value.has(type)) return undefined
    if (type === 'hour') return displayHour(hour.value)
    if (type === 'minute') return minute.value
    if (type === 'second') return second.value
    return undefined
  }

  function segmentText(type: TimeSegmentType): string {
    const n = segmentNumber(type)
    return n === undefined ? '' : String(n).padStart(2, '0')
  }

  function commit() {
    if (!neededUnits.value.every((u) => filled.value.has(u))) return
    value.value = {
      hour: hour.value,
      minute: options.showMinutes() ? minute.value : 0,
      ...(options.showSeconds() ? { second: second.value } : {}),
    }
  }

  function setPeriod(next: 'AM' | 'PM') {
    if (next === period.value) return
    period.value = next
    if (next === 'PM' && hour.value < 12) hour.value += 12
    else if (next === 'AM' && hour.value >= 12) hour.value -= 12
    commit()
  }

  function setUnit(type: Unit, raw: number) {
    const [min, max] = range(type)
    const n = Math.min(max, Math.max(min, raw))
    filled.value.add(type)
    if (type === 'hour') {
      if (hour12.value) {
        let h24 = n
        if (period.value === 'PM' && h24 !== 12) h24 += 12
        if (period.value === 'AM' && h24 === 12) h24 = 0
        hour.value = h24
      } else {
        hour.value = n
      }
    } else if (type === 'minute') {
      minute.value = n
    } else {
      second.value = n
    }
    commit()
  }

  const digitBuffer = ref('')
  let digitTimer: ReturnType<typeof setTimeout> | null = null

  function focusSegment(idx: number) {
    focusedIndex.value = idx
    digitBuffer.value = ''
    nextTick(() => segmentRefs.value[idx]?.focus())
  }

  function focusFirst() {
    const first = editableIndices.value[0]
    if (first !== undefined) focusSegment(first)
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

  function handleDigit(type: Unit, digit: string) {
    if (digitTimer) clearTimeout(digitTimer)
    digitBuffer.value += digit
    const n = parseInt(digitBuffer.value, 10)
    const [, max] = range(type)
    setUnit(type, n)
    if (digitBuffer.value.length >= 2 || n * 10 > max) {
      digitBuffer.value = ''
      nextTick(focusNext)
      return
    }
    digitTimer = setTimeout(() => {
      digitBuffer.value = ''
    }, 1000)
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

  function step(type: Unit, delta: 1 | -1) {
    const [min, max] = range(type)
    const current = segmentNumber(type) ?? (delta > 0 ? max : min)
    const next = current + delta
    setUnit(type, next > max ? min : next < min ? max : next)
  }

  function handleKeydown(e: KeyboardEvent, idx: number) {
    if (!options.editable()) return
    const seg = segments.value[idx]
    if (!seg || seg.type === 'literal') return

    if (e.key === 'ArrowRight' || e.key === ':' || e.key === '.') {
      e.preventDefault()
      focusNext()
      return
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      focusPrev()
      return
    }
    if (e.key === 'Tab') {
      handleTab(e, idx)
      return
    }

    if (seg.type === 'dayPeriod') {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault()
        setPeriod(period.value === 'AM' ? 'PM' : 'AM')
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault()
        setPeriod('AM')
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        setPeriod('PM')
      }
      return
    }

    const type = seg.type as Unit
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      step(type, 1)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      step(type, -1)
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault()
      digitBuffer.value = ''
      filled.value.delete(type)
      if (!neededUnits.value.some((u) => filled.value.has(u))) value.value = null
    } else if (/^\d$/.test(e.key)) {
      e.preventDefault()
      handleDigit(type, e.key)
    }
  }

  function handleFocus(idx: number) {
    focusedIndex.value = idx
    digitBuffer.value = ''
  }

  function handleBlur() {
    focusedIndex.value = -1
    digitBuffer.value = ''
  }

  function setRef(el: unknown, idx: number) {
    segmentRefs.value[idx] = el as HTMLElement | null
  }

  return {
    segments,
    filled,
    focusedIndex,
    period,
    range,
    segmentNumber,
    segmentText,
    focusFirst,
    handleKeydown,
    handleFocus,
    handleBlur,
    setRef,
  }
}
