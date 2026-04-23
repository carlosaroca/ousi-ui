import type { ComponentData } from './types'

export const colorFieldData: ComponentData = {
  title: 'Color Field',
  description: 'A text input for entering color values with optional swatch preview.',
  category: 'Colors',
  importCode: "import { OColorField } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'ColorFieldUsage',
        code: '<OColorField v-model="color" label="Color" />',
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'ColorFieldVariants',
        code: `<OColorField v-model="color" label="Primary" variant="primary" show-swatch />
<OColorField v-model="color" label="Secondary" variant="secondary" show-swatch />`,
      },
    },
    {
      id: 'formats',
      title: 'Formats',
      example: {
        component: 'ColorFieldFormats',
        code: `<!-- Outputs normalized hex -->
<OColorField v-model="hex" label="Hex" format="hex" show-swatch />

<!-- Outputs rgb() string -->
<OColorField v-model="rgb" label="RGB" format="rgb" show-swatch />`,
      },
    },
    {
      id: 'with-swatch',
      title: 'With Swatch',
      example: {
        component: 'ColorFieldWithSwatch',
        code: '<OColorField v-model="color" label="Color" show-swatch />',
      },
    },
    {
      id: 'full-width',
      title: 'Full Width',
      example: {
        component: 'ColorFieldFullWidth',
        code: '<OColorField v-model="color" label="Color" />',
      },
    },
    {
      id: 'animated',
      title: 'Animated',
      example: {
        component: 'ColorFieldAnimated',
        code: `<OColorField label="Default" show-swatch />
<OColorField label="Animated" show-swatch animated />`,
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'string', default: "''", description: 'Color value (v-model). Any valid CSS color.' },
    { name: 'defaultValue', type: 'string', default: "''", description: 'Default color value.' },
    { name: 'label', type: 'string', default: '-', description: 'Label text.' },
    { name: 'description', type: 'string', default: '-', description: 'Help text.' },
    { name: 'errorMessage', type: 'string', default: '-', description: 'Error message — overrides internal validation.' },
    { name: 'format', type: "'hex' | 'rgb' | 'hsl'", default: "'hex'", description: 'Output format.' },
    { name: 'showSwatch', type: 'boolean', default: 'false', description: 'Show color preview swatch.' },
    { name: 'variant', type: "'primary' | 'secondary'", default: "'primary'", description: 'Visual variant.' },
    { name: 'shadow', type: "'none' | 'xs' | 'sm' | 'md'", default: "'xs'", description: 'Elevation shadow.' },
    { name: 'animated', type: 'boolean', default: 'false', description: 'Tactile press animation — scales to 98% on focus.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the field is disabled.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Whether the field is read-only.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Whether a value is required.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'update:modelValue', type: 'string', description: 'Emitted when the color value changes.' },
    { name: 'change', type: 'string', description: 'Emitted on user-initiated change.' },
    { name: 'invalidColor', type: 'string', description: 'Emitted when an invalid color is entered.' },
  ],

  themeCode: `import { colorFieldTheme } from '@ousi-ui/vue'`,

  keyboard: [
    { key: 'Tab', description: 'Move focus in and out of the field.' },
    { key: 'Enter', description: 'Confirm the entered value.' },
  ],

  aria: [
    { attribute: 'aria-label', condition: 'label prop set', description: 'Labels the color input.' },
    { attribute: 'aria-invalid', condition: 'errorMessage set', description: 'Indicates a validation error.' },
    { attribute: 'aria-disabled', condition: 'disabled', description: 'Marks the field as non-interactive.' },
    { attribute: 'aria-describedby', condition: 'description or errorMessage', description: 'Points to help or error text.' },
  ],

  bestPractices: [
    { text: 'Always provide a label for accessibility.', good: true },
    { text: 'Use showSwatch to give immediate visual feedback on the entered color.', good: true },
    { text: "Don't accept arbitrary text without validation — use the format prop.", good: false },
  ],
}
