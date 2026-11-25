<script setup lang="ts">
import { OFileUpload, compressImage, type FileUploadTransform } from '@ousi-ui/vue'

const LIMIT = 500 * 1024

// Photos over the limit are made lighter in the browser; the rest are left as they are.
const compress: FileUploadTransform = (file, { signal }) => compressImage(file, { maxSize: LIMIT, signal })
</script>

<template>
  <OFileUpload
    multiple
    accept="image/*"
    :max-size="LIMIT"
    :transform="compress"
    text="Drop photos of any size"
    hint="They are reduced to 500 KB for you"
    class="max-w-md"
  />
</template>
