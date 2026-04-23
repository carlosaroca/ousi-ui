import type { ComponentData } from './types'

export const inputData: ComponentData = {
  title: 'Input',
  description: 'Single-line text field for user input with built-in label, description, and error handling.',
  category: 'Forms',
  importCode: "import { OInput } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'InputBasic',
        code: '<OInput placeholder="Enter text..." />',
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'InputVariants',
        code: `<OInput variant="primary" placeholder="Primary" />
<OInput variant="secondary" placeholder="Secondary" />`,
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'InputSizes',
        code: `<OInput size="sm" placeholder="Small" />
<OInput size="md" placeholder="Medium" />
<OInput size="lg" placeholder="Large" />`,
      },
    },
    {
      id: 'with-label',
      title: 'With Label',
      example: {
        component: 'InputWithLabel',
        code: '<OInput label="Email" placeholder="you@example.com" />',
      },
    },
    {
      id: 'with-description',
      title: 'With Description',
      example: {
        component: 'InputWithDescription',
        code: `<OInput
  label="Username"
  description="Must be at least 3 characters."
  placeholder="johndoe"
/>`,
      },
    },
    {
      id: 'with-error',
      title: 'With Error',
      example: {
        component: 'InputWithError',
        code: `<OInput
  label="Email"
  error-message="Please enter a valid email address."
  model-value="not-an-email"
/>`,
      },
    },
    {
      id: 'clearable',
      title: 'Clearable',
      example: {
        component: 'InputClearable',
        code: '<OInput clearable placeholder="Type and clear..." />',
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'InputDisabled',
        code: '<OInput disabled placeholder="Disabled input" />',
      },
    },
    {
      id: 'readonly',
      title: 'Readonly',
      example: {
        component: 'InputReadonly',
        code: '<OInput readonly model-value="Read only value" />',
      },
    },
    {
      id: 'full-width',
      title: 'Full Width',
      example: {
        component: 'InputFullWidth',
        code: '<OInput placeholder="Full width input" />',
      },
    },
    {
      id: 'animated',
      title: 'Animated',
      example: {
        component: 'InputAnimated',
        code: `<OInput placeholder="Default — no animation" />
<OInput placeholder="With tactile press" animated />`,
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'string | number', default: '-', description: 'Controlled value (v-model).' },
    { name: 'defaultValue', type: 'string | number', default: '-', description: 'Default value when uncontrolled.' },
    { name: 'type', type: "'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'", default: "'text'", description: 'HTML input type.' },
    { name: 'placeholder', type: 'string', default: '-', description: 'Placeholder text.' },
    { name: 'label', type: 'string', default: '-', description: 'Label text shown above the input.' },
    { name: 'description', type: 'string', default: '-', description: 'Help text shown below the input.' },
    { name: 'name', type: 'string', default: '-', description: 'Field name for form context error matching.' },
    { name: 'errorMessage', type: 'string', default: '-', description: 'Error message that activates error state.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the input.' },
    { name: 'variant', type: "'primary' | 'secondary'", default: "'primary'", description: 'Visual variant.' },
    { name: 'shadow', type: "'none' | 'xs' | 'sm' | 'md'", default: "'xs'", description: 'Elevation shadow.' },
    { name: 'animated', type: 'boolean', default: 'false', description: 'Tactile press animation — scales to 98% on focus.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the input is disabled.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Whether the input is read-only.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Whether the input is required.' },
    { name: 'clearable', type: 'boolean', default: 'false', description: 'Show a clear button when there is a value.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Show a loading spinner in the end slot.' },
    { name: 'as', type: 'string | Component', default: '-', description: 'Render wrapper as a different element.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'start', type: 'slot', description: 'Content before the input (e.g., icon).' },
    { name: 'end', type: 'slot', description: 'Content after the input (e.g., icon).' },
  ],

  emits: [
    { name: 'update:modelValue', type: '[value: string | number]', description: 'Emitted when value changes.' },
    { name: 'change', type: '[value: string | number]', description: 'Emitted on change event.' },
    { name: 'focus', type: '[event: FocusEvent]', description: 'Emitted when the input is focused.' },
    { name: 'blur', type: '[event: FocusEvent]', description: 'Emitted when the input loses focus.' },
    { name: 'clear', type: '[]', description: 'Emitted when the clear button is clicked.' },
  ],

  themeCode: `import { inputTheme } from '@ousi-ui/vue'

// CVA variants: primary, secondary
// CVA sizes: sm, md, lg
// CVA booleans: disabled, invalid`,

  keyboard: [
    { key: 'tab', description: 'Moves focus to the next focusable element.' },
    { key: 'escape', description: 'Clears the input when clearable.' },
  ],

  aria: [
    { attribute: 'aria-invalid', condition: 'errorMessage is set', description: 'Indicates the input has an error.' },
    { attribute: 'aria-describedby', condition: 'description or errorMessage', description: 'Links to the description or error text.' },
    { attribute: 'aria-required', condition: 'required', description: 'Indicates the field is required.' },
    { attribute: 'aria-disabled', condition: 'disabled', description: 'Indicates the input is disabled.' },
  ],

  bestPractices: [
    { text: 'Always provide a label for accessibility, even if visually hidden.', good: true },
    { text: 'Use description to give users additional context about the expected input.', good: true },
    { text: 'Use error-message to explain what went wrong and how to fix it.', good: true },
    { text: "Don't use placeholder as a replacement for a label.", good: false },
    { text: "Don't remove the focus ring — essential for keyboard navigation.", good: false },
  ],
}
