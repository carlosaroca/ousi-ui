<script setup lang="ts">
import { ref } from 'vue'
import { OSwitch } from '@ousi-ui/vue'

const enabled = ref(true)
</script>
<template>
  <OSwitch v-model="enabled" label="Wi-Fi" />
  <p class="mt-2 text-sm text-neutral-500">Wi-Fi is {{ enabled ? 'on' : 'off' }}</p>
</template>
