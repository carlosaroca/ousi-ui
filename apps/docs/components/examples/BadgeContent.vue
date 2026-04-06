<script setup lang="ts">
import { OBadge, OButton } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-wrap gap-6">
    <OBadge content="5"><OButton variant="outline">Count</OButton></OBadge>
    <OBadge content="99" :max="99"><OButton variant="outline">Max</OButton></OBadge>
    <OBadge content="150" :max="99"><OButton variant="outline">Overflow</OButton></OBadge>
  </div>
</template>
