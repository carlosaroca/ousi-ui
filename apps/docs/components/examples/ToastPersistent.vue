<script setup lang="ts">
import { OButton } from '@ousi-ui/vue'
import { toast } from '@ousi-ui/vue'

function demoManualLoading() {
  const id = toast('Saving changes...', { isLoading: true, timeout: 0 })
  setTimeout(() => { toast.close(id); toast.success('Changes saved!') }, 2000)
}
</script>
<template>
  <div class="flex items-center gap-3 flex-wrap">
    <OButton variant="secondary" size="sm" @click="toast('Important notice', { timeout: 0, description: 'This stays until you dismiss it.' })">
      Persistent
    </OButton>
    <OButton variant="secondary" size="sm" @click="toast('Quick message', { timeout: 2000 })">
      2s timeout
    </OButton>
    <OButton variant="secondary" size="sm" @click="demoManualLoading">
      Manual loading
    </OButton>
    <OButton variant="danger-soft" size="sm" @click="toast.clear()">
      Clear all
    </OButton>
  </div>
</template>
