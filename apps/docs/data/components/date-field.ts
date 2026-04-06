import type { ComponentData } from './types'

export const dateFieldData: ComponentData = {
  title: 'Date Field',
  description: 'A segmented input field for entering dates with keyboard navigation.',
  category: 'Date & Time',
  importCode: "import { ODateField } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'DateFieldUsage',
        code: '<ODateField v-model="date" label="Date" />',
      },
    },
    {
      id: 'locales',
      title: 'Locales',
      example: {
        component: 'DateFieldLocales',
        code: `<ODateField v-model="date" label="English" locale="en-US" />
<ODateField v-model="date" label="Japanese" locale="ja-JP" />`,
      },
    },
    {
      id: 'month-granularity',
      title: 'Month Granularity',
      example: {
        component: 'DateFieldMonthGranularity',
        code: '<ODateField v-model="date" label="Month" granularity="month" />',
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'DateFieldDisabled',
        code: '<ODateField label="Date" disabled />',
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'DateFieldValue | null', default: 'null', description: 'Current date value (v-model).' },
    { name: 'defaultValue', type: 'DateFieldValue | null', default: 'null', description: 'Default date value.' },
    { name: 'locale', type: 'string', default: "'en-US'", description: 'Locale for segment ordering (e.g. "en-US", "ja-JP").' },
    { name: 'granularity', type: "'day' | 'month' | 'year'", default: "'day'", description: 'Granularity of the date field.' },
    { name: 'min', type: 'DateFieldValue', default: '-', description: 'Minimum allowed date.' },
    { name: 'max', type: 'DateFieldValue', default: '-', description: 'Maximum allowed date.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the field.' },
    { name: 'readOnly', type: 'boolean', default: 'false', description: 'Mark field as read-only.' },
    { name: 'label', type: 'string', default: '-', description: 'Accessible label.' },
    { name: 'placeholder', type: "Partial<Record<'year' | 'month' | 'day', string>>", default: '-', description: 'Placeholder text per segment.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'update:modelValue', type: 'DateFieldValue | null', description: 'Emitted when the date changes.' },
    { name: 'change', type: 'DateFieldValue | null', description: 'Emitted on user-initiated change.' },
  ],

  themeCode: `import { dateFieldTheme } from '@ousi-ui/vue'`,

  keyboard: [
    { key: 'ArrowUp', description: 'Increment the focused segment.' },
    { key: 'ArrowDown', description: 'Decrement the focused segment.' },
    { key: 'ArrowLeft', description: 'Move focus to the previous segment.' },
    { key: 'ArrowRight', description: 'Move focus to the next segment.' },
    { key: 'Tab', description: 'Move focus to the next segment or out of the field.' },
    { key: '0-9', description: 'Type a numeric value into the focused segment.' },
  ],

  aria: [
    { attribute: 'role="group"', condition: 'always', description: 'Groups segments together as a single date input.' },
    { attribute: 'aria-label', condition: 'label prop set', description: 'Labels the date field group.' },
    { attribute: 'aria-disabled', condition: 'disabled', description: 'Marks the field as non-interactive.' },
    { attribute: 'role="spinbutton"', condition: 'each segment', description: 'Each editable segment is a spinbutton.' },
  ],

  bestPractices: [
    { text: 'Always provide a label for accessibility.', good: true },
    { text: 'Use locale prop to match user language preferences.', good: true },
    { text: "Don't rely solely on placeholder text to convey the expected format.", good: false },
  ],
}
