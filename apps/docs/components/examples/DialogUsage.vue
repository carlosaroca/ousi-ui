<script setup lang="ts">
import { ref } from 'vue'
import { ODialog, OButton } from '@ousi-ui/vue'
const open = ref(false)
</script>
<template>
  <OButton @click="open = true">Open Dialog</OButton>
  <ODialog v-model="open">
    <ODialog.Header>Dialog Title</ODialog.Header>
    <ODialog.Body>This is the dialog content.</ODialog.Body>
    <ODialog.Footer>
      <OButton variant="outline" @click="open = false">Cancel</OButton>
      <OButton @click="open = false">Confirm</OButton>
    </ODialog.Footer>
  </ODialog>
</template>
