<script setup lang="ts">
import { ref } from 'vue'
import { OTagInput } from '@ousi-ui/vue'
const accentTags = ref(['Accent'])
const successTags = ref(['Success'])
const warningTags = ref(['Warning'])
const dangerTags = ref(['Danger'])
</script>
<template>
  <div class="flex flex-col gap-4">
    <OTagInput v-model="accentTags" color="accent" placeholder="Accent..." />
    <OTagInput v-model="successTags" color="success" placeholder="Success..." />
    <OTagInput v-model="warningTags" color="warning" placeholder="Warning..." />
    <OTagInput v-model="dangerTags" color="danger" placeholder="Danger..." />
  </div>
</template>
