import type { ComponentData } from './types'

export const selectData: ComponentData = {
  title: 'Select',
  description: 'Dropdown select field for choosing one or multiple options from a list.',
  category: 'Forms',
  importCode: "import { OSelect } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'SelectBasic',
        code: `<OSelect
  :options="[
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ]"
  placeholder="Choose a fruit"
/>`,
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'SelectVariants',
        code: `<OSelect variant="primary" :options="options" placeholder="Primary" />
<OSelect variant="secondary" :options="options" placeholder="Secondary" />`,
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'SelectSizes',
        code: `<OSelect size="sm" :options="options" placeholder="Small" />
<OSelect size="md" :options="options" placeholder="Medium" />
<OSelect size="lg" :options="options" placeholder="Large" />`,
      },
    },
    {
      id: 'with-label',
      title: 'With Label',
      example: {
        component: 'SelectWithLabel',
        code: `<OSelect
  label="Country"
  :options="countries"
  placeholder="Select a country"
/>`,
      },
    },
    {
      id: 'with-error',
      title: 'With Error',
      example: {
        component: 'SelectWithError',
        code: `<OSelect
  label="Role"
  :options="roles"
  error-message="Please select a role."
/>`,
      },
    },
    {
      id: 'multiple',
      title: 'Multiple',
      example: {
        component: 'SelectMultiple',
        code: `<OSelect
  multiple
  label="Tags"
  :options="tags"
  placeholder="Select tags..."
/>`,
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'SelectDisabled',
        code: '<OSelect disabled :options="options" placeholder="Disabled" />',
      },
    },
    {
      id: 'full-width',
      title: 'Full Width',
      example: {
        component: 'SelectFullWidth',
        code: '<OSelect :options="options" placeholder="Full width" />',
      },
    },
    {
      id: 'animated',
      title: 'Animated',
      example: {
        component: 'SelectAnimated',
        code: `<OSelect :options="options" placeholder="Default — no animation" />
<OSelect :options="options" placeholder="With tactile press" animated />`,
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'string | number | (string | number)[]', default: '-', description: 'Controlled value (v-model). Array when multiple.' },
    { name: 'defaultValue', type: 'string | number | (string | number)[]', default: '-', description: 'Default value when uncontrolled.' },
    { name: 'options', type: 'SelectOption[]', default: '-', description: 'List of options ({ value, label, disabled? }).' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Enable multiple selection.' },
    { name: 'placeholder', type: 'string', default: '-', description: 'Placeholder text when no option is selected.' },
    { name: 'label', type: 'string', default: '-', description: 'Label text shown above the trigger.' },
    { name: 'description', type: 'string', default: '-', description: 'Help text shown below the trigger.' },
    { name: 'name', type: 'string', default: '-', description: 'Field name for form context error matching.' },
    { name: 'errorMessage', type: 'string', default: '-', description: 'Error message that activates error state.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the trigger.' },
    { name: 'variant', type: "'primary' | 'secondary'", default: "'primary'", description: 'Visual variant.' },
    { name: 'shadow', type: "'none' | 'xs' | 'sm' | 'md'", default: "'xs'", description: 'Elevation shadow.' },
    { name: 'animated', type: 'boolean', default: 'false', description: 'Tactile press animation — scales to 98% on focus.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the select is disabled.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Whether the select is required.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '[value: SelectValue]', description: 'Emitted when selection changes.' },
    { name: 'change', type: '[value: SelectValue]', description: 'Emitted on change.' },
    { name: 'open', type: '[]', description: 'Emitted when the dropdown opens.' },
    { name: 'close', type: '[]', description: 'Emitted when the dropdown closes.' },
  ],

  themeCode: `import { selectTheme } from '@ousi-ui/vue'

// CVA variants: primary, secondary
// CVA sizes: sm, md, lg
// CVA booleans: disabled, invalid`,

  keyboard: [
    { key: 'enter', description: 'Opens the dropdown or selects the focused option.' },
    { key: 'space', description: 'Opens the dropdown or selects the focused option.' },
    { key: 'escape', description: 'Closes the dropdown.' },
    { key: 'ArrowDown', description: 'Opens the dropdown or moves focus to the next option.' },
    { key: 'ArrowUp', description: 'Moves focus to the previous option.' },
    { key: 'Home', description: 'Moves focus to the first option.' },
    { key: 'End', description: 'Moves focus to the last option.' },
  ],

  aria: [
    { attribute: 'role="combobox"', condition: 'always', description: 'Identifies the select as a combobox.' },
    { attribute: 'aria-expanded', condition: 'dropdown open', description: 'Indicates whether the dropdown is open.' },
    { attribute: 'aria-invalid', condition: 'errorMessage is set', description: 'Indicates the select has an error.' },
    { attribute: 'aria-required', condition: 'required', description: 'Indicates the field is required.' },
  ],

  bestPractices: [
    { text: 'Always provide a label for accessibility.', good: true },
    { text: 'Use placeholder to guide users on what to select.', good: true },
    { text: 'Mark disabled options clearly so users understand they are unavailable.', good: true },
    { text: "Don't use Select for fewer than 3 options — use Radio or Checkbox instead.", good: false },
  ],

  haptics: {
    defaultPreset: "'selection'",
    trigger: 'When an option is selected from the dropdown',
    notes: 'Fires once per selection, not on dropdown open/close.',
  },
}
