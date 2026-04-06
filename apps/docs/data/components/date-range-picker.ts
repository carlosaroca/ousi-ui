import type { ComponentData } from './types'

export const dateRangePickerData: ComponentData = {
  title: 'Date Range Picker',
  description: 'A date field pair with a popover calendar for selecting a date range.',
  category: 'Date & Time',
  importCode: "import { ODateRangePicker } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'DateRangePickerUsage',
        code: '<ODateRangePicker v-model="range" label="Date range" />',
      },
    },
    {
      id: 'with-description',
      title: 'With Description',
      example: {
        component: 'DateRangePickerWithDescription',
        code: `<ODateRangePicker
  v-model="range"
  label="Trip dates"
  description="Select your departure and return dates."
/>`,
      },
    },
    {
      id: 'with-error',
      title: 'With Error',
      example: {
        component: 'DateRangePickerWithError',
        code: `<ODateRangePicker
  v-model="range"
  label="Date range"
  error-message="End date must be after start date."
/>`,
      },
    },
    {
      id: 'min-max',
      title: 'Min & Max',
      example: {
        component: 'DateRangePickerMinMax',
        code: `<ODateRangePicker
  v-model="range"
  label="Booking"
  :min-value="{ year: 2026, month: 4, day: 1 }"
  :max-value="{ year: 2026, month: 12, day: 31 }"
/>`,
      },
    },
    {
      id: 'full-width',
      title: 'Full Width',
      example: {
        component: 'DateRangePickerFullWidth',
        code: '<ODateRangePicker v-model="range" label="Date range" full-width />',
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'DateRangePickerDisabled',
        code: '<ODateRangePicker label="Date range" disabled />',
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'DateRangeValue | null', default: 'null', description: 'Current range value (v-model).' },
    { name: 'defaultValue', type: 'DateRangeValue | null', default: 'null', description: 'Default range value.' },
    { name: 'label', type: 'string', default: '-', description: 'Label text.' },
    { name: 'description', type: 'string', default: '-', description: 'Description text below the field.' },
    { name: 'errorMessage', type: 'string', default: '-', description: 'Error message — replaces description when present.' },
    { name: 'locale', type: 'string', default: "'en-US'", description: 'Locale for segment ordering and month names.' },
    { name: 'minValue', type: 'DateFieldValue', default: '-', description: 'Minimum selectable date.' },
    { name: 'maxValue', type: 'DateFieldValue', default: '-', description: 'Maximum selectable date.' },
    { name: 'unavailableDates', type: 'DateFieldValue[]', default: '[]', description: 'Dates that cannot be selected.' },
    { name: 'showOutsideDays', type: 'boolean', default: 'true', description: 'Show days from adjacent months.' },
    { name: 'placement', type: "'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'", default: "'bottom-start'", description: 'Popover placement relative to trigger.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the picker.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Read-only mode.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Mark as required (shows asterisk on label).' },
    { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Make the field take full width.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'update:modelValue', type: 'DateRangeValue | null', description: 'Emitted when the range changes.' },
    { name: 'change', type: 'DateRangeValue | null', description: 'Emitted on user-initiated change.' },
  ],

  themeCode: `import { dateRangePickerTheme } from '@ousi-ui/vue'`,

  keyboard: [
    { key: 'ArrowUp / ArrowDown', description: 'Increment or decrement the focused date segment.' },
    { key: 'ArrowLeft / ArrowRight', description: 'Move between date segments.' },
    { key: 'Enter / Space', description: 'Open or close the calendar popover.' },
    { key: 'Escape', description: 'Close the calendar popover.' },
    { key: 'Tab', description: 'Move focus between start field, end field, and trigger.' },
  ],

  aria: [
    { attribute: 'role="group"', condition: 'always', description: 'Groups start and end date fields.' },
    { attribute: 'aria-label', condition: 'label prop set', description: 'Labels the date range picker.' },
    { attribute: 'aria-expanded', condition: 'popover open', description: 'Indicates popover visibility state.' },
    { attribute: 'aria-disabled', condition: 'disabled', description: 'Marks the picker as non-interactive.' },
    { attribute: 'aria-invalid', condition: 'errorMessage set', description: 'Indicates a validation error.' },
    { attribute: 'aria-describedby', condition: 'description or errorMessage', description: 'Points to the description or error message.' },
  ],

  bestPractices: [
    { text: 'Always provide a label for the date range picker.', good: true },
    { text: 'Use errorMessage for validation feedback on invalid ranges.', good: true },
    { text: 'Set minValue and maxValue to constrain bookable date windows.', good: true },
    { text: "Don't use this component for selecting a single date — use DatePicker instead.", good: false },
  ],
}
