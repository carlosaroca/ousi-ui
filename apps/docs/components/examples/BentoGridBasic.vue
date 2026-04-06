<script setup lang="ts">
</script>

<template>
  <div class="w-full max-w-3xl">
    <OBentoGrid :cols="3" :gap="12">
      <OBentoGridItem :col-span="2">
        <div class="flex flex-col justify-between h-full">
          <div>
            <span class="text-xs font-medium text-ousi-accent uppercase tracking-wider">Performance</span>
            <h3 class="text-xl font-bold text-ousi-foreground mt-1">Lightning Fast</h3>
            <p class="text-sm text-ousi-muted mt-2">Built for speed with tree-shaking, lazy loading, and zero runtime overhead.</p>
          </div>
          <div class="flex gap-4 mt-4">
            <div class="text-center">
              <span class="text-2xl font-bold text-ousi-foreground">80+</span>
              <span class="text-xs text-ousi-muted block">Components</span>
            </div>
            <div class="text-center">
              <span class="text-2xl font-bold text-ousi-foreground">&lt;5kb</span>
              <span class="text-xs text-ousi-muted block">Per component</span>
            </div>
          </div>
        </div>
      </OBentoGridItem>
      <OBentoGridItem>
        <div class="flex flex-col items-center justify-center h-full gap-2">
          <div class="size-12 rounded-ousi-xl bg-ousi-accent/15 flex items-center justify-center">
            <svg class="size-6 text-ousi-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18m9-9H3"/></svg>
          </div>
          <span class="text-sm font-medium text-ousi-foreground">Customizable</span>
          <span class="text-xs text-ousi-muted text-center">Every component supports theming</span>
        </div>
      </OBentoGridItem>
      <OBentoGridItem>
        <div class="flex flex-col items-center justify-center h-full gap-3">
          <div class="flex -space-x-2">
            <div class="size-8 rounded-full bg-ousi-accent/20 border-2 border-ousi-surface" />
            <div class="size-8 rounded-full bg-ousi-success/20 border-2 border-ousi-surface" />
            <div class="size-8 rounded-full bg-ousi-warning/20 border-2 border-ousi-surface" />
          </div>
          <span class="text-sm font-medium text-ousi-foreground">Team Ready</span>
        </div>
      </OBentoGridItem>
      <OBentoGridItem :col-span="2">
        <div class="flex items-center gap-4 h-full">
          <div class="flex-1">
            <span class="text-xs font-medium text-ousi-success uppercase tracking-wider">Accessible</span>
            <h3 class="text-lg font-bold text-ousi-foreground mt-1">Built for Everyone</h3>
            <p class="text-sm text-ousi-muted mt-1">ARIA compliant, keyboard navigable, screen reader friendly.</p>
          </div>
          <div class="flex flex-col gap-1">
            <OKbd>Tab</OKbd>
            <OKbd>Enter</OKbd>
            <OKbd>Esc</OKbd>
          </div>
        </div>
      </OBentoGridItem>
    </OBentoGrid>
  </div>
</template>
