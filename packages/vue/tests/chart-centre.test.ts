import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import OSegmentedGauge from '../src/components/segmented-gauge/SegmentedGauge.vue'
import ORadarChart from '../src/components/radar-chart/RadarChart.vue'
import OSunburst from '../src/components/sunburst/Sunburst.vue'

// What sits in the middle of these charts is placed with CSS, over a box. If that box is the root,
// a stretched root (a flex column, a grid, w-full) is wider than the drawing and the text drifts
// off it. happy-dom has no layout, so this pins the structure that keeps the two together.
const mid = () => h('b', { 'data-mid': '' }, 'mid')
const cases = [
  {
    name: 'OSegmentedGauge',
    build: () => mount(OSegmentedGauge, { props: { segments: [{ label: 'A', value: 3, max: 5 }] }, slots: { default: mid } }),
    centre: (root: Element) => root.querySelector('[data-mid]')!.parentElement!,
  },
  {
    name: 'ORadarChart',
    build: () => mount(ORadarChart, { props: { data: [{ label: 'A', v: 1 }, { label: 'B', v: 2 }, { label: 'C', v: 3 }], series: [{ key: 'v', label: 'V' }] }, slots: { center: mid } }),
    centre: (root: Element) => root.querySelector('[data-mid]')!.parentElement!,
  },
  {
    name: 'OSunburst',
    build: () => mount(OSunburst, { props: { data: [{ name: 'A', value: 1 }, { name: 'B', value: 2 }] } }),
    centre: (root: Element) => root.querySelector('[data-part="center"]')!,
  },
]

describe.each(cases)('$name keeps its centre on the drawing', ({ build, centre }) => {
  it('places the centre over a box that is as wide as the drawing, not over the root', () => {
    const root = build().element as Element
    const box = root.querySelector('svg')!.parentElement!

    expect(box).not.toBe(root)
    expect(centre(root).parentElement).toBe(box)
    expect([...box.classList]).toEqual(expect.arrayContaining(['relative', 'mx-auto', 'w-fit', 'max-w-full']))
    expect([...root.classList]).toContain('w-fit')
    expect([...root.classList]).not.toContain('relative')
  })
})
