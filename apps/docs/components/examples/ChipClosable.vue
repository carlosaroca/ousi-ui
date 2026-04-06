<script setup lang="ts">
import { OChip } from '@ousi-ui/vue'
import { ref } from 'vue'

const visible = ref(true)
</script>
<template>
  <OChip v-if="visible">
    Closable
    <template #end>
      <button class="ml-1 hover:opacity-70" @click="visible = false">&times;</button>
    </template>
  </OChip>
  <button v-else class="text-sm underline" @click="visible = true">Reset</button>
</template>
