<script setup lang="ts">
import { OButton } from '@ousi-ui/vue'
import { toast } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex items-center gap-3 flex-wrap">
    <OButton variant="secondary" size="sm" @click="toast('With onClose callback', {
      timeout: 0,
      description: 'Dismiss this to trigger onClose.',
      onClose: () => toast.success('onClose fired!'),
    })">
      onClose
    </OButton>
    <OButton variant="secondary" size="sm" @click="toast('Auto-close in 2s', {
      timeout: 2000,
      onAutoClose: () => toast.info('onAutoClose fired!'),
    })">
      onAutoClose
    </OButton>
  </div>
</template>
