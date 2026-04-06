<script setup lang="ts">
import { OSelect } from '@ousi-ui/vue'

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
]
</script>
<template>
  <OSelect
    label="Role"
    :options="roles"
    error-message="Please select a role."
  />
</template>
