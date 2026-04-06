<script setup lang="ts">
import { OButton } from '@ousi-ui/vue'
import { toast } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex items-center gap-3 flex-wrap">
    <OButton variant="secondary" size="sm" @click="toast.info('You have 2 credits left', { description: 'Get a paid plan for more credits', action: { label: 'Upgrade', onClick: () => {} } })">
      Accent + action
    </OButton>
    <OButton variant="secondary" size="sm" @click="toast.success('Plan upgraded', { description: 'You can continue using Ousi UI', action: { label: 'Billing', onClick: () => {} } })">
      Success + action
    </OButton>
    <OButton variant="secondary" size="sm" @click="toast.danger('Storage is full', { description: 'Remove files to release space', action: { label: 'Remove', onClick: () => {} } })">
      Danger + action
    </OButton>
    <OButton variant="secondary" size="sm" @click="toast('Team invitation', { description: 'Bob invited you to join the team', action: { label: 'Dismiss', onClick: () => toast.clear() } })">
      Default + action
    </OButton>
  </div>
</template>
