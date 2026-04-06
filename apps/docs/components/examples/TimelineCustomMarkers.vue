<script setup lang="ts">
import { OTimeline } from '@ousi-ui/vue'
</script>
<template>
  <OTimeline :items="[
    { key: 'cart', content: 'Added to cart', color: 'accent' },
    { key: 'pay', content: 'Payment processed', color: 'success' },
    { key: 'ship', content: 'Shipped via DHL', color: 'warning' },
    { key: 'done', content: 'Delivered', color: 'success' },
  ]">
    <template #marker-cart>
      <svg class="size-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
    </template>
    <template #marker-pay>
      <svg class="size-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>
    </template>
    <template #marker-ship>
      <svg class="size-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
    </template>
    <template #marker-done>
      <svg class="size-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>
    </template>
  </OTimeline>
</template>
