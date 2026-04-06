<script setup lang="ts">
import { ref, computed, toRef, useSlots } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import {
  calendarTheme,
  calendarHeaderTheme,
  calendarHeadingTheme,
  calendarNavButtonTheme,
  calendarGridTheme,
  calendarHeaderCellTheme,
  calendarCellTheme,
  calendarCellIndicatorTheme,
  calendarYearPickerTriggerTheme,
  calendarYearPickerGridTheme,
  calendarYearCellTheme,
} from './calendar.theme'
import type { CalendarProps, CalendarEmits, CalendarDate } from './calendar.types'

const props = withDefaults(defineProps<CalendarProps>(), {
  locale: 'en-US',
  showOutsideDays: true,
  showYearPicker: false,
  readonly: false,
  disabled: false,
})

const emit = defineEmits<CalendarEmits>()

const slots = useSlots()
const hasCustomCell = computed(() => !!slots.cell)

const selectedDate = useControllableState<CalendarDate | null>({
  prop: toRef(props, 'modelValue') as any,
  defaultValue: props.defaultValue ?? null,
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

const today = new Date()
const viewYear = ref(selectedDate.value?.year ?? today.getFullYear())
const viewMonth = ref(selectedDate.value?.month ?? today.getMonth() + 1)
const isYearPickerOpen = ref(false)

// Year picker range (12 years centered on current view year)
const yearRange = computed(() => {
  const start = viewYear.value - 5
  return Array.from({ length: 12 }, (_, i) => start + i)
})

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

const calendarDays = computed(() => {
  const year = viewYear.value
  const month = viewMonth.value
  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate()

  const days: Array<{
    date: CalendarDate
    isOutsideMonth: boolean
    isToday: boolean
    isSelected: boolean
    isDisabled: boolean
    isUnavailable: boolean
    hasIndicator: boolean
  }> = []

  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    const pm = month === 1 ? 12 : month - 1
    const py = month === 1 ? year - 1 : year
    days.push(makeDay({ year: py, month: pm, day }, true))
  }

  for (let d = 1; d <= daysInMonth; d++) {
    days.push(makeDay({ year, month, day: d }, false))
  }

  const remaining = 42 - days.length
  const nm = month === 12 ? 1 : month + 1
  const ny = month === 12 ? year + 1 : year
  for (let d = 1; d <= remaining; d++) {
    days.push(makeDay({ year: ny, month: nm, day: d }, true))
  }

  return days
})

function makeDay(date: CalendarDate, isOutsideMonth: boolean) {
  const todayD = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() }
  return {
    date,
    isOutsideMonth,
    isToday: same(date, todayD),
    isSelected: selectedDate.value ? same(date, selectedDate.value) : false,
    isDisabled: props.disabled || isDateDisabled(date),
    isUnavailable: props.unavailableDates?.some((u) => same(u, date)) ?? false,
    hasIndicator: !isOutsideMonth && (props.indicatorDays?.includes(date.day) ?? false),
  }
}

function same(a: CalendarDate, b: CalendarDate) {
  return a.year === b.year && a.month === b.month && a.day === b.day
}

function isDateDisabled(date: CalendarDate) {
  const d = new Date(date.year, date.month - 1, date.day)
  if (props.minValue && d < new Date(props.minValue.year, props.minValue.month - 1, props.minValue.day)) return true
  if (props.maxValue && d > new Date(props.maxValue.year, props.maxValue.month - 1, props.maxValue.day)) return true
  return false
}

function prevMonth() {
  if (isYearPickerOpen.value) {
    viewYear.value -= 12
    return
  }
  if (viewMonth.value === 1) { viewMonth.value = 12; viewYear.value-- }
  else viewMonth.value--
}

function nextMonth() {
  if (isYearPickerOpen.value) {
    viewYear.value += 12
    return
  }
  if (viewMonth.value === 12) { viewMonth.value = 1; viewYear.value++ }
  else viewMonth.value++
}

function selectDay(day: typeof calendarDays.value[0]) {
  if (day.isDisabled || day.isUnavailable || props.readonly || props.disabled) return
  if (day.isOutsideMonth) {
    viewYear.value = day.date.year
    viewMonth.value = day.date.month
  }
  selectedDate.value = day.date
}

function selectYear(year: number) {
  viewYear.value = year
  isYearPickerOpen.value = false
}

function handleKeydown(e: KeyboardEvent, day: typeof calendarDays.value[0]) {
  let offset = 0
  switch (e.key) {
    case 'ArrowRight': offset = 1; break
    case 'ArrowLeft': offset = -1; break
    case 'ArrowDown': offset = 7; break
    case 'ArrowUp': offset = -7; break
    case 'Enter':
    case ' ':
      e.preventDefault()
      selectDay(day)
      return
    default: return
  }
  e.preventDefault()
  const d = new Date(day.date.year, day.date.month - 1, day.date.day + offset)
  const next = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }
  viewYear.value = next.year
  viewMonth.value = next.month
  selectedDate.value = next
}
</script>

<template>
  <div :class="cn(calendarTheme, disabled && 'opacity-50 pointer-events-none', props.class)" role="group">
    <!-- Header -->
    <div :class="calendarHeaderTheme">
      <button type="button" :class="calendarNavButtonTheme" aria-label="Previous" @click="prevMonth">
        <slot name="prev-icon">
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </slot>
      </button>

      <!-- Heading — clickable for year picker when enabled -->
      <component
        :is="showYearPicker ? 'button' : 'span'"
        :class="showYearPicker ? calendarYearPickerTriggerTheme : calendarHeadingTheme"
        :type="showYearPicker ? 'button' : undefined"
        aria-live="polite"
        @click="showYearPicker && (isYearPickerOpen = !isYearPickerOpen)"
      >
        {{ headingLabel }}
        <svg
          v-if="showYearPicker"
          class="size-3.5 transition-transform duration-150"
          :class="isYearPickerOpen && 'rotate-180'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </component>

      <button type="button" :class="calendarNavButtonTheme" aria-label="Next" @click="nextMonth">
        <slot name="next-icon">
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </slot>
      </button>
    </div>

    <!-- Year Picker Grid -->
    <div v-if="isYearPickerOpen" :class="calendarYearPickerGridTheme">
      <button
        v-for="yr in yearRange"
        :key="yr"
        type="button"
        :class="calendarYearCellTheme(yr === viewYear, yr === today.getFullYear())"
        @click="selectYear(yr)"
      >
        {{ yr }}
      </button>
    </div>

    <!-- Day Grid -->
    <div v-else :class="calendarGridTheme" role="grid" :aria-label="headingLabel">
      <div v-for="wd in weekdays" :key="wd" :class="calendarHeaderCellTheme" role="columnheader">{{ wd }}</div>

      <button
        v-for="(day, i) in calendarDays"
        :key="i"
        type="button"
        role="gridcell"
        :class="calendarCellTheme(day, hasCustomCell)"
        :aria-selected="day.isSelected || undefined"
        :aria-disabled="(day.isDisabled || day.isUnavailable) || undefined"
        :data-today="day.isToday || undefined"
        :data-selected="day.isSelected || undefined"
        :tabindex="day.isSelected ? 0 : -1"
        v-show="!day.isOutsideMonth || showOutsideDays"
        @click="selectDay(day)"
        @keydown="handleKeydown($event, day)"
      >
        <!-- Custom cell slot — receives full state for custom rendering -->
        <slot
          name="cell"
          :date="day.date"
          :day="day.date.day"
          :is-selected="day.isSelected"
          :is-today="day.isToday"
          :is-outside-month="day.isOutsideMonth"
          :is-disabled="day.isDisabled"
          :is-unavailable="day.isUnavailable"
          :has-indicator="day.hasIndicator"
        >
          {{ day.date.day }}
          <!-- Cell indicator dot -->
          <span
            v-if="day.hasIndicator || day.isToday"
            :class="calendarCellIndicatorTheme(day.isSelected)"
          />
        </slot>
      </button>
    </div>
  </div>
</template>
