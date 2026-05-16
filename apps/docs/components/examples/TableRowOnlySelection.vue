<script setup lang="ts">
import { ref } from 'vue'
import { OTable, OChip } from '@ousi-ui/vue'
import type { TableColumn } from '@ousi-ui/vue'

const columns: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'team', label: 'Team' },
]

const rows = [
  { id: '1', name: 'Lin Wei',      role: 'Designer',        team: 'Apollo' },
  { id: '2', name: 'Marcus Chen',  role: 'Senior Engineer', team: 'Mercury' },
  { id: '3', name: 'Priya Patel',  role: 'Product Manager', team: 'Gemini' },
  { id: '4', name: 'Sofía Méndez', role: 'Engineer',        team: 'Apollo' },
  { id: '5', name: 'Diego Romero', role: 'Engineer',        team: 'Mercury' },
]

const selected = ref<Set<string>>(new Set(['2']))
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center gap-2 text-xs text-ousi-muted">
      <span>Selected:</span>
      <OChip v-if="selected.size === 0" variant="soft" color="default" size="sm">none</OChip>
      <OChip
        v-for="key in selected"
        :key="key"
        variant="soft"
        color="accent"
        size="sm"
      >
        {{ rows.find(r => r.id === key)?.name }}
      </OChip>
    </div>

    <OTable
      :columns="columns"
      :rows="rows"
      selection-mode="multiple"
      :show-selection-column="false"
      :selected-keys="selected"
      @selection-change="(keys) => selected = keys"
    />

    <p class="text-xs text-ousi-muted">
      Click a row to toggle. <strong>Shift+click</strong> still selects ranges from the last anchor.
    </p>
  </div>
</template>
