<script setup lang="ts">
import { OCodeBlock } from '@ousi-ui/vue'
const code = `import { OButton } from '@ousi-ui/vue'
import { OInput } from '@ousi-ui/vue'
import { OCard } from '@ousi-ui/vue'
import { ODialog } from '@ousi-ui/vue'
import { OToast } from '@ousi-ui/vue'`
</script>
<template>
  <OCodeBlock
    :code="code"
    collapsible
    expand-label="Show all imports"
    collapse-label="Hide imports"
  />
</template>
