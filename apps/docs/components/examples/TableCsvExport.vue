<script setup lang="ts">
import { ref } from 'vue'
import { OTable, OButton } from '@ousi-ui/vue'
import type { TableColumn } from '@ousi-ui/vue'

const tableRef = ref<InstanceType<typeof OTable>>()

const columns: TableColumn[] = [
  { key: 'name',   label: 'Name' },
  { key: 'team',   label: 'Team' },
  { key: 'role',   label: 'Role' },
  { key: 'email',  label: 'Email' },
  { key: 'salary', label: 'Salary', align: 'right' },
]

const rows = [
  { id: '1', name: 'Lin Wei',       team: 'Apollo',  role: 'Designer',        email: 'lin@oasiui.dev',     salary: '$92k' },
  { id: '2', name: 'Marcus Chen',   team: 'Mercury', role: 'Senior Engineer', email: 'marcus@oasiui.dev',  salary: '$140k' },
  { id: '3', name: 'Priya Patel',   team: 'Gemini',  role: 'Product Manager', email: 'priya@oasiui.dev',   salary: '$118k' },
  { id: '4', name: 'Sofía Méndez',  team: 'Apollo',  role: 'Engineer',        email: 'sofia@oasiui.dev',   salary: '$96k' },
]

function download() {
  tableRef.value?.exportCSV({ filename: 'employees.csv' })
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center gap-3">
      <OButton variant="outline" size="sm" @click="download">
        <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
        Export CSV
      </OButton>
      <span class="text-xs text-ousi-muted">
        Exports the visible columns and currently filtered/sorted rows.
      </span>
    </div>
    <OTable ref="tableRef" :columns="columns" :rows="rows" />
  </div>
</template>
