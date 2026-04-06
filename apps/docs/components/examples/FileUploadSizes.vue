<script setup lang="ts">
import { OFileUpload } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-col gap-6">
    <div>
      <p class="text-xs text-ousi-muted mb-2">sm</p>
      <OFileUpload size="sm" variant="inline" />
    </div>
    <div>
      <p class="text-xs text-ousi-muted mb-2">md (default)</p>
      <OFileUpload size="md" variant="inline" />
    </div>
    <div>
      <p class="text-xs text-ousi-muted mb-2">lg</p>
      <OFileUpload size="lg" variant="inline" />
    </div>
  </div>
</template>
