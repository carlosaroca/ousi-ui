import type { ComponentData } from './types'

export const avatarData: ComponentData = {
  title: 'Avatar',
  description: 'Display user profile images with fallback initials.',
  category: 'Media',
  importCode: "import { OAvatar } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'AvatarBasic',
        code: '<OAvatar src="https://i.pravatar.cc/150?u=1" alt="John Doe" />',
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'AvatarSizes',
        code: `<OAvatar size="sm" src="https://i.pravatar.cc/150?u=1" />
<OAvatar size="md" src="https://i.pravatar.cc/150?u=2" />
<OAvatar size="lg" src="https://i.pravatar.cc/150?u=3" />
<OAvatar size="xl" src="https://i.pravatar.cc/150?u=4" />`,
      },
    },
    {
      id: 'shapes',
      title: 'Shapes',
      example: {
        component: 'AvatarShapes',
        code: `<OAvatar shape="circle" src="https://i.pravatar.cc/150?u=5" />
<OAvatar shape="square" src="https://i.pravatar.cc/150?u=6" />`,
      },
    },
    {
      id: 'fallback',
      title: 'Fallback',
      example: {
        component: 'AvatarFallback',
        code: `<OAvatar name="John Doe" />
<OAvatar name="Alice Smith" />
<OAvatar />`,
      },
    },
    {
      id: 'group',
      title: 'Group',
      example: {
        component: 'AvatarGrouped',
        code: `<div class="flex -space-x-2.5">
  <OTooltip v-for="user in users" :content="user.name" :delay="0">
    <OAvatar
      :src="user.src"
      :name="user.name"
      class="ring-[1.5px] ring-ousi-background
        transition-transform duration-200 ease-out
        hover:-translate-y-1.5 cursor-pointer"
    />
  </OTooltip>
  <OTooltip content="3 more" :delay="0">
    <OAvatar name="+3" class="ring-[1.5px] ring-ousi-background
      hover:-translate-y-1.5 cursor-pointer" />
  </OTooltip>
</div>`,
      },
    },
  ],

  props: [
    { name: 'src', type: 'string', default: '-', description: 'URL of the avatar image.' },
    { name: 'alt', type: 'string', default: '-', description: 'Alt text for the image.' },
    { name: 'name', type: 'string', default: '-', description: 'Full name used to generate initials as fallback.' },
    { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Size of the avatar.' },
    { name: 'shape', type: "'circle' | 'square'", default: "'circle'", description: 'Shape of the avatar.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'fallback', type: 'slot', description: 'Custom fallback content when image fails and no name is provided.' },
  ],
}
