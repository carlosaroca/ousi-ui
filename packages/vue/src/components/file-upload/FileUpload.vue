<script setup lang="ts">
import { ref, computed } from 'vue'
import { cn } from '@ousi-ui/core'
import { OButton } from '../button'
import {
  fileUploadAreaTheme,
  fileUploadIconTheme,
  fileUploadTextTheme,
  fileUploadInlineTheme,
  fileUploadInlineIconTheme,
  fileUploadInlineTextTheme,
  fileUploadFileTheme,
} from './file-upload.theme'
import type { FileUploadProps, FileUploadEmits } from './file-upload.types'

const props = withDefaults(defineProps<FileUploadProps>(), {
  multiple: false,
  disabled: false,
  variant: 'area',
  size: 'md',
})

const emit = defineEmits<FileUploadEmits>()

const isDragActive = ref(false)
const selectedFiles = ref<File[]>([])
const fileInput = ref<HTMLInputElement | null>(null)

const buttonSize = computed((): 'sm' | 'md' | 'lg' => props.size)

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

function validateFiles(files: File[]): File[] {
  let valid = files
  if (props.accept) {
    const acceptedTypes = props.accept.split(',').map((t) => t.trim())
    valid = valid.filter((file) =>
      acceptedTypes.some((type) => {
        if (type.startsWith('.')) return file.name.toLowerCase().endsWith(type.toLowerCase())
        if (type.endsWith('/*')) return file.type.startsWith(type.replace('/*', '/'))
        return file.type === type
      }),
    )
    if (valid.length < files.length) emit('error', `Some files were rejected. Accepted: ${props.accept}`)
  }
  if (props.maxSize) {
    if (valid.some((f) => f.size > props.maxSize!)) {
      emit('error', `Some files exceed ${formatFileSize(props.maxSize)}`)
      valid = valid.filter((f) => f.size <= props.maxSize!)
    }
  }
  if (props.maxFiles) {
    const total = selectedFiles.value.length + valid.length
    if (total > props.maxFiles) {
      emit('error', `Maximum ${props.maxFiles} files allowed`)
      valid = valid.slice(0, Math.max(0, props.maxFiles - selectedFiles.value.length))
    }
  }
  return valid
}

function processFiles(files: File[]) {
  const valid = validateFiles(files)
  if (valid.length === 0) return
  selectedFiles.value = props.multiple ? [...selectedFiles.value, ...valid] : [valid[0]]
  emit('change', selectedFiles.value)
}

function handleClick() {
  if (props.disabled) return
  fileInput.value?.click()
}

function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files) return
  processFiles(Array.from(target.files))
  target.value = ''
}

function handleDragEnter(e: DragEvent) { if (props.disabled) return; e.preventDefault(); isDragActive.value = true }
function handleDragOver(e: DragEvent) { if (props.disabled) return; e.preventDefault(); isDragActive.value = true }
function handleDragLeave(e: DragEvent) { if (props.disabled) return; e.preventDefault(); isDragActive.value = false }
function handleDrop(e: DragEvent) {
  if (props.disabled) return
  e.preventDefault()
  isDragActive.value = false
  if (e.dataTransfer?.files) processFiles(Array.from(e.dataTransfer.files))
}

function removeFile(index: number) {
  selectedFiles.value = selectedFiles.value.filter((_, i) => i !== index)
  emit('change', selectedFiles.value)
}
</script>

<template>
  <div>
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      @change="handleInputChange"
    />

    <!-- Area variant -->
    <div
      v-if="variant === 'area'"
      :class="cn(
        fileUploadAreaTheme({ size, active: isDragActive }),
        disabled && 'opacity-50 pointer-events-none',
        props.class,
      )"
      @click="handleClick"
      @dragenter="handleDragEnter"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <slot name="icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" :class="fileUploadIconTheme({ size })">
          <path d="M12 16V8m0 0l-3 3m3-3l3 3" />
          <path d="M20 16.7428C21.2215 15.734 22 14.2195 22 12.5C22 9.46243 19.5376 7 16.5 7C16.2815 7 16.0771 6.886 15.9661 6.69774C14.6621 4.48484 12.2544 3 9.5 3C5.35786 3 2 6.35786 2 10.5C2 12.5661 2.83545 14.4371 4.18695 15.7935" />
        </svg>
      </slot>
      <div :class="fileUploadTextTheme({ size })">
        <slot name="text">
          <p class="font-medium">Drop files here</p>
          <p class="mt-1">or click to browse</p>
        </slot>
      </div>
    </div>

    <!-- Inline variant -->
    <div
      v-else
      :class="cn(
        fileUploadInlineTheme({ size, active: isDragActive }),
        disabled && 'opacity-50 pointer-events-none',
        props.class,
      )"
      @dragenter="handleDragEnter"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" :class="fileUploadInlineIconTheme({ size })">
        <path d="M12 16V8m0 0l-3 3m3-3l3 3" />
        <path d="M20 16.7428C21.2215 15.734 22 14.2195 22 12.5C22 9.46243 19.5376 7 16.5 7C16.2815 7 16.0771 6.886 15.9661 6.69774C14.6621 4.48484 12.2544 3 9.5 3C5.35786 3 2 6.35786 2 10.5C2 12.5661 2.83545 14.4371 4.18695 15.7935" />
      </svg>
      <span :class="fileUploadInlineTextTheme({ size })">Drop files here or</span>
      <OButton :size="buttonSize" variant="primary" :disabled="disabled" @click="handleClick">
        Browse
      </OButton>
    </div>

    <!-- File list -->
    <div v-if="selectedFiles.length > 0" class="mt-3 flex flex-col gap-2">
      <div
        v-for="(file, index) in selectedFiles"
        :key="`${file.name}-${index}`"
        :class="fileUploadFileTheme({ size })"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-4 shrink-0">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <span class="flex-1 truncate">{{ file.name }}</span>
        <span class="text-xs text-ousi-muted shrink-0">{{ formatFileSize(file.size) }}</span>
        <button
          type="button"
          class="ml-1 shrink-0 rounded p-0.5 text-ousi-muted hover:text-ousi-foreground transition-colors"
          @click.stop="removeFile(index)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
