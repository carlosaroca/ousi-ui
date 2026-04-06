import type { ComponentData } from './types'

export const buttonGroupData: ComponentData = {
  title: 'ButtonGroup',
  description: 'Group related buttons together with consistent spacing and orientation.',
  category: 'Buttons',
  importCode: "import { OButtonGroup, OButton } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'ButtonGroupBasic',
        code: `<OButtonGroup>
  <OButton>Left</OButton>
  <OButton>Center</OButton>
  <OButton>Right</OButton>
</OButtonGroup>`,
      },
    },
    {
      id: 'vertical',
      title: 'Vertical',
      example: {
        component: 'ButtonGroupVertical',
        code: `<OButtonGroup orientation="vertical">
  <OButton>Top</OButton>
  <OButton>Middle</OButton>
  <OButton>Bottom</OButton>
</OButtonGroup>`,
      },
    },
    {
      id: 'variants',
      title: 'With Variants',
      example: {
        component: 'ButtonGroupVariants',
        code: `<OButtonGroup>
  <OButton variant="outline">Outline</OButton>
  <OButton variant="outline">Outline</OButton>
  <OButton variant="outline">Outline</OButton>
</OButtonGroup>`,
      },
    },
    {
      id: 'full-width',
      title: 'Full Width',
      example: {
        component: 'ButtonGroupFullWidth',
        code: `<OButtonGroup full-width>
  <OButton>Left</OButton>
  <OButton>Center</OButton>
  <OButton>Right</OButton>
</OButtonGroup>`,
      },
    },
  ],

  props: [
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout direction of the buttons.' },
    { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretch buttons to fill parent width.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'default', type: 'slot', description: 'OButton elements to group.' },
  ],

  themeCode: `import { buttonGroupTheme } from '@ousi-ui/vue'

// CVA variants: orientation (horizontal, vertical)
// CVA booleans: fullWidth`,

  keyboard: [
    { key: 'tab', description: 'Moves focus to the next button in the group.' },
  ],

  aria: [
    { attribute: 'role="group"', condition: 'always', description: 'Groups related buttons semantically.' },
  ],

  bestPractices: [
    { text: 'Use ButtonGroup for related actions (e.g., text alignment toggles).', good: true },
    { text: 'Keep button variants consistent within a group.', good: true },
    { text: "Don't mix unrelated actions in the same group.", good: false },
  ],
}
