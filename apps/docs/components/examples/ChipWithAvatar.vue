<script setup lang="ts">
import { OChip, OAvatar } from '@ousi-ui/vue'
</script>
<template>
  <OChip>
    <template #start>
      <OAvatar src="https://i.pravatar.cc/150?u=chip" size="sm" />
    </template>
    John Doe
  </OChip>
</template>
