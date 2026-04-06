<script setup lang="ts">
import { OButton } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex gap-3">
    <OButton>
      <template #start>
        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </template>
      Next
    </OButton>
    <OButton variant="secondary">
      <template #start>
        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
      </template>
      Download
    </OButton>
  </div>
</template>
