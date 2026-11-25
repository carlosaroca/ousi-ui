import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import OFileUpload from '../src/components/file-upload/FileUpload.vue'
import { useFileUpload, type FileUploadRequest } from '../src/components/file-upload/use-file-upload'

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

// Only the writing of the picture is faked (there is no canvas here): button, dialog, editor and list
// are the real ones. `written` decides what the next export weighs and is.
const written = { size: 1000, type: '' }
vi.mock('../src/components/image-editor/image-editor.render', async () => {
  const { isUntouched } = await import('../src/components/image-editor/image-editor.geometry')
  return {
    exportEdit: async (file: File, natural: any, state: any, output: any) => {
      // As the real one: with nothing to change the file goes out as it came, unless a quality is asked.
      if (isUntouched(state, natural) && output.quality === undefined) return { file, ...natural }
      const edited = new File(['edited'], file.name, { type: written.type || file.type, lastModified: 99 })
      Object.defineProperty(edited, 'size', { value: written.size })
      return { file: edited, ...natural }
    },
  }
})

let wrapper: VueWrapper<any> | undefined
beforeEach(() => {
  Object.assign(written, { size: 1000, type: '' })
  let n = 0
  vi.spyOn(URL, 'createObjectURL').mockImplementation(() => `blob:picture-${++n}`)
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
})
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  document.body.innerHTML = ''
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function render(props: Record<string, unknown> = {}) {
  wrapper = mount(OFileUpload, { props, attachTo: document.body })
  return wrapper
}

function file(name: string, size = 2000, type = 'image/jpeg'): File {
  const made = new File(['x'], name, { type, lastModified: 1 })
  Object.defineProperty(made, 'size', { value: size })
  return made
}

const settle = async () => {
  for (let i = 0; i < 4; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0))
    await nextTick()
  }
}
/** The dialog stays open a moment before it closes. */
const closed = () => new Promise((resolve) => setTimeout(resolve, 120))

async function drop(w: VueWrapper<any>, files: File[]) {
  const event = new Event('drop', { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'dataTransfer', { value: { files, types: ['Files'] } })
  w.get('[data-slot="file-upload-zone"]').element.dispatchEvent(event)
  await settle()
}

const all = (selector: string) => [...document.querySelectorAll<HTMLElement>(selector)]
const editButtons = () => all('[data-slot="file-upload-edit"]')
const rows = () => all('[data-slot="file-upload-item"]')
const names = () => all('[data-slot="file-upload-item-name"]').map((n) => n.title)
const status = (i = 0) => rows()[i].querySelector('[data-slot="file-upload-item-status"]')!.textContent!.trim()
const rejections = () => all('[data-slot="file-upload-rejections"] p').map((p) => p.textContent!.trim())
const dialog = () => document.querySelector('[role="dialog"]')
const press = async (selector: string) => {
  document.querySelector<HTMLElement>(selector)!.click()
  await settle()
}

/** happy-dom does not decode pictures: this says how big the one in the editor is. */
async function decode() {
  await settle()
  const image = document.querySelector('[data-slot="image-editor-stage"] img') as HTMLImageElement
  Object.defineProperty(image, 'naturalWidth', { value: 400, configurable: true })
  Object.defineProperty(image, 'naturalHeight', { value: 300, configurable: true })
  image.dispatchEvent(new Event('load'))
  await settle()
}

async function openEditor(i = 0) {
  editButtons()[i].click()
  await decode()
}
const rotate = () => press('[data-tool="rotate-right"]')
const save = async () => {
  await press('[data-slot="image-editor-save"]')
  await closed()
  await settle()
}

describe('the Edit button', () => {
  it('is there only when the field is editable', async () => {
    const w = render({ multiple: true })
    await drop(w, [file('a.jpg')])
    expect(editButtons()).toHaveLength(0)
    await w.setProps({ editable: true })
    await settle()
    expect(editButtons().map((b) => b.getAttribute('aria-label'))).toEqual(['Edit a.jpg'])
  })

  it('is offered for images the editor can rewrite', async () => {
    const w = render({ multiple: true, editable: true })
    await drop(w, [
      file('a.jpg'),
      file('b.png', 1, 'image/png'),
      file('c.pdf', 2, 'application/pdf'),
      file('d.gif', 3, 'image/gif'),
      file('e.svg', 4, 'image/svg+xml'),
    ])
    expect(editButtons().map((b) => b.getAttribute('aria-label'))).toEqual(['Edit a.jpg', 'Edit b.png'])
  })

  it('is not offered for an animation', async () => {
    const chunk = (name: string) => new Uint8Array([0, 0, 0, 0, ...[...name].map((c) => c.charCodeAt(0)), 0, 0, 0, 0])
    const animation = new File([new Uint8Array(8), chunk('acTL'), chunk('IDAT')], 'moving.png', { type: 'image/png' })
    const w = render({ editable: true })
    await drop(w, [animation])
    await new Promise((r) => setTimeout(r, 20))
    await settle()
    expect(editButtons()).toHaveLength(0)
  })

  it('waits while a file is uploading, and comes back with an error', async () => {
    const one = file('a.jpg')
    const w = render({ editable: true, modelValue: [one], fileStatus: () => ({ progress: 10 }) })
    await settle()
    expect(editButtons()).toHaveLength(0)
    await w.setProps({ fileStatus: () => ({ error: 'Too big' }) })
    await settle()
    expect(editButtons()).toHaveLength(1)
  })

  it('does nothing while disabled', async () => {
    render({ editable: true, disabled: true, modelValue: [file('a.jpg')] })
    await settle()
    expect(editButtons()[0].hasAttribute('disabled')).toBe(true)
  })
})

describe('editing a file in the list', () => {
  async function two(props: Record<string, unknown> = {}) {
    const w = render({ multiple: true, editable: true, ...props })
    await drop(w, [file('first.jpg', 2000), file('second.jpg', 3000)])
    return w
  }

  it('puts the result where the old one was, in the same row', async () => {
    const w = await two()
    const previous = (w.emitted('update:modelValue')!.at(-1)![0] as File[])[0]
    const row = rows()[0]
    await openEditor(0)
    await rotate()
    await save()

    const list = w.emitted('update:modelValue')!.at(-1)![0] as File[]
    expect(list.map((f) => f.name)).toEqual(['first.jpg', 'second.jpg'])
    expect(list[0].size).toBe(1000)
    expect(rows()[0]).toBe(row)
    expect(status(0)).toBe('1,000 B · was 2 KB')
    // The old one leaves like a removed file, and `edited` pairs both.
    expect((w.emitted('remove')![0][0] as File).size).toBe(previous.size)
    const [next, before] = w.emitted('edited')![0] as File[]
    expect([next.size, before.size]).toEqual([1000, 2000])
    expect(dialog()).toBeNull()
  })

  it('changes nothing on Cancel, or on a Save without changes', async () => {
    // A quality setting would rewrite even an untouched picture: Save must still leave it alone.
    const w = await two({ editorOptions: { quality: 0.5 } })
    const updates = w.emitted('update:modelValue')!.length
    await openEditor(0)
    await rotate()
    await press('[data-slot="image-editor-cancel"]')
    await closed()
    await openEditor(0)
    await save()
    expect(w.emitted('update:modelValue')).toHaveLength(updates)
    expect(w.emitted('remove')).toBeUndefined()
    expect(w.emitted('edited')).toBeUndefined()
  })

  it('keeps the old one when the result breaks the size limit or the accepted types', async () => {
    const w = await two({ maxSize: 5000, accept: 'image/jpeg' })
    written.size = 9000
    await openEditor(0)
    await rotate()
    await save()
    expect(rejections()).toEqual(['first.jpg could not be brought under 4.9 KB'])

    Object.assign(written, { size: 100, type: 'image/webp' })
    await openEditor(0)
    await rotate()
    await save()
    expect(rejections()).toEqual(['first.jpg: this format is not allowed'])
    expect(w.emitted('edited')).toBeUndefined()
    expect(status(0)).toBe('2 KB')
  })

  it('offers the original after an edit, and brings it back', async () => {
    const w = await two()
    const original = (w.emitted('update:modelValue')!.at(-1)![0] as File[])[0]
    await openEditor(0)
    expect(document.querySelector('[data-slot="image-editor-original"]')).toBeNull()
    await rotate()
    await save()

    await openEditor(0)
    document.querySelector<HTMLElement>('[data-slot="image-editor-original"]')!.click()
    await decode()
    expect(document.querySelector('[data-slot="image-editor-original"]')).toBeNull()
    await save()
    const list = w.emitted('update:modelValue')!.at(-1)![0] as File[]
    expect(list[0].size).toBe(original.size)
    expect(list[0].lastModified).toBe(1)
    expect(status(0)).toBe('2 KB')
  })

  it('offers the picked file after a transform changed it', async () => {
    const w = render({ editable: true, transform: () => file('a.jpg', 500) })
    await drop(w, [file('a.jpg', 2000)])
    await openEditor(0)
    expect(document.querySelector('[data-slot="image-editor-original"]')).not.toBeNull()
  })

  it('still knows the same pick after editing it', async () => {
    const w = await two()
    await openEditor(0)
    await rotate()
    await save()
    await drop(w, [file('first.jpg', 2000)])
    expect(rejections()).toEqual(['first.jpg is already in the list'])
  })

  it('passes the limit of the field to the editor, and the options over it', async () => {
    await two({ maxSize: 5000, editorOptions: { shape: 'circle', hideOutputSettings: true, title: 'Frame it' } })
    await openEditor(0)
    expect(dialog()!.textContent).toContain('Frame it')
    expect(document.querySelector('[data-slot="image-editor-settings"]')).toBeNull()
    expect(document.querySelector('[data-slot="image-editor-ratios"]')).toBeNull()
  })

  it('closes the editor if the form is reset, and ignores a file the app took away', async () => {
    const files = ref([file('a.jpg')])
    const edited = vi.fn()
    wrapper = mount(
      defineComponent(() => () =>
        h(OFileUpload, {
          editable: true,
          modelValue: files.value,
          'onUpdate:modelValue': (next: File[]) => (files.value = next),
          onEdited: edited,
        }),
      ),
      { attachTo: document.body },
    )
    await settle()
    await openEditor(0)
    await rotate()
    files.value = []
    await settle()
    await closed()
    await settle()
    expect(dialog()).toBeNull()
    expect(edited).not.toHaveBeenCalled()
    expect(files.value).toEqual([])
  })

  it('does not take a paste while the editor is open', async () => {
    await two({ paste: 'page' })
    await openEditor(0)
    const event = new Event('paste', { bubbles: true, cancelable: true })
    Object.defineProperty(event, 'clipboardData', { value: { files: [file('pasted.png', 5, 'image/png')], types: ['Files'] } })
    document.body.dispatchEvent(event)
    await settle()
    expect(names()).toEqual(['first.jpg', 'second.jpg'])
  })

  it('uploads the edited file and aborts the old one with useFileUpload', async () => {
    const requests: (FileUploadRequest & { file: File; resolve: () => void })[] = []
    const upload = (file: File, request: FileUploadRequest) =>
      new Promise<void>((resolve) => requests.push({ ...request, file, resolve }))
    wrapper = mount(
      defineComponent(() => {
        const { files, statusOf } = useFileUpload(upload)
        return () =>
          h(OFileUpload, {
            editable: true,
            modelValue: files.value,
            'onUpdate:modelValue': (next: File[]) => (files.value = next),
            fileStatus: statusOf,
          })
      }),
      { attachTo: document.body },
    )
    await drop(wrapper, [file('a.jpg', 2000)])
    requests[0].resolve()
    await settle()
    await openEditor(0)
    await rotate()
    await save()
    expect(requests.map((r) => r.file.size)).toEqual([2000, 1000])
    expect(rows()[0].dataset.state).toBe('uploading')
  })
})

describe('editing an uploaded image', () => {
  const stored = { id: 1, name: 'saved.jpg', size: 4000, url: '/files/1' }
  const serves = (response: Partial<Response> | Error) =>
    vi.stubGlobal('fetch', vi.fn(async () => {
      if (response instanceof Error) throw response
      return { ok: true, status: 200, blob: async () => new Blob(['x'], { type: 'image/jpeg' }), ...response }
    }))

  it('is offered only with a url, an image and someone listening', async () => {
    render({ editable: true, multiple: true, uploadedFiles: [stored] })
    await settle()
    expect(editButtons()).toHaveLength(0)
    wrapper!.unmount()

    render({
      editable: true,
      multiple: true,
      onEditUploaded: () => {},
      uploadedFiles: [
        stored,
        { name: 'thumb-only.jpg', previewUrl: '/t.jpg' },
        { name: 'doc.pdf', url: '/files/2' },
        { name: 'bad.jpg', url: 'javascript:alert(1)' },
        { name: 'typed', type: 'image/png', url: '/files/3' },
      ],
    })
    await settle()
    expect(editButtons().map((b) => b.getAttribute('aria-label'))).toEqual(['Edit saved.jpg', 'Edit typed'])
  })

  it('hands over the edited file and leaves the list to the app', async () => {
    serves({})
    const onEditUploaded = vi.fn()
    const w = render({ editable: true, uploadedFiles: [stored], onEditUploaded })
    await settle()
    await openEditor(0)
    expect(fetch).toHaveBeenCalledWith('/files/1', expect.objectContaining({ signal: expect.any(AbortSignal) }))
    await rotate()
    await save()
    expect(onEditUploaded).toHaveBeenCalledTimes(1)
    expect(onEditUploaded.mock.calls[0][0]).toEqual(stored)
    expect(onEditUploaded.mock.calls[0][1].name).toBe('saved.jpg')
    for (const event of ['update:uploadedFiles', 'removeUploaded', 'update:modelValue', 'remove']) {
      expect(w.emitted(event)).toBeUndefined()
    }
    expect(names()).toEqual(['saved.jpg'])
  })

  it('hands over nothing for a Save without changes', async () => {
    serves({})
    const onEditUploaded = vi.fn()
    render({ editable: true, uploadedFiles: [stored], onEditUploaded })
    await settle()
    await openEditor(0)
    await save()
    expect(onEditUploaded).not.toHaveBeenCalled()
  })

  it.each([
    ['the request fails', new TypeError('CORS')],
    ['the server says no', { ok: false, status: 404 }],
  ])('says it could not be opened when %s', async (_, response) => {
    serves(response as Error)
    render({ editable: true, uploadedFiles: [stored], onEditUploaded: () => {} })
    await settle()
    editButtons()[0].click()
    await settle()
    expect(dialog()).toBeNull()
    expect(rejections()).toEqual(['saved.jpg could not be opened for editing'])
  })
})
