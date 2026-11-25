<script setup lang="ts">
import { ref } from 'vue'
import { OInput } from '@ousi-ui/vue'

const password = ref('correct-horse')
</script>
<template>
  <form class="flex w-full max-w-xs flex-col gap-4" @submit.prevent>
    <OInput
      v-model="password"
      type="password"
      revealable
      label="Password"
      autocomplete="new-password"
      description="Use the eye to check what you typed."
    />
    <OInput type="password" revealable label="Repeat password" autocomplete="new-password" placeholder="Type it again" />
  </form>
</template>
