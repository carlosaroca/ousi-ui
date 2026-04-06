<script setup lang="ts">
import TimelineToc from '~/components/TimelineToc.vue'

useSeoMeta({
  title: 'Introduction — Ousi UI',
  description: 'A beautiful, accessible Vue 3 component library built with Tailwind CSS v4.',
})

const tocItems = [
  { id: 'what-is', label: 'What is Ousi UI?' },
  { id: 'features', label: 'Key Features' },
  { id: 'tech-stack', label: 'Tech Stack' },
  { id: 'categories', label: 'Component Categories' },
]
</script>

<template>
  <div>
    <Teleport to="#docs-toc">
      <TimelineToc :items="tocItems" />
    </Teleport>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-ousi-foreground tracking-tight">Introduction</h1>
      <p class="mt-1.5 text-base text-ousi-muted">A modern Vue 3 component library with 80+ beautifully crafted, accessible components.</p>
    </div>

    <div class="space-y-12">

      <section id="what-is">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">What is Ousi UI?</h2>
        <p class="text-sm text-ousi-foreground leading-relaxed mb-4">
          Ousi UI is an open-source component library for Vue 3, built on top of
          <a href="https://tailwindcss.com" target="_blank" class="text-ousi-accent underline font-medium">Tailwind CSS v4</a>
          and <strong>class-variance-authority (CVA)</strong>. It provides a comprehensive set of components
          with smooth animations, polished interactions, and built-in accessibility — ready to drop into
          any project.
        </p>
        <p class="text-sm text-ousi-muted leading-relaxed">
          Every component is fully customizable through props, slots, and theming — no fighting with
          opinionated styles. The OKLCH-based color system adapts to any brand with a single accent hue change.
        </p>
      </section>

      <OSeparator />

      <section id="features">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Key Features</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface p-4">
            <div class="size-8 rounded-ousi-lg bg-ousi-accent/10 flex items-center justify-center mb-2">
              <svg class="size-4 text-ousi-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-ousi-foreground">Themeable</h3>
            <p class="text-xs text-ousi-muted mt-1">OKLCH color tokens, CSS variables, dark mode — change the entire look with a few lines of CSS.</p>
          </div>
          <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface p-4">
            <div class="size-8 rounded-ousi-lg bg-ousi-success/10 flex items-center justify-center mb-2">
              <svg class="size-4 text-ousi-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-ousi-foreground">Accessible</h3>
            <p class="text-xs text-ousi-muted mt-1">ARIA attributes, keyboard navigation, focus management, and screen reader support built into every component.</p>
          </div>
          <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface p-4">
            <div class="size-8 rounded-ousi-lg bg-ousi-warning/10 flex items-center justify-center mb-2">
              <svg class="size-4 text-ousi-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-ousi-foreground">Animated</h3>
            <p class="text-xs text-ousi-muted mt-1">Smooth transitions, spring physics, and micro-interactions that make interfaces feel alive.</p>
          </div>
          <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface p-4">
            <div class="size-8 rounded-ousi-lg bg-ousi-danger/10 flex items-center justify-center mb-2">
              <svg class="size-4 text-ousi-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-ousi-foreground">Composable</h3>
            <p class="text-xs text-ousi-muted mt-1">Flexible slot-based API. Combine, extend, and customize components without limits.</p>
          </div>
          <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface p-4">
            <div class="size-8 rounded-ousi-lg bg-ousi-accent/10 flex items-center justify-center mb-2">
              <svg class="size-4 text-ousi-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-ousi-foreground">Mobile First</h3>
            <p class="text-xs text-ousi-muted mt-1">Touch-optimized with optional haptic feedback on supported mobile devices.</p>
          </div>
          <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface p-4">
            <div class="size-8 rounded-ousi-lg bg-ousi-muted/10 flex items-center justify-center mb-2">
              <svg class="size-4 text-ousi-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-ousi-foreground">Lightweight</h3>
            <p class="text-xs text-ousi-muted mt-1">Tree-shakeable, zero external dependencies. Import only what you use.</p>
          </div>
        </div>
      </section>

      <OSeparator />

      <section id="tech-stack">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Tech Stack</h2>
        <div class="overflow-x-auto rounded-ousi-xl border border-ousi-border">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-ousi-border bg-ousi-surface-secondary/50">
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Technology</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">Vue 3</td>
                <td class="px-4 py-3 text-ousi-foreground">Composition API, script setup, TypeScript</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">Tailwind CSS v4</td>
                <td class="px-4 py-3 text-ousi-foreground">CSS-first configuration, design tokens</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">CVA</td>
                <td class="px-4 py-3 text-ousi-foreground">Type-safe variant management for component styles</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">OKLCH</td>
                <td class="px-4 py-3 text-ousi-foreground">Perceptually uniform color system for consistent palettes</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">TypeScript</td>
                <td class="px-4 py-3 text-ousi-foreground">Full type safety, auto-completion, and IDE support</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <OSeparator />

      <section id="categories">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Component Categories</h2>
        <p class="text-sm text-ousi-muted mb-4">80+ components organized into logical groups:</p>
        <div class="flex flex-wrap gap-2">
          <OChip v-for="cat in ['Buttons', 'Forms', 'Date & Time', 'Colors', 'Data Display', 'Feedback', 'Layout', 'Media', 'Navigation', 'Overlays', 'Typography', 'Interactive', 'Utilities']" :key="cat" variant="flat" size="sm">{{ cat }}</OChip>
        </div>
      </section>

    </div>
  </div>
</template>
