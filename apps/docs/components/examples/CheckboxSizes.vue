<script setup lang="ts">
import { ref } from 'vue'
import { OCheckbox } from '@ousi-ui/vue'
const sm = ref(false)
const md = ref(true)
const lg = ref(false)
</script>
<template>
  <div class="flex flex-col gap-4">
    <OCheckbox v-model="sm" size="sm" label="Small" />
    <OCheckbox v-model="md" size="md" label="Medium" />
    <OCheckbox v-model="lg" size="lg" label="Large" />
  </div>
</template>
