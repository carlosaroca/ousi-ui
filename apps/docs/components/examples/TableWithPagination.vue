<script setup lang="ts">
import { OTable } from '@ousi-ui/vue'
import { ref, computed } from 'vue'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
]
const allRows = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  name: `User ${i + 1}`,
  role: i % 2 === 0 ? 'Admin' : 'Editor',
}))
const page = ref(1)
const perPage = 5
const paginatedRows = computed(() => allRows.slice((page.value - 1) * perPage, page.value * perPage))
</script>
<template>
  <div class="space-y-4">
    <OTable :columns="columns" :rows="paginatedRows" />
    <div class="flex gap-2">
      <button :disabled="page <= 1" class="px-3 py-1 border rounded disabled:opacity-50" @click="page--">Prev</button>
      <span class="px-3 py-1">Page {{ page }}</span>
      <button :disabled="page >= 4" class="px-3 py-1 border rounded disabled:opacity-50" @click="page++">Next</button>
    </div>
  </div>
</template>
