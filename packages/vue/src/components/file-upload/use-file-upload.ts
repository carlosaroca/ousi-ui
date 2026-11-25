import {
  computed,
  getCurrentScope,
  onScopeDispose,
  ref,
  shallowReactive,
  toRaw,
  watch,
  type ComputedRef,
  type Ref,
} from 'vue'
import type { FileUploadStatus } from './file-upload.types'

/** What your upload function gets along with the file. */
export interface FileUploadRequest {
  /** Report how much has been sent, from 0 to 100. */
  onProgress: (percent: number) => void
  /** Aborted when the file leaves the list or the component unmounts. Pass it to fetch or axios. */
  signal: AbortSignal
}

/** Sends one file. Resolve when the server has it; throw when it fails. */
export type FileUploader<T> = (file: File, request: FileUploadRequest) => Promise<T>

export interface UseFileUploadOptions<T> {
  /** Files sent at the same time; the rest wait their turn. Defaults to 3. */
  concurrency?: number
  onSuccess?: (file: File, result: T) => void
  /** An upload failed. A cancelled one is not a failure. */
  onError?: (file: File, error: unknown) => void
  /**
   * The message of a failed row. Without it, or when it returns nothing, the row shows the translated
   * "Upload failed", so that technical errors never reach the user by accident.
   */
  errorMessage?: (error: unknown, file: File) => string | undefined
}

export interface UseFileUploadReturn<T> {
  /** Bind with v-model: a file that enters is uploaded, one that leaves is aborted. */
  files: Ref<File[]>
  /** Bind to `file-status`. */
  statusOf: (file: File) => FileUploadStatus | undefined
  /** What the upload function resolved with. */
  resultOf: (file: File) => T | undefined
  /** True while any file is waiting or being sent: disable your submit button with it. */
  isUploading: ComputedRef<boolean>
  /** Bind to `@retry`. */
  retry: (file: File) => void
  /** Aborts a file and takes it off the list. */
  cancel: (file: File) => void
  /** Aborts everything and empties the list. */
  clear: () => void
}

/**
 * The upload side of OFileUpload: queue, progress, errors, retry and cancel.
 *
 *   const { files, statusOf, retry } = useFileUpload((file, { onProgress, signal }) => send(file))
 *   <OFileUpload v-model="files" :file-status="statusOf" multiple @retry="retry" />
 */
export function useFileUpload<T = unknown>(
  upload: FileUploader<T>,
  options: UseFileUploadOptions<T> = {},
): UseFileUploadReturn<T> {
  const files = ref<File[]>([]) as Ref<File[]>
  const statuses = shallowReactive(new Map<File, FileUploadStatus>())
  const results = shallowReactive(new Map<File, T>())
  // One controller per file being sent. Only the current one may change its row.
  const running = new Map<File, AbortController>()

  function stop(file: File) {
    running.get(file)?.abort()
    running.delete(file)
  }

  function forget(file: File) {
    stop(file)
    statuses.delete(file)
    results.delete(file)
  }

  // A deep ref may hand out proxies of its files. Every map is keyed by the file itself, which is
  // also what FormData needs.
  const list = () => files.value.map((file) => toRaw(file))

  /** Starts waiting files, in the order of the list, while there is room. */
  function pump() {
    const limit = Math.max(1, options.concurrency ?? 3)
    for (const file of list()) {
      if (running.size >= limit) return
      if (statuses.get(file)?.state === 'idle') void send(file)
    }
  }

  async function send(file: File) {
    const controller = new AbortController()
    running.set(file, controller)
    statuses.set(file, { state: 'uploading' })
    const isCurrent = () => running.get(file) === controller

    let outcome: { result: T } | { error: unknown }
    try {
      outcome = {
        result: await upload(file, {
          signal: controller.signal,
          onProgress(percent) {
            if (!isCurrent() || !Number.isFinite(percent)) return
            statuses.set(file, { state: 'uploading', progress: Math.min(100, Math.max(0, percent)) })
          },
        }),
      }
    } catch (error) {
      outcome = { error }
    }
    // Cancelled or retried meanwhile: whatever came back no longer matters.
    if (!isCurrent()) return
    running.delete(file)

    if ('result' in outcome) {
      results.set(file, outcome.result)
      statuses.set(file, { state: 'done', progress: 100 })
    } else {
      statuses.set(file, { state: 'error', error: options.errorMessage?.(outcome.error, file) })
    }
    // Before the callbacks, so one that throws does not leave the queue stuck.
    pump()
    if ('result' in outcome) options.onSuccess?.(file, outcome.result)
    else options.onError?.(file, outcome.error)
  }

  watch(
    () => list(),
    (current) => {
      const present = new Set(current)
      for (const file of [...statuses.keys()]) if (!present.has(file)) forget(file)
      for (const file of present) if (!statuses.has(file)) statuses.set(file, { state: 'idle' })
      pump()
    },
  )

  function retry(item: File) {
    const file = toRaw(item)
    if (!list().includes(file)) return
    stop(file)
    results.delete(file)
    statuses.set(file, { state: 'idle' })
    pump()
  }

  function cancel(item: File) {
    const file = toRaw(item)
    forget(file)
    files.value = files.value.filter((f) => toRaw(f) !== file)
    pump()
  }

  function clear() {
    for (const file of [...statuses.keys()]) forget(file)
    files.value = []
  }

  if (getCurrentScope()) {
    onScopeDispose(() => {
      for (const file of [...running.keys()]) stop(file)
    })
  }

  return {
    files,
    statusOf: (file) => statuses.get(toRaw(file)),
    resultOf: (file) => results.get(toRaw(file)),
    isUploading: computed(() =>
      [...statuses.values()].some((s) => s.state === 'idle' || s.state === 'uploading'),
    ),
    retry,
    cancel,
    clear,
  }
}
