<script setup lang="ts">
import { OButton, OFileUpload, useFileUpload, type FileUploadRequest } from '@ousi-ui/vue'

// Stands in for your request: pass `signal` to fetch or axios and report with `onProgress`.
function fakeUpload(file: File, { onProgress, signal }: FileUploadRequest) {
  return new Promise<string>((resolve, reject) => {
    let percent = 0
    const timer = setInterval(() => {
      percent += 4
      onProgress(percent)
      if (file.name.includes('error') && percent >= 60) finish(() => reject(new Error('Connection lost')))
      else if (percent >= 100) finish(() => resolve(`/files/${file.name}`))
    }, 120)
    const finish = (settle: () => void) => {
      clearInterval(timer)
      settle()
    }
    signal.addEventListener('abort', () => finish(() => reject(signal.reason)))
  })
}

const { files, statusOf, retry, isUploading, clear } = useFileUpload(fakeUpload, {
  // Two at a time: a third file waits its turn.
  concurrency: 2,
  errorMessage: (error) => (error instanceof Error ? error.message : undefined),
})
</script>

<template>
  <div class="flex w-full max-w-md flex-col items-start gap-3">
    <OFileUpload
      v-model="files"
      multiple
      accept=".pdf,image/*"
      :max-size="15 * 1024 * 1024"
      :file-status="statusOf"
      @retry="retry"
    />
    <OButton size="sm" :disabled="isUploading || !files.length" @click="clear">
      {{ isUploading ? 'Uploading…' : 'Save and clear' }}
    </OButton>
  </div>
</template>
