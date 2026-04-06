<script setup lang="ts">
import { OAccordion, OChip, OButton } from '@ousi-ui/vue'
const items = [
  { key: 'pricing', title: 'Pricing' },
  { key: 'features', title: 'Features' },
  { key: 'support', title: 'Support' },
]
</script>
<template>
  <OAccordion class="max-w-md" :items="items">
    <template #content-pricing>
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <OChip color="success" variant="soft" size="sm">Free</OChip>
          <OChip color="accent" variant="soft" size="sm">Pro $9/mo</OChip>
          <OChip color="warning" variant="soft" size="sm">Enterprise</OChip>
        </div>
        <p class="text-sm text-ousi-background/60">Choose the plan that fits your needs.</p>
      </div>
    </template>
    <template #content-features>
      <ul class="text-sm text-ousi-background/60 space-y-1">
        <li>50+ Vue components</li>
        <li>Haptic feedback</li>
        <li>Theme builder</li>
        <li>Dark mode</li>
      </ul>
    </template>
    <template #content-support>
      <div class="flex flex-col gap-2">
        <p class="text-sm text-ousi-background/60">Get help from our team.</p>
        <OButton size="sm" variant="outline" class="w-fit !text-ousi-background/80 !border-ousi-background/20">Contact us</OButton>
      </div>
    </template>
  </OAccordion>
</template>
