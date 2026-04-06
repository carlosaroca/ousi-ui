<script setup lang="ts">
import { OTable } from '@ousi-ui/vue'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
]
</script>
<template>
  <OTable :columns="columns" :rows="[]" :is-loading="true" :loading-rows="3" />
</template>
