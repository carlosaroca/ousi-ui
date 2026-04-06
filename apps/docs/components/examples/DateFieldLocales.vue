<script setup lang="ts">
import { ODateField } from '@ousi-ui/vue'
const date = ref(null)
</script>
<template>
  <div class="flex flex-col gap-3">
    <ODateField v-model="date" label="English" locale="en-US" />
    <ODateField v-model="date" label="Japanese" locale="ja-JP" />
  </div>
</template>
