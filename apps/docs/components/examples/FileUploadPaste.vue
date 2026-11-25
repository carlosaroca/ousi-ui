<script setup lang="ts">
import { OFileUpload } from '@ousi-ui/vue'
</script>

<template>
  <OFileUpload
    multiple
    accept="image/*"
    text="Drop, choose or paste a screenshot"
    hint="With the pointer over this area, press ⌘V (Ctrl+V on Windows and Linux)"
    class="max-w-md"
  />
</template>
