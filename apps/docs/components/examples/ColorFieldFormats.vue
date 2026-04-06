<script setup lang="ts">
import { ref } from 'vue'
import { OColorField } from '@ousi-ui/vue'
const hex = ref('#3b82f6')
const rgb = ref('rgb(59, 130, 246)')
</script>
<template>
  <div class="flex flex-col gap-4">
    <OColorField v-model="hex" label="Hex format" format="hex" show-swatch />
    <OColorField v-model="rgb" label="RGB format" format="rgb" show-swatch />
  </div>
</template>
