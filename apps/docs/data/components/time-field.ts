import type { ComponentData } from './types'

export const timeFieldData: ComponentData = {
  title: 'Time Field',
  description: 'A segmented input field for entering time values with keyboard navigation.',
  category: 'Date & Time',
  importCode: "import { OTimeField } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'TimeFieldUsage',
        code: '<OTimeField v-model="time" label="Time" />',
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'TimeFieldVariants',
        code: `<OTimeField variant="primary" label="Primary" />
<OTimeField variant="secondary" label="Secondary" />`,
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'TimeFieldSizes',
        code: `<OTimeField size="sm" label="Small" />
<OTimeField size="md" label="Medium" />
<OTimeField size="lg" label="Large" />`,
      },
    },
    {
      id: 'twelve-hour',
      title: '12-Hour Format',
      example: {
        component: 'TimeFieldTwelveHour',
        code: '<OTimeField v-model="time" label="Time" hour12 />',
      },
    },
    {
      id: 'with-seconds',
      title: 'With Seconds',
      example: {
        component: 'TimeFieldWithSeconds',
        code: '<OTimeField v-model="time" label="Time" granularity="second" />',
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'TimeFieldDisabled',
        code: '<OTimeField label="Time" disabled />',
      },
    },
    {
      id: 'animated',
      title: 'Animated',
      example: {
        component: 'TimeFieldAnimated',
        code: `<OTimeField label="Default" />
<OTimeField label="Animated" animated />`,
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'TimeFieldValue | null', default: 'null', description: 'Current time value (v-model).' },
    { name: 'variant', type: "'primary' | 'secondary'", default: "'primary'", description: 'Visual variant.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the field.' },
    { name: 'shadow', type: "'none' | 'xs' | 'sm' | 'md'", default: "'xs'", description: 'Elevation shadow.' },
    { name: 'animated', type: 'boolean', default: 'false', description: 'Tactile press animation — scales to 98% on focus.' },
    { name: 'defaultValue', type: 'TimeFieldValue | null', default: 'null', description: 'Default time value.' },
    { name: 'hour12', type: 'boolean', default: 'false', description: 'Use 12-hour format with AM/PM.' },
    { name: 'granularity', type: "'hour' | 'minute' | 'second'", default: "'minute'", description: 'Granularity of the time field.' },
    { name: 'min', type: 'TimeFieldValue', default: '-', description: 'Minimum allowed time.' },
    { name: 'max', type: 'TimeFieldValue', default: '-', description: 'Maximum allowed time.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the field.' },
    { name: 'readOnly', type: 'boolean', default: 'false', description: 'Mark field as read-only.' },
    { name: 'label', type: 'string', default: '-', description: 'Accessible label.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'update:modelValue', type: 'TimeFieldValue | null', description: 'Emitted when the time changes.' },
    { name: 'change', type: 'TimeFieldValue | null', description: 'Emitted on user-initiated change.' },
  ],

  themeCode: `import { timeFieldTheme } from '@ousi-ui/vue'`,

  keyboard: [
    { key: 'ArrowUp', description: 'Increment the focused segment.' },
    { key: 'ArrowDown', description: 'Decrement the focused segment.' },
    { key: 'ArrowLeft', description: 'Move focus to the previous segment.' },
    { key: 'ArrowRight', description: 'Move focus to the next segment.' },
    { key: 'Tab', description: 'Move focus to the next segment or out of the field.' },
    { key: '0-9', description: 'Type a numeric value into the focused segment.' },
    { key: 'A / P', description: 'Switch AM/PM in 12-hour mode.' },
  ],

  aria: [
    { attribute: 'role="group"', condition: 'always', description: 'Groups segments as a single time input.' },
    { attribute: 'aria-label', condition: 'label prop set', description: 'Labels the time field group.' },
    { attribute: 'aria-disabled', condition: 'disabled', description: 'Marks the field as non-interactive.' },
    { attribute: 'role="spinbutton"', condition: 'each segment', description: 'Each editable segment is a spinbutton.' },
  ],

  bestPractices: [
    { text: 'Always provide a label for accessibility.', good: true },
    { text: 'Use hour12 when the target audience expects 12-hour time format.', good: true },
    { text: "Don't forget to include seconds granularity when precision matters.", good: false },
  ],
}
