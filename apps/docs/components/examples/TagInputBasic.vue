<script setup lang="ts">
import { ref } from 'vue'
import { OTagInput } from '@ousi-ui/vue'
const tags = ref(['Vue', 'React'])
</script>
<template>
  <OTagInput v-model="tags" placeholder="Add a tag..." />
</template>
