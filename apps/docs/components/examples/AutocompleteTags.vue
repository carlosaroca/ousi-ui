<script setup lang="ts">
import { ref } from 'vue'
import { OAutocomplete } from '@ousi-ui/vue'

const tags = ref<string[]>(['urgent'])
const known = ['urgent', 'billing', 'follow-up', 'bug', 'idea'].map((tag) => ({ value: tag, label: tag }))
</script>
<template>
  <!-- With allow-custom-value, what is not on the list can be added too. -->
  <OAutocomplete
    v-model="tags"
    multiple
    allow-custom-value
    :options="known"
    label="Tags"
    placeholder="Add tags…"
    class="max-w-sm"
  />
</template>
