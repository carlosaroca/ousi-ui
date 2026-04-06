<script setup lang="ts">
import { OScrollShadow } from '@ousi-ui/vue'
</script>
<template>
  <OScrollShadow orientation="horizontal" class="w-full">
    <div class="flex gap-4 w-[800px] p-2">
      <div v-for="i in 10" :key="i" class="shrink-0 w-24 h-24 rounded-lg bg-ousi-muted flex items-center justify-center text-sm">{{ i }}</div>
    </div>
  </OScrollShadow>
</template>
