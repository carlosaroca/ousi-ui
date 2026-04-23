import type { ComponentData } from './types'

export const numberFieldData: ComponentData = {
  title: 'NumberField',
  description: 'Numeric input with increment/decrement buttons and optional formatting.',
  category: 'Forms',
  importCode: "import { ONumberField } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'NumberFieldBasic',
        code: '<ONumberField label="Quantity" :default-value="1" />',
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'NumberFieldVariants',
        code: `<ONumberField variant="primary" label="Primary" :default-value="10" />
<ONumberField variant="secondary" label="Secondary" :default-value="10" />`,
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'NumberFieldSizes',
        code: `<ONumberField size="sm" label="Small" :default-value="5" />
<ONumberField size="md" label="Medium" :default-value="5" />
<ONumberField size="lg" label="Large" :default-value="5" />`,
      },
    },
    {
      id: 'min-max',
      title: 'Min / Max',
      example: {
        component: 'NumberFieldMinMax',
        code: `<ONumberField
  label="Rating"
  :min="1"
  :max="5"
  :default-value="3"
/>`,
      },
    },
    {
      id: 'step',
      title: 'Custom Step',
      example: {
        component: 'NumberFieldStep',
        code: `<ONumberField
  label="Price"
  :step="0.5"
  :default-value="10"
  :format-options="{ style: 'currency', currency: 'USD' }"
/>`,
      },
    },
    {
      id: 'with-description',
      title: 'With Description',
      example: {
        component: 'NumberFieldWithDescription',
        code: `<ONumberField
  label="Guests"
  description="Maximum 10 guests allowed."
  :min="1"
  :max="10"
  :default-value="2"
/>`,
      },
    },
    {
      id: 'with-error',
      title: 'With Error',
      example: {
        component: 'NumberFieldWithError',
        code: `<ONumberField
  label="Age"
  error-message="Age must be at least 18."
  :model-value="15"
/>`,
      },
    },
    {
      id: 'no-buttons',
      title: 'Without Buttons',
      example: {
        component: 'NumberFieldNoButtons',
        code: `<ONumberField
  label="Year"
  :show-buttons="false"
  :default-value="2026"
/>`,
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'NumberFieldDisabled',
        code: '<ONumberField disabled label="Disabled" :default-value="0" />',
      },
    },
    {
      id: 'full-width',
      title: 'Full Width',
      example: {
        component: 'NumberFieldFullWidth',
        code: '<ONumberField label="Amount" :default-value="100" />',
      },
    },
    {
      id: 'animated',
      title: 'Animated',
      example: {
        component: 'NumberFieldAnimated',
        code: `<ONumberField label="Default" :default-value="10" />
<ONumberField label="Animated" :default-value="10" animated />`,
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'number | null', default: '-', description: 'Current value (v-model).' },
    { name: 'defaultValue', type: 'number | null', default: '-', description: 'Default value.' },
    { name: 'min', type: 'number', default: '-', description: 'Minimum value.' },
    { name: 'max', type: 'number', default: '-', description: 'Maximum value.' },
    { name: 'step', type: 'number', default: '1', description: 'Step for increment/decrement.' },
    { name: 'label', type: 'string', default: '-', description: 'Label text.' },
    { name: 'description', type: 'string', default: '-', description: 'Description text.' },
    { name: 'errorMessage', type: 'string', default: '-', description: 'Error message.' },
    { name: 'placeholder', type: 'string', default: '-', description: 'Placeholder text.' },
    { name: 'name', type: 'string', default: '-', description: 'Field name for form context.' },
    { name: 'variant', type: "'primary' | 'secondary'", default: "'primary'", description: 'Visual variant.' },
    { name: 'shadow', type: "'none' | 'xs' | 'sm' | 'md'", default: "'xs'", description: 'Elevation shadow.' },
    { name: 'animated', type: 'boolean', default: 'false', description: 'Tactile press animation — scales to 98% on focus.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the field.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Read-only mode.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Required.' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', default: '-', description: 'Intl.NumberFormat options for display.' },
    { name: 'locale', type: 'string', default: '-', description: 'Locale for formatting.' },
    { name: 'showButtons', type: 'boolean', default: 'true', description: 'Show increment/decrement buttons.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '[value: number | null]', description: 'Emitted when value changes.' },
    { name: 'change', type: '[value: number | null]', description: 'Emitted on change.' },
    { name: 'focus', type: '[event: FocusEvent]', description: 'Emitted when the field is focused.' },
    { name: 'blur', type: '[event: FocusEvent]', description: 'Emitted when the field loses focus.' },
  ],

  themeCode: `import { numberFieldTheme } from '@ousi-ui/vue'

// CVA variants: primary, secondary
// CVA sizes: sm, md, lg
// CVA booleans: disabled, invalid`,

  keyboard: [
    { key: 'ArrowUp', description: 'Increments the value by one step.' },
    { key: 'ArrowDown', description: 'Decrements the value by one step.' },
    { key: 'Home', description: 'Sets value to minimum (if defined).' },
    { key: 'End', description: 'Sets value to maximum (if defined).' },
    { key: 'tab', description: 'Moves focus to the next focusable element.' },
  ],

  aria: [
    { attribute: 'role="spinbutton"', condition: 'always', description: 'Identifies the element as a spin button.' },
    { attribute: 'aria-valuenow', condition: 'always', description: 'Current value.' },
    { attribute: 'aria-valuemin', condition: 'min is set', description: 'Minimum value.' },
    { attribute: 'aria-valuemax', condition: 'max is set', description: 'Maximum value.' },
    { attribute: 'aria-invalid', condition: 'errorMessage is set', description: 'Indicates the field has an error.' },
  ],

  bestPractices: [
    { text: 'Always provide a label for accessibility.', good: true },
    { text: 'Set sensible min/max bounds to prevent invalid input.', good: true },
    { text: 'Use formatOptions for currency, percentage, or unit display.', good: true },
    { text: "Don't hide the buttons unless space is extremely constrained.", good: false },
  ],
}
