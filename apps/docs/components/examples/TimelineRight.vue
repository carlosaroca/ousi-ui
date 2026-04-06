<script setup lang="ts">
import { OTimeline } from '@ousi-ui/vue'
</script>
<template>
  <OTimeline align="right" :items="[
    { key: '1', content: 'Design completed' },
    { key: '2', content: 'Development started' },
    { key: '3', content: 'Beta release' },
  ]" />
</template>
