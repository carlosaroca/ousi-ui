<script setup lang="ts">
import { ref } from 'vue'
import { OCheckbox } from '@ousi-ui/vue'
const accepted = ref(false)
</script>
<template>
  <OCheckbox v-model="accepted" label="Accept terms and conditions" />
</template>
