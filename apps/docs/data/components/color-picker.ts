import type { ComponentData } from './types'

export const colorPickerData: ComponentData = {
  title: 'Color Picker',
  description: 'A complete color picker with area, sliders, hex input, and optional preset swatches.',
  category: 'Colors',
  importCode: "import { OColorPicker } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'ColorPickerUsage',
        code: '<OColorPicker v-model="color" label="Color" />',
      },
    },
    {
      id: 'with-swatches',
      title: 'With Swatches',
      example: {
        component: 'ColorPickerWithSwatches',
        code: `<OColorPicker
  v-model="color"
  label="Color"
  show-swatches
  :swatches="['#ef4444', '#3b82f6', '#22c55e', '#f59e0b']"
/>`,
      },
    },
    {
      id: 'dark-mode',
      title: 'Dark Mode',
      example: {
        component: 'ColorPickerDarkMode',
        code: `<!-- Works in both light and dark themes automatically -->
<div data-theme="dark" class="bg-black p-4 rounded-xl">
  <OColorPicker v-model="color" label="Brand" show-swatches />
</div>`,
      },
    },
    {
      id: 'placements',
      title: 'Placements',
      example: {
        component: 'ColorPickerPlacements',
        code: `<OColorPicker v-model="c1" placement="bottom-start" />
<OColorPicker v-model="c2" placement="bottom" />
<OColorPicker v-model="c3" placement="bottom-end" />`,
      },
    },
    {
      id: 'without-alpha',
      title: 'Without Alpha',
      example: {
        component: 'ColorPickerWithoutAlpha',
        code: '<OColorPicker v-model="color" label="Color" :show-alpha="false" />',
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'ColorPickerDisabled',
        code: '<OColorPicker label="Color" disabled />',
      },
    },
  ],

  props: [
    { name: 'modelValue', type: '{ h: number; s: number; v: number; a: number }', default: '-', description: 'Current color value (v-model) in HSVA.' },
    { name: 'defaultValue', type: '{ h: number; s: number; v: number; a: number }', default: '-', description: 'Default color value.' },
    { name: 'label', type: 'string', default: '-', description: 'Label shown next to the trigger swatch.' },
    { name: 'showAlpha', type: 'boolean', default: 'true', description: 'Show alpha slider.' },
    { name: 'showHexInput', type: 'boolean', default: 'true', description: 'Show hex input field.' },
    { name: 'showSwatches', type: 'boolean', default: 'false', description: 'Show preset swatches palette.' },
    { name: 'swatches', type: 'string[]', default: 'DEFAULT_SWATCHES', description: 'Custom preset colors (hex strings).' },
    { name: 'placement', type: "'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'", default: "'bottom-start'", description: 'Popover placement.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the picker.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '{ h, s, v, a }', description: 'Emitted when the color changes.' },
    { name: 'change', type: '{ h, s, v, a }', description: 'Emitted on user-initiated change.' },
  ],

  themeCode: `import { colorPickerTheme } from '@ousi-ui/vue'`,

  keyboard: [
    { key: 'Enter / Space', description: 'Open or close the color picker popover.' },
    { key: 'Escape', description: 'Close the popover.' },
    { key: 'Arrow keys', description: 'Adjust the color area or slider values.' },
    { key: 'Tab', description: 'Move focus between controls inside the popover.' },
  ],

  aria: [
    { attribute: 'aria-label', condition: 'label prop set', description: 'Labels the color picker trigger.' },
    { attribute: 'aria-expanded', condition: 'popover open', description: 'Indicates popover visibility.' },
    { attribute: 'aria-haspopup', condition: 'always', description: 'Indicates the trigger opens a popover.' },
    { attribute: 'aria-disabled', condition: 'disabled', description: 'Marks the picker as non-interactive.' },
  ],

  bestPractices: [
    { text: 'Always provide a label for the color picker.', good: true },
    { text: 'Offer preset swatches for common brand colors.', good: true },
    { text: 'Hide the alpha slider when transparency is not needed.', good: true },
    { text: "Don't nest a color picker inside another popover or modal without testing focus trapping.", good: false },
  ],
}
