<script setup lang="ts">
import { OAlert } from '@ousi-ui/vue'
import { ref } from 'vue'

const visible = ref(true)
</script>
<template>
  <OAlert v-if="visible" title="Dismissible alert" closable @close="visible = false" />
  <button v-else class="text-sm underline" @click="visible = true">Show again</button>
</template>
