<script setup lang="ts">
import { ODisclosure, OChip } from '@ousi-ui/vue'
</script>
<template>
  <ODisclosure>
    <template #trigger="{ isOpen }">
      <span class="flex size-8 items-center justify-center rounded-ousi-xl bg-ousi-accent-soft text-ousi-accent shrink-0">
        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4m0 4h.01" />
        </svg>
      </span>
      <span class="flex-1 text-left text-sm font-medium text-ousi-foreground">Custom trigger with icon</span>
      <OChip color="accent" variant="soft" size="sm">New</OChip>
      <svg
        :class="['size-4 text-ousi-muted transition-transform duration-250', isOpen ? '-rotate-180' : '']"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </template>
    <p class="text-sm text-ousi-muted">Using the trigger slot for completely custom content.</p>
  </ODisclosure>
</template>
