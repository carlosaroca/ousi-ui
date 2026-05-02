<script setup lang="ts">
import { OButton } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-wrap gap-3">
    <OButton animation-type="vertical">
      Home
      <template #animate>
        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12l9-9 9 9M5 10v10h14V10" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </template>
    </OButton>

    <OButton variant="soft" animation-type="vertical">
      Message
      <template #animate>
        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Send</span>
      </template>
    </OButton>

    <OButton variant="outline" animation-type="scale">
      <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2l1 4h14l-3 9H7l-1-4M9 21a1 1 0 100-2 1 1 0 000 2zM18 21a1 1 0 100-2 1 1 0 000 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <template #animate>
        <span>Store</span>
      </template>
    </OButton>

    <OButton variant="danger" is-icon-only animation-type="rotate">
      <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 00-6 0v4M5 9h14l-1 11H6L5 9z" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <template #animate>
        <svg class="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9V5a3 3 0 00-6 0v4H5l1 11h12l1-11h-3z"/></svg>
      </template>
    </OButton>
  </div>
</template>
