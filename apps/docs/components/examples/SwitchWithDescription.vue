<script setup lang="ts">
import { ref } from 'vue'
import { OSwitch } from '@ousi-ui/vue'
const darkMode = ref(false)
</script>
<template>
  <OSwitch v-model="darkMode" label="Dark mode" description="Toggle the application theme" />
</template>
