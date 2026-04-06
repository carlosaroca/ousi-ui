import type { ComponentData } from './types'

export const sliderData: ComponentData = {
  title: 'Slider',
  description: 'Range input for selecting a numeric value or range by dragging a thumb along a track.',
  category: 'Forms',
  importCode: "import { OSlider } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'SliderBasic',
        code: '<OSlider :default-value="50" label="Volume" />',
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'SliderSizes',
        code: `<OSlider size="sm" :default-value="30" label="Small" />
<OSlider size="md" :default-value="50" label="Medium" />
<OSlider size="lg" :default-value="70" label="Large" />`,
      },
    },
    {
      id: 'colors',
      title: 'Colors',
      example: {
        component: 'SliderColors',
        code: `<OSlider color="primary" :default-value="50" label="Primary" />
<OSlider color="secondary" :default-value="50" label="Secondary" />
<OSlider color="success" :default-value="50" label="Success" />
<OSlider color="warning" :default-value="50" label="Warning" />
<OSlider color="danger" :default-value="50" label="Danger" />`,
      },
    },
    {
      id: 'with-output',
      title: 'With Output',
      example: {
        component: 'SliderWithOutput',
        code: '<OSlider :default-value="50" show-output label="Brightness" />',
      },
    },
    {
      id: 'range',
      title: 'Range',
      example: {
        component: 'SliderRange',
        code: '<OSlider :default-value="[20, 80]" label="Price range" />',
      },
    },
    {
      id: 'step',
      title: 'Custom Step',
      example: {
        component: 'SliderStep',
        code: '<OSlider :step="10" :default-value="50" show-output label="Step 10" />',
      },
    },
    {
      id: 'vertical',
      title: 'Vertical',
      example: {
        component: 'SliderVertical',
        code: '<OSlider orientation="vertical" :default-value="50" label="Vertical" />',
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'SliderDisabled',
        code: '<OSlider disabled :default-value="50" label="Disabled" />',
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'number | [number, number]', default: '-', description: 'Current value. Number for single, tuple for range.' },
    { name: 'defaultValue', type: 'number | [number, number]', default: '-', description: 'Default value.' },
    { name: 'min', type: 'number', default: '0', description: 'Minimum value.' },
    { name: 'max', type: 'number', default: '100', description: 'Maximum value.' },
    { name: 'step', type: 'number', default: '1', description: 'Step increment.' },
    { name: 'label', type: 'string', default: '-', description: 'Label text.' },
    { name: 'showOutput', type: 'boolean', default: 'false', description: 'Show formatted value output.' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', default: '-', description: 'Intl.NumberFormat options for the output.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Orientation of the slider.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Track and thumb size.' },
    { name: 'color', type: "'primary' | 'secondary' | 'success' | 'danger' | 'warning'", default: "'primary'", description: 'Fill color.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable interaction.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '[value: SliderValue]', description: 'Emitted when value changes.' },
    { name: 'change', type: '[value: SliderValue]', description: 'Emitted when interaction ends.' },
  ],

  themeCode: `import { sliderTheme } from '@ousi-ui/vue'

// CVA sizes: sm, md, lg
// CVA colors: primary, secondary, success, danger, warning
// CVA booleans: disabled, vertical`,

  keyboard: [
    { key: 'ArrowRight', description: 'Increases value by one step.' },
    { key: 'ArrowLeft', description: 'Decreases value by one step.' },
    { key: 'ArrowUp', description: 'Increases value by one step.' },
    { key: 'ArrowDown', description: 'Decreases value by one step.' },
    { key: 'Home', description: 'Sets value to minimum.' },
    { key: 'End', description: 'Sets value to maximum.' },
    { key: 'Page Up', description: 'Increases value by a large step.' },
    { key: 'Page Down', description: 'Decreases value by a large step.' },
  ],

  aria: [
    { attribute: 'role="slider"', condition: 'always', description: 'Identifies the element as a slider.' },
    { attribute: 'aria-valuenow', condition: 'always', description: 'Current value.' },
    { attribute: 'aria-valuemin', condition: 'always', description: 'Minimum value.' },
    { attribute: 'aria-valuemax', condition: 'always', description: 'Maximum value.' },
    { attribute: 'aria-orientation', condition: 'always', description: 'Orientation of the slider.' },
    { attribute: 'aria-disabled', condition: 'disabled', description: 'Indicates the slider is disabled.' },
  ],

  bestPractices: [
    { text: 'Always provide a label for accessibility.', good: true },
    { text: 'Use showOutput so users can see the exact value.', good: true },
    { text: 'Use step values that make sense for the domain (e.g., 5 for percentages).', good: true },
    { text: "Don't use Slider when exact input is needed — use NumberField instead.", good: false },
  ],
}
