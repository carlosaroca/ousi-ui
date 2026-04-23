<script setup lang="ts">
import { ref } from 'vue'
import { ODialog, ODialogHeader, ODialogBody, ODialogFooter, OButton } from '@ousi-ui/vue'
const open = ref(false)
</script>
<template>
  <OButton @click="open = true">Open Dialog</OButton>
  <ODialog v-model="open">
    <ODialogHeader>Dialog Title</ODialogHeader>
    <ODialogBody>This is the dialog content.</ODialogBody>
    <ODialogFooter>
      <OButton variant="outline" @click="open = false">Cancel</OButton>
      <OButton @click="open = false">Confirm</OButton>
    </ODialogFooter>
  </ODialog>
</template>
