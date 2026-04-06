<script setup lang="ts">
import { OBadge, OButton } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-wrap gap-6">
    <OBadge color="default" content="3"><OButton variant="outline">Default</OButton></OBadge>
    <OBadge color="accent" content="3"><OButton variant="outline">Accent</OButton></OBadge>
    <OBadge color="success" content="3"><OButton variant="outline">Success</OButton></OBadge>
    <OBadge color="warning" content="3"><OButton variant="outline">Warning</OButton></OBadge>
    <OBadge color="danger" content="3"><OButton variant="outline">Danger</OButton></OBadge>
  </div>
</template>
