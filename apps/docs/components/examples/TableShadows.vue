<script setup lang="ts">
import { OTable } from '@ousi-ui/vue'

const levels = ['none', 'xs', 'sm', 'md'] as const

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
]

const rows = [
  { id: '1', name: 'Alice', role: 'Admin' },
  { id: '2', name: 'Bob', role: 'Editor' },
]
</script>
<template>
  <div class="grid grid-cols-1 gap-6 p-4 lg:grid-cols-2">
    <div v-for="level in levels" :key="level" class="flex flex-col gap-2">
      <OTable :shadow="level" :columns="columns" :rows="rows" />
      <p class="text-center text-xs font-mono text-ousi-muted">shadow="{{ level }}"</p>
    </div>
  </div>
</template>
