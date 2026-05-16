<script setup lang="ts">
import { ref } from 'vue'
import { OTreeView, OButton, OSwitch } from '@ousi-ui/vue'
import type { TreeNode } from '@ousi-ui/vue'

// "Server" responses keyed by parent — simulates a real API.
const remote: Record<string, TreeNode[]> = {
  '/': [
    { key: '/projects', label: 'projects', isAsync: true },
    { key: '/docs',     label: 'docs',     isAsync: true },
    { key: '/README.md', label: 'README.md' },
  ],
  '/projects': [
    { key: '/projects/ousi-ui', label: 'ousi-ui', isAsync: true },
    { key: '/projects/api',     label: 'api',     isAsync: true },
  ],
  '/projects/ousi-ui': [
    { key: '/projects/ousi-ui/src',   label: 'src',   isAsync: true },
    { key: '/projects/ousi-ui/pkg',   label: 'package.json' },
  ],
  '/projects/ousi-ui/src': [
    { key: '/projects/ousi-ui/src/index.ts',   label: 'index.ts' },
    { key: '/projects/ousi-ui/src/Button.vue', label: 'Button.vue' },
    { key: '/projects/ousi-ui/src/Input.vue',  label: 'Input.vue' },
  ],
  '/projects/api': [
    { key: '/projects/api/index.ts', label: 'index.ts' },
  ],
  '/docs': [
    { key: '/docs/intro.md',  label: 'intro.md' },
    { key: '/docs/guide.md',  label: 'guide.md' },
  ],
}

const nodes = ref<TreeNode[]>(remote['/'])
const treeRef = ref<InstanceType<typeof OTreeView>>()
const simulateError = ref(false)

async function loadChildren(node: TreeNode): Promise<TreeNode[]> {
  // Simulate network latency (~600ms).
  await new Promise((r) => setTimeout(r, 600))
  if (simulateError.value) throw new Error('Simulated failure')
  return remote[node.key] ?? []
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <p class="text-xs text-ousi-muted max-w-prose">
        Expand any folder — the tree calls <code class="text-xs bg-ousi-default px-1 rounded font-mono">loadChildren</code>
        and shows a spinner while it resolves. Toggle the switch to simulate a fetch failure —
        the chevron becomes a retry button.
      </p>
      <div class="flex items-center gap-2 shrink-0">
        <OSwitch v-model="simulateError" size="sm" />
        <span class="text-xs text-ousi-muted">Simulate error</span>
      </div>
    </div>

    <OTreeView
      ref="treeRef"
      :nodes="nodes"
      :load-children="loadChildren"
      :default-expanded-keys="new Set(['/'])"
    />
  </div>
</template>
