<script setup lang="ts">
import { ref } from 'vue'
import { OButton } from '@ousi-ui/vue'

/**
 * A plain code box with a copy button, for terminal commands and Markdown.
 * OCodeBlock colors everything as Vue (it reads `//` in a URL as a comment and `from` as a keyword),
 * so shell and Markdown snippets use this instead. Same look as the code boxes of the install page.
 */
const props = defineProps<{ code: string; filename?: string }>()

const copied = ref(false)
async function copy() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    // No clipboard access: the text is still selectable.
  }
}
</script>

<template>
  <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
    <div class="flex h-10 items-center justify-between border-b border-ousi-border pl-4 pr-2">
      <span class="text-xs font-medium text-ousi-muted">{{ filename }}</span>
      <OButton is-icon-only variant="text" size="xs" :aria-label="copied ? 'Copied' : 'Copy code'" @click="copy">
        <svg v-if="copied" class="size-3.5 text-ousi-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
        <svg v-else class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
      </OButton>
    </div>
    <pre class="overflow-x-auto p-4 text-[13px] leading-relaxed font-mono text-ousi-foreground"><code>{{ code }}</code></pre>
  </div>
</template>
