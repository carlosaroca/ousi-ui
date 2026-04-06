<script setup lang="ts">
function onFilesChange(files: File[]) {
  console.log('Files:', files)
}
</script>

<template>
  <OFileUpload variant="inline" multiple @change="onFilesChange" />
</template>
