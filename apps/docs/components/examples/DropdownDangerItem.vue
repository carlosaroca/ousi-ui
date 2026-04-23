<script setup lang="ts">
import { ODropdown, ODropdownTrigger, ODropdownPopover, ODropdownMenu, ODropdownItem, ODropdownSeparator, OButton } from '@ousi-ui/vue'
</script>
<template>
  <ODropdown>
    <ODropdownTrigger>
      <OButton variant="outline">More</OButton>
    </ODropdownTrigger>
    <ODropdownPopover>
      <ODropdownMenu>
        <ODropdownItem id="archive">Archive</ODropdownItem>
        <ODropdownSeparator />
        <ODropdownItem id="delete" variant="danger">Delete</ODropdownItem>
      </ODropdownMenu>
    </ODropdownPopover>
  </ODropdown>
</template>
