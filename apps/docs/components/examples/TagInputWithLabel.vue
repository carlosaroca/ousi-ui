<script setup lang="ts">
import { ref } from 'vue'
import { OTagInput } from '@ousi-ui/vue'
const skills = ref(['TypeScript', 'Vue'])
</script>
<template>
  <OTagInput
    v-model="skills"
    label="Skills"
    description="Press Enter or comma to add a skill."
    placeholder="Add a skill..."
    required
  />
</template>
