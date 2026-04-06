<script setup lang="ts">
import { OTable } from '@ousi-ui/vue'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
]
</script>
<template>
  <OTable :columns="columns" :rows="[]" empty-content="No data available." />
</template>
