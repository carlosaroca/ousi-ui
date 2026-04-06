<script setup lang="ts">
import { ref } from 'vue'
import { OCheckbox } from '@ousi-ui/vue'
const marketing = ref(false)
</script>
<template>
  <OCheckbox
    v-model="marketing"
    label="Marketing emails"
    description="Receive emails about new products and features."
  />
</template>
