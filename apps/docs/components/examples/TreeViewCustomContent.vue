<script setup lang="ts">
const nodes = [
  {
    key: 'src',
    label: 'src',
    children: [
      { key: 'index.ts', label: 'index.ts' },
      { key: 'App.vue', label: 'App.vue' },
      { key: 'style.css', label: 'style.css' },
    ],
  },
  { key: 'package.json', label: 'package.json' },
  { key: 'README.md', label: 'README.md' },
]

function getIcon(label: string, hasChildren: boolean): string {
  if (hasChildren) return '📁'
  if (label.endsWith('.vue')) return '💚'
  if (label.endsWith('.ts')) return '🔷'
  if (label.endsWith('.css')) return '🎨'
  if (label.endsWith('.json')) return '📋'
  if (label.endsWith('.md')) return '📝'
  return '📄'
}
</script>

<template>
  <div class="w-full max-w-sm rounded-ousi-xl border border-ousi-border bg-ousi-surface p-3">
    <OTreeView :nodes="nodes" :default-expanded="['src']">
      <template #node="{ node, hasChildren }">
        <span class="flex items-center gap-2">
          <span>{{ getIcon(node.label, hasChildren) }}</span>
          <span>{{ node.label }}</span>
        </span>
      </template>
    </OTreeView>
  </div>
</template>
