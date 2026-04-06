import type { ComponentData } from './types'

export const imageCompareData: ComponentData = {
  title: 'ImageCompare',
  description: 'Before/after image comparison slider with draggable divider.',
  category: 'Media',
  importCode: "import { OImageCompare } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'ImageCompareBasic',
        code: `<OImageCompare
  before-src="/images/before.jpg"
  after-src="/images/after.jpg"
/>`,
      },
    },
    {
      id: 'with-labels',
      title: 'With Labels',
      example: {
        component: 'ImageCompareLabels',
        code: `<OImageCompare
  before-src="/images/before.jpg"
  after-src="/images/after.jpg"
  before-label="Before"
  after-label="After"
/>`,
      },
    },
    {
      id: 'vertical',
      title: 'Vertical',
      example: {
        component: 'ImageCompareVertical',
        code: `<OImageCompare
  before-src="/images/before.jpg"
  after-src="/images/after.jpg"
  orientation="vertical"
  before-label="Day"
  after-label="Night"
/>`,
      },
    },
    {
      id: 'controlled',
      title: 'Controlled',
      example: {
        component: 'ImageCompareControlled',
        code: `<script setup>
const position = ref(30)
</script>

<template>
  <OImageCompare
    v-model="position"
    before-src="/images/before.jpg"
    after-src="/images/after.jpg"
  />
  <OSlider v-model="position" :min="0" :max="100" />
</template>`,
      },
    },
    {
      id: 'no-handle',
      title: 'Without Handle',
      example: {
        component: 'ImageCompareNoHandle',
        code: `<OImageCompare
  before-src="/images/before.jpg"
  after-src="/images/after.jpg"
  :show-handle="false"
/>`,
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'ImageCompareDisabled',
        code: `<OImageCompare
  before-src="/images/before.jpg"
  after-src="/images/after.jpg"
  :default-value="70"
  disabled
/>`,
      },
    },
  ],

  props: [
    { name: 'beforeSrc', type: 'string', default: '-', description: 'URL of the before (left/top) image. Required.' },
    { name: 'afterSrc', type: 'string', default: '-', description: 'URL of the after (right/bottom) image. Required.' },
    { name: 'beforeAlt', type: 'string', default: "'Before'", description: 'Alt text for the before image.' },
    { name: 'afterAlt', type: 'string', default: "'After'", description: 'Alt text for the after image.' },
    { name: 'beforeLabel', type: 'string', default: '-', description: 'Label badge on the before side.' },
    { name: 'afterLabel', type: 'string', default: '-', description: 'Label badge on the after side.' },
    { name: 'modelValue', type: 'number', default: '-', description: 'Controlled position (0-100, v-model).' },
    { name: 'defaultValue', type: 'number', default: '50', description: 'Initial divider position (0-100).' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Divider orientation.' },
    { name: 'showDivider', type: 'boolean', default: 'true', description: 'Show the divider line.' },
    { name: 'showHandle', type: 'boolean', default: 'true', description: 'Show the drag handle circle.' },
    { name: 'rounded', type: 'boolean', default: 'true', description: 'Apply rounded corners.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable drag interaction.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'update:modelValue', type: 'number', description: 'Emitted when the divider position changes.' },
    { name: 'change', type: 'number', description: 'Emitted when the divider position changes.' },
  ],

  themeCode: `import {
  imageCompareTheme,
  imageCompareImageTheme,
  imageCompareDividerTheme,
  imageCompareHandleTheme,
  imageCompareLabelTheme,
} from '@ousi-ui/vue'`,

  keyboard: [
    { key: 'left', description: 'Move divider 1% left (horizontal).' },
    { key: 'right', description: 'Move divider 1% right (horizontal).' },
    { key: 'up', description: 'Move divider 1% up (vertical).' },
    { key: 'down', description: 'Move divider 1% down (vertical).' },
    { key: 'shift', description: 'Hold Shift + Arrow for 10% steps.' },
    { key: 'home', description: 'Move divider to 0% (fully before).' },
    { key: 'end', description: 'Move divider to 100% (fully after).' },
  ],

  aria: [
    { attribute: 'role="slider"', condition: 'Always', description: 'The container acts as a range slider.' },
    { attribute: 'aria-valuenow', condition: 'Always', description: 'Current divider position (0-100).' },
    { attribute: 'aria-valuemin', condition: 'Always', description: 'Minimum value (0).' },
    { attribute: 'aria-valuemax', condition: 'Always', description: 'Maximum value (100).' },
    { attribute: 'aria-orientation', condition: 'Always', description: 'Matches the orientation prop.' },
  ],

  bestPractices: [
    { text: 'Always provide `beforeAlt` and `afterAlt` for screen readers.', good: true },
    { text: 'Use `beforeLabel` and `afterLabel` to clarify what each side represents.', good: true },
    { text: 'Both images should have the same dimensions for proper alignment.', good: true },
    { text: "Don't use for unrelated images — the comparison should be meaningful.", good: false },
  ],
}
