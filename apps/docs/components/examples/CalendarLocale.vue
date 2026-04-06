<script setup lang="ts">
import { OCalendar } from '@ousi-ui/vue'
const date = ref(null)
</script>
<template>
  <OCalendar v-model="date" locale="ja-JP" />
</template>
