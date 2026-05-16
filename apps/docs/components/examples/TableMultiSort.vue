<script setup lang="ts">
import { OTable } from '@ousi-ui/vue'
import type { TableColumn, SortDescriptor } from '@ousi-ui/vue'

const columns: TableColumn[] = [
  { key: 'team',  label: 'Team',  sortable: true },
  { key: 'name',  label: 'Name',  sortable: true },
  { key: 'score', label: 'Score', sortable: true, align: 'right' },
]

const rows = [
  { id: '1', team: 'Apollo',  name: 'Lin',     score: 92 },
  { id: '2', team: 'Apollo',  name: 'Marcus',  score: 88 },
  { id: '3', team: 'Mercury', name: 'Priya',   score: 95 },
  { id: '4', team: 'Mercury', name: 'Sofía',   score: 71 },
  { id: '5', team: 'Gemini',  name: 'Hiro',    score: 83 },
  { id: '6', team: 'Gemini',  name: 'Amara',   score: 90 },
  { id: '7', team: 'Apollo',  name: 'Diego',   score: 76 },
  { id: '8', team: 'Mercury', name: 'Yusuf',   score: 88 },
]

const defaultSorts: SortDescriptor[] = [
  { column: 'team',  direction: 'asc' },
  { column: 'score', direction: 'desc' },
]
</script>
<template>
  <div class="space-y-3">
    <p class="text-xs text-ousi-muted">
      Click a header to sort by that column. <strong>Shift+click</strong> another header to add a secondary sort.
      A small badge shows the order of each active sort.
    </p>
    <OTable
      :columns="columns"
      :rows="rows"
      multi-sort
      :default-sort-descriptors="defaultSorts"
    />
  </div>
</template>
