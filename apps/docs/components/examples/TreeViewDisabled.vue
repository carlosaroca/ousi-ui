<script setup lang="ts">
const nodes = [
  {
    key: 'available',
    label: 'Available Features',
    children: [
      { key: 'auth', label: 'Authentication' },
      { key: 'dashboard', label: 'Dashboard' },
    ],
  },
  {
    key: 'locked',
    label: 'Premium Features',
    disabled: true,
    children: [
      { key: 'analytics', label: 'Analytics' },
      { key: 'reports', label: 'Reports' },
    ],
  },
]
</script>

<template>
  <div class="w-full max-w-sm rounded-ousi-xl border border-ousi-border bg-ousi-surface p-3">
    <OTreeView :nodes="nodes" :default-expanded="['available']" selectable />
    <p class="text-xs text-ousi-muted mt-2">"Premium Features" is disabled.</p>
  </div>
</template>
