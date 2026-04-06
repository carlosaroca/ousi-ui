<script setup lang="ts">
import { ODisclosure, ODisclosureGroup } from '@ousi-ui/vue'
</script>
<template>
  <ODisclosureGroup :allow-multiple="true" class="flex flex-col gap-2">
    <ODisclosure class="rounded-ousi-2xl border border-ousi-border px-4">
      <template #title>Section 1</template>
      <p class="text-sm text-ousi-muted">Can be open simultaneously with other sections.</p>
    </ODisclosure>
    <ODisclosure class="rounded-ousi-2xl border border-ousi-border px-4">
      <template #title>Section 2</template>
      <p class="text-sm text-ousi-muted">Multiple panels can be expanded at the same time.</p>
    </ODisclosure>
    <ODisclosure class="rounded-ousi-2xl border border-ousi-border px-4">
      <template #title>Section 3</template>
      <p class="text-sm text-ousi-muted">Independent open/close behavior.</p>
    </ODisclosure>
  </ODisclosureGroup>
</template>
