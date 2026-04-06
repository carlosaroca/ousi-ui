import type { ComponentData } from './types'

export const meterData: ComponentData = {
  title: 'Meter',
  description: 'Display a value within a known range, such as disk usage or battery level.',
  category: 'Feedback',
  importCode: "import { OMeter } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'MeterBasic',
        code: '<OMeter :value="60" label="Storage" show-value-label />',
      },
    },
    {
      id: 'colors',
      title: 'Colors',
      example: {
        component: 'MeterColors',
        code: `<OMeter :value="60" color="default" label="Default" />
<OMeter :value="60" color="accent" label="Accent" />
<OMeter :value="60" color="success" label="Success" />
<OMeter :value="60" color="warning" label="Warning" />
<OMeter :value="60" color="danger" label="Danger" />`,
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'MeterSizes',
        code: `<OMeter :value="60" size="sm" label="Small" />
<OMeter :value="60" size="md" label="Medium" />
<OMeter :value="60" size="lg" label="Large" />`,
      },
    },
    {
      id: 'auto-color',
      title: 'Auto Color',
      example: {
        component: 'MeterAutoColor',
        code: `<OMeter :value="20" auto-color label="Low" show-value-label />
<OMeter :value="50" auto-color label="Medium" show-value-label />
<OMeter :value="90" auto-color label="High" show-value-label />`,
      },
    },
  ],

  props: [
    { name: 'value', type: 'number', default: '-', description: 'Current value (required).' },
    { name: 'minValue', type: 'number', default: '0', description: 'Minimum value.' },
    { name: 'maxValue', type: 'number', default: '100', description: 'Maximum value.' },
    { name: 'label', type: 'string', default: '-', description: 'Label text.' },
    { name: 'showValueLabel', type: 'boolean', default: 'false', description: 'Show formatted value to the right.' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', default: '-', description: 'Intl.NumberFormat options for the value label.' },
    { name: 'color', type: "'default' | 'accent' | 'success' | 'warning' | 'danger'", default: "'default'", description: 'Fill color.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Track height.' },
    { name: 'autoColor', type: 'boolean', default: 'false', description: 'Automatically change color based on thresholds.' },
    { name: 'low', type: 'number', default: '25', description: 'Low threshold (default: 25% of range).' },
    { name: 'high', type: 'number', default: '75', description: 'High threshold (default: 75% of range).' },
    { name: 'optimum', type: 'number', default: '-', description: 'Optimum value — determines whether high or low is "good".' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the meter.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  aria: [
    { attribute: 'role="meter"', condition: 'always', description: 'Identifies the element as a meter.' },
    { attribute: 'aria-valuenow', condition: 'always', description: 'Current value of the meter.' },
    { attribute: 'aria-valuemin', condition: 'always', description: 'Minimum value of the range.' },
    { attribute: 'aria-valuemax', condition: 'always', description: 'Maximum value of the range.' },
  ],
}
