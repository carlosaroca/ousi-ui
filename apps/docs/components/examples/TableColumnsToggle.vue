<script setup lang="ts">
import { ref } from 'vue'
import { OTable, OContextMenu } from '@ousi-ui/vue'
import type { TableColumn, ContextMenuItem } from '@ousi-ui/vue'

const tableRef = ref<InstanceType<typeof OTable>>()

const columns: TableColumn[] = [
  { key: 'name',  label: 'Name' },
  { key: 'team',  label: 'Team' },
  { key: 'role',  label: 'Role' },
  { key: 'email', label: 'Email' },
  { key: 'city',  label: 'City' },
]

const rows = [
  { id: '1', name: 'Lin Wei',      team: 'Apollo',  role: 'Designer', email: 'lin@oasiui.dev',     city: 'Madrid' },
  { id: '2', name: 'Marcus Chen',  team: 'Mercury', role: 'Engineer', email: 'marcus@oasiui.dev',  city: 'Toronto' },
  { id: '3', name: 'Priya Patel',  team: 'Gemini',  role: 'PM',       email: 'priya@oasiui.dev',   city: 'Mumbai' },
  { id: '4', name: 'Sofía Méndez', team: 'Apollo',  role: 'Engineer', email: 'sofia@oasiui.dev',   city: 'Buenos Aires' },
]

// 1. Define the menu items you want on right-click.
const menuItems: ContextMenuItem[] = [
  { key: 'view',       label: 'View details' },
  { key: 'duplicate',  label: 'Duplicate row' },
  { key: 'sep',        label: '', separator: true },
  { key: 'hide-email', label: 'Toggle Email column' },
  { key: 'export',     label: 'Export to CSV…' },
]

// 2. Handle each action. The table exposes toggleColumn() and exportCSV().
function handle(key: string) {
  if (key === 'view')       console.log('view')       // wire your own handler
  if (key === 'duplicate')  console.log('duplicate')  // wire your own handler
  if (key === 'hide-email') tableRef.value?.toggleColumn('email')
  if (key === 'export')     tableRef.value?.exportCSV({ filename: 'employees.csv' })
}
</script>

<template>
  <div class="space-y-3">
    <p class="text-xs text-ousi-muted">
      <strong>Right-click</strong> anywhere on the table. The menu is yours to define —
      mix custom actions (like "View" or "Duplicate") with the table's exposed
      <code class="text-xs rounded bg-ousi-default px-1 font-mono">toggleColumn</code> and
      <code class="text-xs rounded bg-ousi-default px-1 font-mono">exportCSV</code> methods.
    </p>

    <!-- Wrap the table in OContextMenu — right-click anywhere on it opens the menu. -->
    <OContextMenu :items="menuItems" @select="handle">
      <OTable ref="tableRef" :columns="columns" :rows="rows" />
    </OContextMenu>
  </div>
</template>
