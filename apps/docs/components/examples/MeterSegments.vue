<script setup lang="ts">
import { OMeter } from '@ousi-ui/vue'

const storage = [
  { label: 'Photos', value: 42, color: 'accent' },
  { label: 'Videos', value: 27, color: 'violet' },
  { label: 'Documents', value: 11, color: 'orange' },
  { label: 'Other', value: 2, color: 'success' },
]
const gigabytes: Intl.NumberFormatOptions = { style: 'unit', unit: 'gigabyte' }
</script>
<template>
  <div class="flex w-full max-w-md flex-col gap-8">
    <OMeter
      :segments="storage"
      :max-value="128"
      :format-options="gigabytes"
      size="lg"
      label="Storage"
      show-value-label
      show-legend
    />
    <OMeter :segments="storage" :max-value="128" size="lg" label="Joined" joined />
    <!-- More than fits: the bar is shared among them, and the figure says by how much. -->
    <OMeter :segments="storage" :max-value="64" size="lg" label="Over the limit" show-value-label />
  </div>
</template>
