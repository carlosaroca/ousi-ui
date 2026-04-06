<script setup lang="ts">
import { ODropdown, OButton } from '@ousi-ui/vue'
</script>
<template>
  <ODropdown>
    <ODropdown.Trigger>
      <OButton variant="outline">Menu</OButton>
    </ODropdown.Trigger>
    <ODropdown.Popover>
      <ODropdown.Menu>
        <ODropdown.Item id="edit">Edit</ODropdown.Item>
        <ODropdown.Item id="archive" disabled>Archive</ODropdown.Item>
        <ODropdown.Item id="delete">Delete</ODropdown.Item>
      </ODropdown.Menu>
    </ODropdown.Popover>
  </ODropdown>
</template>
