<script setup lang="ts">
import { ref, computed, toRef } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import {
  rangeCalendarTheme,
  rangeCalendarHeaderTheme,
  rangeCalendarHeadingTheme,
  rangeCalendarNavButtonTheme,
  rangeCalendarGridTheme,
  rangeCalendarHeaderCellTheme,
  rangeCalendarCellTheme,
  rangeCalendarCellButtonTheme,
} from './range-calendar.theme'
import type { RangeCalendarProps, RangeCalendarEmits, CalendarDate, DateRange } from './range-calendar.types'

const props = withDefaults(defineProps<RangeCalendarProps>(), {
  locale: 'en-US',
  showOutsideDays: true,
  readonly: false,
})

const emit = defineEmits<RangeCalendarEmits>()

const range = useControllableState<DateRange | null>({
  prop: toRef(props, 'modelValue') as any,
  defaultValue: props.defaultValue ?? null,
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

const selecting = ref<CalendarDate | null>(null)
const hoverDate = ref<CalendarDate | null>(null)

const today = new Date()
const viewYear = ref(range.value?.start?.year ?? today.getFullYear())
const viewMonth = ref(range.value?.start?.month ?? today.getMonth() + 1)

const headingLabel = computed(() => {
  const d = new Date(viewYear.value, viewMonth.value - 1, 1)
  return d.toLocaleDateString(props.locale, { month: 'long', year: 'numeric' })
})

const weekdays = computed(() => {
  const days: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(2026, 0, 7 + i)
    days.push(d.toLocaleDateString(props.locale, { weekday: 'short' }).slice(0, 2))
  }
  return days
})

const effectiveRange = computed((): DateRange => {
  if (selecting.value && hoverDate.value) {
    const a = selecting.value
    const b = hoverDate.value
    return cmp(a, b) <= 0 ? { start: a, end: b } : { start: b, end: a }
  }
  return range.value ?? { start: null, end: null }
})

const calendarDays = computed(() => {
  const year = viewYear.value
  const month = viewMonth.value
  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate()

  const days: Array<ReturnType<typeof makeDay>> = []

  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    const pm = month === 1 ? 12 : month - 1
    const py = month === 1 ? year - 1 : year
    days.push(makeDay({ year: py, month: pm, day }, true, days.length % 7))
  }

  for (let d = 1; d <= daysInMonth; d++) {
    days.push(makeDay({ year, month, day: d }, false, days.length % 7))
  }

  const remaining = 42 - days.length
  const nm = month === 12 ? 1 : month + 1
  const ny = month === 12 ? year + 1 : year
  for (let d = 1; d <= remaining; d++) {
    days.push(makeDay({ year: ny, month: nm, day: d }, true, days.length % 7))
  }

  return days
})

function makeDay(date: CalendarDate, isOutsideMonth: boolean, colIndex: number) {
  const todayD = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() }
  const er = effectiveRange.value
  const inRange = er.start && er.end ? cmp(date, er.start) >= 0 && cmp(date, er.end) <= 0 : false

  return {
    date,
    isOutsideMonth,
    colIndex,
    isToday: same(date, todayD),
    isStart: er.start ? same(date, er.start) : false,
    isEnd: er.end ? same(date, er.end) : false,
    isInRange: inRange,
    isDisabled: isDateDisabled(date),
    isUnavailable: props.unavailableDates?.some((u) => same(u, date)) ?? false,
  }
}

function same(a: CalendarDate, b: CalendarDate) {
  return a.year === b.year && a.month === b.month && a.day === b.day
}

function cmp(a: CalendarDate, b: CalendarDate): number {
  const da = new Date(a.year, a.month - 1, a.day)
  const db = new Date(b.year, b.month - 1, b.day)
  return da < db ? -1 : da > db ? 1 : 0
}

function isDateDisabled(date: CalendarDate) {
  const d = new Date(date.year, date.month - 1, date.day)
  if (props.minValue && d < new Date(props.minValue.year, props.minValue.month - 1, props.minValue.day)) return true
  if (props.maxValue && d > new Date(props.maxValue.year, props.maxValue.month - 1, props.maxValue.day)) return true
  return false
}

function handleDayClick(day: typeof calendarDays.value[0]) {
  if (day.isDisabled || day.isUnavailable || props.readonly) return

  if (!selecting.value) {
    selecting.value = day.date
    range.value = { start: day.date, end: null }
  } else {
    const start = selecting.value
    const end = day.date
    range.value = cmp(start, end) <= 0 ? { start, end } : { start: end, end: start }
    selecting.value = null
    hoverDate.value = null
  }
}

function handleDayHover(day: typeof calendarDays.value[0]) {
  if (selecting.value) hoverDate.value = day.date
}

function prevMonth() {
  if (viewMonth.value === 1) { viewMonth.value = 12; viewYear.value-- }
  else viewMonth.value--
}

function nextMonth() {
  if (viewMonth.value === 12) { viewMonth.value = 1; viewYear.value++ }
  else viewMonth.value++
}
</script>

<template>
  <div :class="cn(rangeCalendarTheme, props.class)" role="group">
    <!-- Header -->
    <div :class="rangeCalendarHeaderTheme">
      <button type="button" :class="rangeCalendarNavButtonTheme" aria-label="Previous month" @click="prevMonth">
        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <span :class="rangeCalendarHeadingTheme" aria-live="polite">{{ headingLabel }}</span>
      <button type="button" :class="rangeCalendarNavButtonTheme" aria-label="Next month" @click="nextMonth">
        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <!-- Grid -->
    <div :class="rangeCalendarGridTheme" role="grid" :aria-label="headingLabel">
      <div v-for="wd in weekdays" :key="wd" :class="rangeCalendarHeaderCellTheme" role="columnheader">{{ wd }}</div>

      <div
        v-for="(day, i) in calendarDays"
        :key="i"
        :class="rangeCalendarCellTheme(day)"
        v-show="!day.isOutsideMonth || showOutsideDays"
        @click="handleDayClick(day)"
        @mouseenter="handleDayHover(day)"
      >
        <button
          type="button"
          role="gridcell"
          :class="rangeCalendarCellButtonTheme(day)"
          :aria-selected="(day.isStart || day.isEnd) || undefined"
          :aria-disabled="(day.isDisabled || day.isUnavailable) || undefined"
          :tabindex="(day.isStart || day.isEnd) ? 0 : -1"
        >
          {{ day.date.day }}
        </button>
      </div>
    </div>

    <!-- Selection hint -->
    <p v-if="selecting" class="mt-3 text-xs text-ousi-muted text-center">
      Click another date to complete the range
    </p>
  </div>
</template>
