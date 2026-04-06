<script setup lang="ts">
import { OTable } from '@ousi-ui/vue'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
]
const rows = [
  { id: '1', name: 'Alice', role: 'Admin' },
  { id: '2', name: 'Bob', role: 'Editor' },
  { id: '3', name: 'Charlie', role: 'Viewer' },
]
</script>
<template>
  <OTable :columns="columns" :rows="rows" />
</template>
