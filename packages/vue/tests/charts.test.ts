import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import OComboChart from '../src/components/combo-chart/ComboChart.vue'
import OActivityRings from '../src/components/activity-rings/ActivityRings.vue'
import OFunnel from '../src/components/funnel/Funnel.vue'
import OHeatmap from '../src/components/heatmap/Heatmap.vue'
import OAreaChart from '../src/components/area-chart/AreaChart.vue'
import ORadarChart from '../src/components/radar-chart/RadarChart.vue'
import OScatterChart from '../src/components/scatter-chart/ScatterChart.vue'
import OSegmentedGauge from '../src/components/segmented-gauge/SegmentedGauge.vue'
import { shareArc } from '../src/components/chart-shared'
import OSankey from '../src/components/sankey/Sankey.vue'
import ODotMatrix from '../src/components/dot-matrix/DotMatrix.vue'
import ODonutChart from '../src/components/donut-chart/DonutChart.vue'
import OBarChart from '../src/components/bar-chart/BarChart.vue'
import OTreemap from '../src/components/treemap/Treemap.vue'
import { squarify } from '../src/components/treemap/treemap.layout'

beforeAll(() => {
  ;(globalThis as any).ResizeObserver = class { observe() {} disconnect() {} unobserve() {} }
  window.matchMedia = ((q: string) => ({ matches: true, media: q, addEventListener() {}, removeEventListener() {} })) as any
})

/** The circle each clip leaves out: `M<rect>ZM<x - r>,<y>a<r>,…`, with the even-odd rule. */
function circlesCut(clips: { get: (selector: string) => { attributes: (name: string) => string | undefined } }[]) {
  return clips.map((clip) => {
    const path = clip.get('path')
    expect(path.attributes('clip-rule')).toBe('evenodd') // otherwise the circle is kept, and nothing is cut
    const [, left, y, r] = path.attributes('d')!.match(/ZM(-?[\d.]+),(-?[\d.]+)a([\d.]+),/)!.map(Number)
    return { x: left + r, y, r }
  })
}

const rows = [
  { m: 'Jan', a: 10, b: 2 },
  { m: 'Feb', a: 20, b: 3 },
  { m: 'Mar', a: 15, b: 5 },
]
const noNaN = (html: string) => expect(html).not.toMatch(/NaN|undefined|Infinity/)

describe('charts render', () => {
  it('combo chart: bars, line, points, focus events', async () => {
    const w = mount(OComboChart, { props: { data: rows, categoryKey: 'm', bar: { key: 'a' }, line: { key: 'b' } } })
    await nextTick()
    expect(w.findAll('path').length).toBeGreaterThanOrEqual(4)
    expect(w.findAll('circle').length).toBe(3)
    noNaN(w.html())
    await w.findAll('rect[data-roving]')[1].trigger('mouseenter')
    expect(w.emitted('update:focused')?.[0]).toEqual([1])
    expect(w.emitted('point-enter')).toBeTruthy()
  })

  it('combo chart: hides axes and the line is optional', () => {
    const w = mount(OComboChart, { props: { data: rows, categoryKey: 'm', bar: { key: 'a' }, showXAxis: false, showBarAxis: false } })
    expect(w.text()).not.toContain('Jan')
    noNaN(w.html())
  })

  it('activity rings: custom hex color and slot scope', async () => {
    const w = mount(OActivityRings, {
      props: { rings: [{ label: 'Move', value: 5, max: 10, color: '#ff5d73' }], focused: 'Move' },
      slots: { default: `<template #default="{ focusedRing }">{{ focusedRing?.label }}</template>` },
    })
    expect(w.html()).toContain('#ff5d73')
    expect(w.text()).toContain('Move')
  })

  it('funnel: columns and bars', async () => {
    const stages = [{ label: 'A', value: 100 }, { label: 'B', value: 40 }, { label: 'C', value: 10 }]
    for (const variant of ['columns', 'bars'] as const) {
      const w = mount(OFunnel, { props: { stages, variant } })
      await nextTick()
      expect(w.text()).toContain('40%')
      noNaN(w.html())
    }
    const w = mount(OFunnel, { props: { stages, variant: 'bars' } })
    await w.findAll('li')[1].trigger('mouseenter')
    expect((w.emitted('stage-enter')![0][0] as any).label).toBe('B')
    expect(w.emitted('update:focused')![0]).toEqual([1])
  })

  it('heatmap: cells, intensity and events', async () => {
    const w = mount(OHeatmap, { props: { rows: [{ label: 'r', values: [0, 5, 10] }], columns: ['x', 'y', 'z'], showLegend: true } })
    const cells = w.findAll('[role="gridcell"]')
    expect(cells.length).toBe(3)
    await cells[2].trigger('click')
    expect((w.emitted('cell-click')![0][0] as any).intensity).toBe(1)
    noNaN(w.html())
  })

  it('area chart: dashed series has no fill and tooltip appears on focus', async () => {
    const w = mount(OAreaChart, {
      props: { data: rows, categoryKey: 'm', series: [{ key: 'a' }, { key: 'b', dashed: true }], focused: 1 },
    })
    await nextTick()
    expect(w.findAll('path[fill^="url"]').length).toBe(1)
    expect(w.text()).toContain('Feb')
    noNaN(w.html())
  })

  it('radar chart: all variants', () => {
    const data = [{ label: 'x', v: 10 }, { label: 'y', v: 50 }, { label: 'z', v: 90 }]
    for (const variant of ['filled', 'dots', 'lines', 'score'] as const) {
      const w = mount(ORadarChart, { props: { data, series: [{ key: 'v' }], variant, max: 100, alertBelow: 40 } })
      expect(w.findAll('polygon').length).toBeGreaterThan(4)
      noNaN(w.html())
    }
  })

  it('scatter chart: bubble detection and focus', async () => {
    const series = [{ label: 'S', points: [{ x: 1, y: 2, z: 5 }, { x: 3, y: 4, z: 20 }] }]
    const w = mount(OScatterChart, { props: { series, focused: { series: 0, point: 1 } } })
    await nextTick()
    const rs = w.findAll('circle').map((c) => Number(c.attributes('r')))
    expect(rs[1]).toBeGreaterThan(rs[0])
    noNaN(w.html())
  })

  it('segmented gauge: arcs and events', async () => {
    const w = mount(OSegmentedGauge, { props: { segments: [{ label: 'a', value: 5, max: 10 }, { label: 'b', value: 0, max: 5 }] } })
    expect(w.findAll('[data-part="track"]').length).toBe(2)
    expect(w.findAll('[data-part="fill"]').length).toBe(1) // value 0 draws no fill
    await w.findAll('g')[0].trigger('mouseenter')
    expect(w.emitted('segment-enter')).toBeTruthy()
    noNaN(w.html())
  })

  describe('segmented gauge joints', () => {
    type Segment = [value: number, max: number]
    const SWEEP = 270
    const START = 90 + (360 - SWEEP) / 2
    const RADIUS = 44 // strokeWidth 10

    function gauge(values: Segment[], props: Record<string, unknown> = {}) {
      return mount(OSegmentedGauge, {
        props: { animated: false, segments: values.map(([value, max], i) => ({ label: String(i), value, max })), ...props },
      })
    }
    type Gauge = ReturnType<typeof gauge>
    const at = (x: number, y: number) => (((Math.atan2(y - 50, x - 50) * 180) / Math.PI - START + 720 + 1) % 360) - 1
    /** Where each line starts and ends, in degrees from the start of the gauge. */
    const lines = (w: Gauge) =>
      w.findAll('[data-part="track"]').map((path) => {
        const d = path.attributes('d')!
        const ends = [...d.matchAll(/(?:M|0 [01] 1 )(-?[\d.]+),(-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])])
        expect(ends).toHaveLength(3) // start, middle and end
        return { from: at(ends[0][0], ends[0][1]), to: at(ends[2][0], ends[2][1]), start: ends[0], end: ends[2] }
      })
    const cuts = (w: Gauge) => circlesCut(w.findAll('clipPath'))

    const triage: Segment[] = [2, 453, 1224, 480, 39].map((v) => [v, v])

    it('ends each segment exactly where the next begins, so their round ends cannot form a lump', () => {
      for (const props of [{}, { joined: true }, { strokeWidth: 14, gap: 12 }]) {
        const all = lines(gauge(triage, props))
        expect(all).toHaveLength(5)
        for (let i = 1; i < all.length; i++) expect(all[i].start).toEqual(all[i - 1].end)
        // The two ends of the gauge are the two ends of the sweep.
        expect(all[0].from).toBeCloseTo(0, 1)
        expect(all.at(-1)!.to).toBeCloseTo(SWEEP, 1)
      }
    })

    it('has round ends', () => {
      for (const path of gauge(triage).findAll('[data-part="track"], [data-part="fill"]')) {
        expect(path.attributes('stroke-linecap')).toBe('round')
      }
    })

    it('cuts a ring of the same width around the round start of whatever follows', () => {
      const w = gauge(triage, { gap: 6 })
      const all = lines(w)
      const ring = (6 * Math.PI) / 180 * RADIUS
      expect(cuts(w)).toHaveLength(4) // the last one has nothing after it
      cuts(w).forEach((cut, i) => {
        expect(cut.x).toBeCloseTo(all[i].end[0], 2)
        expect(cut.y).toBeCloseTo(all[i].end[1], 2)
        expect(cut.r).toBeCloseTo(5 + ring, 2)
      })
      // Each cut applies to the track and the fill of its own segment.
      const wanted = w.findAll('clipPath').map((c) => `url(#${c.attributes('id')})`)
      for (const part of ['track', 'fill']) {
        expect(w.findAll(`[data-part="${part}"]`).map((p) => p.attributes('clip-path'))).toEqual([...wanted, undefined])
      }
    })

    it('cuts with a clip, not a mask: what is cut away must not take the pointer', () => {
      expect(gauge(triage).findAll('mask')).toHaveLength(0)
    })

    it('closes a full ring: the last segment is cut around the start of the first', () => {
      const w = gauge([[1, 1], [1, 1], [1, 1]], { sweep: 360 })
      const first = w.get('[data-part="track"]').attributes('d')!.match(/^M(-?[\d.]+),(-?[\d.]+)/)!
      expect(cuts(w)).toHaveLength(3)
      expect(cuts(w)[2].x).toBeCloseTo(Number(first[1]), 2)
      expect(cuts(w)[2].y).toBeCloseTo(Number(first[2]), 2)
    })

    it('joined, or with no gap, they touch without lying on each other; separated is the default', () => {
      // An overlap shows as a disc at the joint as soon as a segment is faded.
      for (const props of [{ joined: true }, { gap: 0 }]) {
        const narrow = cuts(gauge(triage, props))
        expect(narrow).toHaveLength(4)
        for (const cut of narrow) expect(cut.r).toBeCloseTo(4.9, 3) // a hair under half the band
      }
      for (const cut of cuts(gauge(triage))) expect(cut.r).toBeGreaterThan(5)
    })

    it('draws a whole ring when a single segment closes on itself, without cutting it', () => {
      const w = gauge([[1, 2]], { sweep: 360 })
      expect(cuts(w)).toHaveLength(0)
      const [only] = lines(w)
      expect(only.start).toEqual(only.end)
      expect(w.html()).not.toContain('NaN')
    })

    it('draws any value above zero once, even one that rounds to 0%, and nothing for zero', () => {
      const [tiny, none] = gauge([[2, 1224], [0, 1224]]).findAll('g')
      const fill = tiny.findAll('[data-part="fill"]')
      expect(fill).toHaveLength(1)
      // A repeat of the dash starting at the end of the line would draw a second dot there.
      expect(fill[0].attributes('stroke-dasharray')).toBe('1 2')
      expect(none.findAll('[data-part="fill"]')).toHaveLength(0)
    })

    it('animates a change of value: the line stays put and only the offset of its dash moves', async () => {
      const w = gauge([[2, 10]])
      await new Promise((resolve) => setTimeout(resolve, 30))
      const fill = () => w.get('[data-part="fill"]')
      const before = fill().attributes('d')
      expect(Number(fill().attributes('stroke-dashoffset'))).toBeCloseTo(0.8)
      await w.setProps({ segments: [{ label: '0', value: 7, max: 10 }] })
      expect(fill().attributes('d')).toBe(before)
      expect(Number(fill().attributes('stroke-dashoffset'))).toBeCloseTo(0.3)
    })

    it('does not fill past the segment when the value is over its maximum', async () => {
      const w = gauge([[15, 10]])
      await new Promise((resolve) => setTimeout(resolve, 30))
      expect(Number(w.get('[data-part="fill"]').attributes('stroke-dashoffset'))).toBe(0)
    })

    it('gives a segment with no maximum no room', () => {
      const w = gauge([[5, 10], [0, 0], [5, 10]])
      expect(lines(w)).toHaveLength(2)
      expect(w.html()).not.toContain('NaN')
    })

    it('gives clip ids that two gauges never share', () => {
      const w = mount({
        components: { OSegmentedGauge },
        template: '<div><OSegmentedGauge :segments="s" /><OSegmentedGauge :segments="s" /></div>',
        data: () => ({ s: [{ label: 'a', value: 1, max: 2 }, { label: 'b', value: 1, max: 1 }] }),
      })
      expect(new Set(w.findAll('clipPath').map((c) => c.attributes('id'))).size).toBe(2)
    })

    it('shares the sweep in proportion, lifting what is too small to see', () => {
      expect(shareArc([1, 1, 2], 100, 5)).toEqual([25, 25, 50])
      const lifted = shareArc([1, 99, 0, 100], 100, 10)
      expect(lifted[0]).toBe(10)
      expect(lifted[2]).toBe(0)
      expect(lifted.reduce((a, b) => a + b)).toBeCloseTo(100)
      expect(shareArc([1, 1, 1], 9, 10)).toEqual([3, 3, 3])
      expect(shareArc([1, 2], -4, 5)).toEqual([0, 0])
    })
  })

  it('sankey: columns, ribbons and focus', async () => {
    const nodes = [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }]
    const links = [
      { source: 'A', target: 'C', value: 5 },
      { source: 'B', target: 'C', value: 3 },
      { source: 'C', target: 'D', value: 8 },
    ]
    const w = mount(OSankey, { props: { nodes, links, focused: 'node:2' } })
    await nextTick()
    expect(w.findAll('path[role="img"]').length).toBe(3)
    expect(w.findAll('rect[role="img"]').length).toBe(4)
    noNaN(w.html())
    await w.findAll('rect[role="img"]')[0].trigger('mouseenter')
    expect((w.emitted('node-enter')![0][0] as any).name).toBe('A')
  })
})

describe('uncontrolled hover (no v-model:focused)', () => {
  it('combo chart shows the tooltip and dims other bars', async () => {
    const w = mount(OComboChart, { props: { data: rows, categoryKey: 'm', bar: { key: 'a', label: 'Sessions' }, line: { key: 'b' } } })
    await w.findAll('rect[data-roving]')[1].trigger('mouseenter')
    expect(w.text()).toContain('Sessions')
    expect(w.text()).toContain('20')
    const opacities = w.findAll('path[style*="scaleY"]').map((p) => p.attributes('style')!.match(/opacity: ([\d.]+)/)![1])
    expect(opacities).toEqual(['0.3', '1', '0.3'])
    await w.findAll('rect[data-roving]')[1].trigger('mouseleave')
    expect(w.findAll('path[style*="scaleY"]').map((p) => p.attributes('style')!.match(/opacity: ([\d.]+)/)![1])).toEqual(['1', '1', '1'])
  })

  it('custom tooltip slot renders on hover', async () => {
    const w = mount(OComboChart, {
      props: { data: rows, categoryKey: 'm', bar: { key: 'a' } },
      slots: { tooltip: `<template #tooltip="{ point }">CUSTOM {{ point.category }}</template>` },
    })
    expect(w.text()).not.toContain('CUSTOM')
    await w.findAll('rect[data-roving]')[2].trigger('mouseenter')
    expect(w.text()).toContain('CUSTOM Mar')
  })

  it('area chart, scatter, gauge, radar, funnel, heatmap, sankey and rings react', async () => {
    const area = mount(OAreaChart, { props: { data: rows, categoryKey: 'm', series: [{ key: 'a' }] } })
    await area.findAll('rect[data-roving]')[0].trigger('mouseenter')
    expect(area.text()).toContain('Jan')

    const scatter = mount(OScatterChart, { props: { series: [{ label: 'S', points: [{ x: 1, y: 2, label: 'P1' }] }] } })
    await scatter.find('circle').trigger('mouseenter')
    expect(scatter.text()).toContain('P1')

    const gauge = mount(OSegmentedGauge, {
      props: { segments: [{ label: 'a', value: 5, max: 10 }, { label: 'b', value: 2, max: 5 }] },
      slots: { default: `<template #default="{ focusedSegment }">{{ focusedSegment?.label ?? 'none' }}</template>` },
    })
    expect(gauge.text()).toBe('none')
    await gauge.findAll('g')[1].trigger('mouseenter')
    expect(gauge.text()).toBe('b')

    const radar = mount(ORadarChart, {
      props: { data: [{ label: 'x', v: 1 }, { label: 'y', v: 2 }, { label: 'z', v: 3 }], series: [{ key: 'v' }] },
      slots: { center: `<template #center="{ focusedAxis }">{{ focusedAxis?.label ?? 'none' }}</template>` },
    })
    await radar.findAll('line[data-roving]')[1].trigger('mouseenter')
    expect(radar.text()).toContain('y')

    const funnel = mount(OFunnel, {
      props: { stages: [{ label: 'A', value: 10 }, { label: 'B', value: 5 }], variant: 'bars' },
      slots: { stage: `<template #stage="{ dimmed }">{{ dimmed ? 'dim' : 'on' }}</template>` },
    })
    await funnel.findAll('li')[0].trigger('mouseenter')
    expect(funnel.text()).toBe('AonBdim')

    const heat = mount(OHeatmap, { props: { rows: [{ label: 'r', values: [1, 2] }], columns: ['x', 'y'] } })
    await heat.findAll('[role="gridcell"]')[1].trigger('mouseenter')
    expect(heat.html()).toContain('0 0 0 2px')

    const sankey = mount(OSankey, {
      props: { nodes: [{ name: 'A' }, { name: 'B' }, { name: 'C' }], links: [{ source: 'A', target: 'B', value: 3 }, { source: 'A', target: 'C', value: 1 }] },
    })
    await sankey.findAll('rect[role="img"]')[1].trigger('mouseenter')
    expect(sankey.findAll('path[role="img"]').map((p) => p.attributes('style')).join()).toContain('opacity: 0.07')

    const rings = mount(OActivityRings, { props: { rings: [{ label: 'a', value: 1 }, { label: 'b', value: 2 }] } })
    await rings.findAll('g[class]')[0].trigger('mouseenter')
    expect(rings.findAll('g').some((g) => (g.attributes('style') ?? '').includes('opacity: 0.25'))).toBe(true)
  })

  it('stays controlled when the parent passes focused', async () => {
    const w = mount(OComboChart, { props: { data: rows, categoryKey: 'm', bar: { key: 'a' }, focused: 0 } })
    await w.findAll('rect[data-roving]')[2].trigger('mouseenter')
    // the parent did not update the prop, so the chart keeps showing the controlled value
    expect(w.text()).toContain('Jan')
    expect(w.emitted('update:focused')![0]).toEqual([2])
  })
})

describe('dot matrix', () => {
  const data = [{ label: 'a', value: 100 }, { label: 'b', value: 40 }, { label: 'c', value: 0, scale: 0.5 }]

  it('fills columns from the bottom and shrinks scaled ones', () => {
    const w = mount(ODotMatrix, { props: { data, max: 100, rows: 5 } })
    const dots = w.findAll('rect[fill]').filter((r) => r.attributes('fill') !== 'transparent')
    expect(dots.length).toBe(15)
    const filled = dots.filter((r) => r.attributes('fill') !== 'var(--ousi-default)')
    expect(filled.length).toBe(5 + 2) // a: 5 dots, b: 40% of 5 = 2 dots, c: none
    const widths = dots.map((r) => Number(r.attributes('width')))
    expect(Math.min(...widths)).toBeLessThan(Math.max(...widths)) // column c is scaled down
    expect(w.html()).not.toMatch(/NaN|undefined|Infinity/)
  })

  it('hover works without v-model and the tooltip slot renders', async () => {
    const w = mount(ODotMatrix, {
      props: { data, max: 100 },
      slots: { tooltip: `<template #tooltip="{ item }">TIP {{ item.label }} {{ item.percent }}</template>` },
    })
    await w.findAll('rect[data-roving]')[1].trigger('mouseenter')
    expect(w.text()).toContain('TIP b 40')
    expect(w.emitted('column-enter')).toBeTruthy()
  })
})

describe('very small and empty values', () => {
  const data = [{ m: 'tiny', v: 1 }, { m: 'big', v: 5000 }, { m: 'none', v: 0 }]
  const series = [{ key: 'v' }]

  it.each([
    ['vertical', 'height', {}],
    ['horizontal', 'width', { orientation: 'horizontal' }],
  ])('bar chart, %s: anything above zero is seen, zero is not', (_, side, props) => {
    const w = mount(OBarChart, { props: { data, categoryKey: 'm', series, animated: false, ...props } })
    const [tiny, big, none] = w.findAll('[data-part="bar"]').map((r) => Number(r.attributes(side)))
    expect(tiny).toBe(3)
    expect(big).toBeGreaterThan(100)
    expect(none).toBe(0)
  })

  it('bar chart: a short bar keeps round corners, not oval ones', () => {
    // SVG limits rx and ry apart, so the radius has to fit both sides.
    const w = mount(OBarChart, { props: { data, categoryKey: 'm', series, animated: false } })
    for (const rect of w.findAll('[data-part="bar"]')) {
      const [width, height, rx] = ['width', 'height', 'rx'].map((a) => Number(rect.attributes(a)))
      expect(rx).toBeLessThanOrEqual(Math.min(width, height) / 2)
    }
  })

  it('combo chart: anything above zero is seen, zero is not', () => {
    const w = mount(OComboChart, { props: { data, categoryKey: 'm', bar: { key: 'v' }, animated: false } })
    const tall = (d: string) => {
      const ys = [...d.matchAll(/V(-?[\d.]+)|(?:M|0 0 1 )-?[\d.]+,(-?[\d.]+)/g)].map((m) => Number(m[1] ?? m[2]))
      return Math.max(...ys) - Math.min(...ys)
    }
    const [tiny, big, none] = w.findAll('path[style*="scaleY"]').map((p) => tall(p.attributes('d')!))
    expect(tiny).toBeCloseTo(3, 5)
    expect(big).toBeGreaterThan(100)
    expect(none).toBe(0)
  })

  it('funnel bars: with little room each bar takes a line of its own', async () => {
    const stages = [{ label: 'Impressions', value: 10 }, { label: 'b', value: 4 }]
    const laid = async (available: number) => {
      const room = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(available)
      const w = mount(OFunnel, { props: { variant: 'bars', stages } })
      await nextTick()
      room.mockRestore()
      return w.findAll('[data-part="track"]').map((track) => track.classes().includes('col-span-2'))
    }
    expect(await laid(300)).toEqual([true, true])
    expect(await laid(640)).toEqual([false, false])
  })

  it('funnel bars: the shortest is a circle, and an empty stage has no bar', async () => {
    const w = mount(OFunnel, {
      props: { variant: 'bars', animated: false, stages: [{ label: 'a', value: 1000 }, { label: 'b', value: 1 }, { label: 'c', value: 0 }] },
    })
    await nextTick()
    const rows = w.findAll('li')
    const bar = rows[1].get('[data-part="bar"]').attributes('style')!
    expect(bar).toContain('min-width: 2.25rem') // the height of the track: h-9
    expect(bar).not.toContain('width: 8%') // the real share, which the minimum then holds up
    expect(rows[0].find('[data-part="bar"]').exists()).toBe(true)
    expect(rows[2].find('[data-part="bar"]').exists()).toBe(false)
  })
})

describe('donut chart', () => {
  const data = [{ label: 'A', value: 50 }, { label: 'B', value: 30 }, { label: 'C', value: 20 }]

  describe('joints', () => {
    const RADIUS = 38 // size 220, thickness 16, explode 3
    const donut = (props: Record<string, unknown> = {}) => mount(ODonutChart, { props: { data, animated: false, ...props } })
    type Donut = ReturnType<typeof donut>
    const segments = (w: Donut) => w.findAll('[data-part="segment"]')
    /** Start and end of each arc. */
    const ends = (w: Donut) =>
      segments(w).map((path) => {
        const all = [...path.attributes('d')!.matchAll(/(?:M|0 [01] 1 )(-?[\d.]+),(-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])])
        return { start: all[0], end: all.at(-1)! }
      })
    const cuts = (w: Donut) => circlesCut(w.findAll('clipPath'))
    /** Degrees an arc spans. */
    const spans = (w: Donut) =>
      ends(w).map(({ start, end }) => {
        const angle = ([x, y]: number[]) => (Math.atan2(y - 50, x - 50) * 180) / Math.PI
        return (angle(end) - angle(start) + 360) % 360
      })

    it('is round by default, each segment ending exactly where the next begins, all the way round', () => {
      const w = donut()
      const all = ends(w)
      expect(all).toHaveLength(3)
      for (const path of segments(w)) expect(path.attributes('stroke-linecap')).toBe('round')
      all.forEach((arc, i) => {
        expect(arc.end[0]).toBeCloseTo(all[(i + 1) % 3].start[0], 2)
        expect(arc.end[1]).toBeCloseTo(all[(i + 1) % 3].start[1], 2)
      })
      expect(all[0].start).toEqual([50, 50 - RADIUS]) // 12 o'clock
    })

    it('keeps the angles in proportion to the values', () => {
      const [a, b, c] = spans(donut())
      expect(a).toBeCloseTo(180, 1)
      expect(b).toBeCloseTo(108, 1)
      expect(c).toBeCloseTo(72, 1)
    })

    it('separates them with a ring of even width around the round start of the next one', () => {
      const w = donut({ gap: 5 })
      const all = ends(w)
      expect(cuts(w)).toHaveLength(3)
      cuts(w).forEach((cut, i) => {
        expect(cut.x).toBeCloseTo(all[i].end[0], 2)
        expect(cut.y).toBeCloseTo(all[i].end[1], 2)
        expect(cut.r).toBeCloseTo(8 + ((5 * Math.PI) / 180) * RADIUS, 2)
      })
      expect(segments(w).map((p) => p.attributes('clip-path'))).toEqual(w.findAll('clipPath').map((c) => `url(#${c.attributes('id')})`))
    })

    it('joined, they touch without lying on each other, also where the circle closes', () => {
      for (const props of [{ joined: true }, { gap: 0 }]) {
        const w = donut(props)
        expect(cuts(w)).toHaveLength(3)
        for (const cut of cuts(w)) expect(cut.r).toBeCloseTo(7.9, 3) // a hair under half the band
        expect(segments(w).every((p) => !!p.attributes('clip-path'))).toBe(true)
      }
    })

    it('moves the hovered segment out, except from a joined round ring, which is one piece', () => {
      const moved = (props: Record<string, unknown>) =>
        !donut({ ...props, focused: 1 }).findAll('g[data-roving]')[1].attributes('style')!.includes('translate(0px, 0px)')
      expect(moved({})).toBe(true)
      expect(moved({ rounded: false, joined: true })).toBe(true) // straight ends come apart cleanly
      expect(moved({ variant: 'pie', joined: true })).toBe(true)
      expect(moved({ joined: true })).toBe(false)
      expect(moved({ gap: 0 })).toBe(false)
    })

    it('can be cut straight, with the space as an angle', () => {
      const w = donut({ rounded: false })
      for (const path of segments(w)) expect(path.attributes('stroke-linecap')).toBe('butt')
      expect(cuts(w)).toHaveLength(0)
      expect(spans(w)[0]).toBeCloseTo((360 - 3 * 2) * 0.5, 1)
      expect(spans(donut({ rounded: false, joined: true }))[0]).toBeCloseTo(180, 1)
    })

    it('never rounds or cuts a pie', () => {
      const w = donut({ variant: 'pie' })
      for (const path of segments(w)) expect(path.attributes('stroke-linecap')).toBe('butt')
      expect(cuts(w)).toHaveLength(0)
    })

    it('draws a single value as a whole ring, uncut', () => {
      const w = donut({ data: [{ label: 'all', value: 7 }, { label: 'none', value: 0 }] })
      expect(segments(w)).toHaveLength(1)
      expect(cuts(w)).toHaveLength(0)
      expect(ends(w)[0].start).toEqual(ends(w)[0].end)
    })

    it('lifts a tiny share enough to be seen, and still reports its real percent', () => {
      const w = donut({ data: [{ label: 'big', value: 999 }, { label: 'tiny', value: 1 }], showLegend: true })
      const length = (degrees: number) => ((degrees * Math.PI) / 180) * RADIUS
      expect(length(spans(w)[1]) - length(2)).toBeCloseTo(0.3 * 16, 1) // what is left of it once cut
      expect(w.text()).toContain('0.1%')
    })

    it('draws each segment once: no repeat of the dash shows as a second dot', () => {
      for (const path of segments(donut())) expect(path.attributes('stroke-dasharray')).toBe('1 2')
    })

    it('gives clip ids that two donuts never share', () => {
      const w = mount({
        components: { ODonutChart },
        template: '<div><ODonutChart :data="d" /><ODonutChart :data="d" /></div>',
        data: () => ({ d: data }),
      })
      expect(new Set(w.findAll('clipPath').map((c) => c.attributes('id'))).size).toBe(6)
    })

    it('survives no data and all zeros', () => {
      for (const empty of [[], [{ label: 'a', value: 0 }, { label: 'b', value: 0 }]]) {
        const w = donut({ data: empty })
        expect(segments(w)).toHaveLength(0)
        expect(w.html()).not.toContain('NaN')
      }
    })
  })

  it('draws one arc per segment with the right shares', () => {
    const w = mount(ODonutChart, { props: { data } })
    expect(w.findAll('[data-part="segment"]').length).toBe(3)
    expect(w.text()).toContain('100') // total in the hole
    noNaN(w.html())
  })

  it('hover works without v-model: the hole shows the segment and the others dim', async () => {
    const w = mount(ODonutChart, { props: { data } })
    await w.findAll('g[data-roving]')[1].trigger('mouseenter')
    expect(w.text()).toContain('B · 30%')
    const styles = w.findAll('g[data-roving]').map((g) => g.attributes('style')!)
    expect(styles[0]).toContain('opacity: 0.3')
    expect(styles[1]).toContain('opacity: 1')
    await w.findAll('g[data-roving]')[1].trigger('mouseleave')
    expect(w.text()).toContain('Total')
  })

  it('pie variant has no hole, legend lists the segments, handles empty data', () => {
    const pie = mount(ODonutChart, { props: { data, variant: 'pie', showLegend: true } })
    expect(pie.text()).not.toContain('Total')
    expect(pie.findAll('li').length).toBe(3)
    const empty = mount(ODonutChart, { props: { data: [] } })
    noNaN(empty.html())
    const single = mount(ODonutChart, { props: { data: [{ label: 'Only', value: 5 }] } })
    expect(single.html()).not.toMatch(/NaN/)
  })
})

describe('bar chart', () => {
  const data = [{ m: 'Jan', a: 10, b: 4 }, { m: 'Feb', a: 20, b: 8 }, { m: 'Mar', a: 15, b: 6 }]

  it('renders tracks, custom ticks and the hover ring', async () => {
    const w = mount(OBarChart, { props: { data, categoryKey: 'm', series: [{ key: 'a' }], track: true, ticks: [0, 5, 20] } })
    await nextTick()
    expect(w.text()).toContain('20')
    expect(w.findAll('rect[data-roving]').length).toBe(3)
    const ring = () => w.findAll('rect[stroke-width="2"]')
    expect(ring().length).toBe(0) // nothing hovered yet
    await w.findAll('rect[data-roving]')[1].trigger('mouseenter')
    expect(ring().length).toBe(1)
    expect(ring()[0].attributes('style')).toContain('opacity: 1')
    expect(w.text()).toContain('Feb')
    // leaving fades the ring out but keeps it mounted in place, so the fade is visible
    await w.findAll('rect[data-roving]')[1].trigger('mouseleave')
    expect(ring().length).toBe(1)
    expect(ring()[0].attributes('style')).toContain('opacity: 0')
    // entering another category moves the same element instead of mounting a new one
    await w.findAll('rect[data-roving]')[2].trigger('mouseenter')
    expect(ring().length).toBe(1)
    expect(ring()[0].attributes('style')).toContain('opacity: 1')
    noNaN(w.html())
  })

  it('grouped puts bars side by side, stacked clips one bar per category', () => {
    const series = [{ key: 'a' }, { key: 'b' }]
    const grouped = mount(OBarChart, { props: { data, categoryKey: 'm', series } })
    const bars = grouped.findAll('rect[fill^="var"]')
    expect(bars.length).toBe(6)
    const stacked = mount(OBarChart, { props: { data, categoryKey: 'm', series, stacked: true } })
    expect(stacked.findAll('clipPath').length).toBe(3)
    noNaN(stacked.html())
  })

  it('horizontal swaps the axes and the tooltip slot renders', async () => {
    const w = mount(OBarChart, {
      props: { data, categoryKey: 'm', series: [{ key: 'a' }], orientation: 'horizontal' },
      slots: { tooltip: `<template #tooltip="{ point }">TIP {{ point.category }} {{ point.total }}</template>` },
    })
    await w.findAll('rect[data-roving]')[2].trigger('mouseenter')
    expect(w.text()).toContain('TIP Mar 15')
    noNaN(w.html())
  })
})

describe('treemap', () => {
  it('squarify conserves the area and never overlaps', () => {
    const values = [40, 25, 15, 10, 6, 4]
    const box = { x: 0, y: 0, w: 600, h: 300 }
    const rects = squarify(values, box)
    const area = rects.reduce((t, r) => t + r.w * r.h, 0)
    expect(Math.round(area)).toBe(box.w * box.h)
    rects.forEach((r, i) => rects.slice(i + 1).forEach((o) => {
      const overlap = Math.min(r.x + r.w, o.x + o.w) - Math.max(r.x, o.x) > 0.01 && Math.min(r.y + r.h, o.y + o.h) - Math.max(r.y, o.y) > 0.01
      expect(overlap).toBe(false)
    }))
    expect(squarify([0, 0], box).every((r) => r.w === 0)).toBe(true)
  })

  it('renders leaves, frames for nodes with children, and reacts to hover', async () => {
    const data = [
      { name: 'A', children: [{ name: 'A1', value: 30 }, { name: 'A2', value: 10 }] },
      { name: 'B', value: 40 },
    ]
    const w = mount(OTreemap, { props: { data, height: 300 } })
    await nextTick()
    expect(w.findAll('[role="img"]').length).toBe(3) // A1, A2, B
    await w.findAll('[role="img"]')[2].trigger('mouseenter')
    expect(w.text()).toContain('40')
    expect(w.findAll('[role="img"]')[0].attributes('style')).toContain('opacity: 0.3')
    expect((w.emitted('node-enter')![0][0] as any).name).toBe('B')
    noNaN(w.html())
  })
})

describe('keyboard: one tab stop per chart (roving tabindex)', () => {
  const stops = (w: ReturnType<typeof mount>) => w.findAll('[tabindex="0"]').length
  const items = (w: ReturnType<typeof mount>) => w.findAll('[data-roving]')

  it('has a single tab stop however many items there are', () => {
    const big = Array.from({ length: 300 }, (_, i) => ({ c: `c${i}`, a: i % 50, b: (i * 3) % 40 }))
    const area = mount(OAreaChart, { props: { data: big, categoryKey: 'c', series: [{ key: 'a' }] } })
    expect(items(area).length).toBe(300)
    expect(stops(area)).toBe(1)
    const bar = mount(OBarChart, { props: { data: big, categoryKey: 'c', series: [{ key: 'a' }] } })
    expect(stops(bar)).toBe(1)
    const heat = mount(OHeatmap, { props: { rows: Array.from({ length: 10 }, (_, r) => ({ label: `r${r}`, values: Array.from({ length: 30 }, (_, c) => c) })), columns: Array.from({ length: 30 }, (_, i) => `${i}`) } })
    expect(items(heat).length).toBe(300)
    expect(stops(heat)).toBe(1)
    const scatter = mount(OScatterChart, { props: { series: [{ label: 'A', points: Array.from({ length: 150 }, (_, i) => ({ x: i, y: i })) }, { label: 'B', points: Array.from({ length: 150 }, (_, i) => ({ x: i, y: -i })) }] } })
    expect(items(scatter).length).toBe(300)
    expect(stops(scatter)).toBe(1)
  })

  it('arrow keys, Home and End move the tab stop', async () => {
    const w = mount(OBarChart, { props: { data: rows, categoryKey: 'm', series: [{ key: 'a' }] }, attachTo: document.body })
    const stopIndex = () => items(w).findIndex((el) => el.attributes('tabindex') === '0')
    expect(stopIndex()).toBe(0)
    await items(w)[0].trigger('keydown', { key: 'ArrowRight' })
    expect(stopIndex()).toBe(1)
    await items(w)[1].trigger('keydown', { key: 'ArrowRight' })
    expect(stopIndex()).toBe(2)
    await items(w)[2].trigger('keydown', { key: 'ArrowRight' }) // already at the end
    expect(stopIndex()).toBe(2)
    await items(w)[2].trigger('keydown', { key: 'Home' })
    expect(stopIndex()).toBe(0)
    await items(w)[0].trigger('keydown', { key: 'End' })
    expect(stopIndex()).toBe(2)
    await items(w)[2].trigger('keydown', { key: 'ArrowLeft' })
    expect(stopIndex()).toBe(1)
    expect(stops(w)).toBe(1)
    w.unmount()
  })

  it('focus moves with the keys and shows the tooltip of the new item', async () => {
    const w = mount(OBarChart, { props: { data: rows, categoryKey: 'm', series: [{ key: 'a' }] }, attachTo: document.body })
    await items(w)[0].trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(items(w)[1].element)
    expect(w.text()).toContain('Feb')
    w.unmount()
  })

  it('heatmap ArrowDown moves a whole row', async () => {
    const w = mount(OHeatmap, { props: { rows: [{ label: 'a', values: [1, 2, 3, 4] }, { label: 'b', values: [5, 6, 7, 8] }], columns: ['w', 'x', 'y', 'z'] }, attachTo: document.body })
    const stopIndex = () => items(w).findIndex((el) => el.attributes('tabindex') === '0')
    await items(w)[1].trigger('keydown', { key: 'ArrowDown' })
    expect(stopIndex()).toBe(5)
    await items(w)[5].trigger('keydown', { key: 'ArrowUp' })
    expect(stopIndex()).toBe(1)
    w.unmount()
  })

  it('sankey skips nodes that are not rendered and keeps one tab stop', async () => {
    const w = mount(OSankey, {
      props: { nodes: [{ name: 'A' }, { name: 'Lonely' }, { name: 'B' }], links: [{ source: 'A', target: 'B', value: 3 }] },
      attachTo: document.body,
    })
    expect(stops(w)).toBe(1)
    const list = items(w)
    expect(list.length).toBe(3) // A, B and the link; "Lonely" is not drawn
    w.unmount()
  })

  it('not interactive means no tab stops at all', () => {
    const w = mount(OBarChart, { props: { data: rows, categoryKey: 'm', series: [{ key: 'a' }], interactive: false } })
    expect(w.findAll('[tabindex]').length).toBe(0)
  })
})

describe('bar chart outline prop', () => {
  it('can hide the ring around the hovered category', async () => {
    const data = [{ m: 'Jan', a: 10 }, { m: 'Feb', a: 20 }]
    for (const outline of [true, false]) {
      const w = mount(OBarChart, { props: { data, categoryKey: 'm', series: [{ key: 'a' }], track: true, outline } })
      await w.findAll('[data-roving]')[0].trigger('mouseenter')
      expect(w.findAll('rect[stroke-width="2"]').length).toBe(outline ? 1 : 0)
    }
  })
})

describe('responsive behaviour', () => {
  it('visibleLabels hides the labels that would touch and ignores empty ones', async () => {
    const { visibleLabels } = await import('../src/components/chart-shared/labels')
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    // 12px apart: nothing fits next to anything
    expect(visibleLabels(labels, labels.map((_, i) => i * 12)).filter(Boolean).length).toBeLessThan(labels.length)
    // 60px apart: all fit
    expect(visibleLabels(labels, labels.map((_, i) => i * 60))).toEqual(labels.map(() => true))
    // sparse labels: empty ones are skipped and take no room
    expect(visibleLabels(['Jan', '', '', 'Feb'], [0, 10, 20, 90], { anchor: 'start' })).toEqual([true, false, false, true])
  })

  it('bar chart thins its category labels when they do not fit', () => {
    const data = Array.from({ length: 24 }, (_, i) => ({ c: `Category ${i + 1}`, a: i }))
    const w = mount(OBarChart, { props: { data, categoryKey: 'c', series: [{ key: 'a' }] } })
    const shown = w.findAll('text').filter((t) => t.text().startsWith('Category')).length
    expect(shown).toBeGreaterThan(0)
    expect(shown).toBeLessThan(24)
  })

  it('charts that measure their width use a percentage SVG, so they never push their parent wider', () => {
    const data = [{ m: 'Jan', a: 1, b: 2 }, { m: 'Feb', a: 2, b: 3 }]
    const bar = mount(OBarChart, { props: { data, categoryKey: 'm', series: [{ key: 'a' }] } })
    expect(bar.find('svg').attributes('width')).toBe('100%')
    const area = mount(OAreaChart, { props: { data, categoryKey: 'm', series: [{ key: 'a' }] } })
    expect(area.find('svg').attributes('width')).toBe('100%')
    const sankey = mount(OSankey, { props: { nodes: [{ name: 'A' }, { name: 'B' }], links: [{ source: 'A', target: 'B', value: 1 }] } })
    expect(sankey.find('svg').attributes('width')).toBe('100%')
  })

  it('sankey scrolls instead of squeezing when the container is narrower than minWidth', () => {
    const props = { nodes: [{ name: 'A' }, { name: 'B' }], links: [{ source: 'A', target: 'B', value: 1 }] }
    // happy-dom reports no layout, so the chart assumes 640px
    const fits = mount(OSankey, { props: { ...props, minWidth: 400 } })
    expect(fits.classes()).not.toContain('overflow-x-auto')
    const narrow = mount(OSankey, { props: { ...props, minWidth: 900 } })
    expect(narrow.classes()).toContain('overflow-x-auto')
    expect(narrow.html()).toContain('min-width: 900px')
  })

  it('heatmap scrolls when the cells would be smaller than minCellWidth', () => {
    const rows = [{ label: 'r', values: Array.from({ length: 60 }, (_, i) => i) }]
    const columns = Array.from({ length: 60 }, (_, i) => String(i))
    const off = mount(OHeatmap, { props: { rows, columns, showRowLabels: false } })
    expect(off.html()).not.toContain('overflow-x-auto')
    const on = mount(OHeatmap, { props: { rows, columns, showRowLabels: false, minCellWidth: 20, gap: 4 } })
    expect(on.html()).toContain('overflow-x-auto')
    expect(on.html()).toContain('min-width: 1436px') // 60 * 20 + 59 * 4
  })

  it('circular charts keep their natural size but shrink to fit (responsive SVG)', () => {
    const donut = mount(ODonutChart, { props: { data: [{ label: 'a', value: 1 }, { label: 'b', value: 2 }], size: 220 } })
    const svg = donut.find('svg')
    expect(svg.attributes('width')).toBe('220')
    expect(svg.classes()).toContain('max-w-full')
    const radar = mount(ORadarChart, { props: { data: [{ label: 'x', v: 1 }, { label: 'y', v: 2 }, { label: 'z', v: 3 }], series: [{ key: 'v' }] } })
    expect(radar.find('svg').classes()).toContain('max-w-full')
    const gauge = mount(OSegmentedGauge, { props: { segments: [{ label: 'a', value: 1, max: 2 }] } })
    expect(gauge.find('svg').classes()).toContain('max-w-full')
  })
})
