<script setup lang="ts">
import { OSkeleton } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex items-center gap-4">
    <OSkeleton class="h-4 w-48 rounded" />
    <OSkeleton class="h-12 w-12 rounded-full" />
    <OSkeleton class="h-24 w-32 rounded-lg" />
  </div>
</template>
