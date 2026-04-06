import type { ComponentData } from './types'

export const marqueeData: ComponentData = {
  title: 'Marquee',
  description: 'Continuously scrolling content in any direction.',
  category: 'Media',
  importCode: "import { OMarquee } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'MarqueeBasic',
        code: `<OMarquee>
  <OBadge content="New">Sale</OBadge>
  <span>Free shipping on orders over $50</span>
  <OBadge color="accent" content="🔥">Hot</OBadge>
  <span>Up to 40% off select items</span>
</OMarquee>`,
      },
    },
    {
      id: 'directions',
      title: 'Directions',
      example: {
        component: 'MarqueeVertical',
        code: `<OMarquee direction="up" style="height: 120px">
  <div>🚀 Version 2.0 released</div>
  <div>🎉 New components available</div>
  <div>📦 Improved bundle size</div>
  <div>🔧 Bug fixes and improvements</div>
</OMarquee>`,
      },
    },
    {
      id: 'pause-on-hover',
      title: 'Pause on Hover',
      example: {
        component: 'MarqueeBasic',
        code: `<OMarquee :pause-on-hover="true">
  <OBadge content="New">Sale</OBadge>
  <span>Free shipping on orders over $50</span>
  <OBadge color="accent" content="🔥">Hot</OBadge>
  <span>Up to 40% off select items</span>
</OMarquee>`,
      },
    },
    {
      id: 'speed',
      title: 'Speed',
      example: {
        component: 'MarqueeBasic',
        code: `<OMarquee :speed="60">
  <span>Fast scrolling content</span>
  <span>Speeding through the marquee</span>
</OMarquee>

<OMarquee :speed="15">
  <span>Slow scrolling content</span>
  <span>Taking it easy</span>
</OMarquee>`,
      },
    },
  ],

  props: [
    { name: 'direction', type: "'left' | 'right' | 'up' | 'down'", default: "'left'", description: 'The scrolling direction of the marquee content.' },
    { name: 'speed', type: 'number', default: '30', description: 'Scrolling speed in pixels per second.' },
    { name: 'pauseOnHover', type: 'boolean', default: 'false', description: 'Pause the animation when the user hovers over the marquee.' },
    { name: 'gap', type: 'number', default: '16', description: 'Gap in pixels between repeated content blocks.' },
  ],

  slots: [
    { name: 'default', type: 'slot', description: 'The content to scroll inside the marquee.' },
  ],
}
