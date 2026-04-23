<script setup lang="ts">
import { ref } from 'vue'
import { OTagInput } from '@ousi-ui/vue'

const tagsA = ref(['Vue', 'TypeScript'])
const tagsB = ref(['Design', 'Motion'])
</script>
<template>
  <div class="flex flex-col gap-4 p-4 max-w-sm">
    <OTagInput v-model="tagsA" label="Default (static)" placeholder="Add a tag..." />
    <OTagInput v-model="tagsB" label="Animated" placeholder="Add a tag..." animated />
  </div>
</template>
