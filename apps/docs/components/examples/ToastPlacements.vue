<script setup lang="ts">
import { OButton } from '@ousi-ui/vue'
import { toast } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-wrap gap-3">
    <OButton variant="secondary" size="sm" @click="toast('Check the toast position')">Show Toast</OButton>
  </div>
</template>
