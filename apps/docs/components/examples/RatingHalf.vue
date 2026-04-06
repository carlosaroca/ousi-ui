<script setup lang="ts">
import { ref } from 'vue'
import { ORating } from '@ousi-ui/vue'
const rating = ref(3.5)
</script>
<template>
  <div class="flex flex-col gap-3">
    <ORating v-model="rating" half-stars />
    <p class="text-sm text-neutral-500">Current rating: {{ rating }}</p>
  </div>
</template>
