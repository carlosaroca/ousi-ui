import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OTabs from '../src/components/tabs/Tabs.vue'

const items = Array.from({ length: 9 }, (_, i) => ({ key: `t${i}`, label: `A rather long tab label ${i}` }))
const list = (w: ReturnType<typeof mount>) => w.find('[role="tablist"]')

describe('OTabs overflow', () => {
  for (const variant of ['primary', 'secondary'] as const) {
    it(`${variant}: scrolls sideways with the scrollbar hidden`, () => {
      const w = mount(OTabs, { props: { items, variant } })
      const cls = list(w).classes().join(' ')
      expect(cls).toContain('overflow-x-auto')
      expect(cls).toContain('[scrollbar-width:none]')
      expect(cls).toContain('[&::-webkit-scrollbar]:hidden')
    })

    it(`${variant}: the wrapper cannot push its parent wider than the column`, () => {
      const w = mount(OTabs, { props: { items, variant } })
      expect(w.classes()).toContain('min-w-0')
      expect(w.classes()).toContain('max-w-full')
      expect(list(w).classes()).toContain('min-w-0')
    })
  }

  it('tabs never wrap their label and never shrink', () => {
    const w = mount(OTabs, { props: { items } })
    for (const tab of w.findAll('[role="tab"]')) {
      expect(tab.classes()).toContain('whitespace-nowrap')
      expect(tab.classes()).toContain('shrink-0')
    }
  })

  it('fullWidth tabs share the space but keep their own width when it is not enough', () => {
    const w = mount(OTabs, { props: { items, fullWidth: true } })
    const cls = w.find('[role="tab"]').classes()
    expect(cls).toContain('flex-1')
    expect(cls).toContain('shrink-0')
  })

  it('vertical tabs are not turned into a horizontal scroller', () => {
    const w = mount(OTabs, { props: { items, orientation: 'vertical' } })
    expect(list(w).classes()).not.toContain('overflow-x-auto')
  })
})

describe('OTabs scroll fade', () => {
  // happy-dom has no layout, so give the list the scroll metrics of a 300px box with 900px of tabs
  function scrollMetrics(el: Element, scrollLeft: number) {
    Object.defineProperty(el, 'scrollWidth', { configurable: true, value: 900 })
    Object.defineProperty(el, 'clientWidth', { configurable: true, value: 300 })
    Object.defineProperty(el, 'scrollLeft', { configurable: true, writable: true, value: scrollLeft })
  }

  it('fades only the side that still has tabs beyond it', async () => {
    const w = mount(OTabs, { props: { items }, attachTo: document.body })
    const el = list(w).element as HTMLElement
    scrollMetrics(el, 0)
    el.dispatchEvent(new Event('scroll'))
    await w.vm.$nextTick()
    const start = el.getAttribute('style') ?? ''
    expect(start).toContain('mask-image')
    expect(start).toContain('to right, #000 calc(100% - 28px), transparent') // only the right edge

    scrollMetrics(el, 300)
    el.dispatchEvent(new Event('scroll'))
    await w.vm.$nextTick()
    expect(el.getAttribute('style')).toContain('transparent, #000 28px, #000 calc(100% - 28px), transparent') // both

    scrollMetrics(el, 600)
    el.dispatchEvent(new Event('scroll'))
    await w.vm.$nextTick()
    expect(el.getAttribute('style')).toContain('to right, transparent, #000 28px)') // only the left edge
    w.unmount()
  })

  it('no fade when the tabs fit, and scrollFade=false turns it off', async () => {
    const fits = mount(OTabs, { props: { items: items.slice(0, 2) }, attachTo: document.body })
    const el = list(fits).element as HTMLElement
    el.dispatchEvent(new Event('scroll')) // scrollWidth = clientWidth = 0 in happy-dom
    await fits.vm.$nextTick()
    expect(el.getAttribute('style') ?? '').not.toContain('mask-image')
    fits.unmount()

    const off = mount(OTabs, { props: { items, scrollFade: false }, attachTo: document.body })
    const el2 = list(off).element as HTMLElement
    scrollMetrics(el2, 0)
    el2.dispatchEvent(new Event('scroll'))
    await off.vm.$nextTick()
    expect(el2.getAttribute('style') ?? '').not.toContain('mask-image')
    off.unmount()
  })
})

describe('OTabs contained', () => {
  it('adds zero intrinsic width and fills the parent only when asked', () => {
    const off = mount(OTabs, { props: { items } })
    expect(off.classes()).not.toContain('w-0')
    const on = mount(OTabs, { props: { items, contained: true } })
    expect(on.classes()).toContain('w-0')
    expect(on.classes()).toContain('min-w-full')
    expect(on.classes()).not.toContain('min-w-0') // replaced by min-w-full
  })

  it('does nothing for vertical tabs', () => {
    const w = mount(OTabs, { props: { items, orientation: 'vertical', contained: true } })
    expect(w.classes()).not.toContain('w-0')
  })
})
