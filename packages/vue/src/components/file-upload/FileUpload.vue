<script setup lang="ts">
import { ref, computed, useId, getCurrentInstance } from 'vue'
import { cn } from '@ousi-ui/core'
import { useOusiConfig, useOusiMessages } from '../../config'
import { OButton } from '../button'
import {
  fileUploadAreaTheme,
  fileUploadIconTheme,
  fileUploadTextTheme,
  fileUploadLinkTheme,
  fileUploadInlineTheme,
  fileUploadInlineIconTheme,
  fileUploadInlineTextTheme,
  fileUploadHintTheme,
  fileUploadErrorTheme,
  fileUploadListTheme,
  fileUploadFileTheme,
  fileUploadFileIconTheme,
  fileUploadProgressTheme,
} from './file-upload.theme'
import type { FileUploadProps, FileUploadEmits, FileUploadStatus } from './file-upload.types'

const props = withDefaults(defineProps<FileUploadProps>(), {
  modelValue: undefined,
  multiple: false,
  disabled: false,
  variant: 'area',
  size: 'md',
  shadow: 'none',
  animated: false,
  hideFileList: false,
  hideHint: false,
})

const emit = defineEmits<FileUploadEmits>()

const ousiText = useOusiMessages()
const ousiConfig = useOusiConfig()
const hintId = useId()

const fileInput = ref<HTMLInputElement | null>(null)
const ownFiles = ref<File[]>([])
const files = computed(() => props.modelValue ?? ownFiles.value)
const rejection = ref('')

// Counting enter/leave keeps the highlight while the pointer crosses the area's children.
const dragDepth = ref(0)
const isDragActive = computed(() => dragDepth.value > 0)

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}

function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit++
  }
  const number = new Intl.NumberFormat(ousiConfig.locale.value, {
    maximumFractionDigits: unit === 0 ? 0 : 1,
  }).format(value)
  return `${number} ${units[unit]}`
}

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

const formatsLabel = computed(() => {
  if (!props.accept) return ''
  const labels = [...new Set(props.accept.split(',').filter((t) => t.trim()).map(typeLabel))]
  return fill(ousiText.value.acceptedFormats, { formats: labels.join(', ') })
})
const maxSizeLabel = computed(() =>
  props.maxSize ? fill(ousiText.value.maxFileSize, { size: formatFileSize(props.maxSize) }) : '',
)
const showHint = computed(() => !props.hideHint && (!!formatsLabel.value || !!maxSizeLabel.value))

function isAccepted(file: File): boolean {
  if (!props.accept) return true
  return props.accept.split(',').some((token) => {
    const type = token.trim().toLowerCase()
    if (!type) return false
    if (type.startsWith('.')) return file.name.toLowerCase().endsWith(type)
    if (type.endsWith('/*')) return file.type.toLowerCase().startsWith(type.slice(0, -1))
    return file.type.toLowerCase() === type
  })
}

function setFiles(next: File[]) {
  ownFiles.value = next
  emit('update:modelValue', next)
  emit('change', next)
}

// An app listening to `error` shows the message its own way; otherwise it shows here.
const instance = getCurrentInstance()
const showsOwnError = computed(() => !instance?.vnode.props?.onError)

function reject(message: string) {
  if (showsOwnError.value) rejection.value = message
  emit('error', message)
}

function processFiles(incoming: File[]) {
  rejection.value = ''
  let valid = incoming.filter((file) => {
    if (!isAccepted(file)) {
      reject(fill(ousiText.value.fileTypeRejected, { name: file.name }))
      return false
    }
    if (props.maxSize && file.size > props.maxSize) {
      reject(fill(ousiText.value.fileTooLarge, { name: file.name, size: formatFileSize(props.maxSize) }))
      return false
    }
    return true
  })
  if (!props.multiple) valid = valid.slice(0, 1)
  else if (props.maxFiles && files.value.length + valid.length > props.maxFiles) {
    reject(fill(ousiText.value.tooManyFiles, { count: props.maxFiles }))
    valid = valid.slice(0, Math.max(0, props.maxFiles - files.value.length))
  }
  if (valid.length === 0) return
  setFiles(props.multiple ? [...files.value, ...valid] : valid)
}

function openPicker() {
  if (props.disabled) return
  fileInput.value?.click()
}

function onInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) processFiles(Array.from(target.files))
  target.value = ''
}

function onDragEnter(event: DragEvent) {
  if (props.disabled) return
  event.preventDefault()
  dragDepth.value++
}
function onDragOver(event: DragEvent) {
  if (props.disabled) return
  event.preventDefault()
}
function onDragLeave(event: DragEvent) {
  if (props.disabled) return
  event.preventDefault()
  dragDepth.value = Math.max(0, dragDepth.value - 1)
}
function onDrop(event: DragEvent) {
  if (props.disabled) return
  event.preventDefault()
  dragDepth.value = 0
  if (event.dataTransfer?.files) processFiles(Array.from(event.dataTransfer.files))
}

function removeFile(file: File) {
  emit('remove', file)
  setFiles(files.value.filter((f) => f !== file))
}

function statusOf(file: File): FileUploadStatus | undefined {
  return props.fileStatus?.(file)
}
function isUploading(file: File): boolean {
  const progress = statusOf(file)?.progress
  return progress !== undefined && progress < 100 && !statusOf(file)?.error
}
function fileTone(file: File): 'default' | 'success' | 'danger' {
  const status = statusOf(file)
  if (status?.error) return 'danger'
  return status?.progress === 100 ? 'success' : 'default'
}
function fileMeta(file: File): string {
  const size = formatFileSize(file.size)
  if (!isUploading(file)) return size
  return `${size} · ${Math.round(statusOf(file)!.progress!)} %`
}
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      tabindex="-1"
      aria-hidden="true"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      @change="onInputChange"
    />

    <div
      v-if="variant === 'area'"
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-disabled="disabled || undefined"
      :aria-describedby="showHint ? hintId : undefined"
      :class="cn(
        fileUploadAreaTheme({ size, active: isDragActive, shadow, animated }),
        disabled && 'pointer-events-none opacity-50',
      )"
      @click="openPicker"
      @keydown.enter.prevent="openPicker"
      @keydown.space.prevent="openPicker"
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <slot name="icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" :class="fileUploadIconTheme({ size, active: isDragActive })">
          <path d="M14 3H8a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8z" />
          <path d="M14 3v5h5" />
          <path d="M12 17v-6m0 0-2.5 2.5M12 11l2.5 2.5" />
        </svg>
      </slot>
      <div :class="fileUploadTextTheme({ size })">
        <slot name="text">
          {{ ousiText.dropHere }}
          <span :class="fileUploadLinkTheme">{{ multiple ? ousiText.chooseFiles : ousiText.chooseFile }}</span>
        </slot>
      </div>
    </div>

    <div
      v-else
      :class="cn(
        fileUploadInlineTheme({ size, active: isDragActive, shadow, animated }),
        disabled && 'pointer-events-none opacity-50',
      )"
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" :class="fileUploadInlineIconTheme({ size, active: isDragActive })">
        <path d="M14 3H8a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8z" />
        <path d="M14 3v5h5" />
        <path d="M12 17v-6m0 0-2.5 2.5M12 11l2.5 2.5" />
      </svg>
      <span :class="fileUploadInlineTextTheme({ size })">{{ ousiText.dropHere }}</span>
      <OButton :size="size" variant="secondary" :disabled="disabled" :aria-describedby="showHint ? hintId : undefined" @click="openPicker">
        {{ ousiText.browseFiles }}
      </OButton>
    </div>

    <div v-if="showHint" :id="hintId" :class="fileUploadHintTheme">
      <span v-if="formatsLabel">{{ formatsLabel }}</span>
      <span v-if="maxSizeLabel" class="ml-auto">{{ maxSizeLabel }}</span>
    </div>

    <p v-if="rejection" role="alert" :class="fileUploadErrorTheme">{{ rejection }}</p>

    <ul v-if="!hideFileList && files.length > 0" :class="fileUploadListTheme">
      <li
        v-for="(file, index) in files"
        :key="`${file.name}-${file.size}-${index}`"
        :class="fileUploadFileTheme({ size })"
      >
        <span :class="fileUploadFileIconTheme({ tone: fileTone(file) })" aria-hidden="true">
          <svg v-if="fileTone(file) === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-4">
            <path d="M14 3H8a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8z" />
            <path d="M14 3v5h5" />
          </svg>
        </span>
        <span class="min-w-0 flex-1">
          <span class="block truncate font-medium text-ousi-foreground">{{ file.name }}</span>
          <span v-if="statusOf(file)?.error" class="block truncate text-xs text-ousi-danger">
            {{ statusOf(file)?.error || ousiText.uploadFailed }}
          </span>
          <span v-else class="block text-xs text-ousi-muted tabular-nums">{{ fileMeta(file) }}</span>
        </span>
        <OButton
          v-if="statusOf(file)?.error"
          variant="text"
          size="sm"
          :disabled="disabled"
          @click="emit('retry', file)"
        >
          {{ ousiText.retryUpload }}
        </OButton>
        <OButton
          v-if="!isUploading(file)"
          variant="text"
          size="sm"
          is-icon-only
          :disabled="disabled"
          :aria-label="fill(ousiText.removeFile, { name: file.name })"
          @click="removeFile(file)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true">
            <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
          </svg>
        </OButton>
        <span
          v-if="isUploading(file)"
          role="progressbar"
          :aria-valuenow="Math.round(statusOf(file)!.progress!)"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="file.name"
          :class="fileUploadProgressTheme"
          :style="{ width: `${statusOf(file)!.progress}%` }"
        />
      </li>
    </ul>
  </div>
</template>
