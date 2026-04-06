import type { ComponentData } from './types'

export const typewriterData: ComponentData = {
  title: 'Typewriter',
  description: 'Animated typing effect that types and deletes text.',
  category: 'Typography',
  importCode: "import { OTypewriter } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'TypewriterBasic',
        code: `<OTypewriter text="Welcome to Ousi UI, a beautiful component library." />`,
      },
    },
    {
      id: 'multiple-strings',
      title: 'Multiple Strings',
      example: {
        component: 'TypewriterMultiple',
        code: `<OTypewriter
  :text="['Build faster.', 'Design better.', 'Ship with confidence.']"
  :speed="60"
  :delete-speed="40"
  :delay="1500"
/>`,
      },
    },
    {
      id: 'speed',
      title: 'Speed',
      example: {
        component: 'TypewriterBasic',
        code: `<OTypewriter text="Slow and steady..." :speed="120" />

<OTypewriter text="Fast typing!" :speed="20" />`,
      },
    },
  ],

  props: [
    { name: 'text', type: 'string | string[]', default: "''", description: 'The text or array of texts to type. When an array, cycles through each string.' },
    { name: 'speed', type: 'number', default: '50', description: 'Typing speed in milliseconds per character.' },
    { name: 'deleteSpeed', type: 'number', default: '30', description: 'Deleting speed in milliseconds per character.' },
    { name: 'delay', type: 'number', default: '2000', description: 'Pause in milliseconds before deleting and typing the next string.' },
    { name: 'loop', type: 'boolean', default: 'true', description: 'Whether to loop through the text array continuously.' },
    { name: 'cursor', type: 'boolean', default: 'true', description: 'Show a blinking cursor at the typing position.' },
    { name: 'cursorChar', type: 'string', default: "'|'", description: 'Character used for the blinking cursor.' },
  ],
}
