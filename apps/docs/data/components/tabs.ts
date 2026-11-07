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
      id: 'secondary-no-border',
      title: 'Secondary without track border',
      example: {
        component: 'TabsSecondaryNoBorder',
        code: `<OTabs variant="secondary" :items="items">...</OTabs>
<OTabs variant="secondary" hide-border :items="items">...</OTabs>`,
      },
    },
    {
      id: 'full-width',
      title: 'Full width',
      example: {
        component: 'TabsFullWidth',
        code: `<OTabs variant="primary" full-width :items="items">...</OTabs>
<OTabs variant="secondary" full-width :items="items">...</OTabs>`,
      },
    },
    {
      id: 'overflow',
      title: 'Many tabs',
      example: {
        component: 'TabsOverflow',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { OTabs } from '@ousi-ui/vue'

// Tabs that do not fit scroll sideways. The scrollbar is hidden, and the active tab is
// always brought into view (try the arrow keys, or pick the last one).
const items = ['Panel', 'People', 'Links', 'Income and travel', 'Social media', 'Sources', 'Press', 'Legal documents', 'Background'].map(
  (label) => ({ key: label, label }),
)
const primary = ref('People')
const secondary = ref('Legal documents')
</script>
<template>
  <div class="flex w-full min-w-0 flex-col gap-8">
    <div class="w-full max-w-md">
      <p class="mb-2 text-xs text-ousi-muted">primary</p>
      <OTabs v-model="primary" :items="items" />
    </div>
    <div class="w-full max-w-md">
      <p class="mb-2 text-xs text-ousi-muted">secondary</p>
      <OTabs v-model="secondary" variant="secondary" :items="items" />
    </div>
    <!-- Inside a flex parent the tabs still stay within their column -->
    <div class="flex w-full max-w-md gap-2">
      <OTabs variant="secondary" :items="items" />
    </div>
    <div class="w-full max-w-md">
      <p class="mb-2 text-xs text-ousi-muted">overflow="menu": the tabs that do not fit go under a menu</p>
      <OTabs variant="secondary" overflow="menu" :items="items" />
    </div>
  </div>
</template>`,
      },
    },
    {
      id: 'long-lists',
      title: 'Long lists',
      example: {
        component: 'TabsLong',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OTabs } from '@ousi-ui/vue'

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
// 24 short tabs
const many = Array.from({ length: 24 }, (_, i) => ({ key: \`m\${i}\`, label: \`\${months[i % 12]} \${i < 12 ? 2024 : 2025}\` }))
// A few very long labels, one disabled
const long = [
  { key: 'a', label: 'Overview' },
  { key: 'b', label: 'Income and international travel over the last five years' },
  { key: 'c', label: 'Corporate links and shareholdings' },
  { key: 'd', label: 'Legal documents pending review', disabled: true },
  { key: 'e', label: 'Press coverage' },
  { key: 'f', label: 'Sources and references used in the investigation' },
]

const active = ref('m3')
const longActive = ref('b')
const sizes = ['sm', 'md', 'lg'] as const
const current = computed(() => many.find((t) => t.key === active.value)?.label)
</script>
<template>
  <!-- w-full min-w-0: a flex or grid child cannot be narrower than its content unless it says so,
       and 24 tabs that never wrap are thousands of pixels wide. -->
  <div class="flex w-full min-w-0 flex-col gap-10">
    <!-- 24 tabs -->
    <div>
      <p class="mb-2 text-xs text-ousi-muted">24 tabs · primary · {{ current }} selected</p>
      <OTabs v-model="active" :items="many" class="max-w-xl" />
    </div>
    <div>
      <p class="mb-2 text-xs text-ousi-muted">24 tabs · secondary, as wide as the page</p>
      <OTabs v-model="active" variant="secondary" :items="many" />
    </div>

    <!-- Very long labels: they never wrap, the list scrolls -->
    <div>
      <p class="mb-2 text-xs text-ousi-muted">long labels, one disabled · primary and secondary</p>
      <div class="flex max-w-xl flex-col gap-4">
        <OTabs v-model="longActive" :items="long" />
        <OTabs v-model="longActive" variant="secondary" :items="long" />
      </div>
    </div>

    <!-- Sizes -->
    <div>
      <p class="mb-2 text-xs text-ousi-muted">sizes sm · md · lg</p>
      <div class="flex max-w-md flex-col gap-3">
        <OTabs v-for="s in sizes" :key="s" :size="s" :items="many" />
      </div>
    </div>

    <!-- Next to a sibling in a flex row: the tabs take what is left and scroll, they do not push the layout -->
    <div>
      <p class="mb-2 text-xs text-ousi-muted">inside a flex row, next to other content</p>
      <div class="flex max-w-xl items-center gap-3 rounded-2xl border border-dashed border-ousi-border p-3">
        <div class="shrink-0 rounded-xl bg-ousi-default px-3 py-1.5 text-sm font-medium text-ousi-foreground">Filters</div>
        <OTabs variant="secondary" :items="many" class="min-w-0 flex-1" />
        <div class="shrink-0 rounded-xl bg-ousi-default px-3 py-1.5 text-sm font-medium text-ousi-foreground">Export</div>
      </div>
    </div>

    <!-- With panels, keyboard: focus a tab and use the arrows / Home / End -->
    <div class="max-w-xl">
      <p class="mb-2 text-xs text-ousi-muted">with panels · use ← → Home End: the selected tab always scrolls into view</p>
      <OTabs v-model="active" variant="secondary" :items="many">
        <template v-for="t in many" :key="t.key" #[t.key]>
          <div class="rounded-xl bg-ousi-default px-4 py-6 text-sm text-ousi-muted">Content of <b class="text-ousi-foreground">{{ t.label }}</b>.</div>
        </template>
      </OTabs>
    </div>

    <!-- Menu instead of scrolling -->
    <div>
      <p class="mb-2 text-xs text-ousi-muted">overflow="menu" with the long labels</p>
      <OTabs v-model="longActive" variant="secondary" overflow="menu" :items="long" class="max-w-xl" />
    </div>
  </div>
</template>`,
      },
    },
    {
      id: 'contained',
      title: 'Inside grids and cards',
      example: {
        component: 'TabsContained',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { OCard, OTabs } from '@ousi-ui/vue'

// Grid cells and cards in a flex row cannot be narrower than their content, so a long list of
// tabs that never wrap would stretch the whole column. \`contained\` makes the tabs fill the cell
// without asking it for width: they scroll (with an edge fade) instead.
const people = ['Overview', 'People', 'Links', 'Income and travel', 'Social media', 'Sources', 'Press', 'Legal documents', 'Background'].map(
  (label) => ({ key: label, label }),
)
const months = Array.from({ length: 12 }, (_, i) => ({
  key: \`m\${i}\`,
  label: new Date(2025, i, 1).toLocaleString('en-US', { month: 'long' }),
}))
const a = ref('People')
const b = ref('m4')
</script>
<template>
  <div class="grid w-full gap-4 md:grid-cols-2">
    <OCard class="gap-3 p-4">
      <div class="text-sm font-medium text-ousi-foreground">Case file</div>
      <OTabs v-model="a" variant="secondary" contained :items="people" />
      <p class="text-sm text-ousi-muted">Showing <b class="text-ousi-foreground">{{ a }}</b>.</p>
    </OCard>
    <OCard class="gap-3 p-4">
      <div class="text-sm font-medium text-ousi-foreground">Monthly report</div>
      <OTabs v-model="b" contained :items="months" />
      <p class="text-sm text-ousi-muted">Showing <b class="text-ousi-foreground">{{ months.find((m) => m.key === b)?.label }}</b>.</p>
    </OCard>
  </div>
</template>`,
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
    { name: 'overflow', type: "'scroll' | 'menu'", default: "'scroll'", description: 'What horizontal tabs do when they do not fit: scroll sideways (the active tab is kept in view), or collect the ones that do not fit under a More menu that shows the active tab when it is one of them.' },
    { name: 'contained', type: 'boolean', default: 'false', description: 'Fill the parent without making it wider. Use it inside grid cells, cards in a flex row and other flex/grid children, where a long list of tabs would otherwise stretch its column. Needs a parent with a defined width (it collapses inside a parent that only fits its content).' },
    { name: 'scrollFade', type: 'boolean', default: 'true', description: 'Fade the edge(s) of a scrolling horizontal list that still have tabs beyond them. Uses the same logic as OScrollShadow.' },
    { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretch horizontal tabs to share the full width. By default each tab is as wide as its label; tabs that do not fit scroll sideways (scrollbar hidden) in both variants. If OTabs sits inside a grid cell or a card in a flex row, add the contained prop (or give that parent min-w-0) so a long list scrolls instead of stretching its column.' },
    { name: 'hideBorder', type: 'boolean', default: 'false', description: "Hide the secondary variant's track border (long underline / left rail). No effect on primary; active-tab indicator unaffected." },
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
