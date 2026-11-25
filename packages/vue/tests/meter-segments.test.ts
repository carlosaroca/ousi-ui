import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OMeter from '../src/components/meter/Meter.vue'

const segments = [
  { label: 'Photos', value: 30, color: 'accent' },
  { label: 'Documents', value: 12, color: '#ff0000' },
  { label: 'Other', value: 8 },
]
const meter = (props: Record<string, unknown> = {}) => mount(OMeter, { props: { segments, ...props } })
type Meter = ReturnType<typeof meter>
const slots = (w: Meter) => w.findAll('[data-part="slot"]').map((s) => (s.element as HTMLElement).style)
const grows = (w: Meter) => slots(w).map((s) => Number(s.flexGrow))
const rest = (w: Meter) => {
  const el = w.find('[data-part="rest"]')
  return el.exists() ? Number((el.element as HTMLElement).style.flexGrow) : 0
}
// happy-dom drops a gradient it cannot parse from the style, so the mask is read from what Vue was given.
const masks = (w: Meter) =>
  w.findAll('[data-part="segment"]').map((s) => ((s.element as any).__vnode.props.style.maskImage as string | undefined) ?? '')

describe('meter: a single value', () => {
  it('is drawn and read as before', () => {
    const w = mount(OMeter, { props: { value: 60, label: 'Storage', showValueLabel: true } })
    expect(w.attributes('aria-valuenow')).toBe('60')
    expect(w.attributes('aria-valuetext')).toBeUndefined()
    expect(w.get('[data-part="track"] > div').attributes('style')).toContain('width: 60%')
    expect(w.text()).toContain('60%')
    expect(w.find('[data-part="segment"]').exists()).toBe(false)
  })

  it('stays within its range, and still picks a colour on its own', () => {
    const w = mount(OMeter, { props: { value: 140, autoColor: true } })
    expect(w.attributes('aria-valuenow')).toBe('100')
    expect(w.get('[data-part="track"] > div').classes()).toContain('bg-ousi-success')
    expect(mount(OMeter, { props: { value: 10, autoColor: true } }).get('[data-part="track"] > div').classes()).toContain('bg-ousi-danger')
  })
})

describe('meter: segments', () => {
  it('shares the bar by value, leaving the rest of the range empty', () => {
    const w = meter()
    expect(grows(w)).toEqual([30, 12, 8])
    expect(rest(w)).toBe(50)
  })

  it('measures against the range, whatever its size', () => {
    expect(grows(meter({ maxValue: 200 }))).toEqual([15, 6, 4])
    // Factors that add up to less than 1 would leave part of the bar unused.
    const small = meter({ maxValue: 0.8, segments: [{ label: 'a', value: 0.2 }, { label: 'b', value: 0.2 }] })
    expect(grows(small)).toEqual([25, 25])
    expect(rest(small)).toBe(50)
  })

  it('shares the whole bar among segments that add up to more, and says by how much', () => {
    const w = meter({ maxValue: 40, showValueLabel: true })
    expect(grows(w).reduce((a, b) => a + b)).toBeCloseTo(100)
    expect(rest(w)).toBe(0)
    expect(w.text()).toContain('125%')
    expect(w.attributes('aria-valuenow')).toBe('40')
  })

  it('uses the colour of each one, or the chart palette', () => {
    const colors = meter().findAll('[data-part="segment"]').map((s) => (s.element as any).__vnode.props.style.backgroundColor)
    expect(colors).toEqual(['var(--ousi-accent)', '#ff0000', 'var(--ousi-orange)'])
  })

  it('leaves out what is empty, and keeps room to show what is tiny', () => {
    const w = meter({ segments: [{ label: 'a', value: 1 }, { label: 'none', value: 0 }, { label: 'less', value: -5 }, { label: 'b', value: 99 }] })
    expect(slots(w)).toHaveLength(2)
    for (const style of slots(w)) expect(style.minWidth).toBe('calc(var(--meter-h) / 2 + 2px)')
    // Nor does a negative amount take anything from the total.
    expect(w.attributes('aria-valuenow')).toBe('100')
    expect(grows(w)).toEqual([1, 99])
  })

  it('cuts every segment but the last around the round start of the next', () => {
    const [first, second, last] = masks(meter({ gap: 3 }))
    for (const mask of [first, second]) {
      // Centred on its own round end, which is where the next one starts.
      expect(mask).toContain('circle at calc(100% - var(--meter-h) / 2) 50%')
      expect(mask).toContain('transparent calc(var(--meter-h) / 2 + 3px)')
    }
    expect(last).toBe('')
  })

  it('joins them, cutting nothing', () => {
    for (const props of [{ joined: true }, { gap: 0 }]) {
      const w = meter(props)
      expect(masks(w)).toEqual(['', '', ''])
      expect(slots(w)[0].minWidth).toBe('calc(var(--meter-h) / 2 + 0px)')
    }
  })

  it('adds them up for the value, in words too for screen readers', () => {
    const w = meter({ label: 'Storage', showValueLabel: true })
    expect(w.attributes('aria-valuenow')).toBe('50')
    expect(w.attributes('aria-valuetext')).toBe('Photos: 30, Documents: 12, Other: 8')
    expect(w.get('output').text()).toBe('50%')
  })

  it('writes values as asked', () => {
    const w = meter({ showLegend: true, showValueLabel: true, formatOptions: { style: 'unit', unit: 'gigabyte' } })
    expect(w.get('output').text()).toMatch(/50\s?GB/)
    expect(w.get('[data-part="legend"]').text()).toMatch(/Photos\s*30\s?GB/)
  })

  it('lists them only when asked, the empty ones too', () => {
    expect(meter().find('[data-part="legend"]').exists()).toBe(false)
    const w = meter({ showLegend: true, segments: [...segments, { label: 'Videos', value: 0 }] })
    expect(w.findAll('[data-part="legend"] li')).toHaveLength(4)
    expect(w.get('[data-part="legend"]').text()).toContain('Videos')
  })

  it('shows an empty bar for no segments, without breaking', () => {
    for (const none of [[], [{ label: 'a', value: 0 }]]) {
      const w = meter({ segments: none, showValueLabel: true })
      expect(w.find('[data-part="segment"]').exists()).toBe(false)
      expect(w.attributes('aria-valuenow')).toBe('0')
      expect(w.get('output').text()).toBe('0%')
      expect(w.html()).not.toContain('NaN')
    }
    expect(meter({ maxValue: 0 }).html()).not.toContain('NaN')
  })

  it('changes in place, so a change of value can animate', async () => {
    const w = meter()
    const before = w.findAll('[data-part="slot"]').map((s) => s.element)
    await w.setProps({ segments: segments.map((s) => ({ ...s, value: s.value * 2 })) })
    expect(w.findAll('[data-part="slot"]').map((s) => s.element)).toEqual(before)
    expect(grows(w)).toEqual([60, 24, 16])
  })
})
