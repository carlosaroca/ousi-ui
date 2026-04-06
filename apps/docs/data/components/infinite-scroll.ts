import type { ComponentData } from './types'

export const infiniteScrollData: ComponentData = {
  title: 'InfiniteScroll',
  description: 'Automatically loads more content as the user scrolls to the bottom.',
  category: 'Utilities',
  importCode: "import { OInfiniteScroll } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'InfiniteScrollBasic',
        code: `<OInfiniteScroll :loading="loading" @load-more="loadMore">
  <div v-for="item in items" :key="item" class="p-3 border-b">
    Item {{ item }}
  </div>
  <template #loader>
    <div class="p-4 text-center">
      <OSpinner size="sm" />
    </div>
  </template>
</OInfiniteScroll>`,
      },
    },
  ],

  props: [
    { name: 'loading', type: 'boolean', default: 'false', description: 'Whether new content is currently loading.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the load-more trigger.' },
    { name: 'threshold', type: 'number', default: '100', description: 'Distance in pixels from the bottom to trigger loading.' },
  ],

  slots: [
    { name: 'default', type: 'slot', description: 'The scrollable content.' },
    { name: 'loader', type: 'slot', description: 'Custom loading indicator shown while fetching.' },
  ],

  emits: [
    { name: 'load-more', type: '[]', description: 'Emitted when the user scrolls near the bottom and more content should be loaded.' },
  ],

  bestPractices: [
    { text: 'Show a loading indicator so users know more content is being fetched.', good: true },
    { text: 'Disable the component when all data has been loaded.', good: true },
    { text: "Don't trigger loads too aggressively; use a reasonable threshold.", good: false },
  ],
}
