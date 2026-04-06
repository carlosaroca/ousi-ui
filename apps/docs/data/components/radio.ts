import type { ComponentData } from './types'

export const radioData: ComponentData = {
  title: 'Radio',
  description: 'Select a single option from a group of choices.',
  category: 'Form',
  importCode: "import { ORadio, ORadioGroup } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'RadioBasic',
        code: `<ORadioGroup label="Favorite fruit" default-value="apple">
  <ORadio value="apple" label="Apple" />
  <ORadio value="banana" label="Banana" />
  <ORadio value="cherry" label="Cherry" />
</ORadioGroup>`,
      },
    },
    {
      id: 'controlled',
      title: 'Controlled',
      example: {
        component: 'RadioControlled',
        code: `<ORadioGroup v-model="selected" label="Plan">
  <ORadio value="free" label="Free" />
  <ORadio value="pro" label="Pro" />
  <ORadio value="enterprise" label="Enterprise" />
</ORadioGroup>
<p>Selected: {{ selected }}</p>`,
      },
    },
    {
      id: 'horizontal',
      title: 'Horizontal',
      example: {
        component: 'RadioHorizontal',
        code: `<ORadioGroup orientation="horizontal" label="Size" default-value="md">
  <ORadio value="sm" label="Small" />
  <ORadio value="md" label="Medium" />
  <ORadio value="lg" label="Large" />
</ORadioGroup>`,
      },
    },
    {
      id: 'with-description',
      title: 'With Description',
      example: {
        component: 'RadioWithDescription',
        code: `<ORadioGroup label="Shipping" default-value="standard">
  <ORadio value="standard" label="Standard" description="4-7 business days" />
  <ORadio value="express" label="Express" description="1-3 business days" />
</ORadioGroup>`,
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'RadioDisabled',
        code: `<ORadioGroup label="Options" disabled default-value="a">
  <ORadio value="a" label="Option A" />
  <ORadio value="b" label="Option B" />
</ORadioGroup>`,
      },
    },
  ],

  props: [
    { name: 'value', type: 'string', default: '-', description: 'Unique value for this radio option (ORadio).' },
    { name: 'label', type: 'string', default: '-', description: 'Label text.' },
    { name: 'description', type: 'string', default: '-', description: 'Help text below the label (ORadio).' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the radio or entire group.' },
    { name: 'modelValue', type: 'string', default: '-', description: 'Selected value (v-model on ORadioGroup).' },
    { name: 'defaultValue', type: 'string', default: '-', description: 'Default selected value (ORadioGroup).' },
    { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Layout orientation (ORadioGroup).' },
    { name: 'errorMessage', type: 'string', default: '-', description: 'Error message — activates error state (ORadioGroup).' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Whether a selection is required (ORadioGroup).' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '(value: string) => void', description: 'Fired when the selected value changes.' },
    { name: 'change', type: '(value: string) => void', description: 'Fired when a new radio is selected.' },
  ],

  keyboard: [
    { key: 'arrow-down', description: 'Move focus to the next radio.' },
    { key: 'arrow-up', description: 'Move focus to the previous radio.' },
    { key: 'arrow-right', description: 'Move focus to the next radio (horizontal).' },
    { key: 'arrow-left', description: 'Move focus to the previous radio (horizontal).' },
    { key: 'space', description: 'Select the focused radio.' },
  ],

  aria: [
    { attribute: 'role="radiogroup"', condition: 'ORadioGroup', description: 'Groups the radio buttons.' },
    { attribute: 'role="radio"', condition: 'ORadio', description: 'Identifies the element as a radio button.' },
    { attribute: 'aria-checked', condition: 'always', description: 'Indicates whether the radio is selected.' },
  ],

  haptics: {
    defaultPreset: "'selection'",
    trigger: 'On radio selection within the group',
    notes: 'Fires when a new radio option is selected.',
  },
}
