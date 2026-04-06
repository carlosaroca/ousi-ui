import type { ComponentData } from './types'

export const animatedNumberData: ComponentData = {
  title: 'AnimatedNumber',
  description: 'Displays numbers with smooth animated transitions. Supports roll (odometer), count (tween), slide, fade, and flip animations.',
  category: 'Data Display',
  importCode: "import { OAnimatedNumber } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'AnimatedNumberBasic',
        code: `<OAnimatedNumber :value="count" />`,
      },
    },
    {
      id: 'animations',
      title: 'Animation Modes',
      example: {
        component: 'AnimatedNumberModes',
        code: `<OAnimatedNumber :value="count" animation="roll" />
<OAnimatedNumber :value="count" animation="count" />
<OAnimatedNumber :value="count" animation="slide" />
<OAnimatedNumber :value="count" animation="fade" />
<OAnimatedNumber :value="count" animation="flip" />`,
      },
    },
    {
      id: 'formatting',
      title: 'Formatting',
      example: {
        component: 'AnimatedNumberFormatting',
        code: `<OAnimatedNumber
  :value="price"
  :format-options="{ style: 'currency', currency: 'USD' }"
  prefix="Total: "
/>`,
      },
    },
    {
      id: 'trend',
      title: 'Trend Direction',
      example: {
        component: 'AnimatedNumberTrend',
        code: `<OAnimatedNumber :value="count" trend="up" />
<OAnimatedNumber :value="count" trend="down" />
<OAnimatedNumber :value="count" trend="auto" />`,
      },
    },
    {
      id: 'duration',
      title: 'Custom Duration',
      example: {
        component: 'AnimatedNumberDuration',
        code: `<OAnimatedNumber :value="count" :duration="200" />
<OAnimatedNumber :value="count" :duration="1200" />`,
      },
    },
  ],

  props: [
    { name: 'value', type: 'number', default: '-', description: 'The numeric value to display (required).' },
    { name: 'animation', type: "'roll' | 'count' | 'slide' | 'fade' | 'flip'", default: "'roll'", description: 'Animation style.' },
    { name: 'duration', type: 'number', default: '600', description: 'Animation duration in milliseconds.' },
    { name: 'trend', type: "'auto' | 'up' | 'down'", default: "'auto'", description: 'Direction for roll/slide/flip animations.' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', default: '-', description: 'Intl.NumberFormat options (currency, decimals, etc.).' },
    { name: 'locale', type: 'string', default: '-', description: 'Locale for number formatting.' },
    { name: 'prefix', type: 'string', default: '-', description: 'Text before the number.' },
    { name: 'suffix', type: 'string', default: '-', description: 'Text after the number.' },
    { name: 'animateOnMount', type: 'boolean', default: 'false', description: 'Whether to animate on initial mount.' },
    { name: 'animated', type: 'boolean', default: 'true', description: 'Disable all animation.' },
  ],

  slots: [],

  emits: [],

  bestPractices: [
    { text: 'Use "roll" for dashboard counters, stats, and scoreboards.', good: true },
    { text: 'Use "count" for progress values or financial figures.', good: true },
    { text: 'Use formatOptions for locale-aware currency and percentage display.', good: true },
    { text: "Don't use very short durations (<100ms) — the animation won't be perceptible.", good: false },
    { text: "Don't animate numbers that change every frame (use count mode for real-time).", good: false },
  ],
}
