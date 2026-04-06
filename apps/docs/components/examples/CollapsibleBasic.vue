<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <div class="w-full max-w-md">
    <OCollapsible v-model="isOpen">
      <template #trigger="{ isOpen: open, toggle }">
        <OButton variant="flat" size="sm" @click="toggle" class="mb-2">
          {{ open ? 'Hide Details' : 'Show Details' }}
        </OButton>
      </template>
      <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface p-4">
        <p class="text-sm text-ousi-muted">
          This content can be expanded or collapsed. Use the Collapsible component for progressive disclosure of content.
        </p>
      </div>
    </OCollapsible>
  </div>
</template>
