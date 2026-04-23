import type { ComponentData } from './types'

export const cardData: ComponentData = {
  title: 'Card',
  description: 'Container for grouping related content and actions.',
  category: 'Layout',
  importCode: "import { OCard } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'CardBasic',
        code: `<OCard>
  <OCardHeader>
    <OCardTitle>Card Title</OCardTitle>
    <OCardDescription>Card description.</OCardDescription>
  </OCardHeader>
  <OCardContent>
    <p>Card body content goes here.</p>
  </OCardContent>
  <OCardFooter>
    <OButton>Action</OButton>
  </OCardFooter>
</OCard>`,
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'CardVariants',
        code: `<OCard variant="transparent">...</OCard>
<OCard variant="default">...</OCard>
<OCard variant="secondary">...</OCard>
<OCard variant="tertiary">...</OCard>`,
      },
    },
    {
      id: 'shadows',
      title: 'Shadows',
      example: {
        component: 'CardShadows',
        code: `<OCard shadow="none">...</OCard>   <!-- default -->
<OCard shadow="xs">...</OCard>
<OCard shadow="sm">...</OCard>
<OCard shadow="md">...</OCard>
<OCard shadow="lg">...</OCard>
<OCard shadow="xl">...</OCard>
<OCard shadow="2xl">...</OCard>`,
      },
    },
    {
      id: 'horizontal',
      title: 'Horizontal Layout',
      example: {
        component: 'CardHorizontal',
        code: `<!-- Use class="flex-row" for horizontal layout -->
<OCard class="flex-row items-stretch" variant="secondary">
  <div class="w-32 shrink-0 rounded-ousi-xl overflow-hidden bg-ousi-accent/20">
    <!-- image or icon -->
  </div>
  <div class="flex flex-col gap-2">
    <OCardHeader>
      <OCardTitle>Horizontal Card</OCardTitle>
      <OCardDescription>Image left, content right.</OCardDescription>
    </OCardHeader>
  </div>
</OCard>`,
      },
    },
    {
      id: 'with-avatar',
      title: 'With Avatar',
      example: {
        component: 'CardWithAvatar',
        code: `<OCard variant="secondary">
  <!-- Cover image area -->
  <div class="h-28 -mx-4 -mt-4 rounded-t-ousi-4xl overflow-hidden bg-ousi-accent/15">
    ...
  </div>
  <OCardHeader>
    <OCardTitle>Project Alpha</OCardTitle>
    <OCardDescription>A design system.</OCardDescription>
  </OCardHeader>
  <OCardFooter class="gap-2">
    <OAvatar name="Carlos Roca" size="sm" />
    <span>Carlos Roca</span>
  </OCardFooter>
</OCard>`,
      },
    },
    {
      id: 'with-form',
      title: 'With Form',
      example: {
        component: 'CardWithForm',
        code: `<OCard variant="secondary" class="max-w-sm">
  <OCardHeader>
    <OCardTitle>Login</OCardTitle>
    <OCardDescription>Enter your credentials.</OCardDescription>
  </OCardHeader>
  <OCardContent class="gap-3">
    <OInput label="Email" variant="secondary" />
    <OInput label="Password" type="password" variant="secondary" />
  </OCardContent>
  <OCardFooter>
    <OButton variant="primary" full-width>Sign In</OButton>
  </OCardFooter>
</OCard>`,
      },
    },
    {
      id: 'as-link',
      title: 'As Link',
      example: {
        component: 'CardAsLink',
        code: `<!-- Render as <a> with hover effect -->
<OCard
  as="a"
  href="/docs"
  variant="secondary"
  class="hover:bg-ousi-surface-tertiary transition-colors cursor-pointer"
>
  <OCardHeader>
    <OCardTitle>Documentation</OCardTitle>
    <OCardDescription>Read the API reference.</OCardDescription>
  </OCardHeader>
  <OCardFooter class="text-ousi-accent text-sm gap-1">
    Learn more →
  </OCardFooter>
</OCard>`,
      },
    },
    {
      id: 'bento-grid',
      title: 'Bento Grid',
      example: {
        component: 'CardBentoGrid',
        code: `<!-- HeroUI-style bento grid using OCard + CSS grid -->
<div class="grid grid-cols-12 gap-4">
  <!-- Banner: flex-row for horizontal layout -->
  <OCard class="col-span-12 flex-row">
    <img src="..." class="rounded-2xl w-[120px]" />
    <OCardHeader>...</OCardHeader>
    <OCardFooter>...</OCardFooter>
  </OCard>

  <!-- Full-image card with overlay text -->
  <OCard class="col-span-6 min-h-[200px]">
    <img class="absolute inset-0 object-cover" />
    <OCardFooter class="z-10 mt-auto">
      <OButton>Notify me</OButton>
    </OCardFooter>
  </OCard>

  <!-- Event list with transparent cards -->
  <OCard class="flex-row gap-3 p-1" variant="transparent">
    <img class="h-20 w-20 rounded-xl object-cover" />
    <OCardTitle>Event Name</OCardTitle>
  </OCard>
</div>`,
      },
    },
    {
      id: 'with-header',
      title: 'With Header',
      example: {
        component: 'CardWithHeader',
        code: `<OCard>
  <OCardHeader>
    <OCardTitle>Card Title</OCardTitle>
    <OCardDescription>Card description here.</OCardDescription>
  </OCardHeader>
  <OCardContent>
    <p>Card body content goes here.</p>
  </OCardContent>
</OCard>`,
      },
    },
    {
      id: 'with-footer',
      title: 'With Footer',
      example: {
        component: 'CardWithFooter',
        code: `<OCard>
  <OCardHeader>
    <OCardTitle>Settings</OCardTitle>
  </OCardHeader>
  <OCardContent>
    <p>Update your preferences below.</p>
  </OCardContent>
  <OCardFooter>
    <OButton variant="outline">Cancel</OButton>
    <OButton>Save</OButton>
  </OCardFooter>
</OCard>`,
      },
    },
  ],

  props: [
    { name: 'variant', type: "'transparent' | 'default' | 'secondary' | 'tertiary'", default: "'default'", description: 'Visual variant of the card.' },
    { name: 'shadow', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'", default: "'none'", description: 'Elevation shadow.' },
    { name: 'as', type: 'string | Component', default: "'div'", description: 'Renders the card as a different element (e.g. "a" for links, "router-link").' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'default', type: '-', description: 'Card content — compose with OCardHeader, OCardContent, OCardFooter.' },
  ],

  bestPractices: [
    { text: 'Use `variant="secondary"` for cards with form inputs inside — it provides better contrast.', good: true },
    { text: 'Use `shadow="md"` or higher for destacated/hero cards, `sm` (default) for inline content.', good: true },
    { text: 'Override `--ousi-shadow-color` on a container to tint all descendant shadows to your brand.', good: true },
    { text: 'Use `as="a"` with hover classes for clickable card links.', good: true },
    { text: 'Use `class="flex-row"` for horizontal card layouts.', good: true },
    { text: 'Use negative margins (`-mx-4 -mt-4`) for full-bleed cover images.', good: true },
    { text: "Don't deeply nest cards — keep hierarchy flat.", good: false },
  ],
}
