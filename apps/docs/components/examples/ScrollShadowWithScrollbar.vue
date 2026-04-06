<script setup lang="ts">
import { OScrollShadow } from '@ousi-ui/vue'
</script>
<template>
  <OScrollShadow :hide-scrollbar="false" class="h-48">
    <div class="space-y-4 p-2">
      <p v-for="i in 20" :key="i">Item {{ i }} — scrollbar visible</p>
    </div>
  </OScrollShadow>
</template>
