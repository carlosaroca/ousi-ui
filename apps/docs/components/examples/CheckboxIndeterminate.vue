<script setup lang="ts">
import { ref } from 'vue'
import { OCheckbox } from '@ousi-ui/vue'
const checked = ref(false)
const indeterminate = ref(true)
</script>
<template>
  <OCheckbox
    v-model="checked"
    v-model:indeterminate="indeterminate"
    label="Select all"
  />
</template>
