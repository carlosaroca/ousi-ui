import type { ComponentData } from './types'

export const buttonData: ComponentData = {
  title: 'Button',
  description: 'Trigger actions or navigate with a single click.',
  category: 'Buttons',
  importCode: "import { OButton } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'ButtonBasic',
        code: '<OButton>Click me</OButton>',
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'ButtonVariants',
        code: `<OButton variant="primary">Primary</OButton>
<OButton variant="secondary">Secondary</OButton>
<OButton variant="outline">Outline</OButton>
<OButton variant="text">Text</OButton>
<OButton variant="soft">Soft</OButton>
<OButton variant="danger">Danger</OButton>
<OButton variant="danger-soft">Danger Soft</OButton>`,
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'ButtonSizes',
        code: `<OButton size="sm">Small</OButton>
<OButton size="md">Medium</OButton>
<OButton size="lg">Large</OButton>`,
      },
    },
    {
      id: 'shadows',
      title: 'Shadows',
      example: {
        component: 'ButtonShadows',
        code: `<OButton shadow="none">None</OButton>   <!-- default -->
<OButton shadow="xs">XS</OButton>
<OButton shadow="sm">SM</OButton>
<OButton shadow="md">MD</OButton>`,
      },
    },
    {
      id: 'with-icons',
      title: 'With Icons',
      example: {
        component: 'ButtonIcons',
        code: `<OButton>
  <template #start>
    <ArrowRightIcon />
  </template>
  Next
</OButton>`,
      },
    },
    {
      id: 'loading',
      title: 'Loading',
      example: {
        component: 'ButtonLoading',
        code: `<OButton :loading="true">Loading</OButton>
<OButton :loading="isLoading" @click="save">
  {{ isLoading ? 'Saving...' : 'Save' }}
</OButton>`,
      },
    },
    {
      id: 'animate-slot',
      title: 'Animate Slot',
      example: {
        component: 'ButtonAnimate',
        code: `<!-- Default content swaps with #animate slot on hover -->
<OButton animation-type="vertical">
  Home
  <template #animate>
    <HomeIcon />
  </template>
</OButton>

<OButton variant="soft" animation-type="vertical">
  Message
  <template #animate>
    <SendIcon /> Send
  </template>
</OButton>

<OButton variant="outline" animation-type="scale">
  <CartIcon />
  <template #animate>Store</template>
</OButton>

<OButton variant="danger" is-icon-only animation-type="rotate">
  <HeartOutline />
  <template #animate>
    <HeartFilled />
  </template>
</OButton>`,
      },
    },
    {
      id: 'full-width',
      title: 'Full Width',
      example: {
        component: 'ButtonFullWidth',
        code: '<OButton full-width>Full Width</OButton>',
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'ButtonDisabled',
        code: `<OButton disabled>Disabled</OButton>
<OButton variant="secondary" disabled>Disabled</OButton>`,
      },
    },
  ],

  props: [
    { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'text' | 'soft' | 'danger' | 'danger-soft'", default: "'primary'", description: 'Visual style of the button.' },
    { name: 'shadow', type: "'none' | 'xs' | 'sm' | 'md'", default: "'none'", description: 'Elevation shadow.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the button.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a loading spinner.' },
    { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretch to fill parent width.' },
    { name: 'ripple', type: 'boolean', default: 'true', description: 'Material-style ripple from the click point.' },
    { name: 'animationType', type: "'vertical' | 'scale' | 'rotate'", default: "'vertical'", description: 'Transition used to swap default content with the #animate slot on hover.' },
    { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'HTML button type.' },
    { name: 'as', type: 'string | Component', default: "'button'", description: 'Render as a different element.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'default', type: 'slot', description: 'Button label content.' },
    { name: 'start', type: 'slot', description: 'Content before the label (icon).' },
    { name: 'end', type: 'slot', description: 'Content after the label (icon).' },
    { name: 'animate', type: 'slot', description: 'Content shown on hover — replaces default with the chosen animationType.' },
  ],

  themeCode: `import { buttonTheme } from '@ousi-ui/vue'

// CVA variants: primary, secondary, outline, text, soft, danger, danger-soft
// CVA sizes: sm, md, lg
// CVA booleans: fullWidth, loading`,

  keyboard: [
    { key: 'enter', description: 'Activates the button.' },
    { key: 'space', description: 'Activates the button.' },
    { key: 'tab', description: 'Moves focus to the next focusable element.' },
  ],

  aria: [
    { attribute: 'aria-disabled', condition: 'disabled or loading', description: 'Button cannot be interacted with.' },
    { attribute: 'aria-busy', condition: 'loading', description: 'Button is performing an action.' },
    { attribute: 'role="button"', condition: "as != 'button'", description: 'Added for non-button elements.' },
  ],

  haptics: {
    defaultPreset: "'none' (opt-in via haptic prop)",
    trigger: 'On click, synchronously with the click event',
    notes: "No haptic by default. Enable with haptic=\"medium\" or any preset. Skipped when disabled or loading.",
  },

  bestPractices: [
    { text: 'Provide meaningful text or aria-label for icon-only buttons.', good: true },
    { text: 'Use type="submit" inside forms.', good: true },
    { text: 'Loading state automatically sets aria-busy.', good: true },
    { text: "Don't remove the focus ring — essential for keyboard navigation.", good: false },
    { text: "Don't disable buttons without explanation — use tooltip or helper text.", good: false },
  ],
}
