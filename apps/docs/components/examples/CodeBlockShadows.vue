<script setup lang="ts">
import { OCodeBlock } from '@ousi-ui/vue'

const levels = ['none', 'xs', 'sm', 'md'] as const
</script>
<template>
  <div class="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
    <OCodeBlock
      v-for="level in levels"
      :key="level"
      :shadow="level"
      :filename="`shadow-${level}.ts`"
      :code="`// shadow=&quot;${level}&quot;\nexport const shadow = '${level}'`"
    />
  </div>
</template>
