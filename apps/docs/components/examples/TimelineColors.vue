<script setup lang="ts">
import { OTimeline } from '@ousi-ui/vue'
</script>
<template>
  <OTimeline :items="[
    { key: '1', content: 'Account created', color: 'accent' },
    { key: '2', content: 'Email verified', color: 'success' },
    { key: '3', content: 'Pending review', color: 'warning' },
    { key: '4', content: 'Access denied', color: 'danger' },
    { key: '5', content: 'Archived', color: 'default' },
  ]" />
</template>
