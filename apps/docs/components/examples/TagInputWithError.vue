<script setup lang="ts">
import { ref, computed } from 'vue'
import { OTagInput } from '@ousi-ui/vue'
const tags = ref<string[]>([])
const error = computed(() => tags.value.length === 0 ? 'At least one tag is required.' : undefined)
</script>
<template>
  <OTagInput
    v-model="tags"
    label="Categories"
    :error-message="error"
    placeholder="Add a category..."
  />
</template>
