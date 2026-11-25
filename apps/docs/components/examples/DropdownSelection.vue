<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  OButton, ODropdown, ODropdownItem, ODropdownItemIndicator,
  ODropdownMenu, ODropdownPopover, ODropdownTrigger,
} from '@ousi-ui/vue'

// Selection is a Set of item ids: one id in single mode, any number in multiple mode.
const view = ref(new Set(['list']))
const columns = ref(new Set(['name', 'status']))

const viewLabel = computed(() => [...view.value][0] ?? 'none')
const columnsLabel = computed(() => [...columns.value].join(', ') || 'none')
</script>
<template>
  <div class="flex flex-wrap items-start gap-4">
    <ODropdown>
      <ODropdownTrigger>
        <OButton variant="outline">View: {{ viewLabel }}</OButton>
      </ODropdownTrigger>
      <ODropdownPopover>
        <ODropdownMenu v-model:selected-keys="view" selection-mode="single">
          <ODropdownItem id="list"><ODropdownItemIndicator />List</ODropdownItem>
          <ODropdownItem id="grid"><ODropdownItemIndicator />Grid</ODropdownItem>
          <ODropdownItem id="board"><ODropdownItemIndicator />Board</ODropdownItem>
        </ODropdownMenu>
      </ODropdownPopover>
    </ODropdown>

    <ODropdown>
      <ODropdownTrigger>
        <OButton variant="outline">Columns: {{ columnsLabel }}</OButton>
      </ODropdownTrigger>
      <ODropdownPopover>
        <ODropdownMenu v-model:selected-keys="columns" selection-mode="multiple">
          <ODropdownItem id="name"><ODropdownItemIndicator />Name</ODropdownItem>
          <ODropdownItem id="status"><ODropdownItemIndicator />Status</ODropdownItem>
          <ODropdownItem id="owner"><ODropdownItemIndicator />Owner</ODropdownItem>
        </ODropdownMenu>
      </ODropdownPopover>
    </ODropdown>
  </div>
</template>
