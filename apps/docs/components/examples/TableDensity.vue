<script setup lang="ts">
import { ref } from 'vue'
import { OTable, OSelect } from '@ousi-ui/vue'
import type { TableColumn, TableDensity, SelectOption } from '@ousi-ui/vue'

const density = ref<TableDensity | string | number>('normal')

const densityOptions: SelectOption[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'normal',  label: 'Normal' },
  { value: 'relaxed', label: 'Relaxed' },
]

const columns: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'team', label: 'Team' },
  { key: 'role', label: 'Role' },
]

const rows = [
  { id: '1', name: 'Lin Wei',       team: 'Apollo',  role: 'Designer' },
  { id: '2', name: 'Marcus Chen',   team: 'Mercury', role: 'Engineer' },
  { id: '3', name: 'Priya Patel',   team: 'Gemini',  role: 'PM' },
  { id: '4', name: 'Sofía Méndez',  team: 'Apollo',  role: 'Engineer' },
  { id: '5', name: 'Diego Romero',  team: 'Mercury', role: 'Engineer' },
]
</script>

<template>
  <div class="space-y-3">
    <div class="max-w-xs">
      <OSelect v-model="density" :options="densityOptions" label="Density" size="sm" />
    </div>
    <OTable :columns="columns" :rows="rows" :density="density as TableDensity" />
  </div>
</template>
