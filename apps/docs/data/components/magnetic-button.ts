import type { ComponentData } from './types'

export const magneticButtonData: ComponentData = {
  title: 'MagneticButton',
  description: 'Button with magnetic cursor pull and 3D tilting popup on hover.',
  category: 'Buttons',
  importCode: "import { OMagneticButton } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'MagneticButtonBasic',
        code: `<OMagneticButton
  label="CLOUD GATE"
  popup-src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80"
/>`,
      },
    },
    {
      id: 'multiple',
      title: 'Multiple Buttons',
      example: {
        component: 'MagneticButtonMultiple',
        code: `<div class="flex gap-4">
  <OMagneticButton label="PARIS" popup-src="..." />
  <OMagneticButton label="TOKYO" popup-src="..." />
</div>`,
      },
    },
    {
      id: 'custom-popup',
      title: 'Custom Popup Content',
      example: {
        component: 'MagneticButtonCustom',
        code: `<OMagneticButton label="VIEW DETAILS" :popup-width="280">
  <template #popup>
    <div class="p-4">
      <h3>Custom content</h3>
      <p>Any Vue content in the popup</p>
    </div>
  </template>
</OMagneticButton>`,
      },
    },
    {
      id: 'no-popup',
      title: 'Without Popup (Magnetic Only)',
      example: {
        component: 'MagneticButtonNoPopup',
        code: `<OMagneticButton label="HOVER ME" />`,
      },
    },
    {
      id: 'intensity',
      title: 'Custom Intensity',
      example: {
        component: 'MagneticButtonIntensity',
        code: `<OMagneticButton label="STRONG" :magnet-strength="0.8" :tilt-max="25" popup-src="..." />
<OMagneticButton label="SUBTLE" :magnet-strength="0.1" :tilt-max="5" popup-src="..." />`,
      },
    },
  ],

  props: [
    { name: 'label', type: 'string', default: '-', description: 'Button label text (required).' },
    { name: 'popupSrc', type: 'string', default: '-', description: 'Image URL for the hover popup card.' },
    { name: 'popupAlt', type: 'string', default: 'label', description: 'Alt text for the popup image.' },
    { name: 'popupWidth', type: 'number', default: '240', description: 'Popup card width in px.' },
    { name: 'magnetStrength', type: 'number', default: '0.3', description: 'How much the button pulls toward the cursor (0-1).' },
    { name: 'tiltMax', type: 'number', default: '15', description: 'Maximum 3D tilt angle in degrees.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the magnetic effect.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes on the button element.' },
  ],

  slots: [
    { name: 'default', type: 'slot', description: 'Button label content (overrides label prop).' },
    { name: 'popup', type: 'slot', description: 'Custom popup content (overrides the image).' },
  ],

  emits: [
    { name: 'click', type: 'MouseEvent', description: 'Emitted when the button is clicked.' },
  ],

  bestPractices: [
    { text: 'Use for hero sections, portfolios, or feature showcases.', good: true },
    { text: 'Keep popup images at least 2x the popup width for sharp display.', good: true },
    { text: 'Use the `#popup` slot for rich content (cards, videos, etc.).', good: true },
    { text: "Don't use for primary navigation — the effect is decorative.", good: false },
    { text: "Don't set magnetStrength above 0.5 — it becomes disorienting.", good: false },
  ],
}
