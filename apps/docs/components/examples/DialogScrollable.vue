<script setup lang="ts">
import { ref } from 'vue'
import { ODialog, ODialogHeader, ODialogBody, ODialogFooter, OButton } from '@ousi-ui/vue'
const open = ref(false)
</script>
<template>
  <OButton @click="open = true">Open Scrollable</OButton>
  <ODialog v-model="open" scroll-behavior="inside">
    <ODialogHeader>Scrollable Content</ODialogHeader>
    <ODialogBody>
      <p v-for="i in 30" :key="i" class="mb-2">Paragraph {{ i }} of scrollable content.</p>
    </ODialogBody>
    <ODialogFooter>
      <OButton @click="open = false">Close</OButton>
    </ODialogFooter>
  </ODialog>
</template>
