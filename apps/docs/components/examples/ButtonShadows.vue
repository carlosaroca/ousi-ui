<script setup lang="ts">
import { OButton } from '@ousi-ui/vue'
import type { ButtonShadow } from '@ousi-ui/vue'

const levels: ButtonShadow[] = ['none', 'xs', 'sm', 'md']
</script>
<template>
  <div class="flex flex-wrap items-center gap-3 p-4">
    <OButton v-for="level in levels" :key="level" :shadow="level" variant="secondary">
      shadow {{ level }}
    </OButton>
  </div>
</template>
