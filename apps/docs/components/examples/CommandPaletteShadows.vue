<script setup lang="ts">
const levels = ['lg', 'xl', '2xl'] as const
</script>
<template>
  <div class="grid grid-cols-1 gap-6 p-4 lg:grid-cols-3">
    <div
      v-for="level in levels"
      :key="level"
      class="rounded-ousi-3xl bg-ousi-overlay text-ousi-overlay-foreground p-5 min-h-40 flex flex-col border border-ousi-border"
      :class="`shadow-ousi-${level}`"
    >
      <div class="mb-3 h-8 rounded-ousi-lg bg-ousi-surface-secondary flex items-center px-3 text-xs text-ousi-muted">
        Search...
      </div>
      <div class="flex-1 flex flex-col justify-end">
        <p class="text-xs font-mono text-ousi-muted">shadow</p>
        <p class="text-base font-semibold text-ousi-foreground">{{ level }}</p>
      </div>
    </div>
  </div>
</template>
