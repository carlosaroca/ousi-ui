<script setup lang="ts">
function onFilesChange(files: File[]) {
  console.log('Files:', files)
}

function onError(error: { type: string; message: string }) {
  console.error('Upload error:', error.message)
}
</script>

<template>
  <OFileUpload
    accept=".jpg,.png"
    :max-size="5242880"
    @change="onFilesChange"
    @error="onError"
  />
</template>
