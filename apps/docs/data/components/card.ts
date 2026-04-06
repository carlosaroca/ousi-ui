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
  <OCard.Header>
    <OCard.Title>Card Title</OCard.Title>
    <OCard.Description>Card description.</OCard.Description>
  </OCard.Header>
  <OCard.Content>
    <p>Card body content goes here.</p>
  </OCard.Content>
  <OCard.Footer>
    <OButton>Action</OButton>
  </OCard.Footer>
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
    <OCard.Header>
      <OCard.Title>Horizontal Card</OCard.Title>
      <OCard.Description>Image left, content right.</OCard.Description>
    </OCard.Header>
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
  <OCard.Header>
    <OCard.Title>Project Alpha</OCard.Title>
    <OCard.Description>A design system.</OCard.Description>
  </OCard.Header>
  <OCard.Footer class="gap-2">
    <OAvatar name="Carlos Roca" size="sm" />
    <span>Carlos Roca</span>
  </OCard.Footer>
</OCard>`,
      },
    },
    {
      id: 'with-form',
      title: 'With Form',
      example: {
        component: 'CardWithForm',
        code: `<OCard variant="secondary" class="max-w-sm">
  <OCard.Header>
    <OCard.Title>Login</OCard.Title>
    <OCard.Description>Enter your credentials.</OCard.Description>
  </OCard.Header>
  <OCard.Content class="gap-3">
    <OInput label="Email" variant="secondary" full-width />
    <OInput label="Password" type="password" variant="secondary" full-width />
  </OCard.Content>
  <OCard.Footer>
    <OButton variant="primary" full-width>Sign In</OButton>
  </OCard.Footer>
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
  <OCard.Header>
    <OCard.Title>Documentation</OCard.Title>
    <OCard.Description>Read the API reference.</OCard.Description>
  </OCard.Header>
  <OCard.Footer class="text-ousi-accent text-sm gap-1">
    Learn more →
  </OCard.Footer>
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
    <OCard.Header>...</OCard.Header>
    <OCard.Footer>...</OCard.Footer>
  </OCard>

  <!-- Full-image card with overlay text -->
  <OCard class="col-span-6 min-h-[200px]">
    <img class="absolute inset-0 object-cover" />
    <OCard.Footer class="z-10 mt-auto">
      <OButton>Notify me</OButton>
    </OCard.Footer>
  </OCard>

  <!-- Event list with transparent cards -->
  <OCard class="flex-row gap-3 p-1" variant="transparent">
    <img class="h-20 w-20 rounded-xl object-cover" />
    <OCard.Title>Event Name</OCard.Title>
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
  <OCard.Header>
    <OCard.Title>Card Title</OCard.Title>
    <OCard.Description>Card description here.</OCard.Description>
  </OCard.Header>
  <OCard.Content>
    <p>Card body content goes here.</p>
  </OCard.Content>
</OCard>`,
      },
    },
    {
      id: 'with-footer',
      title: 'With Footer',
      example: {
        component: 'CardWithFooter',
        code: `<OCard>
  <OCard.Header>
    <OCard.Title>Settings</OCard.Title>
  </OCard.Header>
  <OCard.Content>
    <p>Update your preferences below.</p>
  </OCard.Content>
  <OCard.Footer>
    <OButton variant="outline">Cancel</OButton>
    <OButton>Save</OButton>
  </OCard.Footer>
</OCard>`,
      },
    },
  ],

  props: [
    { name: 'variant', type: "'transparent' | 'default' | 'secondary' | 'tertiary'", default: "'default'", description: 'Visual variant of the card.' },
    { name: 'as', type: 'string | Component', default: "'div'", description: 'Renders the card as a different element (e.g. "a" for links, "router-link").' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'default', type: '-', description: 'Card content — compose with OCard.Header, OCard.Content, OCard.Footer.' },
  ],

  bestPractices: [
    { text: 'Use `variant="secondary"` for cards with form inputs inside — it provides better contrast.', good: true },
    { text: 'Use `as="a"` with hover classes for clickable card links.', good: true },
    { text: 'Use `class="flex-row"` for horizontal card layouts.', good: true },
    { text: 'Use negative margins (`-mx-4 -mt-4`) for full-bleed cover images.', good: true },
    { text: "Don't deeply nest cards — keep hierarchy flat.", good: false },
  ],
}
