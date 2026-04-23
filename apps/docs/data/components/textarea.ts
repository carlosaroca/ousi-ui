import type { ComponentData } from './types'

export const textareaData: ComponentData = {
  title: 'Textarea',
  description: 'Multi-line text field with optional auto-resize and built-in label support.',
  category: 'Forms',
  importCode: "import { OTextarea } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'TextareaBasic',
        code: '<OTextarea placeholder="Write something..." />',
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'TextareaVariants',
        code: `<OTextarea variant="primary" placeholder="Primary" />
<OTextarea variant="secondary" placeholder="Secondary" />`,
      },
    },
    {
      id: 'with-label',
      title: 'With Label',
      example: {
        component: 'TextareaWithLabel',
        code: '<OTextarea label="Message" placeholder="Type your message..." />',
      },
    },
    {
      id: 'with-description',
      title: 'With Description',
      example: {
        component: 'TextareaWithDescription',
        code: `<OTextarea
  label="Bio"
  description="Tell us a little about yourself."
  placeholder="I am a..."
/>`,
      },
    },
    {
      id: 'with-error',
      title: 'With Error',
      example: {
        component: 'TextareaWithError',
        code: `<OTextarea
  label="Comment"
  error-message="Comment is required."
/>`,
      },
    },
    {
      id: 'auto-resize',
      title: 'Auto Resize',
      example: {
        component: 'TextareaAutoResize',
        code: `<OTextarea
  auto-resize
  :min-rows="2"
  :max-rows="6"
  placeholder="This textarea grows with content..."
/>`,
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'TextareaDisabled',
        code: '<OTextarea disabled placeholder="Disabled textarea" />',
      },
    },
    {
      id: 'readonly',
      title: 'Readonly',
      example: {
        component: 'TextareaReadonly',
        code: '<OTextarea readonly model-value="This text cannot be edited." />',
      },
    },
    {
      id: 'full-width',
      title: 'Full Width',
      example: {
        component: 'TextareaFullWidth',
        code: '<OTextarea placeholder="Full width textarea" />',
      },
    },
    {
      id: 'animated',
      title: 'Animated',
      example: {
        component: 'TextareaAnimated',
        code: `<OTextarea placeholder="Default — no animation" />
<OTextarea placeholder="With tactile press" animated />`,
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'string', default: '-', description: 'Controlled value (v-model).' },
    { name: 'defaultValue', type: 'string', default: '-', description: 'Default value when uncontrolled.' },
    { name: 'placeholder', type: 'string', default: '-', description: 'Placeholder text.' },
    { name: 'label', type: 'string', default: '-', description: 'Label text.' },
    { name: 'description', type: 'string', default: '-', description: 'Help text below the textarea.' },
    { name: 'name', type: 'string', default: '-', description: 'Field name for form context error matching.' },
    { name: 'errorMessage', type: 'string', default: '-', description: 'Error message that activates error state.' },
    { name: 'rows', type: 'number', default: '3', description: 'Number of visible rows.' },
    { name: 'minRows', type: 'number', default: '-', description: 'Minimum rows for auto-resize.' },
    { name: 'maxRows', type: 'number', default: '-', description: 'Maximum rows for auto-resize. 0 = no limit.' },
    { name: 'autoResize', type: 'boolean', default: 'false', description: 'Auto-resize with content.' },
    { name: 'resize', type: "'none' | 'vertical' | 'horizontal' | 'both'", default: "'vertical'", description: 'CSS resize behavior.' },
    { name: 'variant', type: "'primary' | 'secondary'", default: "'primary'", description: 'Visual variant.' },
    { name: 'shadow', type: "'none' | 'xs' | 'sm' | 'md'", default: "'xs'", description: 'Elevation shadow.' },
    { name: 'animated', type: 'boolean', default: 'false', description: 'Tactile press animation — scales to 98% on focus.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the textarea is disabled.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Whether the textarea is read-only.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Whether the textarea is required.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '[value: string]', description: 'Emitted when value changes.' },
    { name: 'change', type: '[value: string]', description: 'Emitted on change event.' },
    { name: 'focus', type: '[event: FocusEvent]', description: 'Emitted when the textarea is focused.' },
    { name: 'blur', type: '[event: FocusEvent]', description: 'Emitted when the textarea loses focus.' },
  ],

  themeCode: `import { textareaTheme } from '@ousi-ui/vue'

// CVA variants: primary, secondary
// CVA booleans: disabled, invalid`,

  keyboard: [
    { key: 'tab', description: 'Moves focus to the next focusable element.' },
  ],

  aria: [
    { attribute: 'aria-invalid', condition: 'errorMessage is set', description: 'Indicates the textarea has an error.' },
    { attribute: 'aria-describedby', condition: 'description or errorMessage', description: 'Links to the description or error text.' },
    { attribute: 'aria-required', condition: 'required', description: 'Indicates the field is required.' },
  ],

  bestPractices: [
    { text: 'Always provide a label for accessibility.', good: true },
    { text: 'Use auto-resize for a better user experience when content length varies.', good: true },
    { text: 'Set maxRows to prevent the textarea from growing too large.', good: true },
    { text: "Don't use placeholder as a replacement for a label.", good: false },
  ],
}
