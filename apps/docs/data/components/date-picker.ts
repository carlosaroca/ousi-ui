import type { ComponentData } from './types'

export const datePickerData: ComponentData = {
  title: 'Date Picker',
  description: 'A date field with a popover calendar for visually selecting a date.',
  category: 'Date & Time',
  importCode: "import { ODatePicker } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'DatePickerUsage',
        code: '<ODatePicker v-model="date" label="Date" />',
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'DatePickerVariants',
        code: `<ODatePicker variant="primary" label="Primary" />
<ODatePicker variant="secondary" label="Secondary" />`,
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'DatePickerSizes',
        code: `<ODatePicker size="sm" label="Small" />
<ODatePicker size="md" label="Medium" />
<ODatePicker size="lg" label="Large" />`,
      },
    },
    {
      id: 'clearable',
      title: 'Clearable (external reset)',
      example: {
        component: 'DatePickerClearable',
        code: `<script setup>
import { ref } from 'vue'
import type { DateFieldValue } from '@ousi-ui/vue'

const date = ref<DateFieldValue | null>({ year: 2026, month: 5, day: 15 })
</script>

<template>
  <ODatePicker v-model="date" label="Date" />
  <OButton variant="text" @click="date = null">Clear</OButton>
</template>`,
      },
    },
    {
      id: 'with-description',
      title: 'With Description',
      example: {
        component: 'DatePickerWithDescription',
        code: `<ODatePicker
  v-model="date"
  label="Start date"
  description="Choose a project start date."
/>`,
      },
    },
    {
      id: 'with-error',
      title: 'With Error',
      example: {
        component: 'DatePickerWithError',
        code: `<ODatePicker
  v-model="date"
  label="Date"
  error-message="Please select a valid date."
/>`,
      },
    },
    {
      id: 'format',
      title: 'Format (string v-model)',
      example: {
        component: 'DatePickerFormat',
        code: `<!-- v-model emits/accepts a string in the given pattern. -->
<ODatePicker v-model="iso" format="YYYY-MM-DD" label="API date" />

<!-- Independent: format controls the value, displayFormat controls the visible segments. -->
<ODatePicker
  v-model="iso"
  format="YYYY-MM-DD"
  display-format="DD/MM/YYYY"
  label="API date + custom display"
/>

<!-- Supported tokens: YYYY YY MM M DD D — anything else is a literal. -->`,
      },
    },
    {
      id: 'min-max',
      title: 'Min & Max',
      example: {
        component: 'DatePickerMinMax',
        code: `<ODatePicker
  v-model="date"
  label="Date"
  :min-value="{ year: 2026, month: 1, day: 1 }"
  :max-value="{ year: 2026, month: 12, day: 31 }"
/>`,
      },
    },
    {
      id: 'full-width',
      title: 'Full Width',
      example: {
        component: 'DatePickerFullWidth',
        code: '<ODatePicker v-model="date" label="Date" />',
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'DatePickerDisabled',
        code: '<ODatePicker label="Date" disabled />',
      },
    },
    {
      id: 'animated',
      title: 'Animated',
      example: {
        component: 'DatePickerAnimated',
        code: `<ODatePicker label="Default" />
<ODatePicker label="Animated" animated />`,
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'DateFieldValue | string | null', default: 'null', description: 'Current date value (v-model). When `format` is set, this is a string in that pattern.' },
    { name: 'format', type: 'string', default: '-', description: 'When set, v-model is parsed/emitted as a string in this pattern. Tokens: `YYYY YY MM M DD D` — anything else is a literal.' },
    { name: 'displayFormat', type: 'string', default: '-', description: 'When set, the trigger renders segments in this pattern instead of deriving from `locale`. Independent from `format`.' },
    { name: 'variant', type: "'primary' | 'secondary'", default: "'primary'", description: 'Visual variant of the field.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the field.' },
    { name: 'shadow', type: "'none' | 'xs' | 'sm' | 'md'", default: "'xs'", description: 'Elevation shadow.' },
    { name: 'animated', type: 'boolean', default: 'false', description: 'Tactile press animation — scales to 98% on focus.' },
    { name: 'defaultValue', type: 'DateFieldValue | string | null', default: 'null', description: 'Default date value. Accepts a string when `format` is set.' },
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
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'update:modelValue', type: 'DateFieldValue | string | null', description: 'Emitted when the date changes. String when `format` is set, object otherwise.' },
    { name: 'change', type: 'DateFieldValue | string | null', description: 'Emitted on user-initiated change. String when `format` is set, object otherwise.' },
  ],

  themeCode: `import { datePickerTheme } from '@ousi-ui/vue'`,

  keyboard: [
    { key: 'ArrowUp / ArrowDown', description: 'Increment or decrement the focused date segment.' },
    { key: 'ArrowLeft / ArrowRight', description: 'Move between date segments.' },
    { key: 'Enter / Space', description: 'Open or close the calendar popover.' },
    { key: 'Escape', description: 'Close the calendar popover.' },
    { key: 'Tab', description: 'Move focus between segments and the trigger button.' },
  ],

  aria: [
    { attribute: 'role="group"', condition: 'always', description: 'Groups the date field segments.' },
    { attribute: 'aria-label', condition: 'label prop set', description: 'Labels the date picker.' },
    { attribute: 'aria-expanded', condition: 'popover open', description: 'Indicates popover visibility state.' },
    { attribute: 'aria-disabled', condition: 'disabled', description: 'Marks the picker as non-interactive.' },
    { attribute: 'aria-invalid', condition: 'errorMessage set', description: 'Indicates a validation error.' },
    { attribute: 'aria-describedby', condition: 'description or errorMessage', description: 'Points to the description or error message.' },
  ],

  bestPractices: [
    { text: 'Always provide a label for the date picker.', good: true },
    { text: 'Use errorMessage to display validation feedback.', good: true },
    { text: 'Constrain dates with minValue and maxValue when there is a valid range.', good: true },
    { text: "Don't rely solely on the calendar popover — the date field accepts keyboard input.", good: false },
  ],
}
