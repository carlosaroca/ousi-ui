<script setup lang="ts">
import { OTable, OChip } from '@ousi-ui/vue'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status' },
]
const rows = [
  { id: '1', name: 'Alice', active: true },
  { id: '2', name: 'Bob', active: false },
  { id: '3', name: 'Charlie', active: true },
]
</script>
<template>
  <OTable :columns="columns" :rows="rows">
    <template #cell-status="{ row }">
      <OChip :color="row.active ? 'success' : 'danger'" size="sm">
        {{ row.active ? 'Active' : 'Inactive' }}
      </OChip>
    </template>
  </OTable>
</template>
