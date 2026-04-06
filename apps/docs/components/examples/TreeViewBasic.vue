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
          { key: 'button', label: 'Button.vue' },
          { key: 'input', label: 'Input.vue' },
        ],
      },
      {
        key: 'utils',
        label: 'utils',
        children: [
          { key: 'helpers', label: 'helpers.ts' },
        ],
      },
    ],
  },
]
</script>
<template>
  <OTreeView
    :nodes="nodes"
    :default-expanded="['src', 'components']"
    selectable
    :selected-key="selected"
    @select="selected = $event"
  />
</template>
