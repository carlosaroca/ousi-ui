<script setup lang="ts">
import { ODropdown, ODropdownTrigger, ODropdownPopover, ODropdownMenu, ODropdownItem, OButton } from '@ousi-ui/vue'
</script>
<template>
  <ODropdown>
    <ODropdownTrigger>
      <OButton variant="outline">Options</OButton>
    </ODropdownTrigger>
    <ODropdownPopover>
      <ODropdownMenu>
        <ODropdownItem id="edit">Edit</ODropdownItem>
        <ODropdownItem id="duplicate">Duplicate</ODropdownItem>
        <ODropdownItem id="delete">Delete</ODropdownItem>
      </ODropdownMenu>
    </ODropdownPopover>
  </ODropdown>
</template>
