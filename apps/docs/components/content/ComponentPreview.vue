<script setup lang="ts">
import { OCodeBlock } from '@ousi-ui/vue'

defineProps<{
  /** Raw code string for the code block and copy. */
  code?: string
}>()
</script>

<template>
  <div class="my-6 rounded-ousi-2xl border border-ousi-border overflow-hidden bg-ousi-surface-secondary/30">
    <!-- Preview area -->
    <div class="flex items-center justify-center min-h-[180px] px-8 py-10 bg-ousi-background">
      <ClientOnly>
        <slot name="preview" />
      </ClientOnly>
    </div>

    <!-- Code area -->
    <div class="border-t border-ousi-border/50">
      <ClientOnly>
        <OCodeBlock
          v-if="code"
          :code="code"
          collapsible
          :collapsed-height="88"
          class="!border-0 !rounded-none"
        />
      </ClientOnly>
      <div v-if="!code">
        <slot name="code" />
      </div>
    </div>
  </div>
</template>
