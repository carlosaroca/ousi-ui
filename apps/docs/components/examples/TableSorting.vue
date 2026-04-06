<script setup lang="ts">
import { OTable } from '@ousi-ui/vue'
import { ref } from 'vue'

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'age', label: 'Age', sortable: true },
]
const rows = [
  { id: '1', name: 'Alice', age: 30 },
  { id: '2', name: 'Bob', age: 25 },
  { id: '3', name: 'Charlie', age: 35 },
]
const sortDescriptor = ref({ column: 'name', direction: 'asc' as const })
</script>
<template>
  <OTable :columns="columns" :rows="rows" :sort-descriptor="sortDescriptor" @sort-change="sortDescriptor = $event" />
</template>
