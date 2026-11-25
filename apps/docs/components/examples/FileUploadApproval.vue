<script setup lang="ts">
import { ref } from 'vue'
import { OButton, OFileUpload, compressImage, type FileUploadTransform } from '@ousi-ui/vue'

// A lighter version is suggested at 500 KB, but originals up to 5 MB are fine too.
const suggest: FileUploadTransform = (file, { signal }) =>
  compressImage(file, { maxSize: 500 * 1024, signal })

const files = ref<File[]>([])
const pending = ref(0)
const sent = ref('')
</script>

<template>
  <div class="flex w-full max-w-md flex-col items-start gap-3">
    <OFileUpload
      v-model="files"
      multiple
      accept="image/*"
      :max-size="5 * 1024 * 1024"
      :transform="suggest"
      confirm-transform
      text="Drop a photo over 500 KB"
      hint="You choose between the lighter version and the original"
      @pending-change="(count) => (pending = count)"
    />
    <!-- Files waiting for a decision are not in v-model yet: hold the submit meanwhile. -->
    <OButton size="sm" :disabled="pending > 0 || !files.length" @click="sent = `${files.length} sent`">
      Send
    </OButton>
    <p class="text-xs text-ousi-muted" aria-live="polite">{{ sent }}</p>
  </div>
</template>
