<script setup lang="ts">
import { ref } from 'vue'
import { OTagInput } from '@ousi-ui/vue'
const tags = ref(['One', 'Two', 'Three'])
</script>
<template>
  <OTagInput v-model="tags" :max-tags="5" placeholder="Max 5 tags..." label="Tags (max 5)" />
</template>
