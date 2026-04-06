<script setup lang="ts">
import { ODropdown, OButton } from '@ousi-ui/vue'
</script>
<template>
  <ODropdown>
    <ODropdown.Trigger>
      <OButton variant="outline">Actions</OButton>
    </ODropdown.Trigger>
    <ODropdown.Popover>
      <ODropdown.Menu>
        <ODropdown.Item id="edit">
          <template #start>
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
          </template>
          Edit
        </ODropdown.Item>
        <ODropdown.Item id="copy">
          <template #start>
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
          </template>
          Copy
        </ODropdown.Item>
      </ODropdown.Menu>
    </ODropdown.Popover>
  </ODropdown>
</template>
