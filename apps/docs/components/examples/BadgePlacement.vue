<script setup lang="ts">
import { OBadge, OButton } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-wrap gap-6">
    <OBadge content="1" placement="top-right"><OButton variant="outline">Top Right</OButton></OBadge>
    <OBadge content="2" placement="top-left"><OButton variant="outline">Top Left</OButton></OBadge>
    <OBadge content="3" placement="bottom-right"><OButton variant="outline">Bottom Right</OButton></OBadge>
    <OBadge content="4" placement="bottom-left"><OButton variant="outline">Bottom Left</OButton></OBadge>
  </div>
</template>
