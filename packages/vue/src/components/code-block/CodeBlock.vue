<script setup lang="ts">
import { ref, computed } from 'vue'
import { cn } from '@ousi-ui/core'
import {
  codeBlockTheme,
  codeBlockHeaderTheme,
  codeBlockBodyTheme,
  codeBlockLineNumberTheme,
  codeBlockCodeTheme,
  codeBlockCopyTheme,
  codeBlockToggleTheme,
  codeBlockFadeTheme,
} from './code-block.theme'
import type { CodeBlockProps } from './code-block.types'

const props = withDefaults(defineProps<CodeBlockProps>(), {
  showLineNumbers: true,
  showCopy: true,
  collapsible: false,
  collapsedHeight: 88,
  defaultExpanded: false,
  expandLabel: 'Expand code',
  collapseLabel: 'Collapse code',
})

const expanded = ref(props.defaultExpanded)
const copied = ref(false)

const lines = computed(() => props.code.split('\n'))

function copyCode() {
  navigator.clipboard.writeText(props.code)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

/** Simple syntax highlighting — tags, strings, keywords, directives, comments. */
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

  // Boolean props
  html = html.replace(/\b(disabled|full-width|loading|required|readonly)\b(?![=<])/g, '<span class="text-violet-500">$1</span>')

  // Keywords
  html = html.replace(/\b(import|from|export|const|let|var|function|return|async|await|if|else|new|true|false|null|undefined)\b/g, '<span class="text-violet-500">$1</span>')

  // Comments
  html = html.replace(/(\/\/.*)$/g, '<span class="text-ousi-muted/60 italic">$1</span>')
  html = html.replace(/(\/\*.*?\*\/)/g, '<span class="text-ousi-muted/60 italic">$1</span>')
  html = html.replace(/(&lt;!--.+?--&gt;)/g, '<span class="text-ousi-muted/60 italic">$1</span>')

  return html
}
</script>

<template>
  <div :class="cn(codeBlockTheme, props.class)">
    <!-- Optional header with filename -->
    <div v-if="filename || $slots.header" :class="codeBlockHeaderTheme">
      <slot name="header">
        <span>{{ filename }}</span>
      </slot>
    </div>

    <!-- Code body -->
    <div class="relative" :class="collapsible ? 'bg-ousi-surface-secondary/40' : ''">
      <!-- Scrollable code area -->
      <div
        :class="codeBlockBodyTheme"
        :style="collapsible && !expanded
          ? { maxHeight: `${collapsedHeight}px`, overflow: 'hidden', transition: 'max-height 300ms ease-out', maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }
          : collapsible
            ? { maxHeight: '500px', overflowY: 'auto', transition: 'max-height 300ms ease-out' }
            : undefined
        "
      >
        <table class="w-full border-collapse py-3">
          <tbody>
            <tr
              v-for="(line, i) in lines"
              :key="i"
              class="hover:bg-ousi-default/20"
            >
              <td v-if="showLineNumbers" :class="codeBlockLineNumberTheme" :style="i === 0 ? 'padding-top: 0.75rem' : i === lines.length - 1 ? 'padding-bottom: 0.75rem' : ''">
                {{ i + 1 }}
              </td>
              <td
                :class="codeBlockCodeTheme"
                :style="i === 0 ? 'padding-top: 0.75rem' : i === lines.length - 1 ? 'padding-bottom: 0.75rem' : ''"
                v-html="highlight(line)"
              />
            </tr>
          </tbody>
        </table>
      </div>


      <!-- Copy button -->
      <button
        v-if="showCopy"
        :class="codeBlockCopyTheme"
        style="position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10;"
        @click="copyCode"
      >
        <slot name="copy-icon" :copied="copied">
          <svg v-if="!copied" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke-linecap="round" /></svg>
          <svg v-else class="size-3.5 text-ousi-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </slot>
      </button>

      <!-- Expand/collapse toggle -->
      <div v-if="collapsible" class="flex justify-center pb-2.5 pt-0.5 relative z-10">
        <button :class="codeBlockToggleTheme" @click="expanded = !expanded">
          <slot name="toggle-icon" :expanded="expanded">
            <svg
              class="size-3 transition-transform duration-200"
              :class="expanded ? 'rotate-180' : ''"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            >
              <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </slot>
          {{ expanded ? collapseLabel : expandLabel }}
        </button>
      </div>
    </div>
  </div>
</template>
