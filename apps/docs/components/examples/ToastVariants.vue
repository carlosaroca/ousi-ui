<script setup lang="ts">
import { OButton } from '@ousi-ui/vue'
import { toast } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-wrap gap-3">
    <OButton variant="outline" @click="toast('Default toast')">Default</OButton>
    <OButton variant="outline" @click="toast.success('Success!')">Success</OButton>
    <OButton variant="outline" @click="toast.warning('Warning!')">Warning</OButton>
    <OButton variant="outline" @click="toast.danger('Error!')">Danger</OButton>
  </div>
</template>
