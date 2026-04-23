<script setup lang="ts">
const levels = ['md', 'lg', 'xl', '2xl'] as const
</script>
<template>
  <div class="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2">
    <div
      v-for="level in levels"
      :key="level"
      class="rounded-ousi-3xl bg-ousi-overlay text-ousi-overlay-foreground p-6 min-h-32 flex flex-col items-center justify-center border border-ousi-border"
      :class="`shadow-ousi-${level}`"
    >
      <p class="text-xs font-mono text-ousi-muted">shadow</p>
      <p class="text-base font-semibold text-ousi-foreground">{{ level }}</p>
    </div>
  </div>
</template>
