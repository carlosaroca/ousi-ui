<script setup lang="ts">
import { OTabs } from '@ousi-ui/vue'
const items = [
  { key: 'account', label: 'Account' },
  { key: 'security', label: 'Security' },
  { key: 'billing', label: 'Billing' },
]
</script>
<template>
  <div class="flex flex-col gap-6">
    <div>
      <p class="text-xs text-ousi-muted mb-2">sm</p>
      <OTabs :items="items" size="sm" />
    </div>
    <div>
      <p class="text-xs text-ousi-muted mb-2">md (default)</p>
      <OTabs :items="items" size="md" />
    </div>
    <div>
      <p class="text-xs text-ousi-muted mb-2">lg</p>
      <OTabs :items="items" size="lg" />
    </div>
  </div>
</template>
