import type { ComponentData } from './types'

export const breadcrumbsData: ComponentData = {
  title: 'Breadcrumbs',
  description: 'Show the current page location within a navigational hierarchy.',
  category: 'Navigation',
  importCode: "import { OBreadcrumbs } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'BreadcrumbsUsage',
        code: `<OBreadcrumbs :items="[
  { label: 'Home', href: '/' },
  { label: 'Components', href: '/components' },
  { label: 'Breadcrumbs' },
]" />`,
      },
    },
    {
      id: 'custom-separator',
      title: 'Custom Separator',
      example: {
        component: 'BreadcrumbsCustomSeparator',
        code: `<OBreadcrumbs separator="slash" :items="items" />
<OBreadcrumbs separator="dot" :items="items" />`,
      },
    },
    {
      id: 'with-icons',
      title: 'With Icons',
      example: {
        component: 'BreadcrumbsWithIcons',
        code: `<OBreadcrumbs :items="items">
  <template #item="{ item, isCurrent }">
    <span class="flex items-center gap-1">
      <HomeIcon v-if="item.label === 'Home'" class="size-4" />
      {{ item.label }}
    </span>
  </template>
</OBreadcrumbs>`,
      },
    },
  ],

  props: [
    { name: 'items', type: 'BreadcrumbItem[]', description: 'List of breadcrumb items. Last item is treated as current page.' },
    { name: 'separator', type: "'chevron' | 'slash' | 'dot'", default: "'chevron'", description: 'Separator type between items.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'navigate', type: '[item: BreadcrumbItem, index: number]', description: 'Emitted when a breadcrumb link is clicked.' },
  ],

  keyboard: [
    { key: 'tab', description: 'Moves focus between breadcrumb links.' },
    { key: 'enter', description: 'Activates the focused breadcrumb link.' },
  ],

  aria: [
    { attribute: 'nav[aria-label="Breadcrumb"]', condition: 'always', description: 'Wrapping nav element is labelled.' },
    { attribute: 'aria-current="page"', condition: 'last item', description: 'Marks the current page in the hierarchy.' },
  ],

  bestPractices: [
    { text: 'Always include the current page as the last item.', good: true },
    { text: 'Keep breadcrumb labels concise.', good: true },
    { text: "Don't use breadcrumbs as the only navigation method.", good: false },
  ],
}
