<script setup lang="ts">
import { OTimeline } from '@ousi-ui/vue'
</script>
<template>
  <OTimeline layout="horizontal" :items="[
    { key: '1', content: 'Step 1', opposite: 'Setup', color: 'success' },
    { key: '2', content: 'Step 2', opposite: 'Configure', color: 'success' },
    { key: '3', content: 'Step 3', opposite: 'Deploy', color: 'warning' },
    { key: '4', content: 'Step 4', opposite: 'Monitor', color: 'default' },
  ]" />
</template>
