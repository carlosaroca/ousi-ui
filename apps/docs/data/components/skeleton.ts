import type { ComponentData } from './types'

export const skeletonData: ComponentData = {
  title: 'Skeleton',
  description: 'Placeholder loading indicator that mimics content layout.',
  category: 'Feedback',
  importCode: "import { OSkeleton } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'SkeletonBasic',
        code: '<OSkeleton class="h-4 w-48 rounded" />',
      },
    },
    {
      id: 'shapes',
      title: 'Shapes',
      example: {
        component: 'SkeletonShapes',
        code: `<OSkeleton class="h-4 w-48 rounded" />
<OSkeleton class="h-12 w-12 rounded-full" />
<OSkeleton class="h-24 w-full rounded-lg" />`,
      },
    },
    {
      id: 'with-content',
      title: 'With Content',
      example: {
        component: 'SkeletonWithContent',
        code: `<div class="flex items-center gap-3">
  <OSkeleton class="h-10 w-10 rounded-full" />
  <div class="space-y-2">
    <OSkeleton class="h-4 w-32 rounded" />
    <OSkeleton class="h-3 w-48 rounded" />
  </div>
</div>`,
      },
    },
  ],

  props: [
    { name: 'animation', type: "'shimmer' | 'pulse' | 'none'", default: "'shimmer'", description: 'Animation type.' },
    { name: 'shadow', type: "'none' | 'xs' | 'sm'", default: "'none'", description: 'Elevation shadow.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes for dimensions and radius.' },
  ],
}
