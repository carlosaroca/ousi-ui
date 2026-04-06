<script setup lang="ts">
import { ref } from 'vue'

const selected = ref('')
const nodes = [
  {
    key: 'src',
    label: 'src',
    children: [
      {
        key: 'components',
        label: 'components',
        children: [
          { key: 'Button.vue', label: 'Button.vue' },
          { key: 'Input.vue', label: 'Input.vue' },
          { key: 'Card.vue', label: 'Card.vue' },
        ],
      },
      {
        key: 'utils',
        label: 'utils',
        children: [
          { key: 'helpers.ts', label: 'helpers.ts' },
          { key: 'constants.ts', label: 'constants.ts' },
        ],
      },
      { key: 'App.vue', label: 'App.vue' },
      { key: 'main.ts', label: 'main.ts' },
    ],
  },
  {
    key: 'public',
    label: 'public',
    children: [
      { key: 'favicon.ico', label: 'favicon.ico' },
    ],
  },
  { key: 'package.json', label: 'package.json' },
  { key: 'tsconfig.json', label: 'tsconfig.json' },
]
</script>

<template>
  <div class="flex gap-6 w-full max-w-lg">
    <div class="flex-1 rounded-ousi-xl border border-ousi-border bg-ousi-surface p-3">
      <OTreeView :nodes="nodes" selectable :selected-key="selected" :default-expanded="['src', 'components']" @select="(key) => selected = key" />
    </div>
    <div v-if="selected" class="text-sm text-ousi-muted">
      Selected: <span class="text-ousi-foreground font-medium">{{ selected }}</span>
    </div>
  </div>
</template>
