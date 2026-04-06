<script setup lang="ts">
import { ODisclosure, ODisclosureGroup } from '@ousi-ui/vue'
</script>
<template>
  <ODisclosureGroup class="rounded-ousi-2xl border border-ousi-border divide-y divide-ousi-border overflow-hidden">
    <ODisclosure class="px-4">
      <template #title>Only one open at a time</template>
      <p class="text-sm text-ousi-muted">Opening another section closes this one.</p>
    </ODisclosure>
    <ODisclosure class="px-4">
      <template #title>Accordion behavior</template>
      <p class="text-sm text-ousi-muted">This is the default single-expand mode.</p>
    </ODisclosure>
    <ODisclosure class="px-4">
      <template #title>Third section</template>
      <p class="text-sm text-ousi-muted">Only one section is expanded at any given time.</p>
    </ODisclosure>
  </ODisclosureGroup>
</template>
