import type { ComponentData } from './types'

export const switchData: ComponentData = {
  title: 'Switch',
  description: 'Toggle control for on/off settings, similar to a physical light switch.',
  category: 'Forms',
  importCode: "import { OSwitch } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'SwitchBasic',
        code: '<OSwitch label="Enable notifications" />',
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'SwitchSizes',
        code: `<OSwitch size="sm" label="Small" />
<OSwitch size="md" label="Medium" />
<OSwitch size="lg" label="Large" />`,
      },
    },
    {
      id: 'with-description',
      title: 'With Description',
      example: {
        component: 'SwitchWithDescription',
        code: `<OSwitch
  label="Dark mode"
  description="Toggle between light and dark themes."
/>`,
      },
    },
    {
      id: 'controlled',
      title: 'Controlled',
      example: {
        component: 'SwitchControlled',
        code: `<script setup>
const enabled = ref(true)
</script>
<OSwitch v-model="enabled" label="Wi-Fi" />`,
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'SwitchDisabled',
        code: `<OSwitch disabled label="Disabled off" />
<OSwitch disabled :model-value="true" label="Disabled on" />`,
      },
    },
    {
      id: 'readonly',
      title: 'Readonly',
      example: {
        component: 'SwitchReadonly',
        code: '<OSwitch readonly :model-value="true" label="Read-only on" />',
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'boolean', default: 'false', description: 'Controlled checked state (v-model).' },
    { name: 'defaultValue', type: 'boolean', default: 'false', description: 'Default checked state when uncontrolled.' },
    { name: 'label', type: 'string', default: '-', description: 'Label text.' },
    { name: 'description', type: 'string', default: '-', description: 'Help text below the label.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the switch.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the switch is disabled.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Whether the switch is read-only.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '[value: boolean]', description: 'Emitted when the switch is toggled.' },
    { name: 'change', type: '[value: boolean]', description: 'Emitted on change.' },
  ],

  themeCode: `import { switchTheme } from '@ousi-ui/vue'

// CVA sizes: sm, md, lg
// CVA booleans: disabled, checked`,

  keyboard: [
    { key: 'space', description: 'Toggles the switch.' },
    { key: 'enter', description: 'Toggles the switch.' },
    { key: 'tab', description: 'Moves focus to the next focusable element.' },
  ],

  aria: [
    { attribute: 'role="switch"', condition: 'always', description: 'Identifies the element as a switch.' },
    { attribute: 'aria-checked', condition: 'always', description: 'Reflects the on/off state.' },
    { attribute: 'aria-disabled', condition: 'disabled', description: 'Indicates the switch is disabled.' },
  ],

  bestPractices: [
    { text: 'Use Switch for settings that take effect immediately (e.g., toggling dark mode).', good: true },
    { text: 'Always provide a label for accessibility.', good: true },
    { text: 'Use description to explain the effect of the toggle.', good: true },
    { text: "Don't use Switch for form submissions — use Checkbox instead.", good: false },
  ],

  haptics: {
    defaultPreset: "'light'",
    trigger: 'On toggle, at the same instant as the visual state change',
    notes: 'Fires for both on→off and off→on transitions.',
  },
}
