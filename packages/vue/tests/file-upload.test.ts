import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, reactive, ref } from 'vue'
import OFileUpload from '../src/components/file-upload/FileUpload.vue'
import OForm from '../src/components/form/Form.vue'
import { useOusiConfig } from '../src/config/use-ousi-config'
import {
  fileKind,
  formatFileSize,
  formatTransfer,
  safeUrl,
  splitName,
  stateOf,
} from '../src/components/file-upload/file-upload.utils'

let wrapper: VueWrapper<any> | undefined
let created: string[]
let revoked: string[]

beforeEach(() => {
  created = []
  revoked = []
  vi.spyOn(URL, 'createObjectURL').mockImplementation(() => {
    const url = `blob:preview-${created.length + 1}`
    created.push(url)
    return url
  })
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation((url) => void revoked.push(url))
})
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  useOusiConfig().locale.value = 'en-US'
  vi.restoreAllMocks()
})

function render(props: Record<string, unknown> = {}, options: Record<string, any> = {}) {
  wrapper = mount(OFileUpload, { props, attachTo: document.body, ...options })
  return wrapper
}

/** A file that reports `size` bytes without holding them. */
function file(name: string, size = 1000, type = ''): File {
  const made = new File(['x'], name, { type })
  Object.defineProperty(made, 'size', { value: size })
  return made
}

function drag(target: Element, type: string, files: File[] = [], types = ['Files']) {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'dataTransfer', { value: { files, types, dropEffect: 'copy' } })
  target.dispatchEvent(event)
  return event
}

async function drop(w: VueWrapper<any>, files: File[]) {
  drag(w.get('[data-slot="file-upload-zone"]').element, 'drop', files)
  await nextTick()
}

/** The render that follows a change, and the one the announcement asks for. */
async function flush() {
  await nextTick()
  await nextTick()
}

const rows = (w: VueWrapper<any>) => w.findAll('[data-slot="file-upload-item"]')
const names = (w: VueWrapper<any>) =>
  w.findAll('[data-slot="file-upload-item-name"]').map((n) => n.attributes('title'))
const statusText = (w: VueWrapper<any>, i = 0) =>
  rows(w)[i].get('[data-slot="file-upload-item-status"]').text()

describe('rejected files', () => {
  it('shows the reason of every file rejected in one drop, not just the last', async () => {
    const w = render({ multiple: true, accept: '.pdf', maxSize: 2048 })
    await drop(w, [file('a.png'), file('b.pdf', 9000), file('c.pdf')])
    const messages = w.get('[data-slot="file-upload-rejections"]').findAll('p').map((p) => p.text())
    expect(messages).toEqual(['a.png: this format is not allowed', 'b.pdf is larger than 2 KB'])
    expect(names(w)).toEqual(['c.pdf'])
  })

  it('clears them on the next pick, and leaves them to an app that listens to `error`', async () => {
    const w = render({ accept: '.pdf' })
    await drop(w, [file('a.png')])
    await drop(w, [file('b.pdf')])
    expect(w.find('[data-slot="file-upload-rejections"]').exists()).toBe(false)

    w.unmount()
    const onError = vi.fn()
    const other = render({ accept: '.pdf', onError })
    await drop(other, [file('a.png')])
    expect(onError).toHaveBeenCalledWith('a.png: this format is not allowed')
    expect(other.find('[data-slot="file-upload-rejections"]').exists()).toBe(false)
  })

  it('counts uploaded files against maxFiles', async () => {
    const w = render({ multiple: true, maxFiles: 3, uploadedFiles: [{ name: 'old.pdf' }] })
    await drop(w, [file('a.pdf'), file('b.pdf'), file('c.pdf')])
    expect(names(w)).toEqual(['old.pdf', 'a.pdf', 'b.pdf'])
    expect(w.get('[data-slot="file-upload-rejections"]').text()).toBe('You can add up to 3 files')
  })
})

describe('upload status', () => {
  const one = file('report.pdf', 4.6 * 1024 * 1024)
  const withStatus = (status: object | undefined) =>
    render({ modelValue: [one], fileStatus: () => status })

  it('can cancel a file while it uploads', async () => {
    const onRemove = vi.fn()
    const w = render({ fileStatus: () => ({ progress: 40 }), onRemove })
    await drop(w, [one])
    const cancel = w.get('[data-slot="file-upload-remove"]')
    expect(cancel.attributes('aria-label')).toBe('Cancel the upload of report.pdf')
    await cancel.trigger('click')
    expect(onRemove).toHaveBeenCalledWith(one)
    expect(rows(w)).toHaveLength(0)
  })

  it('shows how much has been sent and a progress bar', () => {
    const w = withStatus({ progress: 64 })
    expect(statusText(w)).toBe('2.9 / 4.6 MB · 64%')
    expect(w.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('64')
  })

  it('shows a bar without a value when the progress is unknown', () => {
    const w = withStatus({ state: 'uploading' })
    expect(statusText(w)).toBe('Uploading…')
    expect(w.get('[role="progressbar"]').attributes('aria-valuenow')).toBeUndefined()
  })

  it('does not call a file done while it is at 99.6%', () => {
    expect(statusText(withStatus({ progress: 99.6 }))).toContain('99%')
  })

  it('shows the size when waiting, and says so when done', () => {
    expect(statusText(withStatus(undefined))).toBe('4.6 MB')
    wrapper!.unmount()
    const w = withStatus({ progress: 100 })
    expect(rows(w)[0].attributes('data-state')).toBe('done')
    expect(statusText(w)).toContain('File uploaded')
    expect(w.find('[role="progressbar"]').exists()).toBe(false)
  })

  it('shows the error with a retry button', async () => {
    const onRetry = vi.fn()
    const w = render({ modelValue: [one], fileStatus: () => ({ error: 'Connection lost' }), onRetry })
    expect(statusText(w)).toBe('Connection lost')
    const retry = w.get('[data-slot="file-upload-retry"]')
    expect(retry.attributes('aria-label')).toBe('Retry: report.pdf')
    await retry.trigger('click')
    expect(onRetry).toHaveBeenCalledWith(one)
  })

  it('has a default text for an error without one', () => {
    expect(statusText(withStatus({ state: 'error' }))).toBe('Upload failed')
  })

  it('writes numbers in the locale of the app', () => {
    useOusiConfig().locale.value = 'es-ES'
    const text = statusText(withStatus({ progress: 64 })).replace(/\s/g, ' ')
    expect(text).toBe('2,9 / 4,6 MB · 64 %')
  })
})

describe('forms', () => {
  it('passes name, capture and required to the native input', () => {
    const w = render({ name: 'receipt', capture: 'environment', required: true, accept: 'image/*' })
    const input = w.get('input[type="file"]')
    expect(input.attributes('name')).toBe('receipt')
    expect(input.attributes('capture')).toBe('environment')
    expect(input.attributes('required')).toBeDefined()
    expect(input.attributes('aria-required')).toBe('true')
    expect(w.element.getAttribute('name')).toBeNull()
  })

  it('does not require a new file when one is already uploaded', () => {
    const w = render({ required: true, uploadedFiles: [{ name: 'signed.pdf' }] })
    const input = w.get('input')
    expect(input.attributes('required')).toBeUndefined()
    expect(input.attributes('aria-required')).toBe('true')
  })

  it('names the input after the label and the text of the area, and describes it', () => {
    const w = render({ label: 'Contract', accept: '.pdf', description: 'The signed copy' })
    const input = w.get('input')
    const text = (attribute: string) =>
      input.attributes(attribute)!.split(' ').map((id) => document.getElementById(id)!.textContent!.trim())
    expect(text('aria-labelledby')).toEqual(['Contract', 'Drag and drop here or choose a file'])
    expect(text('aria-describedby')).toEqual(['Formats: PDF', 'The signed copy'])
  })

  it('shows errorMessage in place of the description and marks the input invalid', () => {
    const w = render({ description: 'Help', errorMessage: 'A contract is required' })
    expect(w.text()).toContain('A contract is required')
    expect(w.text()).not.toContain('Help')
    expect(w.get('input').attributes('aria-invalid')).toBe('true')
    expect(w.get('[data-slot="file-upload-dropzone"]').classes()).toContain('border-ousi-danger')
  })

  it('takes its error from the form by name', () => {
    wrapper = mount(
      defineComponent(() => () =>
        h(OForm, { validationErrors: { contract: ['Attach the signed contract'] } }, () =>
          h(OFileUpload, { name: 'contract' }),
        ),
      ),
    )
    expect(wrapper.text()).toContain('Attach the signed contract')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
  })

  it('keeps every selected file in the input, so a native form sends them', async () => {
    const w = render({ multiple: true, name: 'files' })
    const input = w.get('input').element as HTMLInputElement
    await drop(w, [file('a.pdf')])
    await drop(w, [file('b.pdf')])
    expect(Array.from(input.files ?? [], (f) => f.name)).toEqual(['a.pdf', 'b.pdf'])
    await w.findAll('[data-slot="file-upload-remove"]')[0].trigger('click')
    expect(Array.from(input.files ?? [], (f) => f.name)).toEqual(['b.pdf'])
  })
})

describe('uploaded files', () => {
  const saved = [
    { id: 1, name: 'signed.pdf', size: 305 * 1024, url: '/files/1' },
    { id: 2, name: 'photo.png' },
  ]

  it('lists them as done, linking the ones with a url', () => {
    const w = render({ multiple: true, uploadedFiles: saved })
    expect(names(w)).toEqual(['signed.pdf', 'photo.png'])
    expect(rows(w)[0].attributes('data-state')).toBe('done')
    expect(statusText(w)).toContain('305 KB')
    const link = w.get('a[data-slot="file-upload-item-name"]')
    expect(link.attributes('href')).toBe('/files/1')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  })

  it('reports a removal and updates the v-model', async () => {
    const w = render({ multiple: true, uploadedFiles: saved })
    await w.findAll('[data-slot="file-upload-remove"]')[0].trigger('click')
    expect(w.emitted('removeUploaded')![0]).toEqual([saved[0]])
    expect(w.emitted('update:uploadedFiles')![0]).toEqual([[saved[1]]])
    expect(w.emitted('remove')).toBeUndefined()
  })

  it('is replaced by a new file in a single file field, and comes back without it', async () => {
    const w = render({ uploadedFiles: [saved[0]] })
    await drop(w, [file('new.pdf')])
    expect(names(w)).toEqual(['new.pdf'])
    await w.get('[data-slot="file-upload-remove"]').trigger('click')
    expect(names(w)).toEqual(['signed.pdf'])
    expect(w.emitted('removeUploaded')).toBeUndefined()
  })

  it('turns names into buttons when the app listens to `open`', async () => {
    const onOpen = vi.fn()
    const w = render({ multiple: true, uploadedFiles: saved, onOpen, disabled: true })
    await w.findAll('button[data-slot="file-upload-item-name"]')[1].trigger('click')
    expect(onOpen).toHaveBeenCalledWith(saved[1])
  })

  it('never links a script url', () => {
    const w = render({ uploadedFiles: [{ name: 'a.pdf', url: 'javascript:alert(1)' }] })
    expect(w.find('a').exists()).toBe(false)
  })
})

describe('previews', () => {
  it('shows one for an image and releases it when the file leaves', async () => {
    const w = render({ multiple: true })
    await drop(w, [file('a.png', 10, 'image/png'), file('b.pdf', 10, 'application/pdf')])
    await nextTick()
    expect(w.findAll('[data-slot="file-upload-item-icon"] img')).toHaveLength(1)
    await w.findAll('[data-slot="file-upload-remove"]')[0].trigger('click')
    await nextTick()
    expect(revoked).toEqual(created)
  })

  it('releases them on unmount', async () => {
    const w = render({ modelValue: [file('a.jpg', 10, 'image/jpeg')] })
    await nextTick()
    w.unmount()
    wrapper = undefined
    expect(created).toHaveLength(1)
    expect(revoked).toEqual(created)
  })

  it('goes back to the icon when the image cannot be drawn', async () => {
    const w = render({ uploadedFiles: [{ name: 'a.png', previewUrl: '/broken.png' }] })
    await w.get('img').trigger('error')
    expect(w.find('img').exists()).toBe(false)
    expect(w.find('svg[data-kind="image"]').exists()).toBe(true)
  })

  const image = () => file('a.png', 10, 'image/png')
  const stored = { name: 'saved.png', previewUrl: '/saved.png' }

  it('shows the whole image by default, for new and uploaded files', async () => {
    const w = render({ multiple: true, modelValue: [image()], uploadedFiles: [stored] })
    await nextTick()
    const images = w.findAll('[data-slot="file-upload-item-icon"] img')
    expect(images).toHaveLength(2)
    for (const img of images) expect(img.classes()).toContain('object-contain')
  })

  it('fills the box with preview="cover"', async () => {
    const w = render({ preview: 'cover', uploadedFiles: [stored] })
    expect(w.get('img').classes()).toContain('object-cover')
  })

  it('shows only icons with preview="none", uploaded previewUrl included', async () => {
    const w = render({ preview: 'none', multiple: true, modelValue: [image()], uploadedFiles: [stored] })
    await nextTick()
    expect(created).toHaveLength(0)
    expect(w.find('img').exists()).toBe(false)
    expect(w.findAll('svg[data-kind="image"]').length).toBeGreaterThanOrEqual(2)
  })
})

describe('long names', () => {
  it('splits them so the extension stays in sight, and still reads the whole name', () => {
    const name = 'Quarterly results of the whole company.pdf'
    const w = render({ uploadedFiles: [{ name }] })
    const label = w.get('[data-slot="file-upload-item-name"]')
    expect(label.get('.sr-only').text()).toBe(name)
    const halves = label.findAll('[aria-hidden="true"] > span').map((s) => s.element.textContent)
    expect(halves.join('')).toBe(name)
    expect(halves[1]).toBe('pany.pdf')
  })

  it('splits only what is long enough, without breaking a character', () => {
    expect(splitName('report.pdf')).toEqual(['report.pdf', ''])
    expect(splitName('Floor plan.png')).toEqual(['Floor ', 'plan.png'])
    expect(splitName('a-name-without-extension')).toEqual(['a-name-without-exten', 'sion'])
    expect(splitName('Minutes v1.2 of the board')).toEqual(['Minutes v1.2 of the b', 'oard'])
    // The family emoji is five code points and one character: it moves whole to the kept end.
    expect(splitName('Holiday photos 👨‍👩‍👧 ok.jpg')).toEqual(['Holiday photos ', '👨‍👩‍👧 ok.jpg'])
    expect(splitName('Informe de gestio\u0301n.pdf').join('')).toBe('Informe de gestio\u0301n.pdf')
    // The accent travels with its letter.
    expect(splitName('Informe de la acció\u0301n.pdf')[1].startsWith('\u0301')).toBe(false)
  })
})

describe('duplicates and limits', () => {
  const same = () => {
    const made = file('a.pdf', 10)
    Object.defineProperty(made, 'lastModified', { value: 1 })
    return made
  }

  it('does not add the same file twice, in one drop or in two', async () => {
    const w = render({ multiple: true })
    await drop(w, [same(), same()])
    expect(names(w)).toEqual(['a.pdf'])
    await drop(w, [same()])
    expect(names(w)).toEqual(['a.pdf'])
    expect(w.get('[data-slot="file-upload-rejections"]').text()).toBe('a.pdf is already in the list')
  })

  it('adds a file that only shares the name', async () => {
    const w = render({ multiple: true })
    await drop(w, [same()])
    await drop(w, [file('a.pdf', 20)])
    expect(rows(w)).toHaveLength(2)
  })

  it('names the file limit in the hint', () => {
    const hint = (props: object) => {
      wrapper?.unmount()
      return render(props).find('[data-slot="file-upload-hint"]')
    }
    expect(hint({ multiple: true, maxFiles: 5, accept: '.pdf' }).text()).toBe('Formats: PDF · 5 files at most')
    expect(hint({ maxFiles: 5 }).exists()).toBe(false)
  })
})

describe('announcements', () => {
  it('tells a screen reader when an upload ends or fails', async () => {
    const status = reactive(new Map<File, object>())
    const [one, two] = [file('one.pdf'), file('two.pdf')]
    status.set(one, { progress: 10 })
    status.set(two, { progress: 10 })
    const w = render({ multiple: true, modelValue: [one, two], fileStatus: (f: File) => status.get(f) })
    const said = () => w.get('[data-slot="file-upload-announcer"]').text()
    expect(said()).toBe('')

    status.set(one, { progress: 100 })
    await flush()
    expect(said()).toBe('one.pdf: File uploaded')

    status.set(two, { error: 'Connection lost' })
    await flush()
    expect(said()).toBe('two.pdf: Connection lost')

    // A retry empties it, so the same failure is read again.
    status.set(two, { progress: 0 })
    await flush()
    expect(said()).toBe('')
  })
})

describe('form reset', () => {
  function inForm(props: Record<string, unknown> = {}) {
    wrapper = mount(
      defineComponent(() => () => h('form', [h(OFileUpload, { multiple: true, name: 'files', ...props })])),
      { attachTo: document.body },
    )
    return wrapper
  }
  const form = (w: VueWrapper<any>) => w.element as HTMLFormElement
  const later = () => new Promise((resolve) => setTimeout(resolve, 10))

  it('empties the list and reports each file, so uploads can be aborted', async () => {
    const onRemove = vi.fn()
    const w = inForm({ onRemove })
    await drop(w, [file('a.pdf'), file('b.pdf')])
    form(w).reset()
    await later()
    expect(rows(w)).toHaveLength(0)
    expect(onRemove).toHaveBeenCalledTimes(2)
  })

  it('keeps the files when the app cancels the reset', async () => {
    const w = inForm()
    await drop(w, [file('a.pdf')])
    form(w).addEventListener('reset', (event) => event.preventDefault())
    form(w).reset()
    await later()
    expect(rows(w)).toHaveLength(1)
  })
})

describe('paste', () => {
  function paste(files: File[], target: Element = document.body, types = ['Files']) {
    const event = new Event('paste', { bubbles: true, cancelable: true })
    Object.defineProperty(event, 'clipboardData', { value: { files, types } })
    target.dispatchEvent(event)
    return event
  }
  const shot = () => file('image.png', 10, 'image/png')
  const focusIn = (w: VueWrapper<any>) => (w.get('input').element as HTMLInputElement).focus()

  it('adds the files while focus is inside', async () => {
    const w = render({ multiple: true })
    focusIn(w)
    expect(paste([shot()]).defaultPrevented).toBe(true)
    await nextTick()
    expect(names(w)).toEqual(['image.png'])
  })

  it('leaves a paste elsewhere alone, unless paste="page"', async () => {
    const w = render()
    expect(paste([shot()]).defaultPrevented).toBe(false)
    await nextTick()
    expect(rows(w)).toHaveLength(0)
    await w.setProps({ paste: 'page' })
    paste([shot()])
    await nextTick()
    expect(rows(w)).toHaveLength(1)
  })

  it('gives one paste to one uploader', async () => {
    const first = mount(OFileUpload, { props: { paste: 'page' }, attachTo: document.body })
    const second = render({ paste: 'page' })
    paste([shot()])
    await nextTick()
    expect(rows(first).length + rows(second).length).toBe(1)
    first.unmount()
  })

  // happy-dom has no pointer, so the hovered uploader is stated by hand.
  function hover(w: VueWrapper<any>) {
    const element = w.element as HTMLElement
    const matches = element.matches.bind(element)
    vi.spyOn(element, 'matches').mockImplementation((s) => (s === ':hover' ? true : matches(s)))
  }

  it.each([
    ['the pointer wins over focus left behind in an earlier one', 'hover'],
    ['focus wins over paste="page"', 'focus'],
  ])('%s', async (_, how) => {
    // The one that must lose is created first, so it hears the paste first.
    const loser = mount(OFileUpload, { props: { paste: how === 'focus' ? 'page' : 'self' }, attachTo: document.body })
    const winner = render()
    if (how === 'hover') {
      focusIn(loser)
      hover(winner)
    } else focusIn(winner)
    paste([shot()])
    await nextTick()
    expect(rows(winner)).toHaveLength(1)
    expect(rows(loser)).toHaveLength(0)
    loser.unmount()
  })

  it('lets text win in a text field, but takes a screenshot', async () => {
    const field = document.body.appendChild(document.createElement('textarea'))
    const w = render({ paste: 'page', multiple: true })
    expect(paste([shot()], field, ['text/plain', 'Files']).defaultPrevented).toBe(false)
    expect(paste([shot()], field).defaultPrevented).toBe(true)
    await nextTick()
    expect(rows(w)).toHaveLength(1)
    field.remove()
  })

  it.each([{ paste: 'none' }, { disabled: true }])('takes nothing with %o', async (props) => {
    const w = render(props)
    focusIn(w)
    expect(paste([shot()]).defaultPrevented).toBe(false)
    await nextTick()
    expect(rows(w)).toHaveLength(0)
  })

  it('checks type and size like a drop, and stops listening on unmount', async () => {
    const w = render({ paste: 'page', accept: '.pdf' })
    paste([shot()])
    await nextTick()
    expect(w.get('[data-slot="file-upload-rejections"]').text()).toContain('image.png')
    w.unmount()
    wrapper = undefined
    expect(paste([shot()]).defaultPrevented).toBe(false)
  })
})

describe('drag and drop', () => {
  it('ignores dragged text', async () => {
    const w = render()
    const zone = w.get('[data-slot="file-upload-zone"]')
    drag(zone.element, 'dragenter', [], ['text/plain'])
    await nextTick()
    expect(zone.attributes('data-dragging')).toBeUndefined()
    drag(zone.element, 'dragenter')
    await nextTick()
    expect(zone.attributes('data-dragging')).toBe('')
  })

  it('takes nothing while disabled, and keeps the browser from opening the file', async () => {
    const w = render({ disabled: true })
    const zone = w.get('[data-slot="file-upload-zone"]').element
    expect(drag(zone, 'dragover').defaultPrevented).toBe(true)
    expect(drag(zone, 'drop', [file('a.pdf')]).defaultPrevented).toBe(true)
    await nextTick()
    expect(rows(w)).toHaveLength(0)
  })
})

describe('variants and customization', () => {
  it.each(['area', 'inline', 'button'])('%s opens the picker through a label of the input', (variant) => {
    const w = render({ variant })
    const input = w.get('input[type="file"]')
    expect(w.get(`label[for="${input.attributes('id')}"]`).exists()).toBe(true)
    expect(w.findAll('input')).toHaveLength(1)
  })

  it('lets the app replace the text, the hint and the row icon, and add row actions', async () => {
    const w = render(
      { multiple: true, accept: '.pdf' },
      {
        slots: {
          text: 'Attach to INV-1043',
          hint: 'Harbor Labs',
          'file-icon': ({ kind }: { kind: string }) => h('i', { 'data-icon': kind }),
          'file-actions': ({ state }: { state: string }) => h('b', state),
        },
      },
    )
    await drop(w, [file('a.pdf')])
    expect(w.get('[data-slot="file-upload-text"]').text()).toBe('Attach to INV-1043')
    expect(w.get('[data-slot="file-upload-hint"]').text()).toBe('Harbor Labs')
    expect(w.find('[data-icon="pdf"]').exists()).toBe(true)
    expect(rows(w)[0].get('b').text()).toBe('idle')
  })

  it.each(['inline', 'button'])('keeps the focus color on the %s trigger after merging classes', (variant) => {
    const classes = render({ variant }).get('[data-slot="file-upload-trigger"]').classes()
    expect(classes).toContain('peer-focus-visible:outline-ousi-focus')
  })

  it('can hide the illustration', () => {
    const w = render({ hideIcon: true })
    expect(w.find('[data-slot="file-upload-illustration"]').exists()).toBe(false)
  })

  it('keeps the keyboard in the list after removing a row', async () => {
    const files = ref([file('a.pdf'), file('b.pdf')])
    wrapper = mount(
      defineComponent(() => () =>
        h(OFileUpload, {
          multiple: true,
          modelValue: files.value,
          'onUpdate:modelValue': (next: File[]) => (files.value = next),
        }),
      ),
      { attachTo: document.body },
    )
    const first = wrapper.findAll('[data-slot="file-upload-remove"]')[0]
    ;(first.element as HTMLElement).focus()
    await first.trigger('click')
    await nextTick()
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Remove b.pdf')
  })
})

describe('utils', () => {
  it('picks the icon by extension, then by MIME type', () => {
    expect(fileKind('Q1.XLSX')).toBe('sheet')
    expect(fileKind('clip', 'video/mp4')).toBe('video')
    expect(fileKind('LICENSE')).toBe('file')
  })

  it('formats sizes with one decimal only while the number is short', () => {
    expect(formatFileSize(500, 'en-US')).toBe('500 B')
    expect(formatFileSize(304.7 * 1024, 'en-US')).toBe('305 KB')
    expect(formatTransfer(2 * 1024 * 1024, 4 * 1024 * 1024, 'en-US')).toBe('2.0 / 4 MB')
  })

  it('reads the state from the status', () => {
    expect(stateOf(undefined)).toBe('idle')
    expect(stateOf({ progress: 0 })).toBe('uploading')
    expect(stateOf({ progress: 100 })).toBe('done')
    expect(stateOf({ progress: 100, state: 'uploading' })).toBe('uploading')
  })

  it('allows only web and blob links', () => {
    expect(safeUrl('https://example.com/a.pdf')).toBe('https://example.com/a.pdf')
    expect(safeUrl('java\tscript:alert(1)')).toBeUndefined()
    expect(safeUrl('data:text/html,hi')).toBeUndefined()
  })
})
