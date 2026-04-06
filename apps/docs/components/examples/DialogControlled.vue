<script setup lang="ts">
import { ref } from 'vue'
import { ODialog, OButton } from '@ousi-ui/vue'
const isOpen = ref(false)
const status = ref('closed')
</script>
<template>
  <div class="flex items-center gap-3">
    <OButton @click="isOpen = true">Open</OButton>
    <span class="text-sm text-ousi-muted-foreground">Status: {{ status }}</span>
  </div>
  <ODialog v-model="isOpen" @open="status = 'open'" @close="status = 'closed'">
    <ODialog.Header>Controlled Dialog</ODialog.Header>
    <ODialog.Body>Events fire on open and close.</ODialog.Body>
  </ODialog>
</template>
