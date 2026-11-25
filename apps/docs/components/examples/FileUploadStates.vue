<script setup lang="ts">
import { OFileUpload, type FileUploadStatus } from '@ousi-ui/vue'

const sample = (name: string, kb: number) => new File([new ArrayBuffer(kb * 1024)], name)

const files = [
  sample('Launch plan.docx', 84),
  sample('Brand guidelines.pdf', 4710),
  sample('Homepage hero.png', 1260),
  sample('Q1 forecast.xlsx', 305),
  sample('Product tour.mp4', 8200),
]

// Waiting, uploading, uploading without a known progress, done and failed.
const statuses: (FileUploadStatus | undefined)[] = [
  undefined,
  { progress: 64 },
  { state: 'uploading' },
  { progress: 100 },
  { error: 'Connection lost' },
]
const statusOf = (file: File) => statuses[files.indexOf(file)]
</script>

<template>
  <OFileUpload :model-value="files" :file-status="statusOf" multiple class="max-w-md" />
</template>
