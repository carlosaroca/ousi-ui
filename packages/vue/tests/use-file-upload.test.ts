import { describe, it, expect, vi } from 'vitest'
import { effectScope, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import OFileUpload from '../src/components/file-upload/FileUpload.vue'
import {
  useFileUpload,
  type FileUploadRequest,
  type UseFileUploadOptions,
} from '../src/components/file-upload/use-file-upload'

/** An uploader whose requests the test settles by hand. */
function fakeServer() {
  const requests: (FileUploadRequest & {
    file: File
    resolve: (value: string) => void
    reject: (error: unknown) => void
  })[] = []
  const upload = (file: File, request: FileUploadRequest) =>
    new Promise<string>((resolve, reject) => requests.push({ ...request, file, resolve, reject }))
  return { requests, upload }
}

function setup(options: UseFileUploadOptions<string> = {}) {
  const server = fakeServer()
  const scope = effectScope()
  const api = scope.run(() => useFileUpload(server.upload, options))!
  return { ...server, ...api, scope }
}

const named = (name: string) => new File(['x'], name)
/** Lets the watcher and the promise chain run. */
const settle = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('useFileUpload', () => {
  it('uploads what enters the list, a few at a time, and the rest wait', async () => {
    const t = setup({ concurrency: 2 })
    const files = ['a', 'b', 'c'].map(named)
    t.files.value = files
    await nextTick()
    expect(t.requests.map((r) => r.file.name)).toEqual(['a', 'b'])
    expect(files.map((f) => t.statusOf(f)?.state)).toEqual(['uploading', 'uploading', 'idle'])
    expect(t.isUploading.value).toBe(true)

    t.requests[0].resolve('/a')
    await settle()
    expect(t.requests.map((r) => r.file.name)).toEqual(['a', 'b', 'c'])
    expect(t.statusOf(files[0])).toEqual({ state: 'done', progress: 100 })
    expect(t.resultOf(files[0])).toBe('/a')

    t.requests[1].resolve('/b')
    t.requests[2].resolve('/c')
    await settle()
    expect(t.isUploading.value).toBe(false)
  })

  it('starts files pushed into the list too', async () => {
    const t = setup()
    t.files.value.push(named('a'))
    await nextTick()
    expect(t.requests).toHaveLength(1)
  })

  it('reports progress within 0 and 100, and ignores what is not a number', async () => {
    const t = setup()
    const a = named('a')
    t.files.value = [a]
    await nextTick()
    t.requests[0].onProgress(40)
    expect(t.statusOf(a)).toEqual({ state: 'uploading', progress: 40 })
    t.requests[0].onProgress(Number.NaN)
    expect(t.statusOf(a)?.progress).toBe(40)
    t.requests[0].onProgress(250)
    expect(t.statusOf(a)?.progress).toBe(100)
    expect(t.statusOf(a)?.state).toBe('uploading')
  })

  it('keeps technical errors from the user unless the app gives a message', async () => {
    const onError = vi.fn()
    const plain = setup({ onError })
    const a = named('a')
    plain.files.value = [a]
    await nextTick()
    const failure = new TypeError('Failed to fetch')
    plain.requests[0].reject(failure)
    await settle()
    expect(plain.statusOf(a)).toEqual({ state: 'error', error: undefined })
    expect(onError).toHaveBeenCalledWith(a, failure)

    const worded = setup({ errorMessage: (error) => (error as Error).message })
    worded.files.value = [a]
    await nextTick()
    worded.requests[0].reject(new Error('No space left'))
    await settle()
    expect(worded.statusOf(a)?.error).toBe('No space left')
  })

  it('handles an uploader that throws at once', async () => {
    const scope = effectScope()
    const api = scope.run(() =>
      useFileUpload(() => {
        throw new Error('no')
      }),
    )!
    const a = named('a')
    api.files.value = [a]
    await settle()
    expect(api.statusOf(a)?.state).toBe('error')
  })

  it('aborts a file that leaves the list, and gives its turn to the next', async () => {
    const t = setup({ concurrency: 1 })
    const [a, b] = [named('a'), named('b')]
    t.files.value = [a, b]
    await nextTick()
    t.files.value = [b]
    await nextTick()
    expect(t.requests[0].signal.aborted).toBe(true)
    expect(t.requests[1].file).toBe(b)
    expect(t.statusOf(a)).toBeUndefined()

    // What the aborted request answers later changes nothing.
    t.requests[0].resolve('/late')
    await settle()
    expect(t.statusOf(a)).toBeUndefined()
    expect(t.resultOf(a)).toBeUndefined()
  })

  it('retries a failed file', async () => {
    const t = setup()
    const a = named('a')
    t.files.value = [a]
    await nextTick()
    t.requests[0].reject(new Error('x'))
    await settle()
    t.retry(a)
    expect(t.statusOf(a)?.state).toBe('uploading')
    t.requests[1].resolve('/a')
    await settle()
    expect(t.statusOf(a)?.state).toBe('done')
  })

  it('cancels one file, clears them all, and aborts on dispose', async () => {
    const t = setup()
    const [a, b, c] = ['a', 'b', 'c'].map(named)
    t.files.value = [a, b, c]
    await nextTick()
    t.cancel(a)
    expect(t.requests[0].signal.aborted).toBe(true)
    expect(t.files.value).toEqual([b, c])
    t.scope.stop()
    expect(t.requests.every((r) => r.signal.aborted)).toBe(true)

    const other = setup()
    other.files.value = [a]
    await nextTick()
    other.clear()
    expect(other.files.value).toEqual([])
    expect(other.requests[0].signal.aborted).toBe(true)
  })

  it('keeps the queue moving when a callback throws', async () => {
    const t = setup({
      concurrency: 1,
      onSuccess: () => {
        throw new Error('callback')
      },
    })
    const swallow = vi.fn()
    process.once('unhandledRejection', swallow)
    t.files.value = [named('a'), named('b')]
    await nextTick()
    t.requests[0].resolve('/a')
    await settle()
    await settle()
    expect(t.requests).toHaveLength(2)
    expect(swallow).toHaveBeenCalled()
  })

  it('drives OFileUpload with v-model, file-status and retry alone', async () => {
    const server = fakeServer()
    const wrapper = mount(
      defineComponent(() => {
        const { files, statusOf, retry } = useFileUpload(server.upload)
        return () =>
          h(OFileUpload, {
            multiple: true,
            modelValue: files.value,
            'onUpdate:modelValue': (next: File[]) => (files.value = next),
            fileStatus: statusOf,
            onRetry: retry,
          })
      }),
      { attachTo: document.body },
    )
    const event = new Event('drop', { bubbles: true, cancelable: true })
    Object.defineProperty(event, 'dataTransfer', { value: { files: [named('a.pdf')], types: ['Files'] } })
    wrapper.get('[data-slot="file-upload-zone"]').element.dispatchEvent(event)
    await settle()
    server.requests[0].onProgress(50)
    await settle()
    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('50')

    server.requests[0].reject(new Error('x'))
    await settle()
    await wrapper.get('[data-slot="file-upload-retry"]').trigger('click')
    expect(server.requests).toHaveLength(2)

    await wrapper.get('[data-slot="file-upload-remove"]').trigger('click')
    await settle()
    expect(server.requests[1].signal.aborted).toBe(true)
    wrapper.unmount()
  })
})
