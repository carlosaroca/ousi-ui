import type { ComponentData } from './types'

export const inputOtpData: ComponentData = {
  title: 'InputOtp',
  description: 'One-time password input with individual character slots and auto-advance.',
  category: 'Forms',
  importCode: "import { OInputOtp } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'InputOtpBasic',
        code: '<OInputOtp label="Verification code" />',
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'InputOtpVariants',
        code: `<OInputOtp variant="primary" label="Primary" />
<OInputOtp variant="secondary" label="Secondary" />`,
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'InputOtpSizes',
        code: `<OInputOtp size="sm" label="Small" />
<OInputOtp size="md" label="Medium" />
<OInputOtp size="lg" label="Large" />`,
      },
    },
    {
      id: 'length',
      title: 'Custom Length',
      example: {
        component: 'InputOtpLength',
        code: '<OInputOtp :length="4" label="4-digit code" />',
      },
    },
    {
      id: 'groups',
      title: 'Grouped Slots',
      example: {
        component: 'InputOtpGroups',
        code: `<OInputOtp
  :groups="[{ slots: 3 }, { slots: 3 }]"
  label="Grouped code"
/>`,
      },
    },
    {
      id: 'masked',
      title: 'Masked',
      example: {
        component: 'InputOtpMasked',
        code: '<OInputOtp mask label="PIN" :length="4" />',
      },
    },
    {
      id: 'with-error',
      title: 'With Error',
      example: {
        component: 'InputOtpWithError',
        code: `<OInputOtp
  label="Code"
  error-message="Invalid code. Please try again."
/>`,
      },
    },
    {
      id: 'alphanumeric',
      title: 'Alphanumeric',
      example: {
        component: 'InputOtpAlphanumeric',
        code: '<OInputOtp type="alphanumeric" label="License key" />',
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'InputOtpDisabled',
        code: '<OInputOtp disabled label="Disabled" />',
      },
    },
    {
      id: 'animated',
      title: 'Animated',
      example: {
        component: 'InputOtpAnimated',
        code: `<OInputOtp label="Default" />
<OInputOtp label="Animated" animated />`,
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'string', default: '-', description: 'Current value (v-model).' },
    { name: 'defaultValue', type: 'string', default: '-', description: 'Default value.' },
    { name: 'length', type: 'number', default: '6', description: 'Total number of slots.' },
    { name: 'groups', type: 'OtpGroup[]', default: '-', description: 'Group slots with separators between groups.' },
    { name: 'type', type: "'digit' | 'alpha' | 'alphanumeric'", default: "'digit'", description: 'Which characters to accept.' },
    { name: 'variant', type: "'primary' | 'secondary'", default: "'primary'", description: 'Visual variant.' },
    { name: 'shadow', type: "'none' | 'xs' | 'sm' | 'md'", default: "'xs'", description: 'Elevation shadow.' },
    { name: 'animated', type: 'boolean', default: 'false', description: 'Tactile press animation — scales to 98% on focus.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the slots.' },
    { name: 'label', type: 'string', default: '-', description: 'Label text.' },
    { name: 'description', type: 'string', default: '-', description: 'Description text.' },
    { name: 'errorMessage', type: 'string', default: '-', description: 'Error message that activates error state.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the input.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Read-only mode.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Mark as required.' },
    { name: 'shakeOnError', type: 'boolean', default: 'true', description: 'Shake slots on error.' },
    { name: 'clearOnError', type: 'boolean', default: 'false', description: 'Clear slots on error.' },
    { name: 'clearDelay', type: 'number', default: '80', description: 'Delay between clears in ms.' },
    { name: 'mask', type: 'boolean', default: 'false', description: 'Mask values like a password.' },
    { name: 'placeholder', type: 'string', default: "'○'", description: 'Placeholder per empty slot.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '[value: string]', description: 'Emitted when value changes.' },
    { name: 'change', type: '[value: string]', description: 'Emitted on change.' },
    { name: 'complete', type: '[value: string]', description: 'Emitted when all slots are filled.' },
    { name: 'clear', type: '[]', description: 'Emitted after auto-clear on error.' },
  ],

  themeCode: `import { inputOtpTheme } from '@ousi-ui/vue'

// CVA variants: primary, secondary
// CVA sizes: sm, md, lg
// CVA booleans: disabled, invalid`,

  keyboard: [
    { key: 'ArrowRight', description: 'Moves focus to the next slot.' },
    { key: 'ArrowLeft', description: 'Moves focus to the previous slot.' },
    { key: 'Backspace', description: 'Clears the current slot and moves to the previous.' },
    { key: 'Delete', description: 'Clears the current slot.' },
    { key: 'tab', description: 'Moves focus to the next focusable element.' },
  ],

  aria: [
    { attribute: 'role="group"', condition: 'always', description: 'Groups the OTP slots.' },
    { attribute: 'aria-label', condition: 'label is set', description: 'Describes the OTP input.' },
    { attribute: 'aria-invalid', condition: 'errorMessage is set', description: 'Indicates the input has an error.' },
  ],

  bestPractices: [
    { text: 'Always provide a label for accessibility.', good: true },
    { text: 'Use mask for sensitive codes like PINs.', good: true },
    { text: 'Use groups to visually separate segments (e.g., 3-3 for a 6-digit code).', good: true },
    { text: 'Listen for the complete event to auto-submit the form.', good: true },
    { text: "Don't make OTP fields too long — 4 to 8 slots is standard.", good: false },
  ],
}
