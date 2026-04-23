import type { ComponentData } from './types'

export const kbdData: ComponentData = {
  title: 'Kbd',
  description: 'Display keyboard keys and shortcuts.',
  category: 'Data Display',
  importCode: "import { OKbd } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'KbdBasic',
        code: '<OKbd keys="command">K</OKbd>',
      },
    },
    {
      id: 'single-keys',
      title: 'Single Keys',
      example: {
        component: 'KbdSingleKeys',
        code: `<OKbd keys="command" />
<OKbd keys="shift" />
<OKbd keys="option" />
<OKbd keys="ctrl" />
<OKbd keys="enter" />
<OKbd keys="escape" />`,
      },
    },
    {
      id: 'combinations',
      title: 'Combinations',
      example: {
        component: 'KbdCombinations',
        code: `<OKbd :keys="['command', 'shift']">P</OKbd>
<OKbd :keys="['ctrl', 'alt']">Delete</OKbd>
<OKbd :keys="['command']">S</OKbd>`,
      },
    },
    {
      id: 'light-variant',
      title: 'Light Variant',
      example: {
        component: 'KbdLightVariant',
        code: `<OKbd variant="light" keys="command">K</OKbd>
<OKbd variant="light" :keys="['command', 'shift']">P</OKbd>`,
      },
    },
  ],

  props: [
    { name: 'keys', type: "KbdKey | KbdKey[]", default: '-', description: 'Special key(s) to display as symbols.' },
    { name: 'variant', type: "'default' | 'light'", default: "'default'", description: 'Visual variant.' },
    { name: 'shadow', type: "'none' | 'xs' | 'sm'", default: "'none'", description: 'Elevation shadow.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'default', type: 'slot', description: 'Additional key label (e.g. letter after modifier).' },
  ],
}
