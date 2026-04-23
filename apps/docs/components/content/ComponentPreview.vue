<script setup lang="ts">
import { OCodeBlock } from '@ousi-ui/vue'

defineProps<{
  /** Raw code string for the code block and copy. */
  code?: string
}>()
</script>

<template>
  <div class="my-6 space-y-3">
    <!-- Preview area — standalone, no outer border -->
    <div class="flex items-center justify-center min-h-[180px] px-8 py-10 rounded-ousi-2xl bg-ousi-surface-secondary/40">
      <ClientOnly>
        <slot name="preview" />
      </ClientOnly>
    </div>

    <!-- Code block — standalone, keeps its own frame -->
    <ClientOnly>
      <OCodeBlock
        v-if="code"
        :code="code"
        collapsible
        :collapsed-height="88"
      />
    </ClientOnly>
    <div v-if="!code">
      <slot name="code" />
    </div>
  </div>
</template>
