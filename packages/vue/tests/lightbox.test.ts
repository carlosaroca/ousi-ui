import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import OLightbox from '../src/components/lightbox/Lightbox.vue'
import { clampPan, zoomAt } from '../src/components/lightbox/lightbox.geometry'
import { useOusiConfig } from '../src/config'

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

/* happy-dom lays nothing out. The stage is 400x600 at the top left; the picture, 400x300 in it. */
const STAGE = { width: 400, height: 600 }
const PICTURE = { width: 400, height: 300 }
let now = 0
const sizes: [keyof HTMLElement, string][] = [['clientWidth', 'width'], ['clientHeight', 'height'], ['offsetWidth', 'width'], ['offsetHeight', 'height']]

beforeEach(() => {
  now = 1000
  vi.spyOn(performance, 'now').mockImplementation(() => now)
  for (const [property, side] of sizes) {
    vi.spyOn(HTMLElement.prototype, property as any, 'get').mockImplementation(function (this: HTMLElement) {
      const box = this.dataset.part === 'stage' ? STAGE : this.dataset.part === 'image' ? PICTURE : undefined
      return box ? box[side as 'width'] : 0
    })
  }
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    () => ({ left: 0, top: 0, width: STAGE.width, height: STAGE.height, right: STAGE.width, bottom: STAGE.height, x: 0, y: 0 }) as DOMRect,
  )
})

const wrappers: VueWrapper[] = []
afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount())
  document.body.innerHTML = ''
  useOusiConfig().locale.value = 'en-US'
  vi.restoreAllMocks()
})

const images = [
  { src: '/one.jpg', alt: 'A lake', caption: 'The lake', thumbnail: '/one-small.jpg' },
  { src: '/two.jpg', alt: 'A hill' },
  { src: '/three.jpg' },
]

async function settle() {
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 20))
  await nextTick()
}

const $ = <T extends Element = HTMLElement>(selector: string) => document.querySelector<T>(selector)!
const has = (selector: string) => !!document.querySelector(selector)
const picture = () => $<HTMLImageElement>('[data-part="image"]')
const stage = () => $('[data-part="stage"]')
const dialog = () => $('[role="dialog"]')
const isOpen = () => has('[data-slot="lightbox"]')
const shown = () => picture()?.getAttribute('src')
const transform = () => picture().style.transform
const scale = () => Number(transform().match(/scale\(([\d.]+)\)/)![1])
const moved = () => transform().match(/translate3d\((-?[\d.]+)px, (-?[\d.]+)px/)!.slice(1).map(Number)
const frame = () => $('[data-part="frame"]').style.transform

async function load() {
  picture()?.dispatchEvent(new Event('load'))
  await settle()
}
/** The viewer as an app uses it, holding open and index itself, with its first picture loaded. */
async function viewer(props: Record<string, unknown> = {}, options: { index?: number; slots?: any; loaded?: boolean } = {}) {
  const open = ref(false)
  const index = ref(options.index ?? 0)
  const events: [string, unknown?][] = []
  const w = mount(
    defineComponent({
      setup: () => () =>
        h(
          OLightbox,
          {
            images,
            modelValue: open.value,
            'onUpdate:modelValue': (v: boolean) => (open.value = v),
            index: index.value,
            'onUpdate:index': (v: number) => ((index.value = v), events.push(['index', v])),
            onClose: () => events.push(['close']),
            onError: (image: any, at: number) => events.push(['error', `${image.src} ${at}`]),
            ...props,
          },
          options.slots,
        ),
    }),
    { attachTo: document.body },
  )
  wrappers.push(w)
  open.value = true
  await settle()
  if (options.loaded !== false) await load()
  return { w, open, index, events }
}

async function click(selector: string) {
  $(selector).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
  await settle()
  if (has('[data-part="image"]') && picture().classList.contains('opacity-0')) await load()
}
async function key(name: string, init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true, ...init })
  dialog().dispatchEvent(event)
  await settle()
  if (has('[data-part="image"]') && picture().classList.contains('opacity-0')) await load()
  return event
}

function pointer(type: string, x: number, y: number, target: Element = stage(), id = 1, init: PointerEventInit = {}) {
  const event = new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: id, button: 0, clientX: x, clientY: y, ...init })
  target.dispatchEvent(event)
  return event
}
/** One finger or a mouse, from a point to another, taking `time` ms. */
async function swipe(from: [number, number], to: [number, number], { time = 600, rest = 0, release = true, on = undefined as Element | undefined } = {}) {
  pointer('pointerdown', ...from, on ?? picture() ?? stage())
  for (let i = 1; i <= 10; i++) {
    now += time / 10
    pointer('pointermove', from[0] + ((to[0] - from[0]) * i) / 10, from[1] + ((to[1] - from[1]) * i) / 10)
  }
  now += rest
  if (release) pointer('pointerup', ...to)
  await settle()
  if (has('[data-part="image"]') && picture().classList.contains('opacity-0')) await load()
}
async function tap(x: number, y: number, on: Element = picture()) {
  pointer('pointerdown', x, y, on)
  pointer('pointerup', x, y)
  await settle()
}
async function doubleTap(x: number, y: number) {
  now += 1000
  await tap(x, y)
  now += 100
  await tap(x, y)
}

describe('lightbox geometry', () => {
  it('keeps the picture in the middle while it fits, and its edges at the stage’s when it does not', () => {
    expect(clampPan({ scale: 1, x: 90, y: 90 }, PICTURE, STAGE)).toEqual({ scale: 1, x: 0, y: 0 })
    // At 3x it is 1200x900 in 400x600: 400 to each side, 150 up and down.
    expect(clampPan({ scale: 3, x: 9999, y: -9999 }, PICTURE, STAGE)).toEqual({ scale: 3, x: 400, y: -150 })
    // At 1.5x it is 600x450: wider than the stage, not as tall.
    expect(clampPan({ scale: 1.5, x: -9999, y: 50 }, PICTURE, STAGE)).toEqual({ scale: 1.5, x: -100, y: 0 })
  })

  it('zooms around a point, which stays where it was', () => {
    const before = { scale: 1.5, x: 20, y: -10 }
    const at = { x: 100, y: 40 }
    const after = zoomAt(before, 3, at)
    const under = (v: typeof before) => [(at.x - v.x) / v.scale, (at.y - v.y) / v.scale]
    expect(under(after)).toEqual(under(before))
  })
})

describe('lightbox: opening and pictures', () => {
  it('shows nothing until opened, or with no pictures', async () => {
    const w = mount(OLightbox, { props: { images }, attachTo: document.body })
    wrappers.push(w)
    await settle()
    expect(isOpen()).toBe(false)
    await w.setProps({ images: [], modelValue: true })
    await settle()
    expect(isOpen()).toBe(false)
  })

  it('is opened by its trigger slot, at the picture asked for, with no state in the app', async () => {
    const w = mount(OLightbox, {
      props: { images },
      slots: { trigger: ({ open }: any) => h('button', { class: 'thumb', onClick: () => open(2) }, 'see') },
      attachTo: document.body,
    })
    wrappers.push(w)
    await settle()
    await click('.thumb')
    expect(shown()).toBe('/three.jpg')
    await click('[data-part="close"]')
    expect(isOpen()).toBe(false)
    expect(w.emitted('update:modelValue')).toEqual([[true], [false]])
  })

  it('takes plain addresses', async () => {
    await viewer({ images: ['/a.png', '/b.png'] })
    expect(shown()).toBe('/a.png')
    expect(picture().alt).toBe('')
  })

  it('turns pages with the buttons, saying where it is', async () => {
    const { events } = await viewer()
    expect($('[data-part="counter"]').textContent).toBe('1 of 3')
    expect($('[data-part="caption"]').textContent!.trim()).toBe('The lake')
    await click('[data-part="next"]')
    expect(shown()).toBe('/two.jpg')
    expect($('[data-part="counter"]').textContent).toBe('2 of 3')
    expect(has('[data-part="caption"]')).toBe(false)
    await click('[data-part="previous"]')
    expect(shown()).toBe('/one.jpg')
    expect(events).toEqual([['index', 1], ['index', 0]])
  })

  it('stops at both ends, keeping its buttons focusable', async () => {
    const { index } = await viewer()
    expect($('[data-part="previous"]').getAttribute('aria-disabled')).toBe('true')
    expect($('[data-part="previous"]').hasAttribute('disabled')).toBe(false)
    await click('[data-part="previous"]')
    expect(index.value).toBe(0)
    await key('End')
    await click('[data-part="next"]')
    expect(index.value).toBe(2)
    expect($('[data-part="next"]').getAttribute('aria-disabled')).toBe('true')
  })

  it('goes round with loop', async () => {
    const { index } = await viewer({ loop: true })
    await click('[data-part="previous"]')
    expect(index.value).toBe(2)
    await click('[data-part="next"]')
    expect(index.value).toBe(0)
  })

  it('has nothing about several pictures with just one', async () => {
    await viewer({ images: [images[0]] })
    for (const part of ['next', 'previous', 'counter', 'strip']) expect(has(`[data-part="${part}"]`)).toBe(false)
    expect($('[role="status"]').textContent).toBe('A lake')
  })

  it('never goes past the pictures there are, and closes when there are none left', async () => {
    const list = ref([...images])
    const open = ref(true)
    const w = mount(
      defineComponent({
        setup: () => () => h(OLightbox, { images: list.value, modelValue: open.value, 'onUpdate:modelValue': (v: boolean) => (open.value = v), index: 9 }),
      }),
      { attachTo: document.body },
    )
    wrappers.push(w)
    await settle()
    expect(shown()).toBe('/three.jpg')
    list.value = images.slice(0, 2)
    await settle()
    expect(shown()).toBe('/two.jpg')
    list.value = []
    await settle()
    expect(open.value).toBe(false)
    expect(isOpen()).toBe(false)
  })
})

describe('lightbox: loading', () => {
  it('waits with a spinner until the picture has loaded', async () => {
    await viewer({}, { loaded: false })
    expect(has('[data-part="loading"]')).toBe(true)
    expect(picture().classList).toContain('opacity-0')
    expect($('[data-part="zoom-in"]').getAttribute('aria-disabled')).toBe('true')
    await load()
    expect(has('[data-part="loading"]')).toBe(false)
    expect(picture().classList).toContain('opacity-100')
    expect($('[data-part="zoom-in"]').getAttribute('aria-disabled')).toBeNull()
  })

  it('says when a picture cannot be loaded, and tells the app', async () => {
    const { events } = await viewer({}, { loaded: false })
    picture().dispatchEvent(new Event('error'))
    await settle()
    expect($('[data-part="failed"]').textContent!.trim()).toBe('This picture could not be loaded')
    expect(has('[data-part="image"]')).toBe(false)
    expect(events).toContainEqual(['error', '/one.jpg 0'])
    await click('[data-part="next"]')
    expect(shown()).toBe('/two.jpg')
    expect(has('[data-part="failed"]')).toBe(false)
  })

  it('pays no heed to a picture already left behind', async () => {
    await viewer({}, { loaded: false })
    // As an element that still carries the address of a picture turned away from.
    const stale = picture()
    stale.setAttribute('src', '/gone.jpg')
    stale.dispatchEvent(new Event('load'))
    stale.dispatchEvent(new Event('error'))
    await settle()
    expect(has('[data-part="loading"]')).toBe(true)
    expect(has('[data-part="failed"]')).toBe(false)
  })

  it('does not start over when the app renders the same pictures again', async () => {
    const again = ref(0)
    const w = mount(
      defineComponent({
        // A new array every render, as pictures written in a template are.
        setup: () => () => h('div', { 'data-n': again.value }, h(OLightbox, { modelValue: true, images: [{ src: '/one.jpg' }, { src: '/two.jpg' }] })),
      }),
      { attachTo: document.body },
    )
    wrappers.push(w)
    await settle()
    await load()
    again.value++
    await settle()
    expect(has('[data-part="loading"]')).toBe(false)
    expect(picture().classList).toContain('opacity-100')
  })

  it('loads again a picture that repeats the one before', async () => {
    await viewer({ images: ['/same.jpg', '/same.jpg'] })
    const first = picture()
    dialog().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await settle()
    expect(picture()).not.toBe(first)
    expect(has('[data-part="loading"]')).toBe(true)
  })

  it('fetches the neighbours ahead', async () => {
    const asked: string[] = []
    const Real = window.Image
    vi.stubGlobal('Image', class { set src(value: string) { asked.push(value) } })
    await viewer({}, { index: 1, loaded: false })
    vi.stubGlobal('Image', Real)
    expect(asked).toEqual(['/three.jpg', '/one.jpg'])
  })
})

describe('lightbox: zoom', () => {
  it('zooms with the buttons up to the most allowed, and back', async () => {
    await viewer({ maxZoom: 2 })
    await click('[data-part="zoom-in"]')
    expect(scale()).toBe(1.5)
    await click('[data-part="zoom-in"]')
    expect(scale()).toBe(2)
    expect($('[data-part="zoom-in"]').getAttribute('aria-disabled')).toBe('true')
    await click('[data-part="zoom-out"]')
    await click('[data-part="zoom-out"]')
    expect(scale()).toBe(1)
    expect($('[data-part="zoom-out"]').getAttribute('aria-disabled')).toBe('true')
  })

  it('zooms in on a double tap, around the point tapped, and back out on another', async () => {
    await viewer()
    await doubleTap(260, 330) // 60 right and 30 below the centre of the stage
    expect(scale()).toBe(2.5)
    // The point stays put: 60 - 60 * 2.5 = -90. Down, the picture is 750 tall in 600: 75 of reach.
    expect(moved()).toEqual([-90, -45])
    await doubleTap(200, 300)
    expect(scale()).toBe(1)
  })

  it('does not take two slow taps, or two far apart, for a double tap', async () => {
    await viewer()
    await tap(200, 300)
    now += 500
    await tap(200, 300)
    expect(scale()).toBe(1)
    now += 1000
    await tap(100, 300)
    now += 50
    await tap(300, 300)
    expect(scale()).toBe(1)
  })

  it('zooms with the wheel around the pointer, finer for a trackpad pinch', async () => {
    await viewer()
    const wheel = async (deltaY: number, ctrlKey = false) => {
      const event = new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY, clientX: 200, clientY: 300 })
      Object.defineProperty(event, 'ctrlKey', { value: ctrlKey })
      stage().dispatchEvent(event)
      await settle()
      return event
    }
    expect((await wheel(-200)).defaultPrevented).toBe(true)
    expect(scale()).toBeCloseTo(Math.exp(0.4), 5)
    await wheel(10000)
    expect(scale()).toBe(1)
    await wheel(-50, true)
    expect(scale()).toBeCloseTo(Math.exp(0.5), 5)
  })

  it('pinches around the point between the fingers, which follows them', async () => {
    await viewer()
    pointer('pointerdown', 150, 300, picture(), 1)
    pointer('pointerdown', 250, 300, picture(), 2)
    pointer('pointermove', 100, 300, stage(), 1)
    pointer('pointermove', 300, 300, stage(), 2) // twice as far apart
    await settle()
    expect(scale()).toBe(2)
    expect(moved()).toEqual([0, 0])
    pointer('pointermove', 140, 300, stage(), 1)
    pointer('pointermove', 340, 300, stage(), 2) // both 40 to the right
    await settle()
    expect(moved()).toEqual([40, 0])
  })

  it('carries on with one finger after a pinch, without jumping, and turns no page', async () => {
    const { index } = await viewer()
    pointer('pointerdown', 150, 300, picture(), 1)
    pointer('pointerdown', 250, 300, picture(), 2)
    pointer('pointermove', 50, 300, stage(), 1)
    pointer('pointermove', 350, 300, stage(), 2) // 3x
    pointer('pointerup', 350, 300, stage(), 2)
    await settle()
    const before = moved()
    pointer('pointermove', 52, 300, stage(), 1)
    await settle()
    // By what the finger left has moved, no more: it does not jump to where that finger is.
    expect(moved()).toEqual([before[0] + 2, before[1]])
    now += 100
    pointer('pointermove', 150, 300, stage(), 1)
    pointer('pointerup', 150, 300, stage(), 1)
    await settle()
    expect(moved()[0]).toBeGreaterThan(before[0])
    expect(index.value).toBe(0)
  })

  it('pans a zoomed picture as far as its edges, and does not turn the page', async () => {
    const { index } = await viewer()
    await doubleTap(200, 300) // 2.5x: 1000x750, 300 to each side and 75 up and down
    await swipe([200, 300], [900, 700])
    expect(moved()).toEqual([300, 75])
    await swipe([900, 700], [0, 0])
    expect(moved()).toEqual([-300, -75])
    expect(index.value).toBe(0)
    expect(isOpen()).toBe(true)
  })

  it('starts the next picture at its normal size', async () => {
    await viewer()
    await click('[data-part="zoom-in"]')
    await click('[data-part="next"]')
    expect(scale()).toBe(1)
  })

  it('can be turned off', async () => {
    await viewer({ zoomable: false })
    expect(has('[data-part="zoom-in"]')).toBe(false)
    await doubleTap(200, 300)
    await key('+')
    pointer('pointerdown', 150, 300, picture(), 1)
    pointer('pointerdown', 250, 300, picture(), 2)
    pointer('pointermove', 50, 300, stage(), 1)
    await settle()
    expect(scale()).toBe(1)
  })
})

describe('lightbox: swiping', () => {
  it('turns to the next or the one before when dragged far enough', async () => {
    const { index } = await viewer({}, { index: 1 })
    await swipe([300, 300], [150, 300])
    expect(index.value).toBe(2)
    await swipe([100, 300], [260, 300])
    expect(index.value).toBe(1)
  })

  it('goes back after a short, slow drag, but turns on a flick', async () => {
    const { index } = await viewer()
    await swipe([300, 300], [250, 300])
    expect(index.value).toBe(0)
    expect(frame()).toBe('')
    await swipe([300, 300], [250, 300], { time: 60 })
    expect(index.value).toBe(1)
  })

  it('follows the finger, giving little where there is nothing to turn to', async () => {
    const { index } = await viewer()
    await swipe([300, 300], [200, 300], { release: false })
    expect(frame()).toContain('translate3d(-100px, 0px, 0)')
    pointer('pointercancel', 200, 300)
    await swipe([100, 300], [300, 300], { release: false })
    expect(frame()).toContain('translate3d(50px, 0px, 0)') // a quarter
    pointer('pointerup', 300, 300)
    await settle()
    expect(index.value).toBe(0)
  })

  it('goes back when the system takes the pointer away', async () => {
    const { index } = await viewer()
    await swipe([300, 300], [50, 300], { release: false })
    pointer('pointercancel', 50, 300)
    await settle()
    expect(index.value).toBe(0)
    expect(frame()).toBe('')
  })

  it('closes when thrown downwards, fading the page back in on the way', async () => {
    await viewer()
    await swipe([200, 200], [205, 300], { release: false })
    expect($('[data-part="backdrop"]').style.opacity).toBe('0.8')
    pointer('pointercancel', 205, 300)
    await swipe([200, 200], [205, 400])
    expect(isOpen()).toBe(false)
  })

  it('stays after a short pull, one thrown back up, or one upwards', async () => {
    await viewer()
    await swipe([200, 200], [200, 260])
    await swipe([200, 400], [200, 100])
    pointer('pointerdown', 200, 100, picture())
    for (let i = 1; i <= 5; i++) ((now += 100), pointer('pointermove', 200, 100 + i * 60))
    for (let i = 1; i <= 3; i++) ((now += 20), pointer('pointermove', 200, 400 - i * 40))
    pointer('pointerup', 200, 280)
    await settle()
    expect(isOpen()).toBe(true)
  })

  it('can keep a downward drag from closing it', async () => {
    await viewer({ swipeToClose: false })
    await swipe([200, 100], [200, 500])
    expect(isOpen()).toBe(true)
  })

  it('closes on a tap beside the picture, not on it, unless told not to', async () => {
    await viewer()
    await tap(200, 300)
    expect(isOpen()).toBe(true)
    await tap(200, 40, stage())
    expect(isOpen()).toBe(false)
    await viewer({ closeOnBackdrop: false })
    await tap(200, 40, stage())
    expect(isOpen()).toBe(true)
  })

  it('ignores the right button', async () => {
    await viewer()
    pointer('pointerdown', 200, 40, stage(), 1, { button: 2 })
    pointer('pointerup', 200, 40, stage(), 1, { button: 2 })
    await settle()
    expect(isOpen()).toBe(true)
  })
})

describe('lightbox: keyboard and screen readers', () => {
  it('moves between pictures with the arrows, Home and End', async () => {
    const { index } = await viewer()
    await key('ArrowRight')
    expect(index.value).toBe(1)
    await key('End')
    expect(index.value).toBe(2)
    await key('ArrowLeft')
    expect(index.value).toBe(1)
    await key('Home')
    expect(index.value).toBe(0)
  })

  it('zooms with + and -, and looks around with the arrows while zoomed', async () => {
    const { index } = await viewer()
    await key('+')
    await key('=')
    expect(scale()).toBe(2.25)
    await key('ArrowRight')
    expect(moved()).toEqual([-80, 0])
    await key('ArrowDown')
    expect(moved()).toEqual([-80, -37.5]) // the edge
    expect(index.value).toBe(0)
    await key('-')
    expect(scale()).toBe(1.5)
    await key('0')
    expect(scale()).toBe(1)
  })

  it('leaves the browser its own zoom keys', async () => {
    await viewer()
    expect((await key('+', { ctrlKey: true })).defaultPrevented).toBe(false)
    expect((await key('-', { metaKey: true })).defaultPrevented).toBe(false)
    expect(scale()).toBe(1)
  })

  it('closes with Escape', async () => {
    const { events } = await viewer()
    document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await settle()
    expect(isOpen()).toBe(false)
    expect(events).toContainEqual(['close'])
  })

  it('is a modal dialog with its focus on Close, which gives it back', async () => {
    const opener = document.createElement('button')
    document.body.append(opener)
    opener.focus()
    const { open } = await viewer()
    expect(dialog().getAttribute('aria-modal')).toBe('true')
    expect(dialog().getAttribute('aria-label')).toBe('Image viewer')
    expect(document.activeElement).toBe($('[data-part="close"]'))
    open.value = false
    await settle()
    expect(document.activeElement).toBe(opener)
  })

  it('reads each picture as it comes', async () => {
    await viewer()
    expect($('[role="status"]').textContent).toBe('1 of 3: A lake')
    await key('End')
    expect($('[role="status"]').textContent).toBe('3 of 3')
  })

  it('has a strip that is one Tab stop, marks the picture on show and takes focus along', async () => {
    const { index } = await viewer()
    const thumbs = () => [...document.querySelectorAll<HTMLElement>('[data-part="strip"] button')]
    expect(thumbs().map((t) => t.getAttribute('tabindex'))).toEqual(['0', '-1', '-1'])
    expect(thumbs()[0].querySelector('img')!.getAttribute('src')).toBe('/one-small.jpg')
    expect(thumbs()[1].querySelector('img')!.getAttribute('src')).toBe('/two.jpg')
    thumbs()[2].dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await settle()
    expect(index.value).toBe(2)
    expect(thumbs()[2].getAttribute('aria-current')).toBe('true')
    thumbs()[2].focus()
    thumbs()[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }))
    await settle()
    expect(document.activeElement).toBe(thumbs()[1])
    expect((await viewer({ thumbnails: false }), document.querySelectorAll('[data-part="strip"]').length)).toBe(1)
  })

  it('speaks the language of the app', async () => {
    useOusiConfig().locale.value = 'es-CO'
    await viewer()
    expect(dialog().getAttribute('aria-label')).toBe('Visor de imágenes')
    expect($('[data-part="close"]').getAttribute('aria-label')).toBe('Cerrar el visor')
    expect($('[data-part="counter"]').textContent).toBe('1 de 3')
  })
})

describe('lightbox: what the app adds', () => {
  it('downloads only when asked, under the name given', async () => {
    await viewer()
    expect(has('[data-part="download"]')).toBe(false)
    await viewer({ downloadable: true, images: [{ src: '/x.jpg', downloadName: 'lake.jpg' }] })
    const link = $<HTMLAnchorElement>('[data-part="download"]')
    expect([link.getAttribute('href'), link.getAttribute('download'), link.rel]).toEqual(['/x.jpg', 'lake.jpg', 'noopener'])
  })

  it('takes buttons of its own, with the picture at hand', async () => {
    await viewer({}, { slots: { actions: (c: any) => h('button', { class: 'share' }, `${c.image.src} ${c.index + 1}/${c.total}`) } })
    expect($('.share').textContent).toBe('/one.jpg 1/3')
  })

  it('takes a caption, an error and icons of its own, one at a time', async () => {
    await viewer({}, { slots: { caption: (c: any) => h('b', { class: 'cap' }, c.image.alt), 'close-icon': () => h('i', { class: 'x' }) } })
    expect($('.cap').textContent).toBe('A lake')
    expect($('[data-part="close"] .x')).not.toBeNull()
    // The rest keep their own.
    expect($('[data-part="next"] svg')).not.toBeNull()
    expect($('[data-part="zoom-in"] svg')).not.toBeNull()
  })

  it.each(['previous-icon', 'next-icon', 'zoom-in-icon', 'zoom-out-icon', 'download-icon'])('replaces the #%s', async (slot) => {
    await viewer({ downloadable: true }, { slots: { [slot]: () => h('i', { class: 'mine' }) } })
    expect($(`[data-part="${slot.replace('-icon', '')}"] .mine`)).not.toBeNull()
    expect(document.querySelectorAll('.mine')).toHaveLength(1)
  })

  it('takes its shape and states from the tokens', async () => {
    await viewer()
    const classes = $('[data-part="close"]').className.split(' ')
    for (const token of ['rounded-ousi-4xl', 'focus-visible:outline-ousi-focus', 'aria-disabled:opacity-(--ousi-disabled-opacity)']) {
      expect(classes).toContain(token)
    }
    expect(picture().className).toContain('rounded-ousi-lg')
    expect($('[data-part="backdrop"]').className).toContain('var(--lightbox-backdrop')
  })
})
