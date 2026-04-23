<script setup lang="ts">
import { OCodeBlock } from '@ousi-ui/vue'

const code = `import { OButton } from '@ousi-ui/vue'

const msg = 'Hello world'`
</script>
<template>
  <div class="flex flex-col gap-4 p-4">
    <OCodeBlock :code="code" filename="primary.vue" variant="primary" />
    <OCodeBlock :code="code" filename="secondary.vue" variant="secondary" />
  </div>
</template>
