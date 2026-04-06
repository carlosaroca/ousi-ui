<script setup lang="ts">
</script>

<template>
  <div class="w-full max-w-2xl rounded-ousi-xl border border-ousi-border overflow-hidden" style="height: 300px">
    <OResizable :default-size="35" :min-size="20" :max-size="60">
      <template #first>
        <div class="h-full bg-ousi-surface p-4">
          <span class="text-xs font-semibold text-ousi-muted uppercase tracking-wider">Sidebar</span>
          <div class="mt-3 flex flex-col gap-1">
            <div v-for="item in ['Dashboard', 'Projects', 'Settings', 'Help']" :key="item" class="px-3 py-1.5 rounded-ousi-lg text-sm text-ousi-foreground hover:bg-ousi-default cursor-pointer transition-colors">
              {{ item }}
            </div>
          </div>
        </div>
      </template>
      <template #second>
        <div class="h-full bg-ousi-default/30 p-4">
          <span class="text-xs font-semibold text-ousi-muted uppercase tracking-wider">Content</span>
          <p class="text-sm text-ousi-muted mt-3">Drag the handle to resize panels. This simulates a typical editor or IDE layout.</p>
        </div>
      </template>
    </OResizable>
  </div>
</template>
