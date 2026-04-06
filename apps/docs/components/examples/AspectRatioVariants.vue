<script setup lang="ts">
</script>

<template>
  <div class="grid grid-cols-3 gap-4 w-full max-w-2xl">
    <div>
      <span class="text-xs text-ousi-muted mb-1 block">1:1</span>
      <OAspectRatio :ratio="1">
        <div class="w-full h-full rounded-ousi-xl bg-ousi-accent/15 flex items-center justify-center">
          <span class="text-sm font-medium text-ousi-accent">1:1</span>
        </div>
      </OAspectRatio>
    </div>
    <div>
      <span class="text-xs text-ousi-muted mb-1 block">4:3</span>
      <OAspectRatio :ratio="4/3">
        <div class="w-full h-full rounded-ousi-xl bg-ousi-success/15 flex items-center justify-center">
          <span class="text-sm font-medium text-ousi-success">4:3</span>
        </div>
      </OAspectRatio>
    </div>
    <div>
      <span class="text-xs text-ousi-muted mb-1 block">16:9</span>
      <OAspectRatio :ratio="16/9">
        <div class="w-full h-full rounded-ousi-xl bg-ousi-warning/15 flex items-center justify-center">
          <span class="text-sm font-medium text-ousi-warning">16:9</span>
        </div>
      </OAspectRatio>
    </div>
  </div>
</template>
