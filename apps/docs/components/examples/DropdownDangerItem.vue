<script setup lang="ts">
import { ODropdown, OButton } from '@ousi-ui/vue'
</script>
<template>
  <ODropdown>
    <ODropdown.Trigger>
      <OButton variant="outline">More</OButton>
    </ODropdown.Trigger>
    <ODropdown.Popover>
      <ODropdown.Menu>
        <ODropdown.Item id="archive">Archive</ODropdown.Item>
        <ODropdown.Separator />
        <ODropdown.Item id="delete" variant="danger">Delete</ODropdown.Item>
      </ODropdown.Menu>
    </ODropdown.Popover>
  </ODropdown>
</template>
