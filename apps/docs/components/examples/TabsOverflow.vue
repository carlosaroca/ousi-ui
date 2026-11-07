<script setup lang="ts">
import { ref } from 'vue'
import { OTabs } from '@ousi-ui/vue'

// Tabs that do not fit scroll sideways. The scrollbar is hidden, and the active tab is
// always brought into view (try the arrow keys, or pick the last one).
const items = ['Panel', 'People', 'Links', 'Income and travel', 'Social media', 'Sources', 'Press', 'Legal documents', 'Background'].map(
  (label) => ({ key: label, label }),
)
const primary = ref('People')
const secondary = ref('Legal documents')
</script>
<template>
  <div class="flex w-full min-w-0 flex-col gap-8">
    <div class="w-full max-w-md">
      <p class="mb-2 text-xs text-ousi-muted">primary</p>
      <OTabs v-model="primary" :items="items" />
    </div>
    <div class="w-full max-w-md">
      <p class="mb-2 text-xs text-ousi-muted">secondary</p>
      <OTabs v-model="secondary" variant="secondary" :items="items" />
    </div>
    <!-- Inside a flex parent the tabs still stay within their column -->
    <div class="flex w-full max-w-md gap-2">
      <OTabs variant="secondary" :items="items" />
    </div>
    <div class="w-full max-w-md">
      <p class="mb-2 text-xs text-ousi-muted">overflow="menu": the tabs that do not fit go under a menu</p>
      <OTabs variant="secondary" overflow="menu" :items="items" />
    </div>
  </div>
</template>
