<script setup lang="ts">
import { OMagneticButton, OChip } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex justify-center pt-52 pb-8">
    <OMagneticButton label="VIEW DETAILS" :popup-width="260">
      <template #popup>
        <div class="p-4 flex flex-col gap-2">
          <p class="text-sm font-semibold text-ousi-foreground">Ousi UI</p>
          <p class="text-xs text-ousi-muted">50+ Vue 3 components with haptic feedback, animations, and full a11y.</p>
          <div class="flex gap-1.5">
            <OChip color="accent" variant="soft" size="sm">Vue 3</OChip>
            <OChip color="success" variant="soft" size="sm">Tailwind</OChip>
          </div>
        </div>
      </template>
    </OMagneticButton>
  </div>
</template>
