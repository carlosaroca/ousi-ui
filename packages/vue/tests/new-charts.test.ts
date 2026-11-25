import { describe, it, expect, beforeAll, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import OWaterfallChart from '../src/components/waterfall-chart/WaterfallChart.vue'
import OCandlestickChart from '../src/components/candlestick-chart/CandlestickChart.vue'
import OSunburst from '../src/components/sunburst/Sunburst.vue'
import { runWaterfall } from '../src/components/waterfall-chart/waterfall-chart.utils'
import { sectorLabel, sectorPath } from '../src/components/sunburst/sunburst.geometry'
import { buildTree, findNode, placeNodes } from '../src/components/sunburst/sunburst.layout'
import { chartTooltipClass } from '../src/components/chart-shared'

beforeAll(() => {
  ;(globalThis as any).ResizeObserver = class { observe() {} disconnect() {} unobserve() {} }
  window.matchMedia = ((q: string) => ({ matches: true, media: q, addEventListener() {}, removeEventListener() {} })) as any
})
const wrappers: VueWrapper[] = []
afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount())
  document.body.innerHTML = ''
})

async function chart(component: any, props: Record<string, unknown>, slots?: Record<string, string>) {
  const w = mount(component, { props: { animated: false, ...props }, slots, attachTo: document.body })
  wrappers.push(w)
  await nextTick()
  return w
}
const num = (el: { attributes: (name: string) => string | undefined }, name: string) => Number(el.attributes(name))
const clean = (w: VueWrapper) => expect(w.html()).not.toMatch(/NaN|Infinity|undefined/)

/* ── Waterfall ──────────────────────────────────────────────────── */

describe('waterfall chart', () => {
  const data = [
    { label: 'Start', value: 100, total: true },
    { label: 'Sales', value: 50 },
    { label: 'Costs', value: -30 },
    { label: 'End', total: true },
  ]
  const bars = (w: VueWrapper) => w.findAll('[data-part="bar"]')
  /** The value at a height, read back from the two ends of the opening balance. */
  const levels = (w: VueWrapper) => {
    const first = bars(w)[0]
    const zero = num(first, 'y') + num(first, 'height')
    const per = num(first, 'height') / 100
    return bars(w).map((b) => [(zero - num(b, 'y') - num(b, 'height')) / per, (zero - num(b, 'y')) / per].map(Math.round))
  }

  it('adds up the changes, and totals show where things stand', () => {
    expect(runWaterfall(data)).toEqual([
      { kind: 'total', value: 100, start: 0, end: 100 },
      { kind: 'increase', value: 50, start: 100, end: 150 },
      { kind: 'decrease', value: -30, start: 150, end: 120 },
      { kind: 'total', value: 120, start: 0, end: 120 },
    ])
    // A total with a value sets where things stand from then on.
    expect(runWaterfall([{ label: 'a', value: 5 }, { label: 'b', total: true, value: 40 }, { label: 'c', value: 2 }])[2].start).toBe(40)
  })

  it('does not show the noise of adding decimals, and takes junk as nothing', () => {
    expect(runWaterfall([{ label: 'a', value: 0.1 }, { label: 'b', value: 0.2 }])[1].end).toBe(0.3)
    expect(runWaterfall([{ label: 'a', value: NaN }, { label: 'b' }]).map((s) => s.end)).toEqual([0, 0])
  })

  it('floats each change between the level before it and after it', async () => {
    const w = await chart(OWaterfallChart, { data })
    expect(levels(w)).toEqual([[0, 100], [100, 150], [120, 150], [0, 120]])
    expect(bars(w).map((b) => b.attributes('data-kind'))).toEqual(['total', 'increase', 'decrease', 'total'])
  })

  it('colours rises, falls and totals, and takes other colours', async () => {
    const w = await chart(OWaterfallChart, { data })
    expect(bars(w).map((b) => b.attributes('fill'))).toEqual(['var(--ousi-accent)', 'var(--ousi-success)', 'var(--ousi-danger)', 'var(--ousi-accent)'])
    const own = await chart(OWaterfallChart, { data: [{ label: 'a', value: 1 }, { label: 'b', value: -1 }, { label: 'c', value: 1, color: '#123456' }], increaseColor: 'violet', decreaseColor: 'orange' })
    expect(bars(own).map((b) => b.attributes('fill'))).toEqual(['var(--ousi-violet)', 'var(--ousi-orange)', '#123456'])
  })

  it('writes changes with their sign and totals without', async () => {
    const w = await chart(OWaterfallChart, { data, formatValue: (n: number) => `$${n}` })
    expect(w.findAll('[data-part="value"]').map((t) => t.text())).toEqual(['$100', '+$50', '$-30', '$120'])
    expect((await chart(OWaterfallChart, { data, showValues: false })).find('[data-part="value"]').exists()).toBe(false)
  })

  it('leaves out values that do not fit their slot', async () => {
    const many = Array.from({ length: 60 }, (_, i) => ({ label: `m${i}`, value: 1_000_000 }))
    expect((await chart(OWaterfallChart, { data: many })).findAll('[data-part="value"]')).toHaveLength(0)
  })

  it('goes below zero, and then marks where zero is', async () => {
    const w = await chart(OWaterfallChart, { data: [{ label: 'a', value: 40 }, { label: 'b', value: -90 }, { label: 'net', total: true }] })
    const zero = num(w.get('[data-part="zero"]'), 'y1')
    const [a, b, net] = bars(w)
    expect(num(a, 'y') + num(a, 'height')).toBeCloseTo(zero, 5)
    expect(num(b, 'y')).toBeLessThan(zero)
    expect(num(b, 'y') + num(b, 'height')).toBeGreaterThan(zero)
    expect(num(net, 'y')).toBeCloseTo(zero, 5) // a total under zero hangs from it
    expect((await chart(OWaterfallChart, { data })).find('[data-part="zero"]').exists()).toBe(false)
  })

  it('shows any change other than zero, however small, on the right side of its level', async () => {
    const w = await chart(OWaterfallChart, { data: [{ label: 'a', value: 100000 }, { label: 'up', value: 1 }, { label: 'down', value: -1 }, { label: 'none', value: 0 }] })
    const [, up, down, none] = bars(w)
    expect(num(up, 'height')).toBe(3)
    expect(num(down, 'height')).toBe(3)
    expect(num(none, 'height')).toBe(0)
    expect(num(up, 'y')).toBeLessThan(num(down, 'y'))
  })

  it('keeps corners round on short bars, never oval', async () => {
    const w = await chart(OWaterfallChart, { data: [{ label: 'a', value: 1000 }, { label: 'b', value: 4 }], barRadius: 20 })
    for (const bar of bars(w)) expect(num(bar, 'rx')).toBeLessThanOrEqual(Math.min(num(bar, 'width'), num(bar, 'height')) / 2)
  })

  it('carries each level to the next bar, from under one to under the next', async () => {
    const w = await chart(OWaterfallChart, { data })
    const links = w.findAll('[data-part="connector"]')
    expect(links).toHaveLength(3)
    const [first, second] = bars(w)
    expect(num(links[0], 'y1')).toBeCloseTo(num(first, 'y'), 5)
    expect(num(links[0], 'x1')).toBeLessThanOrEqual(num(first, 'x') + num(first, 'width'))
    expect(num(links[0], 'x2')).toBeGreaterThanOrEqual(num(second, 'x'))
    expect((await chart(OWaterfallChart, { data, connectors: false })).find('[data-part="connector"]').exists()).toBe(false)
  })

  it('tells each change and what it left, on hover and to screen readers', async () => {
    const w = await chart(OWaterfallChart, { data, totalLabel: 'Balance' })
    const hits = w.findAll('[data-part="hit"]')
    expect(hits[1].attributes('aria-label')).toBe('Sales: +50, Balance 150')
    expect(hits[3].attributes('aria-label')).toBe('End: 120')
    await hits[1].trigger('mouseenter')
    expect(w.get('[data-part="tooltip"]').text()).toMatch(/Sales\s*\+50\s*Balance\s*150/)
    expect(w.emitted('bar-enter')![0][0]).toMatchObject({ label: 'Sales', end: 150 })
    await hits[1].trigger('click')
    expect(w.emitted('bar-click')).toHaveLength(1)
  })

  it('survives no data', async () => {
    const w = await chart(OWaterfallChart, { data: [] })
    expect(bars(w)).toHaveLength(0)
    clean(w)
  })
})

/* ── Candlestick ────────────────────────────────────────────────── */

describe('candlestick chart', () => {
  const data = [
    { label: 'Mon', open: 100, high: 120, low: 90, close: 110, volume: 1000 },
    { label: 'Tue', open: 110, high: 115, low: 95, close: 100, volume: 4000 },
    { label: 'Wed', open: 100, high: 105, low: 98, close: 100, volume: 2000 },
  ]
  const candles = (w: VueWrapper) => w.findAll('[data-part="candle"]')
  const part = (w: VueWrapper, i: number, name: string) => candles(w)[i].get(`[data-part="${name}"]`)

  it('draws a wick from high to low and a body from open to close', async () => {
    const w = await chart(OCandlestickChart, { data })
    expect(candles(w)).toHaveLength(3)
    const [wick, body] = [part(w, 0, 'wick'), part(w, 0, 'body')]
    // Read the scale from the wick, which runs from 120 down to 90.
    const per = (num(wick, 'y2') - num(wick, 'y1')) / 30
    const price = (y: number) => 120 - (y - num(wick, 'y1')) / per
    expect(price(num(body, 'y'))).toBeCloseTo(110, 5)
    expect(price(num(body, 'y') + num(body, 'height'))).toBeCloseTo(100, 5)
  })

  it('colours by whether the period rose; closing where it opened counts as rising', async () => {
    const w = await chart(OCandlestickChart, { data })
    expect(candles(w).map((c) => c.attributes('data-rising'))).toEqual(['true', 'false', 'true'])
    expect(part(w, 0, 'body').attributes('fill')).toBe('var(--ousi-success)')
    expect(part(w, 1, 'wick').attributes('stroke')).toBe('var(--ousi-danger)')
    expect(part(await chart(OCandlestickChart, { data, upColor: 'accent' }), 0, 'body').attributes('fill')).toBe('var(--ousi-accent)')
  })

  it('still draws a line for a period that closed where it opened', async () => {
    expect(num(part(await chart(OCandlestickChart, { data }), 2, 'body'), 'height')).toBe(1.5)
  })

  it('fits the axis to the prices instead of starting at zero', async () => {
    const w = await chart(OCandlestickChart, { data })
    expect(w.findAll('text').map((t) => t.text())).not.toContain('0')
  })

  it('keeps open and close inside the wick when the data disagrees with itself', async () => {
    const w = await chart(OCandlestickChart, { data: [{ label: 'x', open: 10, close: 30, high: 20, low: 15 }, ...data] })
    const [wick, body] = [part(w, 0, 'wick'), part(w, 0, 'body')]
    expect(num(wick, 'y1')).toBeLessThanOrEqual(num(body, 'y') + 0.001)
    expect(num(wick, 'y2')).toBeGreaterThanOrEqual(num(body, 'y') + num(body, 'height') - 0.001)
  })

  it('leaves out a period with a price missing', async () => {
    const w = await chart(OCandlestickChart, { data: [{ label: 'gap', open: 1, high: 2, low: 0 } as any, ...data] })
    expect(candles(w)).toHaveLength(3)
    clean(w)
  })

  it('caps how wide a few candles get, and keeps many of them at least a pixel', async () => {
    expect(num(part(await chart(OCandlestickChart, { data }), 0, 'body'), 'width')).toBe(24)
    const many = Array.from({ length: 900 }, (_, i) => ({ label: `d${i}`, open: 1, high: 3, low: 0, close: 2 }))
    expect(num(part(await chart(OCandlestickChart, { data: many }), 0, 'body'), 'width')).toBe(1)
  })

  it('draws volume along the bottom only when asked, clear of the prices', async () => {
    expect((await chart(OCandlestickChart, { data })).find('[data-part="volume"]').exists()).toBe(false)
    const w = await chart(OCandlestickChart, { data, showVolume: true })
    const volumes = w.findAll('[data-part="volume"]')
    expect(volumes).toHaveLength(3)
    expect(num(volumes[1], 'height') / num(volumes[0], 'height')).toBeCloseTo(4, 5)
    const lowest = Math.max(...w.findAll('[data-part="wick"]').map((l) => num(l, 'y2')))
    expect(lowest).toBeLessThan(Math.min(...volumes.map((v) => num(v, 'y'))))
    const none = await chart(OCandlestickChart, { data: data.map(({ volume, ...d }) => d), showVolume: true })
    expect(none.find('[data-part="volume"]').exists()).toBe(false)
    clean(none)
  })

  it('tells the four prices and the change on hover, in the words it is given', async () => {
    const w = await chart(OCandlestickChart, { data, labels: { close: 'Cierre' } })
    const hits = w.findAll('[data-part="hit"]')
    expect(hits[0].attributes('aria-label')).toBe('Mon: Open 100, High 120, Low 90, Cierre 110, +10%')
    expect(w.find('[data-part="guide"]').exists()).toBe(false)
    await hits[1].trigger('mouseenter')
    expect(w.get('[data-part="tooltip"]').text()).toMatch(/Tue\s*-9\.09%.*Cierre\s*100.*Volume\s*4K/s)
    expect(w.find('[data-part="guide"]').exists()).toBe(true)
    expect(w.emitted('candle-enter')![0][0]).toMatchObject({ label: 'Tue', rising: false, change: -10 })
  })

  it('is one stop for the Tab key, however many periods', async () => {
    const w = await chart(OCandlestickChart, { data })
    expect(w.findAll('[data-part="hit"]').map((r) => r.attributes('tabindex'))).toEqual(['0', '-1', '-1'])
    expect(w.get('svg').attributes('aria-label')).toBe('Candlestick chart, 3 periods from Mon to Wed')
  })

  it('survives no data', async () => {
    const w = await chart(OCandlestickChart, { data: [] })
    expect(candles(w)).toHaveLength(0)
    clean(w)
  })
})

/* ── Sunburst ───────────────────────────────────────────────────── */

describe('sunburst: layout', () => {
  const data = [
    { name: 'A', children: [{ name: 'A1', value: 30 }, { name: 'A2', value: 10 }] },
    { name: 'B', value: 60 },
    { name: 'empty', value: 0 },
    { name: 'hollow', children: [{ name: 'nothing', value: -5 }] },
  ]

  it('adds up what has children and leaves out what is worth nothing', () => {
    const tree = buildTree(data)
    expect(tree.map((n) => [n.key, n.name, n.value])).toEqual([['0', 'A', 40], ['1', 'B', 60]])
    expect(findNode(tree, '0.1')!.name).toBe('A2')
    expect(findNode(tree, '7')).toBeNull()
  })

  it('gives each its share of its parent, children inside their parent', () => {
    const placed = placeNodes(buildTree(data), 3)
    const by = Object.fromEntries(placed.map((p) => [p.node.name, [p.depth, Math.round(p.from), Math.round(p.to)]]))
    expect(by).toEqual({ A: [1, -90, 54], A1: [2, -90, 18], A2: [2, 18, 54], B: [1, 54, 270] })
    expect(placeNodes(buildTree(data), 1).map((p) => p.node.name)).toEqual(['A', 'B'])
  })

  const points = (d: string) => [...d.matchAll(/(-?[\d.]+),(-?[\d.]+)(?=[A-Za-z]|$)/g)].map((m) => [Number(m[1]), Number(m[2])])
  const radiusOf = ([x, y]: number[]) => Math.hypot(x - 50, y - 50)

  it('keeps every sector inside its ring, less half the gap', () => {
    const d = sectorPath({ from: -90, to: 30, inner: 20, outer: 35 }, 1, 1.4)!
    const radii = points(d).map(radiusOf)
    expect(Math.min(...radii)).toBeCloseTo(20.5, 1)
    expect(Math.max(...radii)).toBeCloseTo(34.5, 1)
    expect(d).not.toMatch(/NaN/)
  })

  it('leaves the same width between two neighbours from the inside to the outside', () => {
    // With sharp corners, the straight sides run at a fixed distance from the boundary at 0°.
    const side = (d: string) => points(d).filter(([x, y]) => x > 50 && Math.abs(y - 50) < 2).map(([, y]) => y)
    const after = side(sectorPath({ from: 0, to: 90, inner: 20, outer: 40 }, 2, 0)!)
    const before = side(sectorPath({ from: -90, to: 0, inner: 20, outer: 40 }, 2, 0)!)
    expect(after.length).toBeGreaterThanOrEqual(2)
    for (const y of after) expect(y).toBeCloseTo(51, 2)
    for (const y of before) expect(y).toBeCloseTo(49, 2)
  })

  it('rounds the corners as asked, no more than the sector allows', () => {
    const corners = (d: string) => [...d.matchAll(/A([\d.]+),[\d.]+ 0 0 1 /g)].map((m) => Number(m[1])).filter((r) => r < 10)
    expect(corners(sectorPath({ from: 0, to: 90, inner: 20, outer: 35 }, 0.7, 1.4)!)).toEqual([1.4, 1.4, 1.4, 1.4])
    expect(corners(sectorPath({ from: 0, to: 90, inner: 20, outer: 35 }, 0.7, 0)!)).toEqual([])
    for (const r of corners(sectorPath({ from: 0, to: 4, inner: 20, outer: 35 }, 0.7, 5)!)) expect(r).toBeLessThan(0.5)
  })

  it('draws nothing for a sliver the gap would swallow, and a whole ring for one alone', () => {
    expect(sectorPath({ from: 0, to: 1, inner: 20, outer: 35 }, 0.7, 1.4)).toBeNull()
    const ring = sectorPath({ from: -90, to: 270, inner: 20, outer: 35 }, 1, 1.4)!
    expect(ring.match(/Z/g)).toHaveLength(2)
  })
})

describe('sunburst: names', () => {
  const ring = { inner: 20, outer: 31 }
  const label = (name: string, from: number, to: number, band = ring) => sectorLabel(name, { from, to, ...band }, 0.7, 3.1)
  /** The angle the text ends up at, in the page. */
  const heading = (transform: string) => {
    const turns = [...transform.matchAll(/rotate\((-?[\d.]+)\)/g)].reduce((t, m) => t + Number(m[1]), 0)
    return ((turns % 360) + 360) % 360
  }

  it('follows the arc when the whole name fits along it', () => {
    expect(label('Operations', 0, 90)).toMatchObject({ text: 'Operations', along: 'arc' })
  })

  it('goes along the radius when only that holds the whole name', () => {
    expect(label('Web', 0, 12, { inner: 20, outer: 36 })).toMatchObject({ text: 'Web', along: 'radius' })
  })

  it('cuts a long name, keeping four letters or more', () => {
    const cut = label('Extraordinarily long department', 0, 70)!
    expect(cut.text).toMatch(/^.{4,}…$/)
    expect(cut.text.length).toBeLessThan(20)
  })

  it('writes nothing rather than two or three letters', () => {
    // Four letters fit this ring, and no fewer would do.
    expect(label('Support', 0, 14)!.text).toBe('Supp…')
    expect(label('Support', 0, 14, { inner: 20, outer: 28 })).toBeUndefined() // room for two
    expect(label('Support', 0, 3)).toBeUndefined() // no room for a line at all
    for (let span = 4; span <= 120; span += 2) {
      const text = label('Partnerships', 0, span)?.text
      if (text?.endsWith('…')) expect(text.length - 1).toBeGreaterThanOrEqual(4)
    }
  })

  it('keeps a name inside its sector and ring', () => {
    for (let from = -90; from < 270; from += 20) {
      for (const span of [15, 40, 100, 300]) {
        const found = label('Partnerships and more', from, from + span)
        if (!found) continue
        const width = found.text.length * 3.1 * 0.56
        const limit = found.along === 'radius' ? ring.outer - ring.inner : ((span * Math.PI) / 180) * 25.5
        expect(width).toBeLessThanOrEqual(limit)
      }
    }
  })

  it('is never upside down, wherever the sector is', () => {
    for (let middle = -85; middle < 270; middle += 10) {
      for (const [name, span, band] of [['Operations', 90, ring], ['Web', 12, { inner: 20, outer: 36 }]] as const) {
        const angle = heading(label(name, middle - span / 2, middle + span / 2, band)!.transform)
        expect(angle <= 90 || angle >= 270, `${name} at ${middle}° reads at ${angle}°`).toBe(true)
      }
    }
  })
})

describe('sunburst: chart', () => {
  const data = [
    { name: 'Europe', children: [{ name: 'Spain', value: 30 }, { name: 'France', value: 20, children: [{ name: 'Paris', value: 20 }] }] },
    { name: 'Asia', value: 50 },
  ]
  const sectors = (w: VueWrapper) => w.findAll('[data-part="sector"]')
  const sector = (w: VueWrapper, key: string) => w.get(`[data-part="sector"][data-key="${key}"]`)
  const center = (w: VueWrapper) => w.get('[data-part="center"]')
  const keys = (w: VueWrapper) => sectors(w).map((s) => s.attributes('data-key'))

  it('draws every node down to the levels asked for', async () => {
    expect(keys(await chart(OSunburst, { data }))).toEqual(['0', '0.0', '0.1', '0.1.0', '1'])
    expect(keys(await chart(OSunburst, { data, levels: 1 }))).toEqual(['0', '1'])
  })

  it('shows the total in the middle, and the hovered sector with its share', async () => {
    const w = await chart(OSunburst, { data, rootLabel: 'World' })
    expect(center(w).text()).toMatch(/100\s*World/)
    await sector(w, '0.0').trigger('mouseenter')
    expect(center(w).text()).toMatch(/30\s*Spain · 30%/)
    expect(w.emitted('node-enter')![0][0]).toMatchObject({ name: 'Spain', parent: 'Europe', depth: 2 })
  })

  it('keeps lit what leads to the hovered sector and what is inside it', async () => {
    const w = await chart(OSunburst, { data })
    await sector(w, '0.1').trigger('mouseenter')
    const lit = Object.fromEntries(sectors(w).map((s) => [s.attributes('data-key'), !s.attributes('style')!.includes('opacity: 0.3')]))
    expect(lit).toEqual({ '0': true, '0.0': false, '0.1': true, '0.1.0': true, '1': false })
  })

  it('brings a clicked branch to the middle, and the middle goes back', async () => {
    const w = await chart(OSunburst, { data })
    expect(center(w).element.tagName).toBe('DIV')
    await sector(w, '0').trigger('click')
    expect(w.emitted('update:zoom')).toEqual([['0']])
    expect(keys(w)).toEqual(['0.0', '0.1', '0.1.0'])
    expect(center(w).text()).toContain('Europe')
    expect(center(w).element.tagName).toBe('BUTTON')
    expect(center(w).attributes('aria-label')).toBe('Total')
    await sector(w, '0.1').trigger('click')
    expect(keys(w)).toEqual(['0.1.0'])
    expect(center(w).attributes('aria-label')).toBe('Europe')
    await center(w).trigger('click')
    expect(keys(w)).toEqual(['0.0', '0.1', '0.1.0'])
    await center(w).trigger('click')
    expect(w.emitted('update:zoom')!.at(-1)).toEqual([null])
  })

  it('gives shares of what is in view', async () => {
    const w = await chart(OSunburst, { data })
    await sector(w, '0').trigger('click')
    expect(sector(w, '0.0').attributes('aria-label')).toBe('Europe, Spain: 30, 60%')
  })

  it('does not zoom into what has nothing inside, nor when told not to', async () => {
    const w = await chart(OSunburst, { data })
    await sector(w, '1').trigger('click')
    expect(w.emitted('update:zoom')).toBeUndefined()
    expect(w.emitted('node-click')).toHaveLength(1)
    const still = await chart(OSunburst, { data, zoomable: false })
    await sector(still, '0').trigger('click')
    expect(still.emitted('update:zoom')).toBeUndefined()
    expect(sector(still, '0').attributes('role')).toBe('img')
    // Nor is it left empty when asked to by the app.
    expect(keys(await chart(OSunburst, { data, zoom: '1' }))).toHaveLength(5)
    expect(keys(await chart(OSunburst, { data, zoom: '9.9' }))).toHaveLength(5)
  })

  it('follows v-model:zoom', async () => {
    const zoom = ref<string | null>(null)
    const w = mount(
      defineComponent({ setup: () => () => h(OSunburst, { data, animated: false, zoom: zoom.value, 'onUpdate:zoom': (v: string | null) => (zoom.value = v) }) }),
      { attachTo: document.body },
    )
    wrappers.push(w)
    await nextTick()
    zoom.value = '0'
    await nextTick()
    expect(keys(w)).toEqual(['0.0', '0.1', '0.1.0'])
    await center(w).trigger('click')
    expect(zoom.value).toBeNull()
  })

  it('is walked with the arrows, opened with Enter and left with Escape, which goes no further', async () => {
    const w = await chart(OSunburst, { data })
    expect(sectors(w).map((s) => s.attributes('tabindex'))).toEqual(['0', '-1', '-1', '-1', '-1'])
    expect(sector(w, '0').attributes('role')).toBe('button')
    await sector(w, '0').trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(keys(w)).toHaveLength(3)
    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    let reached = false
    const listen = () => (reached = true)
    document.addEventListener('keydown', listen)
    sector(w, '0.0').element.dispatchEvent(escape)
    document.removeEventListener('keydown', listen)
    await nextTick()
    expect(keys(w)).toHaveLength(5)
    expect(reached).toBe(false)
    // At the top there is nowhere to go back to: Escape is left for whatever holds the chart.
    const again = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    sector(w, '0').element.dispatchEvent(again)
    expect(again.defaultPrevented).toBe(false)
  })

  it('moves focus into the new view when the focused sector is gone', async () => {
    const w = await chart(OSunburst, { data })
    ;(sector(w, '0').element as unknown as HTMLElement).focus()
    await sector(w, '0').trigger('click')
    await nextTick()
    await nextTick()
    expect(document.activeElement?.getAttribute('data-key')).toBe('0.0')
  })

  it('writes names only where they fit, and none when asked not to', async () => {
    const w = await chart(OSunburst, { data: [{ name: 'Operations', value: 99 }, { name: 'Tiny', value: 1 }], levels: 1 })
    expect(w.findAll('[data-part="label"]').map((l) => l.text())).toEqual(['Operations'])
    expect((await chart(OSunburst, { data, showLabels: false })).find('[data-part="label"]').exists()).toBe(false)
  })

  it('colours a branch from its top node, and picks text that can be read on it', async () => {
    const w = await chart(OSunburst, { data: [{ name: 'A', color: 'success', children: [{ name: 'a', value: 1 }] }, { name: 'B', color: '#222222', value: 1 }] })
    expect(sector(w, '0').attributes('fill')).toBe('var(--ousi-success)')
    expect(sector(w, '0.0').attributes('fill')).toBe('color-mix(in oklab, var(--ousi-success) 62%, var(--ousi-background))')
    const ink = w.findAll('[data-part="label"]').map((l) => l.attributes('fill'))
    expect(ink).toEqual(['var(--ousi-success-foreground)', 'var(--ousi-foreground)', '#fff'])
  })

  it('survives no data, or data worth nothing', async () => {
    for (const empty of [[], [{ name: 'a', value: 0 }]]) {
      const w = await chart(OSunburst, { data: empty })
      expect(sectors(w)).toHaveLength(0)
      expect(w.find('circle').exists()).toBe(true)
      clean(w)
    }
  })
})

describe('chart tooltip', () => {
  it('is shaped by the theme tokens', () => {
    for (const token of ['rounded-ousi-xl', 'border-[length:var(--ousi-border-width)]', 'border-ousi-border', 'bg-ousi-overlay', 'shadow-ousi-lg']) {
      expect(chartTooltipClass.split(' ')).toContain(token)
    }
  })
})
