import type { ComponentData } from './types'

export const timelineData: ComponentData = {
  title: 'Timeline',
  description: 'Display a sequence of events along a vertical or horizontal line.',
  category: 'Data Display',
  importCode: "import { OTimeline } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'TimelineBasic',
        code: `<OTimeline :items="[
  { key: '1', content: 'Order placed' },
  { key: '2', content: 'Processing' },
  { key: '3', content: 'Shipped' },
  { key: '4', content: 'Delivered' },
]" />`,
      },
    },
    {
      id: 'colors',
      title: 'Colors',
      example: {
        component: 'TimelineColors',
        code: `<OTimeline :items="[
  { key: '1', content: 'Created', color: 'accent' },
  { key: '2', content: 'Approved', color: 'success' },
  { key: '3', content: 'Warning', color: 'warning' },
  { key: '4', content: 'Rejected', color: 'danger' },
]" />`,
      },
    },
    {
      id: 'align-right',
      title: 'Right Aligned',
      example: {
        component: 'TimelineRight',
        code: `<OTimeline align="right" :items="items" />`,
      },
    },
    {
      id: 'alternate',
      title: 'Alternate',
      example: {
        component: 'TimelineAlternate',
        code: `<OTimeline
  align="alternate"
  :items="[
    { key: '1', content: 'Design', opposite: 'Jan 2025' },
    { key: '2', content: 'Development', opposite: 'Mar 2025' },
    { key: '3', content: 'Testing', opposite: 'May 2025' },
    { key: '4', content: 'Launch', opposite: 'Jun 2025' },
  ]"
/>`,
      },
    },
    {
      id: 'custom-markers',
      title: 'Custom Markers',
      example: {
        component: 'TimelineCustomMarkers',
        code: `<OTimeline :items="items">
  <template #marker-1>
    <svg class="size-4 text-white">...</svg>
  </template>
</OTimeline>`,
      },
    },
    {
      id: 'horizontal',
      title: 'Horizontal',
      example: {
        component: 'TimelineHorizontal',
        code: `<OTimeline layout="horizontal" :items="items" />`,
      },
    },
    {
      id: 'custom-content',
      title: 'Custom Content',
      example: {
        component: 'TimelineCustomContent',
        code: `<OTimeline :items="items">
  <template #content-1="{ item }">
    <OCard>
      <OCard.Content>
        <p class="font-medium">{{ item.content }}</p>
      </OCard.Content>
    </OCard>
  </template>
</OTimeline>`,
      },
    },
  ],

  props: [
    { name: 'items', type: 'TimelineItem[]', default: '[]', description: 'Array of timeline items (required).' },
    { name: 'align', type: "'left' | 'right' | 'alternate'", default: "'left'", description: 'Content alignment relative to the line.' },
    { name: 'layout', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Layout direction.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'content-{key}', type: 'slot { item, index }', description: 'Custom content for a specific item.' },
    { name: 'opposite-{key}', type: 'slot { item, index }', description: 'Custom opposite side content for a specific item.' },
    { name: 'marker-{key}', type: 'slot { item, index }', description: 'Custom marker icon for a specific item.' },
    { name: 'marker', type: 'slot { item, index }', description: 'Default marker slot for all items (fallback).' },
  ],

  themeCode: `import {
  timelineTheme,
  timelineEntryTheme,
  timelineSeparatorTheme,
  timelineConnectorTheme,
  timelineMarkerTheme,
  timelineContentTheme,
  timelineOppositeTheme,
} from '@ousi-ui/vue'

// TimelineItem interface:
// { key: string, content?: string, opposite?: string,
//   color?: 'accent'|'success'|'warning'|'danger'|'default',
//   icon?: string }`,

  keyboard: [
    { key: 'tab', description: 'Moves focus between interactive items inside the timeline.' },
  ],

  aria: [
    { attribute: 'role', condition: 'Default', description: 'No ARIA role — the timeline is a visual layout, not an interactive widget.' },
  ],

  bestPractices: [
    { text: 'Use `alternate` alignment for balanced layouts with dates and descriptions.', good: true },
    { text: 'Use semantic colors: `success` for completed, `warning` for pending, `danger` for failed.', good: true },
    { text: 'Use the `#content-{key}` slot to render cards or rich content per item.', good: true },
    { text: "Don't use horizontal layout for more than 6-8 items — it gets hard to read.", good: false },
  ],
}
