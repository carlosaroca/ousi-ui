<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { OFileUpload, type FileUploadUploadedFile } from '@ousi-ui/vue'

const added = ref<File[]>([])
const stored = ref<FileUploadUploadedFile[]>([])

// Stands in for a picture your server already has. Its url must allow fetch (same origin or CORS).
function samplePhoto(): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 800
  const context = canvas.getContext('2d')!
  context.fillStyle = '#0f766e'
  context.fillRect(0, 0, 1200, 800)
  context.fillStyle = '#fcd34d'
  context.beginPath()
  context.arc(360, 300, 150, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = '#134e4a'
  context.fillRect(0, 560, 1200, 240)
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.9))
}

const record = (name: string, blob: Blob): FileUploadUploadedFile => {
  const url = URL.createObjectURL(blob)
  return { id: 1, name, size: blob.size, type: blob.type, url, previewUrl: url }
}

// A real app uploads `file` here and updates the list when the server answers.
function replaceStored(previous: FileUploadUploadedFile, file: File) {
  URL.revokeObjectURL(previous.url!)
  stored.value = stored.value.map((item) => (item.id === previous.id ? record(file.name, file) : item))
}

onMounted(async () => (stored.value = [record('stored-photo.jpg', await samplePhoto())]))
onBeforeUnmount(() => stored.value.forEach((item) => URL.revokeObjectURL(item.url!)))
</script>

<template>
  <OFileUpload
    v-model="added"
    v-model:uploaded-files="stored"
    editable
    multiple
    accept="image/*"
    :max-size="2 * 1024 * 1024"
    class="max-w-md"
    @edit-uploaded="replaceStored"
  />
</template>
