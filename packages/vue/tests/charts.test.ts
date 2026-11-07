import { describe, it, expect, beforeAll } from 'vitest'
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
    expect(w.findAll('path').length).toBe(3) // 2 tracks + 1 fill (value 0 draws no fill)
    await w.findAll('g')[0].trigger('mouseenter')
    expect(w.emitted('segment-enter')).toBeTruthy()
    noNaN(w.html())
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

describe('donut chart', () => {
  const data = [{ label: 'A', value: 50 }, { label: 'B', value: 30 }, { label: 'C', value: 20 }]

  it('draws one arc per segment with the right shares', () => {
    const w = mount(ODonutChart, { props: { data } })
    expect(w.findAll('path').length).toBe(3)
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
