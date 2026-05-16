<script setup lang="ts">
import { OTable } from '@ousi-ui/vue'
import type { TableColumn } from '@ousi-ui/vue'

const columns: TableColumn[] = [
  { key: 'id', label: '#', width: 60 },
  { key: 'name', label: 'Name' },
  { key: 'team', label: 'Team' },
  { key: 'score', label: 'Score', align: 'right' },
]

const teams = ['Apollo', 'Mercury', 'Gemini', 'Voyager', 'Atlas']
const rows = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `Member ${String(i + 1).padStart(2, '0')}`,
  team: teams[i % teams.length],
  score: Math.round(60 + Math.random() * 40),
}))
</script>
<template>
  <OTable
    :columns="columns"
    :rows="rows"
    sticky-header
    style="--ousi-table-max-height: 18rem"
  />
</template>
