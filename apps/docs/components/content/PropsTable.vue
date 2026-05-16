<script setup lang="ts">
interface PropDef {
  name: string
  type: string
  default?: string
  description: string
}

const props = withDefaults(
  defineProps<{
    props: PropDef[]
    /** Label for the first column. Defaults to 'Prop'. Use 'Method' / 'Slot' / 'Event' as appropriate. */
    nameLabel?: string
    /** Hide the Default column. Useful for methods/events where a default doesn't apply. */
    hideDefault?: boolean
  }>(),
  { nameLabel: 'Prop', hideDefault: false },
)
</script>

<template>
  <div class="my-6 overflow-x-auto rounded-ousi-2xl border border-ousi-border">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-ousi-border bg-ousi-surface-secondary/50">
          <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">{{ nameLabel }}</th>
          <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Type</th>
          <th v-if="!hideDefault" class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Default</th>
          <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="prop in props.props"
          :key="prop.name"
          class="border-b border-ousi-border last:border-b-0"
        >
          <td class="px-4 py-3 font-mono text-xs font-medium text-ousi-accent">{{ prop.name }}</td>
          <td class="px-4 py-3 font-mono text-xs text-ousi-muted">{{ prop.type }}</td>
          <td v-if="!hideDefault" class="px-4 py-3 font-mono text-xs text-ousi-muted">{{ prop.default ?? '-' }}</td>
          <td class="px-4 py-3 text-sm text-ousi-foreground">{{ prop.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
