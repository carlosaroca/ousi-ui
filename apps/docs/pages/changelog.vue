<script setup lang="ts">
useSeoMeta({
  title: 'Changelog — Ousi UI',
  description: 'Release history and changes for Ousi UI.',
})
</script>

<template>
  <div class="max-w-2xl">
    <h1 class="text-3xl font-bold text-ousi-foreground tracking-tight mb-2">Changelog</h1>
    <p class="text-ousi-muted mb-10">All notable changes to Ousi UI.</p>

    <!-- v0.1.3 -->
    <article class="relative pl-8 pb-10 border-l-2 border-ousi-border">
      <div class="absolute -left-[9px] top-0 size-4 rounded-full bg-ousi-accent border-2 border-ousi-background" />
      <div class="flex items-center gap-3 mb-3">
        <h2 class="text-lg font-semibold text-ousi-foreground">v0.1.3</h2>
        <span class="text-xs text-ousi-muted">April 8, 2026</span>
        <span class="text-xs font-medium text-ousi-accent bg-ousi-accent-soft px-2 py-0.5 rounded-full">Latest</span>
      </div>
      <ul class="space-y-1.5 text-sm text-ousi-muted">
        <li class="flex items-start gap-2">
          <span class="text-ousi-warning mt-0.5">~</span>
          Fixed npm/yarn install — bundled @ousi-ui/core and @ousi-ui/haptics into @ousi-ui/vue to eliminate workspace:* protocol errors
        </li>
        <li class="flex items-start gap-2">
          <span class="text-ousi-accent mt-0.5">+</span>
          Added Google Analytics to docs and playground
        </li>
      </ul>
    </article>

    <!-- v0.1.2 -->
    <article class="relative pl-8 pb-10 border-l-2 border-ousi-border">
      <div class="absolute -left-[9px] top-0 size-4 rounded-full bg-ousi-accent border-2 border-ousi-background" />
      <div class="flex items-center gap-3 mb-3">
        <h2 class="text-lg font-semibold text-ousi-foreground">v0.1.2</h2>
        <span class="text-xs text-ousi-muted">April 6, 2026</span>
      </div>
      <ul class="space-y-1.5 text-sm text-ousi-muted">
        <li class="flex items-start gap-2">
          <span class="text-ousi-accent mt-0.5">+</span>
          New OTimelineNav component — animated sidebar navigation with SVG curved line
        </li>
        <li class="flex items-start gap-2">
          <span class="text-ousi-accent mt-0.5">+</span>
          Added Changelog page to docs
        </li>
        <li class="flex items-start gap-2">
          <span class="text-ousi-accent mt-0.5">+</span>
          GitHub stars counter with smart caching in header
        </li>
        <li class="flex items-start gap-2">
          <span class="text-ousi-accent mt-0.5">+</span>
          Footer with gradient logo, links, and social icons on landing
        </li>
        <li class="flex items-start gap-2">
          <span class="text-ousi-accent mt-0.5">+</span>
          Playground integrated into docs site (no separate server)
        </li>
        <li class="flex items-start gap-2">
          <span class="text-ousi-warning mt-0.5">~</span>
          Fixed ImageCompare and Resizable drag on mobile (touch-action: none)
        </li>
        <li class="flex items-start gap-2">
          <span class="text-ousi-warning mt-0.5">~</span>
          Fixed secondary variant on Input, Textarea, NumberField, Select
        </li>
        <li class="flex items-start gap-2">
          <span class="text-ousi-warning mt-0.5">~</span>
          Fixed dark mode for Toast, sidebar highlight, TOC highlight
        </li>
        <li class="flex items-start gap-2">
          <span class="text-ousi-warning mt-0.5">~</span>
          Fixed Checkbox click on label/description areas
        </li>
        <li class="flex items-start gap-2">
          <span class="text-ousi-warning mt-0.5">~</span>
          Fixed MagneticButton — now uses OButton internally
        </li>
        <li class="flex items-start gap-2">
          <span class="text-ousi-danger mt-0.5">-</span>
          Removed Dock component (easily replicated with CSS)
        </li>
        <li class="flex items-start gap-2">
          <span class="text-ousi-danger mt-0.5">-</span>
          Removed Disclosure/DisclosureGroup (redundant with Collapsible + Accordion)
        </li>
        <li class="flex items-start gap-2">
          <span class="text-ousi-danger mt-0.5">-</span>
          Removed AvatarGroup (replicated with flex + ring classes)
        </li>
        <li class="flex items-start gap-2">
          <span class="text-ousi-danger mt-0.5">-</span>
          Removed Sidebar component (deferred to next release)
        </li>
      </ul>
    </article>

    <!-- v0.1.1 -->
    <article class="relative pl-8 pb-10 border-l-2 border-ousi-border">
      <div class="absolute -left-[9px] top-0 size-4 rounded-full bg-ousi-accent border-2 border-ousi-background" />
      <div class="flex items-center gap-3 mb-3">
        <h2 class="text-lg font-semibold text-ousi-foreground">v0.1.1</h2>
        <span class="text-xs text-ousi-muted">April 6, 2026</span>
      </div>
      <ul class="space-y-1.5 text-sm text-ousi-muted">
        <li class="flex items-start gap-2">
          <span class="text-ousi-accent mt-0.5">+</span>
          Added README to npm packages
        </li>
        <li class="flex items-start gap-2">
          <span class="text-ousi-warning mt-0.5">~</span>
          Fixed all TypeScript build errors for clean CI
        </li>
        <li class="flex items-start gap-2">
          <span class="text-ousi-warning mt-0.5">~</span>
          Fixed Switch pill shape — now fully rounded
        </li>
        <li class="flex items-start gap-2">
          <span class="text-ousi-warning mt-0.5">~</span>
          Fixed Switch track color for dark mode
        </li>
      </ul>
    </article>

    <!-- v0.1.0 -->
    <article class="relative pl-8 pb-10 border-l-2 border-ousi-border">
      <div class="absolute -left-[9px] top-0 size-4 rounded-full bg-ousi-accent border-2 border-ousi-background" />
      <div class="flex items-center gap-3 mb-3">
        <h2 class="text-lg font-semibold text-ousi-foreground">v0.1.0</h2>
        <span class="text-xs text-ousi-muted">April 5, 2026</span>
        <span class="text-xs font-medium text-ousi-accent bg-ousi-accent-soft px-2 py-0.5 rounded-full">First Release</span>
      </div>
      <p class="text-sm text-ousi-muted mb-3">
        The first public release of Ousi UI — a component library for Vue & Flutter.
      </p>
      <div class="space-y-4">
        <div>
          <h3 class="text-sm font-medium text-ousi-foreground mb-1.5">Highlights</h3>
          <ul class="space-y-1.5 text-sm text-ousi-muted">
            <li class="flex items-start gap-2">
              <span class="text-ousi-accent mt-0.5">+</span>
              74 Vue 3 components
            </li>
            <li class="flex items-start gap-2">
              <span class="text-ousi-accent mt-0.5">+</span>
              Tailwind CSS v4 with OKLCH color system
            </li>
            <li class="flex items-start gap-2">
              <span class="text-ousi-accent mt-0.5">+</span>
              Light & dark mode via data-theme
            </li>
            <li class="flex items-start gap-2">
              <span class="text-ousi-accent mt-0.5">+</span>
              Theme Playground with CSS export + URL sharing
            </li>
            <li class="flex items-start gap-2">
              <span class="text-ousi-accent mt-0.5">+</span>
              OChart — real-time canvas chart (line, candlestick, multi-series)
            </li>
            <li class="flex items-start gap-2">
              <span class="text-ousi-accent mt-0.5">+</span>
              Full documentation site with live examples
            </li>
            <li class="flex items-start gap-2">
              <span class="text-ousi-accent mt-0.5">+</span>
              Published to npm: @ousi-ui/vue, @ousi-ui/theme, @ousi-ui/tokens
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-medium text-ousi-foreground mb-1.5">Components</h3>
          <p class="text-sm text-ousi-muted">
            Buttons, Forms, Date Pickers, Color Pickers, Charts, Modals, Tooltips, Toasts, Tables, Tabs, Accordions, Carousels, Command Palette, and 50+ more.
          </p>
        </div>
      </div>
    </article>

    <!-- End marker -->
    <div class="relative pl-8">
      <div class="absolute -left-[5px] top-0 size-2.5 rounded-full bg-ousi-border" />
      <p class="text-xs text-ousi-muted">Beginning of changelog</p>
    </div>
  </div>
</template>
