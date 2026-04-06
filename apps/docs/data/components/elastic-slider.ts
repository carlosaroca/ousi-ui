import type { ComponentData } from './types'

export const elasticSliderData: ComponentData = {
  title: 'ElasticSlider',
  description: 'Interactive slider with animated vertical bars and wave expansion effect on hover.',
  category: 'Forms',
  importCode: "import { OElasticSlider } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'ElasticSliderBasic',
        code: `<OElasticSlider v-model="value" />`,
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'ElasticSliderSizes',
        code: `<OElasticSlider size="sm" :default-value="30" />
<OElasticSlider size="md" :default-value="50" />
<OElasticSlider size="lg" :default-value="70" />`,
      },
    },
    {
      id: 'colors',
      title: 'Colors',
      example: {
        component: 'ElasticSliderColors',
        code: `<OElasticSlider color="primary" :default-value="60" />
<OElasticSlider color="secondary" :default-value="60" />
<OElasticSlider color="success" :default-value="60" />
<OElasticSlider color="danger" :default-value="60" />
<OElasticSlider color="warning" :default-value="60" />`,
      },
    },
    {
      id: 'bar-count',
      title: 'Bar Count',
      example: {
        component: 'ElasticSliderBarCount',
        code: `<OElasticSlider :bar-count="20" :default-value="50" />
<OElasticSlider :bar-count="60" :default-value="50" />`,
      },
    },
    {
      id: 'wave',
      title: 'Wave Intensity',
      example: {
        component: 'ElasticSliderWave',
        code: `<OElasticSlider :wave-radius="4" :wave-intensity="1.3" :default-value="50" />
<OElasticSlider :wave-radius="14" :wave-intensity="2.5" :default-value="50" />`,
      },
    },
    {
      id: 'percent',
      title: 'Percentage Tooltip',
      example: {
        component: 'ElasticSliderPercent',
        code: `<OElasticSlider show-percent :default-value="67" />`,
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'ElasticSliderDisabled',
        code: `<OElasticSlider disabled :default-value="40" />`,
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'number', default: '-', description: 'Current slider value (v-model).' },
    { name: 'defaultValue', type: 'number', default: '50', description: 'Default value when uncontrolled.' },
    { name: 'min', type: 'number', default: '0', description: 'Minimum value.' },
    { name: 'max', type: 'number', default: '100', description: 'Maximum value.' },
    { name: 'step', type: 'number', default: '1', description: 'Step increment.' },
    { name: 'barCount', type: 'number', default: '40', description: 'Number of vertical bars.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size variant.' },
    { name: 'color', type: "'primary' | 'secondary' | 'success' | 'danger' | 'warning'", default: "'primary'", description: 'Active bar color.' },
    { name: 'showTooltip', type: 'boolean', default: 'true', description: 'Show value tooltip on hover/drag.' },
    { name: 'showPercent', type: 'boolean', default: 'false', description: 'Show percentage symbol in tooltip.' },
    { name: 'waveRadius', type: 'number', default: '8', description: 'Number of bars affected by the wave expansion.' },
    { name: 'waveIntensity', type: 'number', default: '1.8', description: 'Maximum height multiplier for wave expansion.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable interaction.' },
  ],

  slots: [
    { name: 'tooltip', type: '{ value: number }', description: 'Custom tooltip content.' },
  ],

  emits: [
    { name: 'update:modelValue', type: 'number', description: 'Emitted when the value changes.' },
    { name: 'change', type: 'number', description: 'Emitted when the value changes.' },
  ],

  bestPractices: [
    { text: 'Use for volume, brightness, or other visual intensity controls.', good: true },
    { text: 'Keep barCount proportional to the slider width for a clean look.', good: true },
    { text: 'Use showPercent for percentage-based values like opacity or volume.', good: true },
    { text: "Don't use for precise numeric input — use NumberField or Slider instead.", good: false },
    { text: "Don't set waveIntensity above 3 — the effect becomes exaggerated.", good: false },
  ],
}
