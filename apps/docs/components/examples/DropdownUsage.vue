<script setup lang="ts">
import { ODropdown, OButton } from '@ousi-ui/vue'
</script>
<template>
  <ODropdown>
    <ODropdown.Trigger>
      <OButton variant="outline">Options</OButton>
    </ODropdown.Trigger>
    <ODropdown.Popover>
      <ODropdown.Menu>
        <ODropdown.Item id="edit">Edit</ODropdown.Item>
        <ODropdown.Item id="duplicate">Duplicate</ODropdown.Item>
        <ODropdown.Item id="delete">Delete</ODropdown.Item>
      </ODropdown.Menu>
    </ODropdown.Popover>
  </ODropdown>
</template>
