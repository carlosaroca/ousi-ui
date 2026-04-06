<script setup lang="ts">
import { OTimeline } from '@ousi-ui/vue'
</script>
<template>
  <OTimeline :items="[
    { key: '1', content: 'Order placed' },
    { key: '2', content: 'Payment confirmed' },
    { key: '3', content: 'Shipped' },
    { key: '4', content: 'Delivered' },
  ]" />
</template>
