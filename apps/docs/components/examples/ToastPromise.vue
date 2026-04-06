<script setup lang="ts">
import { OButton } from '@ousi-ui/vue'
import { toast } from '@ousi-ui/vue'

function handleSave() {
  toast.promise(
    new Promise<void>(res => setTimeout(res, 2000)),
    { loading: 'Saving...', success: 'Saved!', error: 'Failed to save.' }
  )
}
</script>
<template>
  <OButton @click="handleSave">Save & Notify</OButton>
</template>
