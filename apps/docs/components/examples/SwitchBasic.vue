<script setup lang="ts">
import { ref } from 'vue'
import { OSwitch } from '@ousi-ui/vue'
const enabled = ref(false)
</script>
<template>
  <OSwitch v-model="enabled" label="Enable notifications" />
</template>
