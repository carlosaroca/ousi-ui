<script setup lang="ts">
import { computed, ref } from 'vue'
import { OContextMenu } from '@ousi-ui/vue'
import type { ContextMenuItem } from '@ousi-ui/vue'

const visible = ref({ name: true, email: true, role: true, status: false, created: false })

const items = computed<ContextMenuItem[]>(() => [
  { key: 'columns-heading', label: 'Columns', heading: true },
  { key: 'name',    label: (visible.value.name    ? '✓ ' : '  ') + 'Name',    keepOpen: true },
  { key: 'email',   label: (visible.value.email   ? '✓ ' : '  ') + 'Email',   keepOpen: true },
  { key: 'role',    label: (visible.value.role    ? '✓ ' : '  ') + 'Role',    keepOpen: true },
  { key: 'status',  label: (visible.value.status  ? '✓ ' : '  ') + 'Status',  keepOpen: true },
  { key: 'created', label: (visible.value.created ? '✓ ' : '  ') + 'Created', keepOpen: true },
  { separator: true },
  { key: 'reset', label: 'Reset to defaults' },
])

function onSelect(key: string) {
  if (key === 'reset') {
    visible.value = { name: true, email: true, role: true, status: false, created: false }
    return
  }
  if (key in visible.value) {
    visible.value[key as keyof typeof visible.value] = !visible.value[key as keyof typeof visible.value]
  }
}
</script>
<template>
  <OContextMenu :items="items" @select="onSelect">
    <div class="flex items-center justify-center p-12 border border-dashed border-ousi-border rounded-ousi-xl text-sm text-ousi-muted">
      Right-click — toggle stays open
    </div>
  </OContextMenu>
</template>
