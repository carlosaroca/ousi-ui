<script setup lang="ts">
function onFilesChange(files: File[]) {
  console.log('Files:', files)
}
</script>

<template>
  <!-- Without an @error listener, the reason of each rejected file shows under the area. -->
  <OFileUpload
    accept=".jpg,.png"
    :max-size="5242880"
    class="max-w-md"
    @change="onFilesChange"
  />
</template>
