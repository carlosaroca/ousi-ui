import type { ComponentData } from './types'

export const accordionData: ComponentData = {
  title: 'Accordion',
  description: 'Accordion with fluid separation animation — items detach smoothly when expanded.',
  category: 'Navigation',
  importCode: "import { OAccordion } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'AccordionBasic',
        code: `<OAccordion :items="[
  { key: 'fav', title: 'Favorites', description: 'Your saved items.' },
  { key: 'sched', title: 'Schedule', description: 'Track your events.' },
  { key: 'shop', title: 'Shopping', description: 'Your cart and orders.' },
]" />`,
      },
    },
    {
      id: 'with-icons',
      title: 'With Icons',
      example: {
        component: 'AccordionIcons',
        code: `<OAccordion :items="items">
  <template #icon-fav>
    <svg>...</svg>
  </template>
</OAccordion>`,
      },
    },
    {
      id: 'controlled',
      title: 'Controlled',
      example: {
        component: 'AccordionControlled',
        code: `<script setup>
const open = ref('sched')
</script>

<OAccordion v-model="open" :items="items" />`,
      },
    },
    {
      id: 'custom-content',
      title: 'Custom Content',
      example: {
        component: 'AccordionCustomContent',
        code: `<OAccordion :items="items">
  <template #content-pricing>
    <div class="flex gap-2">
      <OChip color="success">Free</OChip>
      <OChip color="accent">Pro $9/mo</OChip>
    </div>
  </template>
</OAccordion>`,
      },
    },
    {
      id: 'secondary',
      title: 'Secondary Variant',
      example: {
        component: 'AccordionSecondary',
        code: `<OAccordion variant="secondary" :items="items" />`,
      },
    },
    {
      id: 'no-dividers',
      title: 'Without Dividers',
      example: {
        component: 'AccordionNoDividers',
        code: `<OAccordion :show-dividers="false" :items="items" />`,
      },
    },
    {
      id: 'custom-gap',
      title: 'Custom Gap',
      example: {
        component: 'AccordionGap',
        code: `<OAccordion :items="items" :gap="24" />`,
      },
    },
  ],

  props: [
    { name: 'items', type: 'AccordionItem[]', default: '[]', description: 'Array of accordion items (required).' },
    { name: 'modelValue', type: 'string | null', default: 'null', description: 'Controlled expanded key (v-model).' },
    { name: 'defaultValue', type: 'string | null', default: 'null', description: 'Initially expanded key.' },
    { name: 'gap', type: 'number', default: '10', description: 'Gap in px when an item separates.' },
    { name: 'showDividers', type: 'boolean', default: 'true', description: 'Show separator lines between collapsed items.' },
    { name: 'variant', type: "'primary' | 'secondary'", default: "'primary'", description: 'Visual variant. Secondary has no border/shadow.' },
    { name: 'shadow', type: "'none' | 'xs' | 'sm' | 'md' | 'lg'", default: "'none'", description: 'Elevation shadow.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'icon-{key}', type: 'slot { item, index }', description: 'Custom icon for a specific item.' },
    { name: 'icon', type: 'slot { item, index }', description: 'Default icon slot for all items.' },
    { name: 'title-{key}', type: 'slot { item }', description: 'Custom title for a specific item.' },
    { name: 'content-{key}', type: 'slot { item }', description: 'Custom expanded content for a specific item.' },
  ],

  emits: [
    { name: 'update:modelValue', type: 'string | null', description: 'Emitted when expanded item changes.' },
    { name: 'change', type: 'string | null', description: 'Emitted when expanded item changes.' },
  ],

  keyboard: [
    { key: 'enter', description: 'Toggle the focused accordion item.' },
    { key: 'space', description: 'Toggle the focused accordion item.' },
    { key: 'tab', description: 'Move focus between items.' },
  ],

  aria: [
    { attribute: 'aria-expanded', condition: 'Always', description: 'Set on each trigger button.' },
  ],

  bestPractices: [
    { text: 'Use icons in the `#icon-{key}` slot to make items visually distinct.', good: true },
    { text: 'Keep descriptions concise — the animation works best with short content.', good: true },
    { text: 'Use `gap` prop to control the visual separation intensity.', good: true },
    { text: "Don't use for more than 8-10 items — a regular accordion is better for long lists.", good: false },
  ],
}
