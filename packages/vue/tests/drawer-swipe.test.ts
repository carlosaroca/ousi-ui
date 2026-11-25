import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import ODrawer from '../src/components/drawer/Drawer.vue'

// Animations are out of scope: Motion renders its tag and AnimatePresence its slot.
vi.mock('motion-v', async () => {
  const { defineComponent, h } = await import('vue')
  const Motion = defineComponent({
    name: 'Motion',
    props: { tag: { type: String, default: 'div' }, initial: null, animate: null, exit: null, transition: null },
    setup: (props, { slots }) => () => h(props.tag, null, slots.default?.()),
  })
  const AnimatePresence = defineComponent({ name: 'AnimatePresence', setup: (_, { slots }) => () => slots.default?.() })
  return { Motion, AnimatePresence }
})

let now = 0
const wrappers: VueWrapper[] = []

beforeEach(() => {
  now = 1000
  vi.spyOn(performance, 'now').mockImplementation(() => now)
})
afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount())
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

const body = '<ul class="rows"><li class="row">Row</li></ul><input class="field"><div class="crop" style="touch-action: none">crop</div>'

async function open(props: Record<string, unknown> = {}) {
  const wrapper = mount(ODrawer, {
    props: { modelValue: true, placement: 'bottom', title: 'Title', ...props },
    slots: { default: body },
    attachTo: document.body,
  })
  wrappers.push(wrapper)
  await nextTick()
  await nextTick()
  return wrapper
}

const $ = (selector: string) => {
  const el = document.querySelector<HTMLElement>(selector)
  if (!el) throw new Error(`No element for ${selector}`)
  return el
}
const panel = () => $('[role="dialog"]')
const handle = () => $('[data-drawer-handle]')
const moved = () => panel().parentElement!.style.transform
const closed = (w: VueWrapper) => !!w.emitted('close')

interface Path {
  from?: [number, number]
  to: [number, number]
  /** How long the whole movement takes, in ms. */
  time?: number
  /** How long the pointer rests before letting go. */
  rest?: number
  release?: boolean
}
const STEPS = 10
function walk({ from = [200, 200], to, time = 600, rest = 0 }: Path, step: (x: number, y: number) => void) {
  for (let i = 1; i <= STEPS; i++) {
    now += time / STEPS
    step(from[0] + ((to[0] - from[0]) * i) / STEPS, from[1] + ((to[1] - from[1]) * i) / STEPS)
  }
  now += rest
}

async function mouse(target: Element, path: Path, init: PointerEventInit = {}) {
  const { from = [200, 200], release = true } = path
  const fire = (type: string, x: number, y: number) =>
    target.dispatchEvent(
      new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 1, pointerType: 'mouse', button: 0, clientX: x, clientY: y, ...init }),
    )
  fire('pointerdown', ...from)
  walk(path, (x, y) => fire('pointermove', x, y))
  if (release) fire('pointerup', ...path.to)
  await nextTick()
}

function touchEvent(type: string, points: [number, number][]) {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'touches', { value: points.map(([clientX, clientY]) => ({ clientX, clientY })) })
  return event
}
/** Swipes with one finger. Says whether any move held the page back from scrolling. */
async function touch(target: Element, path: Path) {
  const { from = [200, 200], release = true } = path
  let held = false
  target.dispatchEvent(touchEvent('touchstart', [from]))
  walk(path, (x, y) => {
    const event = touchEvent('touchmove', [[x, y]])
    target.dispatchEvent(event)
    held ||= event.defaultPrevented
  })
  if (release) target.dispatchEvent(touchEvent('touchend', []))
  await nextTick()
  return held
}

/** happy-dom lays nothing out, so a scrollable box has to be described. */
function scrollable(el: HTMLElement, { at = 0, view = 100, content = 400, axis = 'y' } = {}) {
  el.style.setProperty(axis === 'y' ? 'overflow-y' : 'overflow-x', 'auto')
  const sizes = axis === 'y' ? ['clientHeight', 'scrollHeight', 'scrollTop'] : ['clientWidth', 'scrollWidth', 'scrollLeft']
  ;[view, content, at].forEach((value, i) => Object.defineProperty(el, sizes[i], { configurable: true, value }))
}

describe('drawer: swipe to close', () => {
  it('closes when the handle is dragged far enough', async () => {
    const w = await open()
    await mouse(handle(), { to: [200, 400] })
    expect(closed(w)).toBe(true)
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual([false])
  })

  it('follows the pointer while it is held', async () => {
    const w = await open()
    await mouse(handle(), { to: [200, 230], release: false })
    expect(moved()).toBe('translate3d(0px, 30px, 0)')
    expect(panel().parentElement!.style.transition).toBe('none')
    expect(closed(w)).toBe(false)
  })

  it('goes back to its place after a short, slow drag', async () => {
    const w = await open()
    await mouse(handle(), { to: [200, 230] })
    expect(closed(w)).toBe(false)
    expect(moved()).toBe('')
    expect(panel().parentElement!.style.transition).toContain('transform')
  })

  it('closes with a short flick', async () => {
    const w = await open()
    await mouse(handle(), { to: [200, 240], time: 50 })
    expect(closed(w)).toBe(true)
  })

  it('does not take a quick tremor for a flick', async () => {
    const w = await open()
    await mouse(handle(), { to: [200, 212], time: 10 })
    expect(closed(w)).toBe(false)
  })

  it('does not take a drag for a flick once the pointer has rested', async () => {
    const w = await open()
    await mouse(handle(), { to: [200, 240], time: 50, rest: 400 })
    expect(closed(w)).toBe(false)
  })

  it('stays when thrown back to its place, however far it had been pulled', async () => {
    const w = await open()
    const fire = (type: string, y: number) =>
      handle().dispatchEvent(new PointerEvent(type, { bubbles: true, pointerId: 1, pointerType: 'mouse', button: 0, clientX: 200, clientY: y }))
    fire('pointerdown', 200)
    walk({ to: [200, 500] }, (_, y) => fire('pointermove', y))
    walk({ from: [200, 500], to: [200, 380], time: 60 }, (_, y) => fire('pointermove', y))
    fire('pointerup', 380)
    await nextTick()
    expect(closed(w)).toBe(false)
  })

  it('measures how far against the size of the panel', async () => {
    const w = await open()
    Object.defineProperty(panel(), 'offsetHeight', { configurable: true, value: 600 })
    await mouse(handle(), { to: [200, 400] }) // 200 of 600: under 40%
    expect(closed(w)).toBe(false)
    await mouse(handle(), { to: [200, 460] }) // 260 of 600
    expect(closed(w)).toBe(true)
  })

  it('fades the page back in as it is pulled, but never a blur', async () => {
    await open()
    Object.defineProperty(panel(), 'offsetHeight', { configurable: true, value: 400 })
    await mouse(handle(), { to: [200, 300], release: false })
    const backdrop = $('[aria-hidden="true"].fixed')
    expect(backdrop.style.filter).toBe('opacity(0.75)')
    wrappers.splice(0).forEach((w) => w.unmount())
    document.body.innerHTML = ''
    await open({ backdrop: 'blur' })
    await mouse(handle(), { to: [200, 300], release: false })
    expect($('[aria-hidden="true"].fixed').style.filter).toBe('')
  })

  it('lets a mouse drag it by the handle only, so text can be selected', async () => {
    const w = await open()
    await mouse($('.row'), { to: [200, 500] })
    expect(closed(w)).toBe(false)
    expect(moved()).toBe('')
  })

  it('ignores the right button', async () => {
    const w = await open()
    await mouse(handle(), { to: [200, 500] }, { button: 2 })
    expect(closed(w)).toBe(false)
  })

  it('does not move the other way', async () => {
    const w = await open()
    await mouse(handle(), { to: [200, 20], release: false })
    expect(moved()).toBe('')
    expect(closed(w)).toBe(false)
  })

  it.each([
    ['bottom', [200, 400], [200, 0]],
    ['top', [200, 0], [200, 400]],
    ['left', [0, 200], [400, 200]],
    ['right', [400, 200], [0, 200]],
    ['floating-bottom', [200, 400], [200, 0]],
    ['floating-left', [0, 200], [400, 200]],
  ] as const)('%s leaves the way it came, and no other', async (placement, back, forth) => {
    const w = await open({ placement })
    await touch($('.row'), { to: [...forth] })
    expect(closed(w)).toBe(false)
    await touch($('.row'), { to: [...back] })
    expect(closed(w)).toBe(true)
  })

  it('cannot be swiped from the centre, where it came from nowhere', async () => {
    const w = await open({ placement: 'floating-center', showHandle: true })
    for (const to of [[200, 500], [200, 0], [0, 200], [500, 200]] as [number, number][]) await touch($('.row'), { to })
    await mouse(handle(), { to: [200, 500] })
    expect(closed(w)).toBe(false)
    expect(handle().className).not.toContain('cursor-grab')
  })

  it('can be turned off, and then offers no handle unasked', async () => {
    const w = await open({ swipeToClose: false })
    expect(document.querySelector('[data-drawer-handle]')).toBeNull()
    await touch($('.row'), { to: [200, 500] })
    expect(closed(w)).toBe(false)
  })

  it('shows a handle that was asked for even when it cannot be pulled', async () => {
    const w = await open({ swipeToClose: false, showHandle: true })
    expect(handle().className).not.toContain('cursor-grab')
    await mouse(handle(), { to: [200, 500] })
    expect(closed(w)).toBe(false)
  })

  it('puts the handle on the edge it is pulled by', async () => {
    const bodyBefore = (el: Element) =>
      !!($('[data-slot="drawer-body"]').compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)
    await open({ placement: 'bottom' })
    expect(bodyBefore(handle())).toBe(false)
    wrappers.splice(0).forEach((w) => w.unmount())
    document.body.innerHTML = ''
    await open({ placement: 'top' })
    expect(bodyBefore(handle())).toBe(true)
    expect(document.querySelectorAll('[data-drawer-handle]')).toHaveLength(1)
    for (const [placement, edge] of [['left', 'right-0'], ['right', 'left-0']]) {
      wrappers.splice(0).forEach((w) => w.unmount())
      document.body.innerHTML = ''
      await open({ placement, showHandle: true })
      expect(handle().className.split(' ')).toContain(edge)
    }
  })

  it('swipes with a finger from anywhere, holding the page still', async () => {
    const w = await open()
    const held = await touch($('.row'), { to: [200, 420] })
    expect(held).toBe(true)
    expect(closed(w)).toBe(true)
  })

  it('lets content scroll while it can, and takes over once it is at its end', async () => {
    const w = await open()
    const rows = $('.rows')
    scrollable(rows, { at: 120 })
    expect(await touch($('.row'), { to: [200, 500] })).toBe(false)
    expect(closed(w)).toBe(false)
    scrollable(rows, { at: 0 })
    expect(await touch($('.row'), { to: [200, 500] })).toBe(true)
    expect(closed(w)).toBe(true)
  })

  it('from the top, waits until the content has been scrolled to the bottom', async () => {
    const w = await open({ placement: 'top' })
    scrollable($('.rows'), { at: 0 })
    expect(await touch($('.row'), { to: [200, 0] })).toBe(false)
    scrollable($('.rows'), { at: 300 })
    await touch($('.row'), { to: [200, 0] })
    expect(closed(w)).toBe(true)
  })

  it('leaves a sideways scroller to scroll', async () => {
    const w = await open({ placement: 'right' })
    scrollable($('.rows'), { axis: 'x', at: 80 })
    expect(await touch($('.row'), { to: [500, 200] })).toBe(false)
    expect(closed(w)).toBe(false)
  })

  it('leaves a swipe across the other axis alone', async () => {
    const w = await open({ placement: 'bottom' })
    expect(await touch($('.row'), { to: [500, 260] })).toBe(false)
    expect(closed(w)).toBe(false)
  })

  it('keeps a swipe that began the wrong way from closing it on the way back', async () => {
    const w = await open()
    $('.row').dispatchEvent(touchEvent('touchstart', [[200, 200]]))
    $('.row').dispatchEvent(touchEvent('touchmove', [[200, 180]])) // scrolling down the list
    $('.row').dispatchEvent(touchEvent('touchmove', [[200, 500]]))
    $('.row').dispatchEvent(touchEvent('touchend', []))
    await nextTick()
    expect(closed(w)).toBe(false)
  })

  it.each([['a text field', '.field'], ['what handles its own gestures', '.crop']])(
    'leaves the drag to %s',
    async (_, selector) => {
      const w = await open()
      expect(await touch($(selector), { to: [200, 500] })).toBe(false)
      expect(closed(w)).toBe(false)
    },
  )

  it('gives up the swipe when a second finger lands', async () => {
    const w = await open()
    await touch($('.row'), { to: [200, 400], release: false })
    $('.row').dispatchEvent(touchEvent('touchstart', [[200, 400], [100, 100]]))
    $('.row').dispatchEvent(touchEvent('touchend', []))
    await nextTick()
    expect(closed(w)).toBe(false)
    expect(moved()).toBe('')
  })

  it('goes back when the system takes the gesture away', async () => {
    const w = await open()
    await touch($('.row'), { to: [200, 400], release: false })
    $('.row').dispatchEvent(touchEvent('touchcancel', []))
    await nextTick()
    expect(closed(w)).toBe(false)
    expect(moved()).toBe('')
  })

  it('opens in its place again after being swiped away', async () => {
    const w = await open()
    await mouse(handle(), { to: [200, 400] })
    await w.setProps({ modelValue: false })
    await w.setProps({ modelValue: true })
    await nextTick()
    expect(moved()).toBe('')
  })
})
