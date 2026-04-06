<script setup lang="ts">
import { ref } from 'vue'
import { ODialog, OButton } from '@ousi-ui/vue'
const open = ref(false)
</script>
<template>
  <OButton @click="open = true">Open Scrollable</OButton>
  <ODialog v-model="open" scroll-behavior="inside">
    <ODialog.Header>Scrollable Content</ODialog.Header>
    <ODialog.Body>
      <p v-for="i in 30" :key="i" class="mb-2">Paragraph {{ i }} of scrollable content.</p>
    </ODialog.Body>
    <ODialog.Footer>
      <OButton @click="open = false">Close</OButton>
    </ODialog.Footer>
  </ODialog>
</template>
