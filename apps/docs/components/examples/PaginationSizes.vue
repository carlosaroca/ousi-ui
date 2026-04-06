<script setup lang="ts">
import { OPagination } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-col gap-4">
    <OPagination :total="10" size="sm" />
    <OPagination :total="10" size="md" />
    <OPagination :total="10" size="lg" />
  </div>
</template>
