<script setup lang="ts">
function onFilesChange(files: File[]) {
  console.log('Files:', files)
}
</script>

<template>
  <OFileUpload
    multiple
    accept=".jpg,.png,.pdf"
    :max-size="5 * 1024 * 1024"
    class="max-w-md"
    @change="onFilesChange"
  />
</template>
