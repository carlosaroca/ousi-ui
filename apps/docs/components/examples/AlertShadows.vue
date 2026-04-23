<script setup lang="ts">
import { OAlert } from '@ousi-ui/vue'

const levels = ['none', 'xs', 'sm', 'md', 'lg'] as const
</script>
<template>
  <div class="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
    <OAlert
      v-for="level in levels"
      :key="level"
      :shadow="level"
      :title="`shadow=&quot;${level}&quot;`"
    />
  </div>
</template>
