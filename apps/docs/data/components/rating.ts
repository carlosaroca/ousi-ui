import type { ComponentData } from './types'

export const ratingData: ComponentData = {
  title: 'Rating',
  description: 'A star-based rating input for collecting user feedback.',
  category: 'Forms',
  importCode: "import { ORating } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'RatingBasic',
        code: `<script setup lang="ts">
import { ref } from 'vue'
const rating = ref(3)
</script>

<ORating v-model="rating" />
<p>Current rating: {{ rating }}</p>`,
      },
    },
    {
      id: 'colors',
      title: 'Colors',
      example: {
        component: 'RatingColors',
        code: `<ORating :default-value="3" color="accent" />
<ORating :default-value="3" color="success" />
<ORating :default-value="3" color="warning" />
<ORating :default-value="3" color="danger" />
<ORating :default-value="3" color="default" />`,
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'RatingBasic',
        code: `<ORating size="sm" :default-value="3" />
<ORating size="md" :default-value="3" />
<ORating size="lg" :default-value="3" />`,
      },
    },
    {
      id: 'half-stars',
      title: 'Half Stars',
      example: {
        component: 'RatingHalf',
        code: `<ORating v-model="rating" half-stars />`,
      },
    },
    {
      id: 'read-only',
      title: 'Read Only',
      example: {
        component: 'RatingBasic',
        code: `<ORating :default-value="4" read-only />`,
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'RatingBasic',
        code: `<ORating :default-value="2" disabled />`,
      },
    },
    {
      id: 'custom-icon',
      title: 'Custom Icon',
      example: {
        component: 'RatingCustomIcon',
        code: `<ORating v-model="hearts" color="danger" size="lg">
  <template #icon="{ fill, active }">
    <svg viewBox="0 0 24 24" class="size-full"
      :fill="active ? 'currentColor' : 'none'"
      stroke="currentColor" stroke-width="1.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 ..." />
    </svg>
  </template>
</ORating>`,
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'number', description: 'Current rating value (v-model).' },
    { name: 'shadow', type: "'none' | 'xs' | 'sm'", default: "'none'", description: 'Elevation shadow.' },
    { name: 'defaultValue', type: 'number', default: '0', description: 'Initial rating when uncontrolled.' },
    { name: 'max', type: 'number', default: '5', description: 'Maximum number of stars.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the stars.' },
    { name: 'color', type: "'accent' | 'success' | 'warning' | 'danger' | 'default'", default: "'accent'", description: 'Color theme for filled stars.' },
    { name: 'readOnly', type: 'boolean', default: 'false', description: 'Display-only mode, no interaction.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the rating input.' },
    { name: 'halfStars', type: 'boolean', default: 'false', description: 'Allow half-star increments.' },
  ],

  slots: [
    { name: 'icon', type: '{ index: number, fill: "full" | "half" | "empty", active: boolean }', description: 'Custom icon for each star. Receives fill state and active flag. The wrapper handles color and sizing.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '[value: number]', description: 'Emitted when the rating value changes.' },
    { name: 'change', type: '[value: number]', description: 'Emitted when the user commits a rating.' },
  ],

  bestPractices: [
    { text: 'Use read-only mode when displaying aggregated ratings.', good: true },
    { text: 'Enable half-stars for more granular feedback.', good: true },
    { text: "Don't use more than 10 stars — it overwhelms users.", good: false },
  ],
}
