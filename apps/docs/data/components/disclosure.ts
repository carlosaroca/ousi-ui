import type { ComponentData } from './types'

export const disclosureData: ComponentData = {
  title: 'Disclosure',
  description: 'An expandable/collapsible section that reveals hidden content with smooth height animation.',
  category: 'Navigation',
  importCode: "import { ODisclosure } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'DisclosureUsage',
        code: `<ODisclosure class="border-b border-ousi-border">
  <template #title>What is Ousi UI?</template>
  <p class="text-sm text-ousi-muted">
    A modern Vue 3 component library with accessible defaults.
  </p>
</ODisclosure>`,
      },
    },
    {
      id: 'default-open',
      title: 'Default Open',
      example: {
        component: 'DisclosureDefaultOpen',
        code: `<ODisclosure default-open class="border-b border-ousi-border">
  <template #title>Open by default</template>
  <p class="text-sm text-ousi-muted">Starts expanded.</p>
</ODisclosure>`,
      },
    },
    {
      id: 'controlled',
      title: 'Controlled',
      example: {
        component: 'DisclosureControlled',
        code: `<OButton @click="isOpen = !isOpen">Toggle</OButton>
<ODisclosure v-model="isOpen">
  <template #title>Controlled</template>
  <p>Toggle via button or click the title.</p>
</ODisclosure>`,
      },
    },
    {
      id: 'custom-trigger',
      title: 'Custom Trigger',
      example: {
        component: 'DisclosureCustomTrigger',
        code: `<ODisclosure>
  <template #trigger="{ isOpen }">
    <span class="bg-ousi-accent-soft text-ousi-accent rounded-ousi-xl size-8 flex items-center justify-center">
      <InfoIcon />
    </span>
    <span class="flex-1 text-left font-medium">Custom trigger</span>
    <OChip color="accent" variant="soft" size="sm">New</OChip>
    <ChevronIcon :class="isOpen ? '-rotate-180' : ''" />
  </template>
  <p>Using the trigger slot for fully custom content.</p>
</ODisclosure>`,
      },
    },
    {
      id: 'custom-indicator',
      title: 'Custom Indicator',
      example: {
        component: 'DisclosureCustomIndicator',
        code: `<ODisclosure>
  <template #title>Custom indicator</template>
  <template #indicator="{ isOpen }">
    <span class="text-xs text-ousi-muted">{{ isOpen ? 'Hide' : 'Show' }}</span>
  </template>
  <p>Text instead of chevron.</p>
</ODisclosure>`,
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'DisclosureDisabled',
        code: `<ODisclosure disabled>
  <template #title>Disabled</template>
  <p>Cannot be opened.</p>
</ODisclosure>`,
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'boolean', description: 'Controlled open state (v-model).' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Whether the disclosure starts open.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the disclosure.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'default', type: '-', description: 'Content revealed when open.' },
    { name: 'title', type: '-', description: 'Label shown in the trigger button.' },
    { name: 'trigger', type: '{ isOpen: boolean, toggle: () => void }', description: 'Custom trigger — replaces the entire button content.' },
    { name: 'indicator', type: '{ isOpen: boolean }', description: 'Custom expand/collapse indicator (replaces chevron).' },
  ],

  emits: [
    { name: 'update:modelValue', type: '[value: boolean]', description: 'Emitted when open state changes.' },
    { name: 'change', type: '[value: boolean]', description: 'Emitted when open state changes.' },
  ],

  keyboard: [
    { key: 'enter', description: 'Toggles the disclosure open/closed.' },
    { key: 'space', description: 'Toggles the disclosure open/closed.' },
    { key: 'tab', description: 'Moves focus to the next focusable element.' },
  ],

  aria: [
    { attribute: 'aria-expanded', condition: 'always', description: 'Reflects the open state.' },
    { attribute: 'aria-controls', condition: 'always', description: 'Points to the content region.' },
    { attribute: 'role="region"', condition: 'content panel', description: 'Labelled by the trigger.' },
    { attribute: 'role="heading"', condition: 'trigger wrapper', description: 'Semantic heading for the trigger.' },
  ],

  bestPractices: [
    { text: 'Add `border-b border-ousi-border` for visual separation between disclosures.', good: true },
    { text: 'Use the `#trigger` slot with icon + chip for rich interactive headers.', good: true },
    { text: 'Use `v-model` when you need external control (e.g. "expand all" button).', good: true },
    { text: "Don't nest disclosures more than two levels deep.", good: false },
  ],
}
