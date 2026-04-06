<script setup lang="ts">
import { OTimeline } from '@ousi-ui/vue'
</script>
<template>
  <OTimeline align="alternate" :items="[
    { key: '1', content: 'Design phase', opposite: 'Jan 2025', color: 'accent' },
    { key: '2', content: 'Development', opposite: 'Mar 2025', color: 'accent' },
    { key: '3', content: 'Testing & QA', opposite: 'May 2025', color: 'warning' },
    { key: '4', content: 'Public launch', opposite: 'Jun 2025', color: 'success' },
  ]" />
</template>
