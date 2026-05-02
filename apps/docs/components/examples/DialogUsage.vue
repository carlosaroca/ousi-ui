<script setup lang="ts">
import { ref } from 'vue'
import { ODialog, ODialogHeader, ODialogBody, ODialogFooter, OButton } from '@ousi-ui/vue'

const open = ref(false)
function confirm() {
  open.value = false
}
</script>
<template>
  <OButton variant="danger-soft" @click="open = true">Delete project</OButton>

  <ODialog v-model="open" size="sm">
    <ODialogHeader>
      <div class="flex items-start gap-3">
        <div class="size-10 shrink-0 flex items-center justify-center rounded-ousi-2xl bg-ousi-danger-soft text-ousi-danger">
          <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <h2 class="text-base font-semibold text-ousi-foreground leading-tight">Delete &ldquo;Onboarding flow&rdquo;?</h2>
          <p class="text-sm text-ousi-muted mt-1 leading-relaxed">
            This permanently removes the project, its 47 components, and 12 collaborators&rsquo; access. This action cannot be undone.
          </p>
        </div>
      </div>
    </ODialogHeader>

    <ODialogBody>
      <div class="rounded-ousi-2xl border border-ousi-border bg-ousi-surface-secondary/50 px-4 py-3">
        <div class="flex items-center justify-between text-sm">
          <span class="text-ousi-muted">Project</span>
          <span class="font-medium text-ousi-foreground">Onboarding flow</span>
        </div>
        <div class="flex items-center justify-between text-sm mt-2">
          <span class="text-ousi-muted">Created</span>
          <span class="font-medium text-ousi-foreground">Jan 14, 2026</span>
        </div>
        <div class="flex items-center justify-between text-sm mt-2">
          <span class="text-ousi-muted">Last edited</span>
          <span class="font-medium text-ousi-foreground">2 hours ago</span>
        </div>
      </div>
    </ODialogBody>

    <ODialogFooter>
      <OButton variant="outline" @click="open = false">Cancel</OButton>
      <OButton variant="danger" @click="confirm">Delete project</OButton>
    </ODialogFooter>
  </ODialog>
</template>
