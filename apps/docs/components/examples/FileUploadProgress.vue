<script setup lang="ts">
import { reactive, ref } from 'vue'
import { OFileUpload, type FileUploadStatus } from '@ousi-ui/vue'

const files = ref<File[]>([])
const status = reactive(new Map<File, FileUploadStatus>())

// Simulates an upload; a real app reports axios' onUploadProgress here.
function send(file: File) {
  status.set(file, { progress: 0 })
  const timer = setInterval(() => {
    const progress = (status.get(file)?.progress ?? 0) + 20
    if (file.name.includes('error') && progress >= 60) {
      status.set(file, { error: 'Upload failed' })
      clearInterval(timer)
    } else {
      status.set(file, { progress: Math.min(progress, 100) })
      if (progress >= 100) clearInterval(timer)
    }
  }, 400)
}

function onChange(next: File[]) {
  next.filter((f) => !status.has(f)).forEach(send)
}
</script>
<template>
  <OFileUpload
    v-model="files"
    multiple
    accept=".pdf,image/*"
    :max-size="15 * 1024 * 1024"
    :file-status="(f) => status.get(f)"
    @change="onChange"
    @retry="send"
    @remove="(f) => status.delete(f)"
  />
</template>
