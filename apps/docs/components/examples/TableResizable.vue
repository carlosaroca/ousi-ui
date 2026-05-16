<script setup lang="ts">
import { OTable } from '@ousi-ui/vue'
import type { TableColumn } from '@ousi-ui/vue'

const columns: TableColumn[] = [
  { key: 'name', label: 'Name', resizable: true, width: 220, minWidth: 120 },
  { key: 'role', label: 'Role', resizable: true, width: 180, minWidth: 100 },
  { key: 'team', label: 'Team', resizable: true, width: 160, minWidth: 100 },
  { key: 'email', label: 'Email', resizable: true, width: 240, minWidth: 160 },
]

const rows = [
  { id: '1', name: 'Lin Wei',      role: 'Designer',        team: 'Apollo',  email: 'lin@oasiui.dev' },
  { id: '2', name: 'Marcus Chen',  role: 'Senior Engineer', team: 'Mercury', email: 'marcus@oasiui.dev' },
  { id: '3', name: 'Priya Patel',  role: 'Product Manager', team: 'Gemini',  email: 'priya@oasiui.dev' },
  { id: '4', name: 'Sofía Méndez', role: 'Engineer',        team: 'Apollo',  email: 'sofia@oasiui.dev' },
]
</script>
<template>
  <div class="space-y-3">
    <p class="text-xs text-ousi-muted">
      Drag the right edge of any column header to resize. The resizer is also keyboard-accessible:
      Tab to focus it, then <kbd class="text-[10px] font-mono px-1 rounded bg-ousi-default">Arrow Left</kbd> /
      <kbd class="text-[10px] font-mono px-1 rounded bg-ousi-default">Right</kbd> to adjust
      (hold <kbd class="text-[10px] font-mono px-1 rounded bg-ousi-default">Shift</kbd> for 1px,
      <kbd class="text-[10px] font-mono px-1 rounded bg-ousi-default">Ctrl/Cmd</kbd> for 24px).
    </p>
    <OTable :columns="columns" :rows="rows" allows-resizing />
  </div>
</template>
