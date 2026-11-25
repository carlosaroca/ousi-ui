import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import OFileUpload from '../src/components/file-upload/FileUpload.vue'
import type { FileUploadTransform } from '../src/components/file-upload/file-upload.types'

// As in layers.test: animations are out of scope, so the dialog mounts and unmounts with its v-if.
vi.mock('motion-v', async () => {
  const { defineComponent, h } = await import('vue')
  const Motion = defineComponent({
    name: 'Motion',
    props: { tag: { type: String, default: 'div' }, initial: null, animate: null, exit: null, transition: null },
    setup: (props, { slots }) => () => h(props.tag, null, slots.default?.()),
  })
  const AnimatePresence = defineComponent({
    name: 'AnimatePresence',
    setup: (_, { slots }) => () => slots.default?.(),
  })
  return { Motion, AnimatePresence }
})

let wrapper: VueWrapper<any> | undefined
let validity: string[]

beforeEach(() => {
  validity = []
  vi.spyOn(URL, 'createObjectURL').mockImplementation(() => 'blob:preview')
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  vi.spyOn(HTMLInputElement.prototype, 'setCustomValidity').mockImplementation((m) => void validity.push(m))
})
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

function render(props: Record<string, unknown> = {}, options: Record<string, any> = {}) {
  wrapper = mount(OFileUpload, { props, attachTo: document.body, ...options })
  return wrapper
}

function file(name: string, size: number, type = 'image/jpeg', lastModified = 1): File {
  const made = new File(['x'], name, { type, lastModified })
  Object.defineProperty(made, 'size', { value: size })
  return made
}
/** A transform that brings every file down to `size`, keeping its name. */
const shrinkTo = (size: number): FileUploadTransform => (f) => file(f.name, size, f.type, f.lastModified)

const settle = async () => {
  for (let i = 0; i < 3; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0))
    await nextTick()
  }
}

async function drop(w: VueWrapper<any>, files: File[]) {
  const event = new Event('drop', { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'dataTransfer', { value: { files, types: ['Files'] } })
  w.get('[data-slot="file-upload-zone"]').element.dispatchEvent(event)
  await settle()
}

const rows = (w: VueWrapper<any>) => w.findAll('[data-slot="file-upload-item"]')
const states = (w: VueWrapper<any>) => rows(w).map((r) => r.attributes('data-state'))
const status = (w: VueWrapper<any>, i = 0) => rows(w)[i].get('[data-slot="file-upload-item-status"]').text()
const rejected = (w: VueWrapper<any>) =>
  w.findAll('[data-slot="file-upload-rejections"] p').map((p) => p.text())
const added = (w: VueWrapper<any>): File[] => (w.emitted('update:modelValue')?.at(-1)?.[0] as File[]) ?? []
const click = async (w: VueWrapper<any>, slot: string, i = 0) => {
  await w.findAll(`[data-slot="${slot}"]`)[i].trigger('click')
  await settle()
}

const MB = 1024 * 1024
const KB = 1024

describe('transform', () => {
  it('checks the size on what comes out, not on what was picked', async () => {
    const w = render({ maxSize: 500 * KB, transform: shrinkTo(300 * KB) })
    await drop(w, [file('photo.jpg', 2 * MB)])
    expect(added(w).map((f) => f.size)).toEqual([300 * KB])
    expect(rejected(w)).toEqual([])
    expect(status(w)).toBe('300 KB · was 2 MB')
  })

  it('still checks the type before transforming', async () => {
    const transform = vi.fn(shrinkTo(1))
    const w = render({ accept: 'image/*', transform })
    await drop(w, [file('doc.pdf', 10, 'application/pdf')])
    expect(transform).not.toHaveBeenCalled()
    expect(rejected(w)).toEqual(['doc.pdf: this format is not allowed'])
  })

  it('shows the file as processing, out of v-model, until the transform ends', async () => {
    let finish!: (f: File) => void
    const onPendingChange = vi.fn()
    const w = render({ transform: () => new Promise<File>((r) => (finish = r)), onPendingChange })
    await drop(w, [file('a.jpg', 10)])
    expect(states(w)).toEqual(['processing'])
    expect(status(w)).toBe('Processing…')
    expect(w.find('[role="progressbar"]').exists()).toBe(true)
    expect(w.emitted('update:modelValue')).toBeUndefined()
    expect(onPendingChange).toHaveBeenLastCalledWith(1)
    // A native form cannot leave meanwhile.
    expect(validity.at(-1)).toBe('Finish with the pending files first')

    finish(file('a.jpg', 5))
    await settle()
    expect(states(w)).toEqual(['idle'])
    expect(onPendingChange).toHaveBeenLastCalledWith(0)
    expect(validity.at(-1)).toBe('')
  })

  it('runs one file at a time, in order', async () => {
    const calls: { name: string; finish: () => void }[] = []
    const w = render({
      multiple: true,
      transform: (f: File) => new Promise<File>((r) => calls.push({ name: f.name, finish: () => r(f) })),
    })
    await drop(w, [file('a.jpg', 1), file('b.jpg', 2)])
    expect(calls.map((c) => c.name)).toEqual(['a.jpg'])
    calls[0].finish()
    await settle()
    expect(calls.map((c) => c.name)).toEqual(['a.jpg', 'b.jpg'])
  })

  it('loses no file when many finish at once under a v-model', async () => {
    const files = ref<File[]>([])
    wrapper = mount(
      defineComponent(() => () =>
        h(OFileUpload, {
          multiple: true,
          modelValue: files.value,
          'onUpdate:modelValue': (next: File[]) => (files.value = next),
          transform: (f: File) => f,
        }),
      ),
      { attachTo: document.body },
    )
    await drop(wrapper, ['a', 'b', 'c', 'd', 'e'].map((n, i) => file(`${n}.jpg`, i + 1)))
    expect(files.value.map((f) => f.name)).toEqual(['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg', 'e.jpg'])
  })

  it('drops the file on null', async () => {
    const w = render({ transform: () => null })
    await drop(w, [file('a.jpg', 1)])
    expect(rows(w)).toHaveLength(0)
    expect(w.emitted('update:modelValue')).toBeUndefined()
    expect(rejected(w)).toEqual([])
  })

  it('never adds the original when the transform fails, and reports the cause', async () => {
    const cause = new Error('boom')
    const w = render({
      multiple: true,
      transform: (f: File) => {
        if (f.name === 'bad.jpg') throw cause
        return f
      },
    })
    await drop(w, [file('bad.jpg', 1), file('good.jpg', 2)])
    expect(added(w).map((f) => f.name)).toEqual(['good.jpg'])
    expect(rejected(w)).toEqual(['bad.jpg could not be processed'])
    expect(w.emitted('transformError')![0]).toEqual([cause, expect.objectContaining({ name: 'bad.jpg' })])
  })

  it('says why a file that is still too large was left out', async () => {
    const w = render({ multiple: true, maxSize: 500 * KB, transform: (f: File) => (f.name === 'a.jpg' ? file('a.jpg', 600 * KB) : f) })
    await drop(w, [file('a.jpg', 2 * MB), file('b.jpg', 900 * KB)])
    expect(rejected(w)).toEqual(['a.jpg could not be brought under 500 KB', 'b.jpg is larger than 500 KB'])
    expect(rows(w)).toHaveLength(0)
  })

  it('frees the queue when a file is discarded, even if its transform never answers', async () => {
    const signals: AbortSignal[] = []
    const w = render({
      multiple: true,
      transform: (f: File, { signal }: { signal: AbortSignal }) => {
        signals.push(signal)
        return f.name === 'stuck.jpg' ? new Promise<File>(() => {}) : f
      },
    })
    await drop(w, [file('stuck.jpg', 1), file('next.jpg', 2)])
    expect(rows(w)[0].get('[data-slot="file-upload-remove"]').attributes('aria-label')).toBe('Discard stuck.jpg')
    await click(w, 'file-upload-remove')
    expect(signals[0].aborted).toBe(true)
    expect(added(w).map((f) => f.name)).toEqual(['next.jpg'])
    expect(w.emitted('remove')).toBeUndefined()
  })

  it('aborts on unmount', async () => {
    let signal!: AbortSignal
    const w = render({ transform: (_: File, c: { signal: AbortSignal }) => ((signal = c.signal), new Promise<File>(() => {})) })
    await drop(w, [file('a.jpg', 1)])
    w.unmount()
    wrapper = undefined
    expect(signal.aborted).toBe(true)
  })

  it('counts pending files against maxFiles and as duplicates', async () => {
    const w = render({ multiple: true, maxFiles: 2, transform: () => new Promise<File>(() => {}) })
    await drop(w, [file('a.jpg', 1)])
    await drop(w, [file('a.jpg', 1)])
    expect(rejected(w)).toEqual(['a.jpg is already in the list'])
    await drop(w, [file('b.jpg', 2), file('c.jpg', 3)])
    expect(rejected(w)).toEqual(['You can add up to 2 files'])
    expect(rows(w)).toHaveLength(2)
  })

  it('recognises the same pick after it was transformed', async () => {
    const w = render({ multiple: true, transform: shrinkTo(1) })
    await drop(w, [file('a.jpg', 100)])
    await drop(w, [file('a.jpg', 100)])
    expect(rows(w)).toHaveLength(1)
    expect(rejected(w)).toEqual(['a.jpg is already in the list'])
  })

  it('keeps the file of a single field until the new one is in', async () => {
    const first = file('first.jpg', 1)
    let finish!: (f: File) => void
    const signals: AbortSignal[] = []
    const w = render({
      transform: (f: File, c: { signal: AbortSignal }) => {
        signals.push(c.signal)
        return f === first ? f : new Promise<File>((r) => (finish = r))
      },
    })
    await drop(w, [first])
    await drop(w, [file('second.jpg', 2)])
    expect(states(w)).toEqual(['idle', 'processing'])
    // A third pick replaces the one that waits.
    await drop(w, [file('third.jpg', 3)])
    expect(signals[1].aborted).toBe(true)
    finish(file('third.jpg', 3))
    await settle()
    expect(added(w).map((f) => f.name)).toEqual(['third.jpg'])
  })

  it('is emptied by a form reset', async () => {
    let signal!: AbortSignal
    wrapper = mount(
      defineComponent(() => () =>
        h('form', [h(OFileUpload, { transform: (_: File, c: { signal: AbortSignal }) => ((signal = c.signal), new Promise<File>(() => {})) })]),
      ),
      { attachTo: document.body },
    )
    await drop(wrapper, [file('a.jpg', 1)])
    ;(wrapper.element as HTMLFormElement).reset()
    await new Promise((r) => setTimeout(r, 10))
    await settle()
    expect(rows(wrapper)).toHaveLength(0)
    expect(signal.aborted).toBe(true)
  })
})

describe('confirm-transform', () => {
  const props = { confirmTransform: true, maxSize: 500 * KB, transform: shrinkTo(300 * KB) }
  const pick = file('photo.jpg', 400 * KB)

  it('waits for approval with the file out of v-model, and says so', async () => {
    const onPendingChange = vi.fn()
    const w = render({ ...props, onPendingChange })
    await drop(w, [pick])
    expect(states(w)).toEqual(['review'])
    expect(status(w)).toBe('400 KB → 300 KB−25%')
    expect(w.get('[data-slot="file-upload-saving"]').text()).toBe('−25%')
    expect(w.emitted('update:modelValue')).toBeUndefined()
    expect(onPendingChange).toHaveBeenLastCalledWith(1)
    expect(w.get('[data-slot="file-upload-announcer"]').text()).toBe('photo.jpg: waiting for your approval')
  })

  it('adds the new version when approved, in the same row', async () => {
    const w = render(props)
    await drop(w, [pick])
    const row = rows(w)[0].element
    await click(w, 'file-upload-accept')
    expect(added(w).map((f) => f.size)).toEqual([300 * KB])
    expect(states(w)).toEqual(['idle'])
    expect(rows(w)[0].element).toBe(row)
  })

  it('adds the original when the user keeps it', async () => {
    const w = render(props)
    await drop(w, [pick])
    await click(w, 'file-upload-keep')
    expect(added(w)[0]).toBe(pick)
    expect(status(w)).toBe('400 KB')
  })

  it('cannot keep an original over the limit, and says why', async () => {
    const w = render(props)
    await drop(w, [file('big.jpg', 2 * MB)])
    expect(w.find('[data-slot="file-upload-keep"]').exists()).toBe(false)
    expect(w.get('[data-slot="file-upload-review"]').text()).toContain('The original is over 500 KB')
  })

  it('discards without adding anything', async () => {
    const w = render(props)
    await drop(w, [pick])
    await click(w, 'file-upload-remove')
    expect(rows(w)).toHaveLength(0)
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })

  it('does not ask about a file the transform left as it was', async () => {
    const w = render({ confirmTransform: true, transform: (f: File) => f })
    await drop(w, [pick])
    expect(states(w)).toEqual(['idle'])
  })

  it('transforms the next file while one waits, and can approve them in any order', async () => {
    const w = render({ ...props, multiple: true })
    await drop(w, [file('a.jpg', 400 * KB), file('b.jpg', 450 * KB)])
    expect(states(w)).toEqual(['review', 'review'])
    await click(w, 'file-upload-accept', 1)
    await click(w, 'file-upload-accept', 0)
    expect(added(w).map((f) => f.name)).toEqual(['b.jpg', 'a.jpg'])
  })

  it('keeps focus in the list after a choice', async () => {
    const w = render(props)
    await drop(w, [pick])
    const accept = w.get('[data-slot="file-upload-accept"]')
    ;(accept.element as HTMLElement).focus()
    await accept.trigger('click')
    await settle()
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Remove photo.jpg')
  })

  it('lets the app draw its own approval buttons', async () => {
    let choose!: () => void
    const w = render(props, {
      slots: {
        review: (slot: { original: File; result: File; keepOriginal: () => void }) => {
          choose = slot.keepOriginal
          return h('b', `${slot.original.size} to ${slot.result.size}`)
        },
      },
    })
    await drop(w, [pick])
    expect(w.get('[data-slot="file-upload-review"] b').text()).toBe(`${400 * KB} to ${300 * KB}`)
    choose()
    await settle()
    expect(added(w)[0]).toBe(pick)
  })

  it('takes no decision while disabled', async () => {
    const w = render(props)
    await drop(w, [pick])
    await w.setProps({ disabled: true })
    expect(w.get('[data-slot="file-upload-accept"]').attributes('disabled')).toBeDefined()
  })

  it('shows what waits for approval even when the app draws its own list', async () => {
    const w = render({ ...props, hideFileList: true })
    await drop(w, [pick])
    expect(states(w)).toEqual(['review'])
    await click(w, 'file-upload-accept')
    expect(rows(w)).toHaveLength(0)
    expect(added(w)).toHaveLength(1)
  })

  it('offers a comparison only for images', async () => {
    const w = render({ confirmTransform: true, transform: shrinkTo(1) })
    await drop(w, [file('data.csv', 100, 'text/csv')])
    expect(w.find('[data-slot="file-upload-compare-open"]').exists()).toBe(false)
    expect(w.find('[data-slot="file-upload-accept"]').exists()).toBe(true)
  })

  it('compares both versions in a dialog and decides from it', async () => {
    const w = render(props)
    await drop(w, [pick])
    await click(w, 'file-upload-compare-open')
    const dialog = () => document.querySelector('[data-slot="file-upload-compare"]')?.closest('[role="dialog"]')
    expect(dialog()?.textContent).toContain('Compare photo.jpg')
    expect(dialog()?.textContent).toContain('New version · 300 KB')
    expect(dialog()?.textContent).toContain('Original · 400 KB')
    expect(document.querySelectorAll('[data-slot="file-upload-compare"] img')).toHaveLength(2)

    ;(document.querySelector('[data-slot="file-upload-compare-keep"]') as HTMLElement).click()
    await settle()
    expect(added(w)[0]).toBe(pick)
  })
})
