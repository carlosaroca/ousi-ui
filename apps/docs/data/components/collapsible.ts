import type { ComponentData } from './types'

export const collapsibleData: ComponentData = {
  title: 'Collapsible',
  description: 'A toggleable container that shows or hides its content.',
  category: 'Interactive',
  importCode: "import { OCollapsible } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'CollapsibleBasic',
        code: `<OCollapsible>
  <template #trigger="{ isOpen, toggle }">
    <button @click="toggle">
      {{ isOpen ? 'Hide' : 'Show' }} content
    </button>
  </template>
  <p>This content can be toggled on and off.</p>
</OCollapsible>`,
      },
    },
    {
      id: 'controlled',
      title: 'Controlled',
      example: {
        component: 'CollapsibleBasic',
        code: `<script setup lang="ts">
import { ref } from 'vue'
const isOpen = ref(false)
</script>

<OButton @click="isOpen = !isOpen">Toggle</OButton>
<OCollapsible v-model="isOpen">
  <p>Controlled collapsible content.</p>
</OCollapsible>`,
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'boolean', description: 'Controlled open state (v-model).' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Whether the collapsible starts open.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable toggling.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'trigger', type: '{ isOpen: boolean, toggle: () => void }', description: 'Custom trigger element with access to state and toggle function.' },
    { name: 'default', type: 'slot', description: 'Content revealed when open.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '[value: boolean]', description: 'Emitted when open state changes.' },
  ],

  keyboard: [
    { key: 'enter', description: 'Toggles the collapsible when trigger is focused.' },
    { key: 'space', description: 'Toggles the collapsible when trigger is focused.' },
  ],

  bestPractices: [
    { text: 'Use a clear trigger label that describes what will be revealed.', good: true },
    { text: 'Keep collapsible content concise and focused.', good: true },
    { text: "Don't hide critical information inside a collapsible.", good: false },
  ],
}
