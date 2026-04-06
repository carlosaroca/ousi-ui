import type { ComponentData } from './types'

export const rangeCalendarData: ComponentData = {
  title: 'Range Calendar',
  description: 'A calendar grid for selecting a date range with start and end dates.',
  category: 'Date & Time',
  importCode: "import { ORangeCalendar } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'RangeCalendarUsage',
        code: '<ORangeCalendar v-model="range" />',
      },
    },
    {
      id: 'with-min-max',
      title: 'With Min & Max',
      example: {
        component: 'RangeCalendarWithMinMax',
        code: `<ORangeCalendar
  v-model="range"
  :min-value="{ year: 2026, month: 1, day: 1 }"
  :max-value="{ year: 2026, month: 6, day: 30 }"
/>`,
      },
    },
    {
      id: 'controlled',
      title: 'Controlled',
      example: {
        component: 'RangeCalendarControlled',
        code: `<ORangeCalendar
  :model-value="range"
  @update:model-value="range = $event"
/>`,
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'RangeCalendarDisabled',
        code: '<ORangeCalendar disabled />',
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'DateRange | null', default: 'null', description: 'Selected range (v-model).' },
    { name: 'defaultValue', type: 'DateRange | null', default: 'null', description: 'Default range.' },
    { name: 'minValue', type: 'CalendarDate', default: '-', description: 'Minimum selectable date.' },
    { name: 'maxValue', type: 'CalendarDate', default: '-', description: 'Maximum selectable date.' },
    { name: 'unavailableDates', type: 'CalendarDate[]', default: '[]', description: 'Dates not available for selection.' },
    { name: 'locale', type: 'string', default: "'en-US'", description: 'Locale for month and day names.' },
    { name: 'showOutsideDays', type: 'boolean', default: 'true', description: 'Show adjacent month days.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Prevent selection.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'update:modelValue', type: 'DateRange | null', description: 'Emitted when the selected range changes.' },
    { name: 'change', type: 'DateRange | null', description: 'Emitted on user-initiated range change.' },
  ],

  themeCode: `import { rangeCalendarTheme } from '@ousi-ui/vue'`,

  keyboard: [
    { key: 'ArrowLeft', description: 'Move focus to the previous day.' },
    { key: 'ArrowRight', description: 'Move focus to the next day.' },
    { key: 'ArrowUp', description: 'Move focus to the same day in the previous week.' },
    { key: 'ArrowDown', description: 'Move focus to the same day in the next week.' },
    { key: 'Enter / Space', description: 'Set the start or end of the range.' },
    { key: 'PageUp', description: 'Move to the previous month.' },
    { key: 'PageDown', description: 'Move to the next month.' },
  ],

  aria: [
    { attribute: 'role="grid"', condition: 'always', description: 'Calendar grid exposed as grid role.' },
    { attribute: 'aria-selected', condition: 'within range', description: 'Marks cells within the selected range.' },
    { attribute: 'aria-disabled', condition: 'disabled or out of range', description: 'Marks non-interactive cells.' },
  ],

  bestPractices: [
    { text: 'Use minValue and maxValue to prevent selecting impossible ranges.', good: true },
    { text: 'Provide clear visual feedback for the selected range and hover preview.', good: true },
    { text: "Don't use range calendar for single date selection — use Calendar instead.", good: false },
  ],
}
