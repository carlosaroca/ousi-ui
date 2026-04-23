<script setup lang="ts">
const levels = ['md', 'lg', 'xl', '2xl'] as const
</script>
<template>
  <div class="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4">
    <div
      v-for="level in levels"
      :key="level"
      class="rounded-ousi-2xl bg-ousi-overlay text-ousi-overlay-foreground p-4 min-h-48 flex flex-col items-center justify-center border border-ousi-border"
      :class="`shadow-ousi-${level}`"
    >
      <p class="text-xs font-mono text-ousi-muted">shadow</p>
      <p class="text-sm font-semibold text-ousi-foreground">{{ level }}</p>
    </div>
  </div>
</template>
