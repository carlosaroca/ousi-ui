<script setup lang="ts">
import { OTable, OChip } from '@ousi-ui/vue'
import type { TableColumn } from '@ousi-ui/vue'

const columns: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
]

const rows = [
  { id: '1', name: 'Lin Wei',       role: 'Designer',          status: 'Active',   email: 'lin@oasiui.dev',       address: 'Madrid, ES',  joined: 'Feb 2024' },
  { id: '2', name: 'Marcus Chen',   role: 'Senior Engineer',   status: 'Active',   email: 'marcus@oasiui.dev',    address: 'Toronto, CA', joined: 'Aug 2022' },
  { id: '3', name: 'Priya Patel',   role: 'Product Manager',   status: 'On leave', email: 'priya@oasiui.dev',     address: 'Mumbai, IN',  joined: 'Apr 2023' },
  { id: '4', name: 'Sofía Méndez',  role: 'Engineer',          status: 'Active',   email: 'sofia@oasiui.dev',     address: 'Buenos Aires, AR', joined: 'Jan 2026' },
]
</script>
<template>
  <OTable :columns="columns" :rows="rows" expandable>
    <template #cell-status="{ value }">
      <OChip
        variant="soft"
        size="sm"
        :color="value === 'Active' ? 'success' : 'warning'"
      >
        {{ value }}
      </OChip>
    </template>

    <template #expanded-row="{ row }">
      <div class="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm py-1">
        <div>
          <p class="text-xs text-ousi-muted">Email</p>
          <p class="text-ousi-foreground font-medium">{{ row.email }}</p>
        </div>
        <div>
          <p class="text-xs text-ousi-muted">Address</p>
          <p class="text-ousi-foreground font-medium">{{ row.address }}</p>
        </div>
        <div>
          <p class="text-xs text-ousi-muted">Joined</p>
          <p class="text-ousi-foreground font-medium">{{ row.joined }}</p>
        </div>
      </div>
    </template>
  </OTable>
</template>
