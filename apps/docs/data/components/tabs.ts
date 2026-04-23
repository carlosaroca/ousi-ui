import type { ComponentData } from './types'

export const tabsData: ComponentData = {
  title: 'Tabs',
  description: 'Organize content into separate views within the same context.',
  category: 'Navigation',
  importCode: "import { OTabs } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'TabsUsage',
        code: `<OTabs :items="[
  { key: 'account', label: 'Account' },
  { key: 'security', label: 'Security' },
  { key: 'billing', label: 'Billing' },
]">
  <template #account>Account settings here.</template>
  <template #security>Security settings here.</template>
  <template #billing>Billing info here.</template>
</OTabs>`,
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'TabsSizes',
        code: `<OTabs :items="items" size="sm" />
<OTabs :items="items" size="md" />
<OTabs :items="items" size="lg" />`,
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'TabsVariants',
        code: `<OTabs variant="primary" :items="items">...</OTabs>
<OTabs variant="secondary" :items="items">...</OTabs>`,
      },
    },
    {
      id: 'vertical',
      title: 'Vertical',
      example: {
        component: 'TabsVertical',
        code: `<OTabs orientation="vertical" :items="items">
  <template #tab1>Vertical tab content.</template>
  <template #tab2>Another vertical panel.</template>
</OTabs>`,
      },
    },
    {
      id: 'controlled',
      title: 'Controlled',
      example: {
        component: 'TabsControlled',
        code: `<OTabs v-model="activeTab" :items="items">
  <template #account>Account panel.</template>
  <template #security>Security panel.</template>
</OTabs>`,
      },
    },
    {
      id: 'custom-tab',
      title: 'Custom Tab Content',
      example: {
        component: 'TabsCustomTab',
        code: `<OTabs :items="items">
  <template #tab="{ item, selected }">
    <span class="flex items-center gap-1.5">
      <span>{{ item.icon }}</span>
      <span>{{ item.label }}</span>
    </span>
  </template>
  <template #photos>Photos content</template>
  <template #videos>Videos content</template>
</OTabs>`,
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'TabsDisabled',
        code: `<OTabs :items="[
  { key: 'active', label: 'Active' },
  { key: 'disabled', label: 'Disabled', disabled: true },
  { key: 'other', label: 'Other' },
]">
  <template #active>Active tab content.</template>
  <template #other>Other content.</template>
</OTabs>`,
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'string', description: 'Active tab key (v-model).' },
    { name: 'defaultValue', type: 'string', description: 'Default active tab key.' },
    { name: 'items', type: 'TabItem[]', description: 'Tab items with key, label, and optional disabled.' },
    { name: 'variant', type: "'primary' | 'secondary'", default: "'primary'", description: 'Visual variant.' },
    { name: 'shadow', type: "'none' | 'xs' | 'sm' | 'md'", default: "'none'", description: 'Elevation shadow.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the tabs.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout orientation.' },
    { name: 'showSeparator', type: 'boolean', default: '-', description: 'Show separator lines between tabs.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'tab', type: '{ item: TabItem, selected: boolean }', description: 'Custom content for each tab trigger. Overrides the default label text.' },
    { name: '[key]', type: '-', description: 'Content panel for each tab, using the tab key as the slot name.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '[value: string]', description: 'Emitted when the active tab changes.' },
    { name: 'change', type: '[value: string]', description: 'Emitted when the active tab changes.' },
  ],

  keyboard: [
    { key: 'arrow-left / arrow-right', description: 'Move between tabs (horizontal).' },
    { key: 'arrow-up / arrow-down', description: 'Move between tabs (vertical).' },
    { key: 'home', description: 'Moves focus to the first tab.' },
    { key: 'end', description: 'Moves focus to the last tab.' },
    { key: 'enter', description: 'Activates the focused tab.' },
    { key: 'space', description: 'Activates the focused tab.' },
  ],

  aria: [
    { attribute: 'role="tablist"', condition: 'always', description: 'Container has tablist role.' },
    { attribute: 'role="tab"', condition: 'each tab', description: 'Each trigger has tab role.' },
    { attribute: 'role="tabpanel"', condition: 'active panel', description: 'Content panel has tabpanel role.' },
    { attribute: 'aria-selected', condition: 'active tab', description: 'Reflects which tab is active.' },
    { attribute: 'aria-orientation', condition: 'always', description: 'Reflects the orientation of the tablist.' },
  ],

  bestPractices: [
    { text: 'Use short, descriptive tab labels.', good: true },
    { text: 'Keep tab count manageable (2-6 tabs).', good: true },
    { text: "Don't use tabs for sequential steps — use a stepper instead.", good: false },
  ],

  haptics: {
    defaultPreset: "'none' (opt-in via haptic prop)",
    trigger: 'On tab switch',
    notes: "No haptic by default. Enable with haptic=\"selection\" or any preset.",
  },
}
