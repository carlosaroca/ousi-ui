<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  shallowReactive,
  shallowRef,
  toRaw,
  useId,
  useSlots,
  watch,
} from 'vue'
import { cn } from '@ousi-ui/core'
import { useOusiConfig, useOusiMessages } from '../../config'
import { OButton, buttonTheme } from '../button'
import { labelTheme } from '../input/input.theme'
import { useFormContext } from '../form/form.context'
import { fieldFocus, useFieldAttrs } from '../shared/field-attrs'
import OImageEditorDialog from '../image-editor/ImageEditorDialog.vue'
import { isAnimatedImage, isCompressibleType } from '../../image/compress-image'
import FileTypeIcon from './FileTypeIcon.vue'
import FileUploadCompare from './FileUploadCompare.vue'
import FileUploadIllustration from './FileUploadIllustration.vue'
import UploadGlyph from './UploadGlyph.vue'
import {
  fileUploadAreaTheme,
  fileUploadTextTheme,
  fileUploadInlineTheme,
  fileUploadInlineIconTheme,
  fileUploadInlineTextTheme,
  fileUploadTriggerTheme,
  fileUploadHintTheme,
  fileUploadMessageTheme,
  fileUploadListTheme,
  fileUploadFileTheme,
  fileUploadFileIconTheme,
  fileUploadReviewTheme,
  fileUploadProgressTheme,
  fileUploadProgressFillTheme,
} from './file-upload.theme'
import {
  fileKind,
  formatFileSize,
  formatPercent,
  formatTransfer,
  isAccepted,
  isPreviewable,
  safeUrl,
  splitName,
  stateOf,
} from './file-upload.utils'
import type {
  FileUploadProps,
  FileUploadEmits,
  FileUploadSlots,
  FileUploadFileKind,
  FileUploadState,
  FileUploadUploadedFile,
} from './file-upload.types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FileUploadProps>(), {
  modelValue: undefined,
  uploadedFiles: () => [],
  required: false,
  multiple: false,
  disabled: false,
  variant: 'area',
  size: 'md',
  shadow: 'none',
  animated: false,
  confirmTransform: false,
  editable: false,
  preview: 'contain',
  paste: 'self',
  hideIcon: false,
  hideFileList: false,
  hideHint: false,
})

const emit = defineEmits<FileUploadEmits>()
defineSlots<FileUploadSlots>()

const ousiText = useOusiMessages()
const ousiConfig = useOusiConfig()
const instance = getCurrentInstance()
const slots = useSlots()

const rootRef = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const ownFiles = shallowRef<File[]>([])
const files = computed(() => props.modelValue ?? ownFiles.value)

// In a single file field, a new file stands in for the uploaded one until it is taken off.
const shownUploaded = computed(() =>
  !props.multiple && files.value.length > 0 ? [] : props.uploadedFiles,
)

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}
const formatSize = (bytes: number) => formatFileSize(bytes, ousiConfig.locale.value)

/* ── Texts ─────────────────────────────────────────────────────── */

const KNOWN_TYPES: Record<string, string> = {
  'application/pdf': 'PDF',
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
  'image/gif': 'GIF',
  'image/webp': 'WEBP',
  'image/svg+xml': 'SVG',
  'text/csv': 'CSV',
  'text/plain': 'TXT',
  'application/json': 'JSON',
  'application/xml': 'XML',
  'text/xml': 'XML',
  'application/zip': 'ZIP',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
}

function typeLabel(token: string): string {
  const type = token.trim().toLowerCase()
  if (type.startsWith('.')) return type.slice(1).toUpperCase()
  if (type === 'image/*') return ousiText.value.images
  if (type === 'video/*') return ousiText.value.videos
  if (type === 'audio/*') return ousiText.value.audio
  return KNOWN_TYPES[type] ?? (type.split('/').pop() ?? type).toUpperCase()
}

const limitsText = computed(() => {
  const parts: string[] = []
  if (props.accept) {
    const labels = [...new Set(props.accept.split(',').filter((t) => t.trim()).map(typeLabel))]
    parts.push(fill(ousiText.value.acceptedFormats, { formats: labels.join(', ') }))
  }
  if (props.maxSize) parts.push(fill(ousiText.value.maxFileSize, { size: formatSize(props.maxSize) }))
  if (props.multiple && props.maxFiles && props.maxFiles > 1) {
    parts.push(fill(ousiText.value.maxFilesHint, { count: props.maxFiles }))
  }
  return parts.join(' · ')
})
const hintText = computed(() => props.hint ?? limitsText.value)
// A function: slots are not reactive, so they are read on every render.
const showHint = () => !props.hideHint && (!!hintText.value || !!slots.hint)

const areaText = computed(
  () =>
    props.text ??
    `${ousiText.value.dropHere} ${props.multiple ? ousiText.value.chooseFiles : ousiText.value.chooseFile}`,
)
const browseText = computed(() =>
  props.multiple ? ousiText.value.browseFilesMultiple : ousiText.value.browseFiles,
)

/* ── Field: label, description, error and the native input ─────── */

const labelId = useId()
const textId = useId()
const hintId = useId()
const descriptionId = useId()
const errorId = useId()

const formCtx = useFormContext()
const resolvedError = computed(() => {
  if (props.errorMessage) return props.errorMessage
  const error = props.name ? formCtx?.validationErrors.value[props.name] : undefined
  return Array.isArray(error) ? error[0] : error
})
const isInvalid = computed(() => !!resolvedError.value)

const { attrs, rootAttrs, controlAttrs, controlId, describedBy } = useFieldAttrs(useId(), () => {
  const message = isInvalid.value ? errorId : props.description ? descriptionId : undefined
  return [showHint() ? hintId : undefined, message].filter(Boolean).join(' ') || undefined
})

/** The field label and the text of the control, unless the app names the input itself. */
function labelledBy(): string | undefined {
  if (attrs['aria-label'] || attrs['aria-labelledby']) return undefined
  return [props.label ? labelId : undefined, textId].filter(Boolean).join(' ')
}

// A native form (FormData, `required`) reads the files from the input, which would otherwise hold
// only the last pick, and nothing at all after a drop.
function syncInput() {
  const input = fileInput.value
  if (!input || typeof DataTransfer === 'undefined') return
  try {
    const transfer = new DataTransfer()
    for (const file of files.value) transfer.items.add(file)
    input.files = transfer.files
  } catch {
    // Old browsers cannot write the list; `v-model` still holds every file.
  }
}
watch(() => [...files.value], syncInput, { flush: 'post' })

defineExpose(fieldFocus(() => fileInput.value))

/* ── Adding files ──────────────────────────────────────────────── */

function setFiles(next: File[]) {
  ownFiles.value = next
  emit('update:modelValue', next)
  emit('change', next)
}

// An app listening to `error` shows the message its own way; otherwise it shows here.
const showsOwnError = () => !instance?.vnode.props?.onError
const rejections = ref<string[]>([])

function reject(message: string) {
  if (showsOwnError()) rejections.value.push(message)
  emit('error', message)
}

// The same pick or drop twice. Two different files practically never share all three.
const isSameFile = (a: File, b: File) =>
  a.name === b.name && a.size === b.size && a.lastModified === b.lastModified

// What each transformed file was when it was picked.
const originals = new WeakMap<File, File>()
// A deep ref in the app may hand out a proxy of the file: lookups use the file itself.
const originalOf = (file: File) => originals.get(toRaw(file)) ?? file

const isTooLarge = (file: File) => !!props.maxSize && file.size > props.maxSize
const tooLargeMessage = (file: File) =>
  fill(ousiText.value.fileTooLarge, { name: file.name, size: formatSize(props.maxSize!) })

function processFiles(incoming: File[]) {
  if (incoming.length === 0) return
  rejections.value = []
  // Compared as picked: a transformed file no longer looks like its original.
  const listed = props.multiple
    ? [...files.value.map(originalOf), ...pending.value.map((item) => item.original)]
    : []
  let valid = incoming.filter((file) => {
    if (!isAccepted(file, props.accept)) {
      reject(fill(ousiText.value.fileTypeRejected, { name: file.name }))
      return false
    }
    // With a transform, the size is checked on what comes out of it.
    if (!props.transform && isTooLarge(file)) {
      reject(tooLargeMessage(file))
      return false
    }
    if (props.multiple) {
      if (listed.some((other) => isSameFile(other, file))) {
        reject(fill(ousiText.value.duplicateFile, { name: file.name }))
        return false
      }
      listed.push(file)
    }
    return true
  })
  if (!props.multiple) valid = valid.slice(0, 1)
  else if (props.maxFiles) {
    const taken = files.value.length + props.uploadedFiles.length + pending.value.length
    const room = Math.max(0, props.maxFiles - taken)
    if (valid.length > room) {
      reject(fill(ousiText.value.tooManyFiles, { count: props.maxFiles }))
      valid = valid.slice(0, room)
    }
  }
  if (valid.length === 0) return
  if (props.transform) return queueTransforms(valid)
  setFiles(props.multiple ? [...files.value, ...valid] : valid)
}

/* ── Transform and approval ────────────────────────────────────── */

/** A picked file that is not in the list yet: being transformed, or waiting for approval. */
interface Pending {
  key: string
  original: File
  controller: AbortController
  /** Set once it waits for approval. */
  result?: File
}

const pending = shallowRef<Pending[]>([])
let queue = Promise.resolve()

function queueTransforms(picked: File[]) {
  // A single file field waits for one file only. What it already holds stays until this one is in.
  if (!props.multiple) abortPending()
  const items = picked.map((original) =>
    shallowReactive<Pending>({ key: newKey(), original, controller: new AbortController() }),
  )
  pending.value = [...pending.value, ...items]
  // One at a time: a transform may open an editor, and big photos are heavy to decode.
  for (const item of items) queue = queue.then(() => runTransform(item)).catch(() => {})
}

async function runTransform(item: Pending) {
  const { signal } = item.controller
  const transform = props.transform
  if (signal.aborted || !transform) return

  let result: File | null
  try {
    // Discarding frees the queue at once, even if the transform never answers.
    result = await Promise.race([
      Promise.resolve().then(() => transform(item.original, { signal })),
      new Promise<null>((resolve) => signal.addEventListener('abort', () => resolve(null), { once: true })),
    ])
  } catch (error) {
    if (signal.aborted) return
    // The original is never added in its place: the transform may be there to remove something.
    dropPending(item)
    reject(fill(ousiText.value.processingFailed, { name: item.original.name }))
    emit('transformError', error, item.original)
    return
  }
  if (signal.aborted) return
  if (!result) return dropPending(item)

  if (isTooLarge(result)) {
    dropPending(item)
    reject(
      result === item.original
        ? tooLargeMessage(result)
        : fill(ousiText.value.couldNotReduce, { name: item.original.name, size: formatSize(props.maxSize!) }),
    )
    return
  }
  // An unchanged file has nothing to approve.
  if (props.confirmTransform && result !== item.original) item.result = result
  else commit(item, result)
}

function dropPending(item: Pending) {
  pending.value = pending.value.filter((other) => other !== item)
}

function abortPending() {
  for (const item of pending.value) item.controller.abort()
  pending.value = []
  compareOpen.value = false
}

// Several files may be added before a v-model comes back around: they build on one another.
let staged: File[] | undefined

function commit(item: Pending, file: File) {
  if (file !== item.original) originals.set(toRaw(file), item.original)
  // The row keeps its key, so it changes in place.
  fileKeys.set(toRaw(file), item.key)
  dropPending(item)
  staged = props.multiple ? [...(staged ?? files.value), file] : [file]
  setFiles(staged)
  nextTick(() => (staged = undefined))
}

const canKeepOriginal = (item: Pending) => !isTooLarge(item.original)

function decide(item: Pending, choice: 'result' | 'original' | 'discard') {
  if (props.disabled || !pending.value.includes(item)) return
  if (compared.value === item) compareOpen.value = false
  if (choice === 'discard') {
    item.controller.abort()
    dropPending(item)
  } else if (choice === 'result' && item.result) commit(item, item.result)
  else if (choice === 'original' && canKeepOriginal(item)) commit(item, item.original)
}

const compared = shallowRef<Pending>()
const compareOpen = ref(false)

const canCompare = (item: Pending) =>
  !!item.result && isPreviewable(item.original.type) && isPreviewable(item.result.type)

function openCompare(item: Pending) {
  compared.value = item
  compareOpen.value = true
}

watch(
  () => pending.value.length,
  (count) => {
    emit('pendingChange', count)
    // A native form must not leave without them: they are not in the input yet.
    fileInput.value?.setCustomValidity(count ? ousiText.value.pendingFiles : '')
  },
)

function onInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  const picked = Array.from(target.files ?? [])
  // Emptied so that picking a removed file again fires `change`; then the kept files go back in.
  target.value = ''
  processFiles(picked)
  nextTick(syncInput)
}

/* ── Drag and drop ─────────────────────────────────────────────── */

// Counting enter/leave keeps the highlight while the pointer crosses the area's children.
const dragDepth = ref(0)
const isDragActive = computed(() => dragDepth.value > 0)

// Dragged text or links are not files, and must not light the area up.
function carriesFiles(event: DragEvent): boolean {
  const types = event.dataTransfer?.types
  return !types || Array.from(types).includes('Files')
}

const dragListeners = {
  dragenter(event: DragEvent) {
    if (!carriesFiles(event)) return
    event.preventDefault()
    if (!props.disabled) dragDepth.value++
  },
  dragover(event: DragEvent) {
    if (!carriesFiles(event)) return
    // Also while disabled: otherwise the browser opens the dropped file and leaves the page.
    event.preventDefault()
    if (props.disabled && event.dataTransfer) event.dataTransfer.dropEffect = 'none'
  },
  dragleave(event: DragEvent) {
    if (!carriesFiles(event)) return
    dragDepth.value = Math.max(0, dragDepth.value - 1)
  },
  drop(event: DragEvent) {
    if (!carriesFiles(event)) return
    event.preventDefault()
    dragDepth.value = 0
    if (!props.disabled) processFiles(Array.from(event.dataTransfer?.files ?? []))
  },
}

/* ── Editing what is in the list ───────────────────────────────── */

const editorDialog = ref<InstanceType<typeof OImageEditorDialog>>()
const editorSettings = computed(() => ({ maxSize: props.maxSize, ...props.editorOptions }))
/** One edit at a time. */
const editing = shallowRef<{
  key: string
  target: File | FileUploadUploadedFile
  controller: AbortController
}>()

// A canvas would keep a single frame of an animation, so those get no Edit button.
const animated = shallowReactive(new WeakSet<File>())
const looked = new WeakSet<File>()

async function findAnimations() {
  if (!props.editable) return
  for (const item of files.value) {
    const file = toRaw(item)
    if (looked.has(file)) continue
    looked.add(file)
    if (await isAnimatedImage(file).catch(() => false)) animated.add(file)
  }
}

const hasEditUploadedListener = () => !!instance?.vnode.props?.onEditUploaded

const isEditableUploaded = ({ name, type }: FileUploadUploadedFile) =>
  type ? isCompressibleType(type) : /\.(jpe?g|png|webp|bmp|avif)$/i.test(name)

function canEdit(row: Row): boolean {
  if (!props.editable || row.pending) return false
  if (row.file) {
    return row.state !== 'uploading' && isCompressibleType(row.file.type) && !animated.has(toRaw(row.file))
  }
  // An uploaded one needs its full picture (a thumbnail would not do) and someone to take the result.
  return hasEditUploadedListener() && !!row.href && isEditableUploaded(row.source as FileUploadUploadedFile)
}

/** The editor may change the format or fail to get under the limit: the field's rules still hold. */
function acceptsEdit(result: File, name: string): boolean {
  if (!isAccepted(result, props.accept)) {
    reject(fill(ousiText.value.fileTypeRejected, { name: result.name }))
    return false
  }
  if (isTooLarge(result)) {
    reject(fill(ousiText.value.couldNotReduce, { name, size: formatSize(props.maxSize!) }))
    return false
  }
  return true
}

async function editFile(file: File, signal: AbortSignal) {
  const original = originalOf(file)
  const result = await editorDialog.value!.edit(file, { signal, original, keepUntouched: true })
  // Cancelled, left as it was, or gone from the list meanwhile.
  if (!result || signal.aborted || toRaw(result) === toRaw(file) || !files.value.includes(file)) return
  if (!acceptsEdit(result, file.name)) return
  if (toRaw(result) !== toRaw(original)) originals.set(toRaw(result), original)
  // The row keeps its key, so it changes in place and focus has somewhere to return.
  fileKeys.set(toRaw(result), keyOf(file))
  // The previous file leaves like a removed one, so what cleans up after `remove` still works.
  emit('remove', file)
  setFiles(files.value.map((other) => (other === file ? result : other)))
  emit('edited', result, file)
}

async function editStored(uploaded: FileUploadUploadedFile, url: string, signal: AbortSignal) {
  let file: File
  try {
    const response = await fetch(url, { signal })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const blob = await response.blob()
    file = new File([blob], uploaded.name, { type: blob.type || uploaded.type || '' })
  } catch {
    if (!signal.aborted) reject(fill(ousiText.value.editFailed, { name: uploaded.name }))
    return
  }
  const result = await editorDialog.value!.edit(file, { signal, keepUntouched: true })
  if (!result || signal.aborted || result === file || !props.uploadedFiles.includes(uploaded)) return
  if (acceptsEdit(result, uploaded.name)) emit('editUploaded', uploaded, result)
}

async function editRow(row: Row) {
  if (props.disabled || editing.value || !editorDialog.value) return
  const controller = new AbortController()
  editing.value = { key: row.key, target: row.source, controller }
  rejections.value = []
  try {
    if (row.file) await editFile(row.file, controller.signal)
    else await editStored(row.source as FileUploadUploadedFile, row.href!, controller.signal)
  } finally {
    editing.value = undefined
  }
}

// If the app takes the file away while it is open, the editor closes.
watch(
  () => [...files.value, ...props.uploadedFiles],
  (listed) => {
    if (editing.value && !listed.includes(editing.value.target as File)) editing.value.controller.abort()
  },
)

/* ── Paste ─────────────────────────────────────────────────────── */

function isHovered(element: Element): boolean {
  try {
    return element.matches(':hover')
  } catch {
    return false
  }
}

/**
 * Every uploader hears a paste, so each one decides whether it is the one meant: first the one
 * under the pointer, then the one with focus, then one that takes the whole page. Focus often stays
 * behind after a click, which is why the pointer goes first.
 */
function isPasteTarget(root: HTMLElement): boolean {
  if (isHovered(root)) return true
  const others = Array.from(document.querySelectorAll('[data-takes-paste]')).filter((el) => el !== root)
  if (others.some(isHovered)) return false
  if (root.contains(document.activeElement)) return true
  if (props.paste !== 'page' || others.some((el) => el.contains(document.activeElement))) return false
  return root.checkVisibility?.() !== false
}

function onPaste(event: ClipboardEvent) {
  const root = rootRef.value
  // `defaultPrevented`: another uploader, or an editor, already took this paste.
  if (!root || props.paste === 'none' || props.disabled || event.defaultPrevented) return
  // With the editor open, a paste must not slip a file in behind it.
  if (editing.value) return
  if (!isPasteTarget(root)) return

  const data = event.clipboardData
  const pasted = Array.from(data?.files ?? [])
  if (pasted.length === 0) return
  // Text copied from a document often travels with a picture of itself: in a text field, text wins.
  const typing =
    event.target instanceof Element &&
    !!event.target.closest('textarea, input:not([type="file"]), [contenteditable]:not([contenteditable="false"])')
  if (typing && Array.from(data!.types).includes('text/plain')) return

  event.preventDefault()
  processFiles(pasted)
}

/* ── Form reset ────────────────────────────────────────────────── */

function clearFiles() {
  rejections.value = []
  abortPending()
  editing.value?.controller.abort()
  if (files.value.length === 0) return
  // Reported one by one, so an app can abort what is uploading.
  for (const file of files.value) emit('remove', file)
  setFiles([])
}

let ownerForm: HTMLFormElement | null = null
let resetTimer: ReturnType<typeof setTimeout> | undefined

// The event arrives before the reset, and a later listener may still cancel it.
function onFormReset(event: Event) {
  resetTimer = setTimeout(() => {
    if (!event.defaultPrevented) clearFiles()
  })
}

const zoneState = computed(() => {
  if (props.disabled) return 'disabled'
  if (isDragActive.value) return 'active'
  return isInvalid.value ? 'invalid' : 'idle'
})

/* ── Thumbnails ────────────────────────────────────────────────── */

const previews = shallowRef(new Map<File, string>())
const brokenPreviews = ref<string[]>([])

function updatePreviews() {
  if (typeof URL.createObjectURL !== 'function') return
  const waiting = pending.value.map((item) => item.result ?? item.original)
  const wanted =
    props.preview === 'none' ? [] : props.hideFileList ? waiting : [...files.value, ...waiting]
  const next = new Map<File, string>()
  for (const file of wanted) {
    if (!isPreviewable(file.type)) continue
    next.set(file, previews.value.get(file) ?? URL.createObjectURL(file))
  }
  for (const [file, url] of previews.value) {
    if (!next.has(file)) URL.revokeObjectURL(url)
  }
  previews.value = next
}

// Object URLs and the document exist only in the browser, so they wait for the mount.
onMounted(() => {
  syncInput()
  watch(
    () => [props.preview, props.hideFileList, ...files.value, ...pending.value.map((i) => i.result ?? i.original)],
    updatePreviews,
    { immediate: true },
  )
  watch(() => [props.editable, ...files.value], findAnimations, { immediate: true })
  document.addEventListener('paste', onPaste)
  ownerForm = fileInput.value?.form ?? null
  ownerForm?.addEventListener('reset', onFormReset)
})
onBeforeUnmount(() => {
  for (const url of previews.value.values()) URL.revokeObjectURL(url)
  document.removeEventListener('paste', onPaste)
  ownerForm?.removeEventListener('reset', onFormReset)
  clearTimeout(resetTimer)
  for (const item of pending.value) item.controller.abort()
  editing.value?.controller.abort()
})

/* ── The list ──────────────────────────────────────────────────── */

interface Row {
  key: string
  source: File | FileUploadUploadedFile
  /** Set for a new file, which can be retried; an uploaded one is already done. */
  file?: File
  name: string
  /** The name cut in two for a middle ellipsis; the end is empty for a short one. */
  nameStart: string
  nameEnd: string
  kind: FileUploadFileKind
  previewUrl?: string
  href?: string
  state: FileUploadState | 'processing' | 'review'
  /** Set for a file that is not in the list yet. */
  pending?: Pending
  /** How much lighter the new version waiting for approval is, such as "−92%". */
  saving?: string
  percent?: number
  meta: string
}

const fileKeys = new WeakMap<File, string>()
let nextKey = 0
const newKey = () => `file-${++nextKey}`
function keyOf(item: File): string {
  const file = toRaw(item)
  let key = fileKeys.get(file)
  if (!key) fileKeys.set(file, (key = newKey()))
  return key
}

const shownPreview = (url: string | undefined) =>
  props.preview !== 'none' && url && !brokenPreviews.value.includes(url) ? url : undefined

function nameParts(name: string) {
  const [nameStart, nameEnd] = splitName(name)
  return { name, nameStart, nameEnd }
}

function uploadedRow(item: FileUploadUploadedFile, index: number): Row {
  return {
    key: `uploaded-${item.id ?? item.url ?? `${item.name}-${index}`}`,
    source: item,
    ...nameParts(item.name),
    kind: fileKind(item.name, item.type),
    previewUrl: shownPreview(item.previewUrl),
    href: safeUrl(item.url),
    state: 'done',
    meta: item.size === undefined ? '' : formatSize(item.size),
  }
}

function fileRow(file: File): Row {
  const status = props.fileStatus?.(file)
  const state = stateOf(status)
  const percent =
    state === 'uploading' && status?.progress !== undefined
      ? Math.floor(Math.min(100, Math.max(0, status.progress)))
      : undefined
  const locale = ousiConfig.locale.value

  let meta = formatSize(file.size)
  const original = originalOf(file)
  if (original.size !== file.size) {
    meta += ` · ${fill(ousiText.value.wasSize, { size: formatSize(original.size) })}`
  }
  if (state === 'error') meta = status?.error || ousiText.value.uploadFailed
  else if (state === 'uploading') {
    meta =
      percent === undefined
        ? ousiText.value.uploading
        : `${formatTransfer((file.size * percent) / 100, file.size, locale)} · ${formatPercent(percent, locale)}`
  }

  return {
    key: keyOf(file),
    source: file,
    file,
    ...nameParts(file.name),
    kind: fileKind(file.name, file.type),
    previewUrl: shownPreview(previews.value.get(file)),
    state,
    percent,
    meta,
  }
}

function savingOf({ original, result }: Pending): string | undefined {
  if (!result || !original.size) return undefined
  const saved = Math.floor((1 - result.size / original.size) * 100)
  return saved >= 1 ? `−${formatPercent(saved, ousiConfig.locale.value)}` : undefined
}

function pendingRow(item: Pending): Row {
  const file = item.result ?? item.original
  return {
    key: item.key,
    source: file,
    pending: item,
    ...nameParts(file.name),
    kind: fileKind(file.name, file.type),
    previewUrl: shownPreview(previews.value.get(file)),
    state: item.result ? 'review' : 'processing',
    saving: savingOf(item),
    meta: item.result
      ? `${formatSize(item.original.size)} → ${formatSize(item.result.size)}`
      : ousiText.value.processing,
  }
}

let renderedRows: Row[] = []

// Called by the template, not computed: `fileStatus` may read data that is not reactive.
function rows(): Row[] {
  const seen = new Set<string>()
  // An app that draws its own list still needs the pending files shown here, to approve them.
  const listed = props.hideFileList
    ? []
    : [...shownUploaded.value.map(uploadedRow), ...files.value.map(fileRow)]
  renderedRows = [...listed, ...pending.value.map(pendingRow)].map(
    (row, index) => {
      // An app may list the same File twice, or repeat an id: keys must stay unique.
      if (seen.has(row.key)) row.key = `${row.key}-${index}`
      seen.add(row.key)
      return row
    },
  )
  return renderedRows
}

/* ── Announcements ─────────────────────────────────────────────── */

const announcement = ref('')
let knownStates = new Map<string, Row['state']>()

// A screen reader hears when an upload ends. Rows are read while rendering, so what changed is
// looked at once the render is done.
function announceChanges() {
  const messages: string[] = []
  let changed = false
  for (const row of renderedRows) {
    const before = knownStates.get(row.key)
    if (before === row.state || (before === undefined && row.state !== 'review')) continue
    changed = true
    if (row.state === 'review') messages.push(`${row.name}: ${ousiText.value.awaitingApproval}`)
    else if (row.state === 'done') messages.push(`${row.name}: ${ousiText.value.fileUploaded}`)
    else if (row.state === 'error') messages.push(`${row.name}: ${row.meta}`)
  }
  knownStates = new Map(renderedRows.map((row) => [row.key, row.state]))
  // Emptied on a retry too, so the same failure is read again.
  if (changed) announcement.value = messages.join('. ')
}
onMounted(announceChanges)
onUpdated(announceChanges)

/* ── Row motion ────────────────────────────────────────────────── */

// A row opens and closes its own height, so the list never jumps.
function animateRow(element: Element, done: () => void, opening: boolean) {
  const row = element as HTMLElement
  const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (still || typeof row.animate !== 'function') return done()
  const { paddingTop, paddingBottom } = getComputedStyle(row)
  const open = { height: `${row.offsetHeight}px`, paddingTop, paddingBottom, opacity: 1 }
  const closed = { height: '0px', paddingTop: '0px', paddingBottom: '0px', opacity: 0 }
  row.style.overflow = 'hidden'
  const animation = row.animate(opening ? [closed, open] : [open, closed], {
    duration: 220,
    easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
    // A leaving row stays closed until it is taken out.
    fill: opening ? 'none' : 'forwards',
  })
  animation.onfinish = animation.oncancel = () => {
    row.style.overflow = ''
    done()
  }
}
const onRowEnter = (element: Element, done: () => void) => animateRow(element, done, true)
const onRowLeave = (element: Element, done: () => void) => animateRow(element, done, false)
function onRowBeforeLeave(element: Element) {
  element.setAttribute('data-leaving', '')
  element.setAttribute('inert', '')
}

const hasOpenListener = () => !!instance?.vnode.props?.onOpen

function nameTag(row: Row) {
  if (row.pending) return 'span'
  if (hasOpenListener()) return 'button'
  return row.href ? 'a' : 'span'
}
function nameAttrs(row: Row): Record<string, unknown> {
  if (row.pending) return {}
  if (hasOpenListener()) return { type: 'button', onClick: () => emit('open', row.source) }
  return row.href ? { href: row.href, target: '_blank', rel: 'noopener noreferrer' } : {}
}

function removeLabel(row: Row): string {
  if (row.pending) return fill(ousiText.value.discardFile, { name: row.name })
  const template =
    row.state === 'uploading' ? ousiText.value.cancelUpload : ousiText.value.removeFile
  return fill(template, { name: row.name })
}

/**
 * Runs an action that takes the focused button away with it, and keeps the keyboard in the list.
 * If the app moved focus elsewhere, say to a confirm dialog, it stays there.
 */
async function keepingFocus(event: Event, index: number, action: () => void) {
  const item = (event.target as HTMLElement).closest('li')
  const hadFocus = !!item?.contains(document.activeElement)
  action()
  await nextTick()
  const active = document.activeElement
  if (!hadFocus || (active && active !== document.body && !item?.contains(active))) return
  focusRow(index)
}

function focusRow(index: number) {
  const buttons = rootRef.value?.querySelectorAll<HTMLElement>(
    '[data-slot="file-upload-item"]:not([data-leaving]) [data-slot="file-upload-remove"]',
  )
  const next = buttons?.length ? buttons[Math.min(index, buttons.length - 1)] : fileInput.value
  next?.focus()
}

function removeRow(row: Row, index: number, event: Event) {
  keepingFocus(event, index, () => {
    if (row.pending) decide(row.pending, 'discard')
    else if (row.file) {
      emit('remove', row.file)
      setFiles(files.value.filter((f) => f !== row.file))
    } else {
      const uploaded = row.source as FileUploadUploadedFile
      emit('removeUploaded', uploaded)
      emit('update:uploadedFiles', props.uploadedFiles.filter((f) => f !== uploaded))
    }
  })
}

// From the dialog the focused button goes away with it, so focus returns to the row it was about.
async function decideCompared(choice: 'result' | 'original') {
  const item = compared.value
  if (!item) return
  const index = renderedRows.findIndex((row) => row.key === item.key)
  decide(item, choice)
  await nextTick()
  focusRow(Math.max(0, index))
}

/** Everything the native input takes, in the order that lets an app replace only what it may. */
const inputAttrs = () => ({
  'aria-labelledby': labelledBy(),
  ...controlAttrs.value,
  id: controlId.value,
  type: 'file',
  class: 'peer sr-only bottom-0 left-1/2',
  name: props.name,
  accept: props.accept,
  capture: props.capture,
  multiple: props.multiple,
  disabled: props.disabled,
  // An uploaded file already satisfies the field, but the native input cannot know about it.
  required: props.required && props.uploadedFiles.length === 0,
  'aria-required': props.required || undefined,
  'aria-invalid': isInvalid.value || undefined,
  'aria-describedby': describedBy.value,
})
</script>

<template>
  <div
    v-bind="rootAttrs"
    ref="rootRef"
    :class="cn('flex w-full flex-col', props.class)"
    data-slot="file-upload"
    :data-takes-paste="paste !== 'none' && !disabled ? '' : undefined"
  >
    <label
      v-if="label"
      :id="labelId"
      :for="controlId"
      :class="cn(
        labelTheme({ required: required || undefined, disabled: disabled || undefined, invalid: isInvalid || undefined }),
        'mb-1.5',
      )"
    >
      {{ label }}
    </label>

    <!-- Drop area -->
    <div
      v-if="variant === 'area'"
      class="group/zone relative"
      data-slot="file-upload-zone"
      :data-dragging="isDragActive ? '' : undefined"
      :data-disabled="disabled ? '' : undefined"
      v-on="dragListeners"
    >
      <input ref="fileInput" v-bind="inputAttrs()" @change="onInputChange" />
      <label
        :for="controlId"
        data-slot="file-upload-dropzone"
        :class="fileUploadAreaTheme({ size, state: zoneState, shadow, animated })"
      >
        <slot v-if="!hideIcon" name="icon" :active="isDragActive" :disabled="disabled">
          <FileUploadIllustration :size="props.size" :active="isDragActive" :disabled="disabled" />
        </slot>
        <span class="flex flex-col gap-1">
          <span :id="textId" data-slot="file-upload-text" :class="fileUploadTextTheme({ size, disabled })">
            <slot name="text" :active="isDragActive">{{ areaText }}</slot>
          </span>
          <span v-if="showHint()" :id="hintId" data-slot="file-upload-hint" :class="fileUploadHintTheme">
            <slot name="hint">{{ hintText }}</slot>
          </span>
        </span>
      </label>
    </div>

    <!-- Compact strip -->
    <template v-else-if="variant === 'inline'">
      <div
        :class="cn('group/zone', fileUploadInlineTheme({ size, state: zoneState, shadow, animated }))"
        data-slot="file-upload-zone"
        :data-dragging="isDragActive ? '' : undefined"
        :data-disabled="disabled ? '' : undefined"
        v-on="dragListeners"
      >
        <slot v-if="!hideIcon" name="icon" :active="isDragActive" :disabled="disabled">
          <UploadGlyph :class="fileUploadInlineIconTheme({ size: props.size, active: isDragActive })" />
        </slot>
        <span :class="fileUploadInlineTextTheme({ size })" data-slot="file-upload-text">
          <slot name="text" :active="isDragActive">{{ text ?? ousiText.dropHere }}</slot>
        </span>
        <span class="relative ml-auto inline-flex shrink-0">
          <input ref="fileInput" v-bind="inputAttrs()" @change="onInputChange" />
          <label
            :id="textId"
            :for="controlId"
            data-slot="file-upload-trigger"
            :class="cn(
              buttonTheme({ variant: 'secondary', size }),
              fileUploadTriggerTheme({ state: disabled ? 'disabled' : 'idle' }),
            )"
          >
            {{ browseText }}
          </label>
        </span>
      </div>
      <span v-if="showHint()" :id="hintId" data-slot="file-upload-hint" :class="cn(fileUploadHintTheme, 'mt-1.5')">
        <slot name="hint">{{ hintText }}</slot>
      </span>
    </template>

    <!-- A button, with the hint beside it -->
    <div
      v-else
      class="flex flex-wrap items-center gap-x-3 gap-y-1.5"
      data-slot="file-upload-zone"
      :data-dragging="isDragActive ? '' : undefined"
      :data-disabled="disabled ? '' : undefined"
      v-on="dragListeners"
    >
      <span class="group/zone relative inline-flex max-w-full" :data-disabled="disabled ? '' : undefined">
        <input ref="fileInput" v-bind="inputAttrs()" @change="onInputChange" />
        <label
          :id="textId"
          :for="controlId"
          data-slot="file-upload-trigger"
          :class="cn(
            buttonTheme({ variant: 'outline', size, shadow }),
            'h-auto min-h-[var(--ousi-btn-h)] max-w-full whitespace-normal py-1',
            fileUploadTriggerTheme({ state: zoneState === 'idle' ? 'outlined' : zoneState }),
          )"
        >
          <slot v-if="!hideIcon" name="icon" :active="isDragActive" :disabled="disabled">
            <UploadGlyph class="size-4 shrink-0" />
          </slot>
          <span class="min-w-0 text-balance" data-slot="file-upload-text">
            <slot name="text" :active="isDragActive">{{ text ?? browseText }}</slot>
          </span>
        </label>
      </span>
      <span v-if="showHint()" :id="hintId" data-slot="file-upload-hint" :class="fileUploadHintTheme">
        <slot name="hint">{{ hintText }}</slot>
      </span>
    </div>

    <p v-if="resolvedError" :id="errorId" role="alert" :class="cn(fileUploadMessageTheme, 'text-ousi-danger')">
      {{ resolvedError }}
    </p>
    <p v-else-if="description" :id="descriptionId" :class="cn(fileUploadMessageTheme, 'text-ousi-muted')">
      {{ description }}
    </p>

    <div
      v-if="rejections.length"
      role="alert"
      :class="cn(fileUploadMessageTheme, 'flex flex-col gap-1 text-ousi-danger')"
      data-slot="file-upload-rejections"
    >
      <p v-for="(message, index) in rejections" :key="index" class="flex items-start gap-1.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="mt-px size-3.5 shrink-0" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7.5v5M12 16.2v.1" />
        </svg>
        <span class="min-w-0 break-words">{{ message }}</span>
      </p>
    </div>

    <!-- The rows are built here, in this component's render, so a status change updates it. The list
         stays mounted for the rows to animate in and out, and hides itself while it has none. -->
    <template v-for="list in [rows()]" :key="'list'">
      <TransitionGroup
        v-if="!hideFileList || confirmTransform"
        tag="ul"
        :css="false"
        :class="fileUploadListTheme"
        data-slot="file-upload-list"
        @before-leave="onRowBeforeLeave"
        @enter="onRowEnter"
        @leave="onRowLeave"
      >
        <li
          v-for="(row, index) in list"
          :key="row.key"
          :class="fileUploadFileTheme({ size })"
          data-slot="file-upload-item"
          :data-state="row.state"
        >
          <!-- With a second button the name gives way sooner, so narrow rows stay on one line. -->
          <div :class="['flex min-w-0 flex-1 items-center gap-3', canEdit(row) ? 'basis-28' : 'basis-36']">
            <span :class="fileUploadFileIconTheme({ size })" data-slot="file-upload-item-icon" aria-hidden="true">
              <slot name="file-icon" :file="row.source" :kind="row.kind" :preview-url="row.previewUrl">
                <FileTypeIcon
                  :kind="row.kind"
                  :preview-url="row.previewUrl"
                  :fit="preview === 'cover' ? 'cover' : 'contain'"
                  @preview-error="brokenPreviews.push(row.previewUrl!)"
                />
              </slot>
            </span>
            <span class="flex min-w-0 flex-1 flex-col items-start gap-0.5">
              <component
                :is="nameTag(row)"
                v-bind="nameAttrs(row)"
                :title="row.name"
                data-slot="file-upload-item-name"
                :class="cn(
                  'block min-w-0 max-w-full text-left font-medium text-ousi-foreground',
                  !row.nameEnd && 'truncate',
                  nameTag(row) !== 'span' && 'cursor-(--ousi-cursor-interactive) rounded-ousi-xs underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ousi-focus',
                )"
              >
                <template v-if="row.nameEnd">
                  <!-- Cut in the middle, so the extension stays in sight. A reader hears the whole name. -->
                  <span class="sr-only">{{ row.name }}</span>
                  <span class="flex whitespace-pre" aria-hidden="true">
                    <span class="min-w-0 overflow-hidden text-ellipsis">{{ row.nameStart }}</span>
                    <span class="shrink-0">{{ row.nameEnd }}</span>
                  </span>
                </template>
                <template v-else>{{ row.name }}</template>
              </component>
              <span
                :class="cn(
                  'flex min-h-4 max-w-full items-center gap-1.5 text-xs leading-4 tabular-nums',
                  row.state === 'error' ? 'text-ousi-danger' : 'text-ousi-muted',
                )"
                data-slot="file-upload-item-status"
              >
                <svg v-if="row.state === 'done'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 shrink-0 text-ousi-success-soft-strong" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="m8.2 12.3 2.6 2.6 5-5.2" />
                </svg>
                <svg v-else-if="row.state === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="size-3.5 shrink-0" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7.5v5M12 16.2v.1" />
                </svg>
                <span v-if="row.state === 'done'" class="sr-only">{{ ousiText.fileUploaded }}</span>
                <span class="truncate" :title="row.state === 'error' ? row.meta : undefined">{{ row.meta }}</span>
              <span v-if="row.saving" class="shrink-0 rounded-full bg-ousi-success-soft px-1.5 text-[0.6875rem] font-medium text-ousi-success-soft-strong" data-slot="file-upload-saving">
                {{ row.saving }}
              </span>
              </span>
            </span>
          </div>

          <div class="ml-auto flex shrink-0 items-center gap-1">
            <slot
              v-if="row.state !== 'processing' && row.state !== 'review'"
              name="file-actions"
              :file="row.source"
              :state="row.state"
            />
            <OButton
              v-if="row.state === 'error' && row.file"
              variant="text"
              size="sm"
              :disabled="disabled"
              :aria-label="`${ousiText.retryUpload}: ${row.name}`"
              data-slot="file-upload-retry"
              @click="emit('retry', row.file)"
            >
              {{ ousiText.retryUpload }}
            </OButton>
            <OButton
              v-if="canEdit(row)"
              variant="text"
              size="sm"
              is-icon-only
              :disabled="disabled"
              :loading="!row.file && editing?.key === row.key"
              :aria-label="fill(ousiText.editFile, { name: row.name })"
              :title="fill(ousiText.editFile, { name: row.name })"
              data-slot="file-upload-edit"
              @click="editRow(row)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true">
                <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" />
                <path d="m13.5 6.5 4 4" />
              </svg>
            </OButton>
            <OButton
              variant="text"
              size="sm"
              is-icon-only
              :disabled="disabled"
              :aria-label="removeLabel(row)"
              data-slot="file-upload-remove"
              @click="removeRow(row, index, $event)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" class="size-4" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </OButton>
          </div>

          <div v-if="row.state === 'review'" :class="fileUploadReviewTheme({ size })" data-slot="file-upload-review">
            <slot
              name="review"
              :original="row.pending!.original"
              :result="row.pending!.result!"
              :can-keep-original="canKeepOriginal(row.pending!)"
              :accept="() => decide(row.pending!, 'result')"
              :keep-original="() => decide(row.pending!, 'original')"
              :discard="() => decide(row.pending!, 'discard')"
              :compare="canCompare(row.pending!) ? () => openCompare(row.pending!) : undefined"
            >
              <!-- Three weights: the suggested answer filled, the other outlined, and looking, which
                   decides nothing, set apart and quiet. -->
              <OButton
                size="xs"
                :disabled="disabled"
                data-slot="file-upload-accept"
                @click="keepingFocus($event, index, () => decide(row.pending!, 'result'))"
              >
                <template #start>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="size-3.5" aria-hidden="true">
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                </template>
                {{ ousiText.useNewVersion }}
              </OButton>
              <OButton
                v-if="canKeepOriginal(row.pending!)"
                variant="outline"
                size="xs"
                :disabled="disabled"
                data-slot="file-upload-keep"
                @click="keepingFocus($event, index, () => decide(row.pending!, 'original'))"
              >
                {{ ousiText.keepOriginal }}
              </OButton>
              <!-- Says why there is no way to keep the original. -->
              <span v-else class="px-1 text-xs text-ousi-muted">
                {{ fill(ousiText.originalTooLarge, { size: formatSize(maxSize!) }) }}
              </span>
              <OButton
                v-if="canCompare(row.pending!)"
                variant="text"
                size="xs"
                class="ml-auto text-ousi-muted hover:text-ousi-foreground"
                data-slot="file-upload-compare-open"
                @click="openCompare(row.pending!)"
              >
                <template #start>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="size-3.5" aria-hidden="true">
                    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
                    <circle cx="12" cy="12" r="2.75" />
                  </svg>
                </template>
                {{ ousiText.compare }}
              </OButton>
            </slot>
          </div>

          <span
            v-if="row.state === 'uploading' || row.state === 'processing'"
            role="progressbar"
            :aria-label="row.name"
            :aria-valuenow="row.percent"
            aria-valuemin="0"
            aria-valuemax="100"
            :class="fileUploadProgressTheme"
          >
            <span
              :class="fileUploadProgressFillTheme({ indeterminate: row.percent === undefined })"
              :style="row.percent === undefined ? undefined : { width: `${row.percent}%` }"
            />
          </span>
          <!-- The progress bar takes the place of the line between rows. -->
          <span v-else class="absolute inset-x-3 bottom-0 h-px bg-ousi-border group-last/item:hidden" aria-hidden="true" />
        </li>
      </TransitionGroup>
    </template>

    <OImageEditorDialog v-if="editable" ref="editorDialog" v-bind="editorSettings" />

    <FileUploadCompare
      v-if="compared?.result"
      :open="compareOpen"
      :title="fill(ousiText.compareTitle, { name: compared.original.name })"
      :original="compared.original"
      :result="compared.result"
      :original-size="formatSize(compared.original.size)"
      :result-size="formatSize(compared.result.size)"
      :can-keep-original="canKeepOriginal(compared)"
      :disabled="disabled"
      @close="compareOpen = false"
      @accept="decideCompared('result')"
      @keep-original="decideCompared('original')"
    />

    <span role="status" class="sr-only" data-slot="file-upload-announcer">{{ announcement }}</span>
  </div>
</template>
