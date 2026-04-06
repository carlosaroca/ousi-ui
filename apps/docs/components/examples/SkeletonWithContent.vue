<script setup lang="ts">
import { OSkeleton } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex items-center gap-3">
    <OSkeleton class="h-10 w-10 rounded-full" />
    <div class="space-y-2">
      <OSkeleton class="h-4 w-32 rounded" />
      <OSkeleton class="h-3 w-48 rounded" />
    </div>
  </div>
</template>
