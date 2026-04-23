<script setup lang="ts">
import { ref } from 'vue'
import { ODialog, ODialogHeader, ODialogBody, OButton } from '@ousi-ui/vue'
const isOpen = ref(false)
const status = ref('closed')
</script>
<template>
  <div class="flex items-center gap-3">
    <OButton @click="isOpen = true">Open</OButton>
    <span class="text-sm text-ousi-muted-foreground">Status: {{ status }}</span>
  </div>
  <ODialog v-model="isOpen" @open="status = 'open'" @close="status = 'closed'">
    <ODialogHeader>Controlled Dialog</ODialogHeader>
    <ODialogBody>Events fire on open and close.</ODialogBody>
  </ODialog>
</template>
