import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import OButton from '../src/components/button/Button.vue'
import ODialogFooter from '../src/components/dialog/DialogFooter.vue'
import OTable from '../src/components/table/Table.vue'
import OTabs from '../src/components/tabs/Tabs.vue'
import OSelect from '../src/components/select/Select.vue'
import OPopover from '../src/components/popover/Popover.vue'
import OColorPicker from '../src/components/color-picker/ColorPicker.vue'

describe('OButton never squeezes its label', () => {
  it('clips the ripple with overflow-clip, which keeps its content width as the minimum', () => {
    const cls = mount(OButton, { slots: { default: 'Admitir y cargar consulta' } }).classes()
    expect(cls).toContain('overflow-clip')
    expect(cls).not.toContain('overflow-hidden')
  })

  it('takes its height from a variable, so one class from the caller wins at every width', () => {
    const plain = mount(OButton, { slots: { default: 'Guardar' } }).classes()
    expect(plain).toContain('h-[var(--ousi-btn-h)]')
    expect(plain.some((c) => c.startsWith('md:h-'))).toBe(false)

    const row = mount(OButton, { props: { class: 'h-auto py-2' }, slots: { default: 'Fila' } }).classes()
    expect(row).toContain('h-auto')
    expect(row).not.toContain('h-[var(--ousi-btn-h)]')
  })

  it('an icon button stays square at every size', () => {
    const cls = mount(OButton, { props: { isIconOnly: true, size: 'sm' } }).classes()
    expect(cls).toContain('w-[var(--ousi-btn-h)]')
  })

  it('its content follows the button justification', () => {
    const w = mount(OButton, { props: { class: 'w-full justify-between' }, slots: { default: 'A' } })
    const content = w.findAll('span').find((s) => s.classes().includes('grow'))
    expect(content?.classes()).toContain('[justify-content:inherit]')
  })
})

describe('footers wrap their buttons', () => {
  it('ODialogFooter wraps instead of squeezing', () => {
    expect(mount(ODialogFooter).classes()).toContain('flex-wrap')
  })
})

describe('OTable marks hidden columns', () => {
  const columns = [
    { key: 'a', label: 'A' },
    { key: 'b', label: 'B' },
  ]
  const rows = [{ id: '1', a: 'x', b: 'y' }]

  function metrics(el: Element, scrollLeft: number) {
    Object.defineProperty(el, 'scrollWidth', { configurable: true, value: 900 })
    Object.defineProperty(el, 'clientWidth', { configurable: true, value: 300 })
    Object.defineProperty(el, 'scrollLeft', { configurable: true, writable: true, value: scrollLeft })
  }

  it('shows a thin scrollbar instead of hiding it', () => {
    const w = mount(OTable, { props: { columns, rows } })
    const cls = w.find('.overflow-x-auto').classes().join(' ')
    expect(cls).toContain('[scrollbar-width:thin]')
    expect(cls).not.toContain('[scrollbar-width:none]')
  })

  it('puts a shadow on each side that still hides columns', async () => {
    const w = mount(OTable, { props: { columns, rows }, attachTo: document.body })
    const scroller = w.find('.overflow-x-auto').element as HTMLElement
    metrics(scroller, 0)
    scroller.dispatchEvent(new Event('scroll'))
    await w.vm.$nextTick()
    expect(scroller.hasAttribute('data-hidden-end')).toBe(true)
    expect(scroller.hasAttribute('data-hidden-start')).toBe(false)

    metrics(scroller, 600)
    scroller.dispatchEvent(new Event('scroll'))
    await w.vm.$nextTick()
    expect(scroller.hasAttribute('data-hidden-end')).toBe(false)
    expect(scroller.hasAttribute('data-hidden-start')).toBe(true)
    w.unmount()
  })

  it('no shadow when the table fits', async () => {
    const w = mount(OTable, { props: { columns, rows }, attachTo: document.body })
    const scroller = w.find('.overflow-x-auto').element as HTMLElement
    scroller.dispatchEvent(new Event('scroll'))
    await w.vm.$nextTick()
    expect(scroller.hasAttribute('data-hidden-end')).toBe(false)
    w.unmount()
  })
})

describe('OTabs that do not fit', () => {
  const items = Array.from({ length: 9 }, (_, i) => ({ key: `t${i}`, label: `A rather long tab label ${i}` }))

  function metrics(el: Element, scrollLeft: number) {
    Object.defineProperty(el, 'scrollWidth', { configurable: true, value: 900 })
    Object.defineProperty(el, 'clientWidth', { configurable: true, value: 300 })
    Object.defineProperty(el, 'scrollLeft', { configurable: true, writable: true, value: scrollLeft })
  }
  const arrowsOf = (w: ReturnType<typeof mount>) => w.findAll('[role="tablist"] button[aria-hidden="true"]')

  it('show an arrow on each side that still has tabs, and no fade over it', async () => {
    const w = mount(OTabs, { props: { items }, attachTo: document.body })
    const list = w.find('[role="tablist"]').element as HTMLElement
    metrics(list, 0)
    list.dispatchEvent(new Event('scroll'))
    await w.vm.$nextTick()
    expect(arrowsOf(w)).toHaveLength(1)
    expect(arrowsOf(w)[0].classes()).toContain('right-1')
    expect(list.getAttribute('style') ?? '').not.toContain('mask-image')

    metrics(list, 300)
    list.dispatchEvent(new Event('scroll'))
    await w.vm.$nextTick()
    expect(arrowsOf(w)).toHaveLength(2)
    w.unmount()
  })

  it('no arrows when the tabs fit or when turned off', async () => {
    const w = mount(OTabs, { props: { items: items.slice(0, 2) }, attachTo: document.body })
    w.find('[role="tablist"]').element.dispatchEvent(new Event('scroll'))
    await w.vm.$nextTick()
    expect(arrowsOf(w)).toHaveLength(0)
    w.unmount()

    const off = mount(OTabs, { props: { items, scrollArrows: false }, attachTo: document.body })
    const list = off.find('[role="tablist"]').element as HTMLElement
    metrics(list, 0)
    list.dispatchEvent(new Event('scroll'))
    await off.vm.$nextTick()
    expect(arrowsOf(off)).toHaveLength(0)
    off.unmount()
  })
})

describe('OSelect with an empty-value option', () => {
  const options = [
    { value: '', label: 'Todos los estados' },
    { value: 'active', label: 'Activa' },
  ]

  it('shows that option as the value instead of the placeholder', () => {
    const w = mount(OSelect, { props: { options, modelValue: '' } })
    const trigger = w.find('[role="combobox"]')
    expect(trigger.text()).toContain('Todos los estados')
    expect(trigger.text()).not.toContain('Selecciona')
  })

  it('without such an option the placeholder still shows', () => {
    const w = mount(OSelect, { props: { options: options.slice(1), modelValue: '', placeholder: 'Estado' } })
    expect(w.find('[role="combobox"]').text()).toContain('Estado')
  })
})

describe('OPopover triggerClass', () => {
  it('lands on the trigger wrapper, not on the panel', () => {
    const w = mount(OPopover, {
      props: { triggerClass: 'flex min-w-0 flex-1', class: 'w-80' },
      slots: { trigger: () => h('button', 'Abrir') },
    })
    const wrapper = w.find('span')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['flex', 'min-w-0', 'flex-1']))
    expect(wrapper.classes()).not.toContain('w-80')
  })
})

describe('OColorPicker showValue', () => {
  it('hides the hex next to the swatch when asked', () => {
    // happy-dom has no canvas; the picker reads the hex back from a 1px canvas.
    HTMLCanvasElement.prototype.getContext = (() => ({
      fillStyle: '',
      fillRect: () => {},
      getImageData: () => ({ data: [0, 0, 0, 255] }),
    })) as unknown as typeof HTMLCanvasElement.prototype.getContext
    const shown = mount(OColorPicker, { props: { modelValue: { h: 0, s: 0, v: 0, a: 1 } } })
    expect(shown.find('button .font-mono').exists()).toBe(true)
    const hidden = mount(OColorPicker, { props: { modelValue: { h: 0, s: 0, v: 0, a: 1 }, showValue: false } })
    expect(hidden.find('button .font-mono').exists()).toBe(false)
  })
})
