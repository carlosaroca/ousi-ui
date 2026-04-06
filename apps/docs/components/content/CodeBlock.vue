<script setup lang="ts">
const props = defineProps<{
  code: string
  lang?: string
  /** Show a copy button. Default: false (ComponentPreview has its own). */
  showCopy?: boolean
}>()

const copied = ref(false)

function copyCode() {
  navigator.clipboard.writeText(props.code)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

const lines = computed(() => props.code.split('\n'))

function highlight(line: string): string {
  let html = line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Strings
  html = html.replace(/&quot;([^&]*)&quot;/g, '<span class="text-emerald-600">&quot;$1&quot;</span>')
  html = html.replace(/"([^"]*)"/g, '<span class="text-emerald-600">"$1"</span>')
  html = html.replace(/'([^']*)'/g, '<span class="text-emerald-600">\'$1\'</span>')

  // Vue directives
  html = html.replace(/\b(v-[\w.-]+|:[a-zA-Z][\w.-]*|@[\w.-]+)/g, '<span class="text-violet-500">$1</span>')

  // Tags
  html = html.replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="text-rose-500">$2</span>')

  // Brackets
  html = html.replace(/(&lt;)/g, '<span class="text-ousi-muted">$1</span>')
  html = html.replace(/(&gt;)/g, '<span class="text-ousi-muted">$1</span>')
  html = html.replace(/(\/&gt;)/g, '<span class="text-ousi-muted">$1</span>')

  // Boolean props
  html = html.replace(/\b(disabled|full-width|loading)\b(?![=<])/g, '<span class="text-violet-500">$1</span>')

  // Keywords
  html = html.replace(/\b(import|from|export|const|function)\b/g, '<span class="text-violet-500">$1</span>')

  // Comments
  html = html.replace(/(\/\/.*)$/g, '<span class="text-ousi-muted/60">$1</span>')

  return html
}
</script>

<template>
  <div class="relative font-mono text-[13px] leading-6 overflow-x-auto py-3">
    <!-- Copy button (optional, for standalone code blocks) -->
    <button
      v-if="showCopy"
      class="absolute top-2 right-2 size-7 flex items-center justify-center rounded-ousi-lg text-ousi-muted hover:text-ousi-foreground hover:bg-ousi-default/50 transition-colors z-10"
      @click="copyCode"
    >
      <svg v-if="!copied" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke-linecap="round" /></svg>
      <svg v-else class="size-3.5 text-ousi-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </button>

    <table class="w-full border-collapse">
      <tbody>
        <tr v-for="(line, i) in lines" :key="i" class="hover:bg-ousi-default/20">
          <td class="w-8 pr-3 text-right text-ousi-muted/40 select-none align-top shrink-0 pl-4 tabular-nums">{{ i + 1 }}</td>
          <td class="text-ousi-foreground whitespace-pre pr-4" v-html="highlight(line)" />
        </tr>
      </tbody>
    </table>
  </div>
</template>
