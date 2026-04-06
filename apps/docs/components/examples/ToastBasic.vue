<script setup lang="ts">
import { OButton } from '@ousi-ui/vue'
import { toast } from '@ousi-ui/vue'
</script>
<template>
  <OButton @click="toast('Hello world!')">Show Toast</OButton>
</template>
