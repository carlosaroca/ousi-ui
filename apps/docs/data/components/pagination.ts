import type { ComponentData } from './types'

export const paginationData: ComponentData = {
  title: 'Pagination',
  description: 'Navigate between pages of content.',
  category: 'Navigation',
  importCode: "import { OPagination } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'PaginationUsage',
        code: '<OPagination :total="10" :default-page="1" />',
      },
    },
    {
      id: 'with-summary',
      title: 'With Summary',
      example: {
        component: 'PaginationWithSummary',
        code: '<OPagination :total="20" show-summary />',
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'PaginationSizes',
        code: `<OPagination :total="10" size="sm" />
<OPagination :total="10" size="md" />
<OPagination :total="10" size="lg" />`,
      },
    },
    {
      id: 'loop',
      title: 'Loop',
      example: {
        component: 'PaginationLoop',
        code: '<OPagination :total="5" loop />',
      },
    },
    {
      id: 'with-labels',
      title: 'With Labels',
      example: {
        component: 'PaginationWithLabels',
        code: '<OPagination :total="10" prev-label="Previous" next-label="Next" />',
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'PaginationDisabled',
        code: '<OPagination :total="10" disabled />',
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'number', description: 'Current page (1-based, v-model).' },
    { name: 'defaultPage', type: 'number', description: 'Default page when uncontrolled.' },
    { name: 'total', type: 'number', description: 'Total number of pages (required).' },
    { name: 'siblings', type: 'number', default: '1', description: 'Pages shown on each side of current.' },
    { name: 'boundaries', type: 'number', default: '1', description: 'Pages shown at start and end.' },
    { name: 'showControls', type: 'boolean', default: 'true', description: 'Show Prev/Next buttons.' },
    { name: 'showSummary', type: 'boolean', default: 'false', description: 'Show "Page X of Y" summary.' },
    { name: 'loop', type: 'boolean', default: 'false', description: 'Loop from last to first and vice versa.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size variant.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable all interactions.' },
    { name: 'prevLabel', type: 'string', description: 'Text label for prev button.' },
    { name: 'nextLabel', type: 'string', description: 'Text label for next button.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '[page: number]', description: 'Emitted when the page changes.' },
    { name: 'change', type: '[page: number]', description: 'Emitted when the page changes.' },
  ],

  keyboard: [
    { key: 'tab', description: 'Moves focus between pagination buttons.' },
    { key: 'enter', description: 'Activates the focused page button.' },
    { key: 'space', description: 'Activates the focused page button.' },
  ],

  aria: [
    { attribute: 'nav[aria-label="pagination"]', condition: 'always', description: 'Wrapping nav is labelled for pagination.' },
    { attribute: 'aria-current="page"', condition: 'active page', description: 'Marks the currently active page.' },
    { attribute: 'aria-disabled', condition: 'disabled or boundary', description: 'Disables prev/next at boundaries.' },
  ],

  bestPractices: [
    { text: 'Use show-summary to give users context on total pages.', good: true },
    { text: 'Provide text labels for prev/next when space allows.', good: true },
    { text: "Don't use pagination for fewer than 2 pages.", good: false },
  ],

  haptics: {
    defaultPreset: "'selection'",
    trigger: 'On page change (prev, next, or direct page click)',
    notes: 'Skipped if the page does not actually change.',
  },
}
