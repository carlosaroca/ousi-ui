<script setup lang="ts">
import { ref } from 'vue'
import { OSelect } from '@ousi-ui/vue'

// One option and a required field: the select fills itself.
const country = ref('')
const options = [{ value: 'es', label: 'Spain' }]
</script>
<template>
  <OSelect v-model="country" :options="options" label="Country" required auto-select-single />
</template>
