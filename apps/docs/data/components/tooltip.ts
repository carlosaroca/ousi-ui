import type { ComponentData } from './types'

export const tooltipData: ComponentData = {
  title: 'Tooltip',
  description: 'A brief label that appears on hover to describe an element.',
  category: 'Overlays',
  importCode: "import { OTooltip } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'TooltipUsage',
        code: `<OTooltip content="This is a tooltip">
  <OButton variant="outline">Hover me</OButton>
</OTooltip>`,
      },
    },
    {
      id: 'placements',
      title: 'Placements',
      example: {
        component: 'TooltipPlacements',
        code: `<OTooltip content="Top" placement="top">...</OTooltip>
<OTooltip content="Right" placement="right">...</OTooltip>
<OTooltip content="Bottom" placement="bottom">...</OTooltip>
<OTooltip content="Left" placement="left">...</OTooltip>`,
      },
    },
    {
      id: 'with-delay',
      title: 'With Delay',
      example: {
        component: 'TooltipWithDelay',
        code: `<OTooltip content="Delayed tooltip" :delay="500">
  <OButton variant="outline">Slow open</OButton>
</OTooltip>
<OTooltip content="Slow close" :close-delay="1000">
  <OButton variant="outline">Slow close</OButton>
</OTooltip>`,
      },
    },
  ],

  props: [
    { name: 'content', type: 'string', description: 'Text content of the tooltip.' },
    { name: 'placement', type: 'Placement', default: "'top'", description: 'Placement relative to the trigger.' },
    { name: 'offset', type: 'number', default: '-', description: 'Offset in px from the trigger.' },
    { name: 'showArrow', type: 'boolean', default: 'false', description: 'Show an arrow pointing to the trigger.' },
    { name: 'delay', type: 'number', description: 'Delay in ms before showing.' },
    { name: 'closeDelay', type: 'number', description: 'Delay in ms before hiding.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the tooltip is disabled.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes on the tooltip bubble.' },
  ],

  slots: [
    { name: 'default', type: 'slot', description: 'Trigger element that the tooltip wraps.' },
  ],

  keyboard: [
    { key: 'escape', description: 'Dismisses the tooltip.' },
    { key: 'tab (focus)', description: 'Shows the tooltip when the trigger gains focus.' },
  ],

  aria: [
    { attribute: 'role="tooltip"', condition: 'always', description: 'Tooltip has the tooltip role.' },
    { attribute: 'aria-describedby', condition: 'always', description: 'Trigger references the tooltip content.' },
  ],

  bestPractices: [
    { text: 'Use tooltips for supplementary info, not essential content.', good: true },
    { text: 'Keep tooltip text short (one line).', good: true },
    { text: "Don't put interactive elements inside tooltips — use a popover.", good: false },
  ],
}
