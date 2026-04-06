<script setup lang="ts">
import { OSelect } from '@ousi-ui/vue'

const tags = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'docs', label: 'Documentation' },
  { value: 'enhancement', label: 'Enhancement' },
]
</script>
<template>
  <OSelect
    multiple
    label="Tags"
    :options="tags"
    placeholder="Select tags..."
  />
</template>
