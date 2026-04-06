<script setup lang="ts">
import { ref } from 'vue'
import { ODrawer, OButton } from '@ousi-ui/vue'
const open = ref(false)
</script>
<template>
  <OButton @click="open = true">Open Drawer</OButton>
  <ODrawer v-model="open" title="Drawer Title">
    <p>Drawer content goes here.</p>
  </ODrawer>
</template>
