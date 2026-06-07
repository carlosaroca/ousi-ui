import type { ComponentData } from './types'

export const checkboxData: ComponentData = {
  title: 'Checkbox',
  description: 'Toggle a boolean value on or off, with optional indeterminate state.',
  category: 'Forms',
  importCode: "import { OCheckbox } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'CheckboxBasic',
        code: '<OCheckbox label="Accept terms and conditions" />',
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'CheckboxVariants',
        code: `<OCheckbox variant="primary" label="Primary" />
<OCheckbox variant="secondary" label="Secondary" />`,
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'CheckboxSizes',
        code: `<OCheckbox size="sm" label="Small" />
<OCheckbox size="md" label="Medium" />
<OCheckbox size="lg" label="Large" />`,
      },
    },
    {
      id: 'with-description',
      title: 'With Description',
      example: {
        component: 'CheckboxWithDescription',
        code: `<OCheckbox
  label="Marketing emails"
  description="Receive emails about new products and features."
/>`,
      },
    },
    {
      id: 'with-error',
      title: 'With Error',
      example: {
        component: 'CheckboxWithError',
        code: `<OCheckbox
  label="I agree to the terms"
  error-message="You must accept the terms to continue."
/>`,
      },
    },
    {
      id: 'indeterminate',
      title: 'Indeterminate',
      example: {
        component: 'CheckboxIndeterminate',
        code: '<OCheckbox indeterminate label="Select all" />',
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'CheckboxDisabled',
        code: `<OCheckbox disabled label="Disabled unchecked" />
<OCheckbox disabled :model-value="true" label="Disabled checked" />`,
      },
    },
    {
      id: 'readonly',
      title: 'Readonly',
      example: {
        component: 'CheckboxReadonly',
        code: '<OCheckbox readonly :model-value="true" label="Read-only checked" />',
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'boolean', default: 'false', description: 'Controlled checked state (v-model).' },
    { name: 'defaultValue', type: 'boolean', default: 'false', description: 'Default checked state when uncontrolled.' },
    { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Show indeterminate state (overrides checked visually).' },
    { name: 'label', type: 'string', default: '-', description: 'Label text.' },
    { name: 'description', type: 'string', default: '-', description: 'Help text below the label.' },
    { name: 'errorMessage', type: 'string', default: '-', description: 'Error message that activates error state.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Whether the field is required.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the checkbox is disabled.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Whether the checkbox is read-only.' },
    { name: 'invalid', type: 'boolean', default: 'false', description: 'Force invalid state without error message.' },
    { name: 'variant', type: "'primary' | 'secondary'", default: "'primary'", description: 'Visual variant.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Control box + label size.' },
    { name: 'shadow', type: "'none' | 'xs' | 'sm'", default: "'none'", description: 'Elevation shadow.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '[value: boolean]', description: 'Emitted when checked state changes.' },
    { name: 'update:indeterminate', type: '[value: boolean]', description: 'Emitted when indeterminate state changes.' },
    { name: 'change', type: '[value: boolean]', description: 'Emitted on change.' },
  ],

  themeCode: `import { checkboxTheme } from '@ousi-ui/vue'

// CVA variants: primary, secondary
// CVA booleans: disabled, invalid, indeterminate`,

  keyboard: [
    { key: 'space', description: 'Toggles the checkbox.' },
    { key: 'tab', description: 'Moves focus to the next focusable element.' },
  ],

  aria: [
    { attribute: 'role="checkbox"', condition: 'always', description: 'Identifies the element as a checkbox.' },
    { attribute: 'aria-checked', condition: 'always', description: 'Reflects the checked state (true, false, or mixed).' },
    { attribute: 'aria-invalid', condition: 'errorMessage or invalid', description: 'Indicates the checkbox has an error.' },
    { attribute: 'aria-required', condition: 'required', description: 'Indicates the field is required.' },
    { attribute: 'aria-disabled', condition: 'disabled', description: 'Indicates the checkbox is disabled.' },
  ],

  bestPractices: [
    { text: 'Always provide a label for accessibility.', good: true },
    { text: 'Use indeterminate state for "select all" patterns with partial selection.', good: true },
    { text: 'Use description to provide additional context about the option.', good: true },
    { text: "Don't use a checkbox for actions — use a Switch for on/off settings.", good: false },
  ],

  haptics: {
    defaultPreset: "'selection'",
    trigger: 'On check/uncheck toggle',
    notes: 'Uses the selection preset for a subtle tick feedback.',
  },
}
