<script setup lang="ts">
import { ref } from 'vue'
import { OSwitch } from '@ousi-ui/vue'
const sm = ref(false)
const md = ref(true)
const lg = ref(false)
</script>
<template>
  <div class="flex items-center gap-6">
    <OSwitch v-model="sm" size="sm" label="Small" />
    <OSwitch v-model="md" size="md" label="Medium" />
    <OSwitch v-model="lg" size="lg" label="Large" />
  </div>
</template>
