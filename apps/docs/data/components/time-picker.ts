import type { ComponentData } from './types'

export const timePickerData: ComponentData = {
  title: 'Time Picker',
  description: 'A time field with an iOS-style wheel picker for selecting hours, minutes, and seconds.',
  category: 'Date & Time',
  importCode: "import { OTimePicker } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'TimePickerUsage',
        code: '<OTimePicker v-model="time" label="Time" />',
      },
    },
    {
      id: 'hour12',
      title: '12-hour format',
      example: {
        component: 'TimePickerHour12',
        code: '<OTimePicker v-model="time" hour12 label="Meeting time" />',
      },
    },
    {
      id: 'hour-only',
      title: 'Hour only',
      example: {
        component: 'TimePickerHourOnly',
        code: '<OTimePicker v-model="time" granularity="hour" hour12 label="Reservation hour" />',
      },
    },
    {
      id: 'granularity',
      title: 'With seconds',
      example: {
        component: 'TimePickerSeconds',
        code: '<OTimePicker v-model="time" granularity="second" label="Stopwatch start" />',
      },
    },
    {
      id: 'min-max',
      title: 'Min & Max',
      example: {
        component: 'TimePickerMinMax',
        code: `<OTimePicker
  v-model="time"
  label="Office hours"
  :min="{ hour: 9, minute: 0 }"
  :max="{ hour: 17, minute: 30 }"
/>`,
      },
    },
    {
      id: 'interval',
      title: 'Custom interval',
      example: {
        component: 'TimePickerInterval',
        code: `<OTimePicker v-model="time" :interval="15" label="15-minute slots" />
<OTimePicker v-model="time" :interval="30" label="30-minute slots" />`,
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'TimePickerVariants',
        code: `<OTimePicker variant="primary" label="Primary" />
<OTimePicker variant="secondary" label="Secondary" />`,
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'TimePickerSizes',
        code: `<OTimePicker size="sm" label="Small" />
<OTimePicker size="md" label="Medium" />
<OTimePicker size="lg" label="Large" />`,
      },
    },
    {
      id: 'clearable',
      title: 'Clearable (external reset)',
      example: {
        component: 'TimePickerClearable',
        code: `<script setup>
import { ref } from 'vue'
import type { TimeFieldValue } from '@ousi-ui/vue'

const time = ref<TimeFieldValue | null>({ hour: 14, minute: 30 })
</script>

<template>
  <OTimePicker v-model="time" label="Departure" />
  <OButton variant="text" @click="time = null">Clear</OButton>
</template>`,
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'TimePickerDisabled',
        code: '<OTimePicker label="Time" disabled />',
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'TimeFieldValue | null', default: 'null', description: 'Current time value (v-model). Shape: { hour, minute, second? }.' },
    { name: 'variant', type: "'primary' | 'secondary'", default: "'primary'", description: 'Visual variant of the field.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the field.' },
    { name: 'shadow', type: "'none' | 'xs' | 'sm' | 'md'", default: "'xs'", description: 'Elevation shadow on the trigger.' },
    { name: 'animated', type: 'boolean', default: 'false', description: 'Tactile press animation — scales to 98% on focus.' },
    { name: 'defaultValue', type: 'TimeFieldValue | null', default: 'null', description: 'Default time value.' },
    { name: 'label', type: 'string', default: '-', description: 'Label text.' },
    { name: 'description', type: 'string', default: '-', description: 'Description text below the field.' },
    { name: 'errorMessage', type: 'string', default: '-', description: 'Error message — replaces description when present.' },
    { name: 'hour12', type: 'boolean', default: 'false', description: 'Use 12-hour format with an AM/PM column.' },
    { name: 'granularity', type: "'hour' | 'minute' | 'second'", default: "'minute'", description: 'Smallest unit displayed in the picker.' },
    { name: 'interval', type: '1 | 5 | 10 | 15 | 30 | 60', default: '5', description: 'Step in minutes for the minute wheel.' },
    { name: 'min', type: 'TimeFieldValue', default: '-', description: 'Minimum allowed time.' },
    { name: 'max', type: 'TimeFieldValue', default: '-', description: 'Maximum allowed time.' },
    { name: 'placement', type: "'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'", default: "'bottom-start'", description: 'Popover placement relative to the trigger.' },
    { name: 'showNow', type: 'boolean', default: 'true', description: 'Show the "Now" button in the popover footer.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the picker.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Read-only mode.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Mark as required (shows asterisk on label).' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'update:modelValue', type: 'TimeFieldValue | null', description: 'Emitted when the time changes (after pressing OK or Now).' },
    { name: 'change', type: 'TimeFieldValue | null', description: 'Emitted on user-initiated change.' },
  ],

  themeCode: `import { timePickerTheme } from '@ousi-ui/vue'`,

  keyboard: [
    { key: 'Enter / Space', description: 'Open the popover when the trigger is focused.' },
    { key: 'Escape', description: 'Close the popover without committing.' },
    { key: 'ArrowUp / ArrowDown', description: 'Move selection within a focused wheel.' },
    { key: 'Home / End', description: 'Jump to the first/last item in the focused wheel.' },
    { key: 'Tab', description: 'Move focus between wheels and footer buttons.' },
  ],

  aria: [
    { attribute: 'aria-haspopup="dialog"', condition: 'always', description: 'Trigger announces the popover.' },
    { attribute: 'aria-expanded', condition: 'popover open', description: 'Indicates popover visibility.' },
    { attribute: 'role="listbox"', condition: 'wheel column', description: 'Each wheel is a listbox of options.' },
    { attribute: 'aria-selected', condition: 'wheel item', description: 'Marks the centered item as selected.' },
    { attribute: 'aria-invalid', condition: 'errorMessage set', description: 'Indicates a validation error.' },
  ],

  bestPractices: [
    { text: 'Use OTimeField for keyboard-first power users; OTimePicker for touch and visual selection.', good: true },
    { text: 'Set a sensible interval — 1-minute precision is rarely needed for human-scheduled events.', good: true },
    { text: 'Pair with ODatePicker when you need a full datetime — avoid combining them into a single field.', good: true },
    { text: "Don't use granularity=&apos;second&apos; for user-facing time selection unless you really need it.", good: false },
  ],
}
