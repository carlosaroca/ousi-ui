import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import {
  flipEdit,
  initialEdit,
  isUntouched,
  largestCrop,
  moveCrop,
  pixelCrop,
  reshapeCrop,
  resizeCrop,
  rotateEdit,
  setZoom,
  turnedSize,
  viewOf,
  zoomCrop,
  zoomOf,
  type EditState,
  type Handle,
  type Rect,
} from '../src/components/image-editor/image-editor.geometry'
import { exportEdit, paintEdit, type PaintContext } from '../src/components/image-editor/image-editor.render'
import OImageEditor from '../src/components/image-editor/ImageEditor.vue'
import OImageEditorDialog from '../src/components/image-editor/ImageEditorDialog.vue'

// As in layers.test: animations are out of scope, so the dialog mounts and unmounts with its v-if.
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

const photo = { width: 400, height: 300 }

/** Where a point of the original picture is seen, as the CSS of the preview places it. */
function seen(point: [number, number], state: EditState): [number, number] {
  const turned = turnedSize(photo, state.rotation)
  let x = point[0] - photo.width / 2
  let y = point[1] - photo.height / 2
  const angle = (state.rotation * Math.PI) / 180
  ;[x, y] = [x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle)]
  return [x * (state.flipX ? -1 : 1) + turned.width / 2, y * (state.flipY ? -1 : 1) + turned.height / 2]
}

/** The rectangle of the original picture that the crop frames. */
function framed(state: EditState): number[] {
  const turned = turnedSize(photo, state.rotation)
  // Inverts the mapping on the two axes, which a quarter turn only swaps or mirrors.
  const back = (sx: number, sy: number): [number, number] => {
    let x = (sx - turned.width / 2) * (state.flipX ? -1 : 1)
    let y = (sy - turned.height / 2) * (state.flipY ? -1 : 1)
    const angle = (-state.rotation * Math.PI) / 180
    ;[x, y] = [x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle)]
    return [x + photo.width / 2, y + photo.height / 2]
  }
  const { crop } = state
  const a = back(crop.x, crop.y)
  const b = back(crop.x + crop.width, crop.y + crop.height)
  return [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1])].map((n) => Math.round(n * 1000) / 1000)
}

const operations: [string, (s: EditState) => EditState][] = [
  ['turn right', (s) => rotateEdit(s, photo, true)],
  ['turn left', (s) => rotateEdit(s, photo, false)],
  ['mirror', (s) => flipEdit(s, photo, 'horizontal')],
  ['mirror vertically', (s) => flipEdit(s, photo, 'vertical')],
]

describe('turning and mirroring', () => {
  const start: EditState = { rotation: 0, flipX: false, flipY: false, crop: { x: 30, y: 40, width: 120, height: 90 } }

  it('keeps the same part of the picture framed through any sequence', () => {
    const expected = framed(start)
    let sequences = 0
    for (const [, a] of operations)
      for (const [, b] of operations)
        for (const [, c] of operations)
          for (const [, d] of operations) {
            expect(framed(d(c(b(a(start)))))).toEqual(expected)
            sequences++
          }
    expect(sequences).toBe(256)
  })

  it('turns what is on screen: right moves a point from the left edge to the top', () => {
    for (const mirrored of [start, flipEdit(start, photo, 'horizontal')]) {
      const before = turnedSize(photo, mirrored.rotation)
      const turned = rotateEdit(mirrored, photo, true)
      const point: [number, number] = [90, 10]
      const [x, y] = seen(point, mirrored)
      expect(seen(point, turned).map(Math.round)).toEqual([before.height - y, x].map(Math.round))
    }
  })

  it('comes back after four turns, or two mirrors', () => {
    let state = start
    for (let i = 0; i < 4; i++) state = rotateEdit(state, photo, true)
    expect(state).toEqual(start)
    expect(flipEdit(flipEdit(start, photo, 'vertical'), photo, 'vertical')).toEqual(start)
  })

  it('exports each framed pixel where the preview showed it, in every orientation', () => {
    for (const rotation of [0, 90, 180, 270] as const)
      for (const flipX of [false, true])
        for (const flipY of [false, true]) {
          const state: EditState = { rotation, flipX, flipY, crop: { x: 20, y: 30, width: 100, height: 80 } }
          // A context that only follows the transforms: matrix [a b c d e f].
          let m = [1, 0, 0, 1, 0, 0]
          const multiply = (n: number[]) =>
            (m = [
              m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1],
              m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3],
              m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5],
            ])
          let drawn: number[] = []
          const context = {
            scale: (x: number, y: number) => multiply([x, 0, 0, y, 0, 0]),
            translate: (x: number, y: number) => multiply([1, 0, 0, 1, x, y]),
            rotate: (a: number) => multiply([Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0]),
            drawImage: (_: unknown, ...rest: number[]) => (drawn = rest),
          } as unknown as PaintContext
          // Twice the size of the crop, to check the scaling too.
          paintEdit(context, {} as CanvasImageSource, photo, state, state.crop, 200, 160)

          for (const point of [[0, 0], [400, 0], [123, 217]] as [number, number][]) {
            const local = [drawn[0] + point[0], drawn[1] + point[1]]
            const out = [m[0] * local[0] + m[2] * local[1] + m[4], m[1] * local[0] + m[3] * local[1] + m[5]]
            const [x, y] = seen(point, state)
            expect(out[0]).toBeCloseTo((x - state.crop.x) * 2, 6)
            expect(out[1]).toBeCloseTo((y - state.crop.y) * 2, 6)
          }
        }
  })
})

describe('crop arithmetic', () => {
  const inside = (c: Rect, w = 400, h = 300) => {
    expect(c.x).toBeGreaterThanOrEqual(-1e-6)
    expect(c.y).toBeGreaterThanOrEqual(-1e-6)
    expect(c.x + c.width).toBeLessThanOrEqual(w + 1e-6)
    expect(c.y + c.height).toBeLessThanOrEqual(h + 1e-6)
    expect(c.width).toBeGreaterThanOrEqual(1)
    expect(c.height).toBeGreaterThanOrEqual(1)
  }

  it('centres the largest crop of a ratio', () => {
    expect(largestCrop(photo, 1)).toEqual({ x: 50, y: 0, width: 300, height: 300 })
    expect(largestCrop(photo)).toEqual({ x: 0, y: 0, width: 400, height: 300 })
  })

  it('never lets the crop leave the picture, whatever is dragged and how far', () => {
    const handles: Handle[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']
    let seed = 3
    const random = (range: number) => ((seed = (seed * 48271) % 2147483647) % (range * 2 + 1)) - range
    for (const ratio of [undefined, 1, 16 / 9, 3 / 4]) {
      let crop = largestCrop(photo, ratio)
      for (let i = 0; i < 600; i++) {
        const action = i % 3
        if (action === 0) crop = resizeCrop(crop, handles[i % 8], random(500), random(500), photo, ratio)
        else if (action === 1) crop = moveCrop(crop, random(500), random(500), photo)
        else crop = zoomCrop(crop, 1 + random(200) / 250, photo)
        inside(crop)
        if (ratio) expect(crop.width / crop.height).toBeCloseTo(ratio, 6)
      }
    }
  })

  it('keeps the opposite corner still while a corner is dragged', () => {
    const crop = { x: 100, y: 100, width: 100, height: 100 }
    const free = resizeCrop(crop, 'nw', -20, -30, photo)
    expect(free).toEqual({ x: 80, y: 70, width: 120, height: 130 })
    const square = resizeCrop(crop, 'nw', -20, -5, photo, 1)
    expect([square.x + square.width, square.y + square.height]).toEqual([200, 200])
    expect(square.width).toBe(120)
  })

  it('zooms between the largest crop and a small one, around the point asked', () => {
    const crop = largestCrop(photo, 1)
    expect(zoomOf(crop, photo)).toBe(1)
    const twice = setZoom(crop, 2, photo)
    expect(twice).toEqual({ x: 125, y: 75, width: 150, height: 150 })
    expect(zoomCrop(crop, 2, photo, { x: 0, y: 0 })).toMatchObject({ x: 50, y: 0 })
    expect(zoomCrop(crop, 0.1, photo).width).toBe(300)
    expect(zoomCrop(crop, 1e6, photo).width).toBe(32)
  })

  it('changes shape without shrinking a little more each time', () => {
    const start = { x: 100, y: 75, width: 200, height: 150 }
    const back = reshapeCrop(reshapeCrop(start, 1, photo), 4 / 3, photo)
    expect(back.width).toBeCloseTo(200, 6)
  })

  it('centres the crop on the stage, as large as it fits', () => {
    const view = viewOf({ x: 100, y: 100, width: 100, height: 50 }, { width: 448, height: 300 }, 24)
    expect(view.scale).toBe(4)
    expect(view.x + 150 * view.scale).toBe(224)
    expect(view.y + 125 * view.scale).toBe(150)
  })

  it('knows an untouched picture, and rounds a crop inside it', () => {
    expect(isUntouched(initialEdit(photo), photo)).toBe(true)
    expect(isUntouched(initialEdit(photo, 1), photo)).toBe(false)
    expect(pixelCrop({ x: 99.6, y: 0.2, width: 300.7, height: 299.9 }, photo)).toEqual({ x: 100, y: 0, width: 300, height: 300 })
  })
})

describe('exportEdit', () => {
  const file = new File(['x'.repeat(100)], 'a.jpg', { type: 'image/jpeg' })

  it('hands back the very file when nothing would change', async () => {
    const open = vi.fn()
    const out = await exportEdit(file, photo, initialEdit(photo), { maxSize: 1000, maxDimension: 400 }, undefined, open)
    expect(out.file).toBe(file)
    expect(open).not.toHaveBeenCalled()
  })

  it.each([
    ['a crop', initialEdit(photo, 1), {}],
    ['a lower size limit', initialEdit(photo), { maxSize: 10 }],
    ['smaller dimensions', initialEdit(photo), { maxDimension: 200 }],
    ['another format', initialEdit(photo), { type: 'image/png' as const }],
    ['a chosen quality', initialEdit(photo), { quality: 0.6 }],
  ])('writes the picture again for %s', async (_, state, output) => {
    const encode = vi.fn(async (_w: number, _h: number, type: string) => new Blob(['y'], { type }))
    const open = vi.fn(async () => ({
      width: state.crop.width, height: state.crop.height, hasTransparency: () => false, encode, close: vi.fn(),
    }))
    const out = await exportEdit(file, photo, state, output, undefined, open)
    expect(encode).toHaveBeenCalled()
    expect(out.file).not.toBe(file)
  })
})

/* ── Components ────────────────────────────────────────────────── */

const wrappers: VueWrapper<any>[] = []
beforeEach(() => {
  let n = 0
  vi.spyOn(URL, 'createObjectURL').mockImplementation(() => `blob:picture-${++n}`)
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
})
afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount())
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

const settle = async () => {
  for (let i = 0; i < 3; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0))
    await nextTick()
  }
}

/** happy-dom does not decode pictures: this says how big the one in the editor is. */
async function decode(size = photo) {
  await settle()
  const image = document.querySelector('[data-slot="image-editor-stage"] img') as HTMLImageElement
  Object.defineProperty(image, 'naturalWidth', { value: size.width, configurable: true })
  Object.defineProperty(image, 'naturalHeight', { value: size.height, configurable: true })
  image.dispatchEvent(new Event('load'))
  await settle()
}

const jpeg = () => new File(['x'], 'me.jpg', { type: 'image/jpeg' })
const text = (slot: string) => document.querySelector(`[data-slot="${slot}"]`)?.textContent?.trim()
const press = async (selector: string) => {
  ;(document.querySelector(selector) as HTMLElement).click()
  await settle()
}

describe('OImageEditor', () => {
  async function editor(props: Record<string, unknown> = {}) {
    const wrapper = mount(OImageEditor, { props: { src: jpeg(), ...props }, attachTo: document.body })
    wrappers.push(wrapper)
    await decode()
    return wrapper
  }
  const key = async (name: string, shiftKey = false) => {
    const event = new KeyboardEvent('keydown', { key: name, shiftKey, bubbles: true, cancelable: true })
    document.querySelector('[data-slot="image-editor-frame"]')!.dispatchEvent(event)
    await settle()
    return event
  }

  it('opens the picture with everything framed, and says it is ready', async () => {
    const w = await editor()
    expect(w.emitted('ready')).toHaveLength(1)
    expect(text('image-editor-dimensions')).toBe('400 × 300 px')
    expect(w.vm.dirty).toBe(false)
  })

  it('applies a shape, turns with it locked, and resets', async () => {
    const w = await editor()
    const square = [...document.querySelectorAll('[data-slot="image-editor-ratios"] button')].find((b) => b.textContent?.trim() === '1:1') as HTMLElement
    square.click()
    await settle()
    expect(text('image-editor-dimensions')).toBe('300 × 300 px')
    expect(square.getAttribute('aria-pressed')).toBe('true')
    expect(w.vm.dirty).toBe(true)
    await press('[data-tool="reset"]')
    expect(text('image-editor-dimensions')).toBe('400 × 300 px')
    expect(w.vm.dirty).toBe(false)
    await press('[data-tool="rotate-right"]')
    expect(text('image-editor-dimensions')).toBe('300 × 400 px')
  })

  it('hides the shapes when the shape is fixed, and round means square', async () => {
    await editor({ shape: 'circle' })
    expect(document.querySelector('[data-slot="image-editor-ratios"]')).toBeNull()
    expect(text('image-editor-dimensions')).toBe('300 × 300 px')
    expect(document.querySelector('[data-slot="image-editor-frame"]')!.className).toContain('rounded-full')
  })

  it('resizes and zooms with the keyboard', async () => {
    await editor()
    expect((await key('ArrowLeft', true)).defaultPrevented).toBe(true)
    expect(text('image-editor-dimensions')).toBe('392 × 300 px')
    await key('+')
    expect(text('image-editor-dimensions')).toBe('356 × 273 px')
    expect((await key('Tab')).defaultPrevented).toBe(false)
  })

  it('shows the quality as a percentage', async () => {
    await editor()
    expect(document.querySelector('[data-slot="image-editor-settings"] output')!.textContent!.trim()).toBe('90%')
  })

  it('can hide the output settings', async () => {
    await editor({ hideOutputSettings: true })
    expect(document.querySelector('[data-slot="image-editor-settings"]')).toBeNull()
  })

  it('says so when the picture cannot be opened', async () => {
    const wrapper = mount(OImageEditor, { props: { src: jpeg() }, attachTo: document.body })
    wrappers.push(wrapper)
    await settle()
    document.querySelector('img')!.dispatchEvent(new Event('error'))
    await settle()
    expect(wrapper.text()).toContain('This image cannot be opened here')
    expect(wrapper.emitted('error')).toHaveLength(1)
  })

  it('releases its object URL', async () => {
    const w = await editor()
    w.unmount()
    wrappers.length = 0
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:picture-1')
  })
})

describe('OImageEditorDialog.edit()', () => {
  function dialog(props: Record<string, unknown> = {}) {
    const wrapper = mount(OImageEditorDialog, { props, attachTo: document.body })
    wrappers.push(wrapper)
    return wrapper.vm as unknown as { edit: (f: File, o?: { signal?: AbortSignal }) => Promise<File | null> }
  }
  const isShown = () => !!document.querySelector('[role="dialog"]')
  const closed = () => new Promise((resolve) => setTimeout(resolve, 120))

  it('gives back at once what cannot be edited', async () => {
    const api = dialog()
    const pdf = new File(['x'], 'a.pdf', { type: 'application/pdf' })
    expect(await api.edit(pdf)).toBe(pdf)
    expect(isShown()).toBe(false)
  })

  it('resolves with the untouched file on Save', async () => {
    const api = dialog()
    const file = jpeg()
    const answer = api.edit(file)
    await decode()
    await press('[data-slot="image-editor-save"]')
    expect(await answer).toBe(file)
    await closed()
    expect(isShown()).toBe(false)
  })

  it('cannot save before the picture is open', async () => {
    const api = dialog()
    void api.edit(jpeg())
    await settle()
    expect(document.querySelector('[data-slot="image-editor-save"]')!.hasAttribute('disabled')).toBe(true)
  })

  it('resolves with null on Cancel', async () => {
    const api = dialog()
    const answer = api.edit(jpeg())
    await decode()
    await press('[data-slot="image-editor-cancel"]')
    expect(await answer).toBeNull()
  })

  it('resolves with null and closes when the signal aborts', async () => {
    const api = dialog()
    const controller = new AbortController()
    const answer = api.edit(jpeg(), { signal: controller.signal })
    await settle()
    controller.abort()
    expect(await answer).toBeNull()
    await closed()
    expect(isShown()).toBe(false)
  })

  it('stays open for the next file of a batch, and cancels one that is replaced', async () => {
    const api = dialog()
    const first = api.edit(jpeg())
    await settle()
    const second = api.edit(jpeg())
    expect(await first).toBeNull()
    await decode()
    await press('[data-slot="image-editor-save"]')
    await second
    const third = api.edit(jpeg())
    await settle()
    await closed()
    expect(isShown()).toBe(true)
    void third
  })

  it('answers null if it goes away while waiting', async () => {
    const api = dialog()
    const answer = api.edit(jpeg())
    await settle()
    wrappers.splice(0).forEach((w) => w.unmount())
    expect(await answer).toBeNull()
  })

  it('works with v-model:open too', async () => {
    const wrapper = mount(OImageEditorDialog, { props: { open: true, src: jpeg() }, attachTo: document.body })
    wrappers.push(wrapper)
    await decode()
    await press('[data-slot="image-editor-save"]')
    expect(wrapper.emitted('save')).toHaveLength(1)
    expect(wrapper.emitted('update:open')![0]).toEqual([false])
  })
})
