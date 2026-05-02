<script setup lang="ts">
import TimelineToc from '~/components/TimelineToc.vue'

useSeoMeta({
  title: 'Changelog — Ousi UI',
  description: 'Release history and changes for Ousi UI.',
})

const tocItems = [
  { id: 'v0-3-0', label: 'v0.3.0' },
  { id: 'v0-2-0', label: 'v0.2.0' },
  { id: 'v0-1-4', label: 'v0.1.4' },
  { id: 'v0-1-3', label: 'v0.1.3' },
  { id: 'v0-1-2', label: 'v0.1.2' },
  { id: 'v0-1-1', label: 'v0.1.1' },
  { id: 'v0-1-0', label: 'v0.1.0' },
]
</script>

<template>
  <div class="max-w-2xl">
    <Teleport to="#docs-toc">
      <TimelineToc :items="tocItems" />
    </Teleport>

    <h1 class="text-3xl font-bold text-ousi-foreground tracking-tight mb-2">Changelog</h1>
    <p class="text-ousi-muted mb-10">All notable changes to Ousi UI.</p>

    <!-- v0.3.0 -->
    <article id="v0-3-0" class="relative pl-8 pb-10 border-l-2 border-ousi-border">
      <div class="absolute -left-[9px] top-0 size-4 rounded-full bg-ousi-accent border-2 border-ousi-background" />
      <div class="flex items-center gap-3 mb-3">
        <h2 class="text-lg font-semibold text-ousi-foreground">v0.3.0</h2>
        <span class="text-xs text-ousi-muted">May 2, 2026</span>
        <span class="text-xs font-medium text-ousi-accent bg-ousi-accent-soft px-2 py-0.5 rounded-full">Latest</span>
      </div>

      <div class="space-y-4">
        <div>
          <h3 class="text-sm font-medium text-ousi-foreground mb-1.5">Added</h3>
          <ul class="space-y-1.5 text-sm text-ousi-muted">
            <li class="flex items-start gap-2">
              <span class="text-ousi-accent mt-0.5">+</span>
              OButton — <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">ripple</code> prop (default <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">true</code>) — Material-style ripple from the click point
            </li>
            <li class="flex items-start gap-2">
              <span class="text-ousi-accent mt-0.5">+</span>
              OButton — <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">animationType</code> prop with <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">#animate</code> slot — swap default content on hover with <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">vertical</code> / <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">scale</code> / <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">rotate</code>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-ousi-accent mt-0.5">+</span>
              ODialog — <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">preventClose</code> prop — block dismissal via Escape and backdrop click. The X button still works unless also hidden via <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">hideCloseButton</code>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-ousi-accent mt-0.5">+</span>
              ODialog — close button repositioned outside the panel with shadow at rest and press-in feel on hover. Radius adapts to <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">--ousi-radius</code> via <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">rounded-ousi-xl</code>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-ousi-accent mt-0.5">+</span>
              OAutocomplete — <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">scrollShadow</code> prop (default <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">true</code>) — fade indicator at top/bottom of long option lists, native scrollbar hidden
            </li>
            <li class="flex items-start gap-2">
              <span class="text-ousi-accent mt-0.5">+</span>
              ODatePicker and ODateRangePicker — new <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">variant: 'primary' | 'secondary'</code> prop matching the rest of the field family
            </li>
            <li class="flex items-start gap-2">
              <span class="text-ousi-accent mt-0.5">+</span>
              Docs — Dialog examples rewritten with realistic content (confirm-delete, pricing, rename, terms, prevent-close); long-list demo for Autocomplete; Variants and Clearable sections for date pickers; Animate Slot demo for Button
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-medium text-ousi-foreground mb-1.5">Changed</h3>
          <ul class="space-y-1.5 text-sm text-ousi-muted">
            <li class="flex items-start gap-2">
              <span class="text-ousi-warning mt-0.5">~</span>
              ODialog — default <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">placement</code> changed from <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">'auto'</code> to <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">'center'</code>. Mobile no longer sticks dialogs to the bottom by default
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-medium text-ousi-foreground mb-1.5">Fixed</h3>
          <ul class="space-y-1.5 text-sm text-ousi-muted">
            <li class="flex items-start gap-2">
              <span class="text-ousi-warning mt-0.5">~</span>
              ODatePicker and ODateRangePicker — setting <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">v-model</code> to <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">null</code> now clears the displayed segments. Previously the watcher only handled non-null values
            </li>
            <li class="flex items-start gap-2">
              <span class="text-ousi-warning mt-0.5">~</span>
              OAutocomplete — native scrollbar no longer clashes with the rounded popover edges on long lists
            </li>
          </ul>
        </div>
      </div>
    </article>

    <!-- v0.2.0 -->
    <article id="v0-2-0" class="relative pl-8 pb-10 border-l-2 border-ousi-border">
      <div class="absolute -left-[9px] top-0 size-4 rounded-full bg-ousi-accent border-2 border-ousi-background" />
      <div class="flex items-center gap-3 mb-3">
        <h2 class="text-lg font-semibold text-ousi-foreground">v0.2.0</h2>
        <span class="text-xs text-ousi-muted">April 23, 2026</span>
      </div>

      <div class="space-y-4">
        <div>
          <h3 class="text-sm font-medium text-ousi-foreground mb-1.5">Breaking changes</h3>
          <ul class="space-y-1.5 text-sm text-ousi-muted">
            <li class="flex items-start gap-2">
              <span class="text-ousi-danger mt-0.5">!</span>
              Renamed <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">variant="ghost"</code> to <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">variant="text"</code> on OButton, OChip, and OToast action
            </li>
            <li class="flex items-start gap-2">
              <span class="text-ousi-danger mt-0.5">!</span>
              Compound components flattened — <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">OCard.Header</code> → <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">OCardHeader</code> across Card, Dialog, Dropdown, ButtonGroup, BentoGrid
            </li>
            <li class="flex items-start gap-2">
              <span class="text-ousi-danger mt-0.5">!</span>
              Removed <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">fullWidth</code> prop from 13 field components — fields always stretch now
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-medium text-ousi-foreground mb-1.5">Added</h3>
          <ul class="space-y-1.5 text-sm text-ousi-muted">
            <li class="flex items-start gap-2">
              <span class="text-ousi-accent mt-0.5">+</span>
              Layered shadow system with tintable <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">--ousi-shadow-color</code> token — xs/sm/md/lg/xl/2xl
            </li>
            <li class="flex items-start gap-2">
              <span class="text-ousi-accent mt-0.5">+</span>
              <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">shadow</code> prop on 40+ components, each with scoped ranges
            </li>
            <li class="flex items-start gap-2">
              <span class="text-ousi-accent mt-0.5">+</span>
              <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">animated</code> prop on fields — iOS-style tactile scale on focus
            </li>
            <li class="flex items-start gap-2">
              <span class="text-ousi-accent mt-0.5">+</span>
              <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">v-tooltip</code> directive and <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">useTooltip</code> composable as alternatives to the <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">&lt;OTooltip&gt;</code> wrapper
            </li>
            <li class="flex items-start gap-2">
              <span class="text-ousi-accent mt-0.5">+</span>
              Complete <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">@ousi-ui/nuxt</code> module with auto-imports + <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">unplugin-vue-components</code> resolver
            </li>
            <li class="flex items-start gap-2">
              <span class="text-ousi-accent mt-0.5">+</span>
              <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">sideEffects</code> field in package.json for reliable tree-shaking
            </li>
            <li class="flex items-start gap-2">
              <span class="text-ousi-accent mt-0.5">+</span>
              Redesigned OCodeBlock
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-medium text-ousi-foreground mb-1.5">Fixed</h3>
          <ul class="space-y-1.5 text-sm text-ousi-muted">
            <li class="flex items-start gap-2">
              <span class="text-ousi-warning mt-0.5">~</span>
              Tooltip no longer breaks child layouts — uses <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">display: contents</code> wrapper instead of <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">inline-flex</code>
            </li>
          </ul>
        </div>
      </div>
    </article>

    <!-- v0.1.4 -->
    <article id="v0-1-4" class="relative pl-8 pb-10 border-l-2 border-ousi-border">
      <div class="absolute -left-[9px] top-0 size-4 rounded-full bg-ousi-accent border-2 border-ousi-background" />
      <div class="flex items-center gap-3 mb-3">
        <h2 class="text-lg font-semibold text-ousi-foreground">v0.1.4</h2>
        <span class="text-xs text-ousi-muted">April 8, 2026</span>
      </div>
      <ul class="space-y-1.5 text-sm text-ousi-muted">
        <li class="flex items-start gap-2">
          <span class="text-ousi-warning mt-0.5">~</span>
          Fixed Card border-radius — reduced from 4xl to 3xl for better visual consistency
        </li>
        <li class="flex items-start gap-2">
          <span class="text-ousi-accent mt-0.5">+</span>
          Theme now auto-scans @ousi-ui/vue classes — no manual @source needed in Tailwind v4
        </li>
      </ul>
    </article>

    <!-- v0.1.3 -->
    <article id="v0-1-3" class="relative pl-8 pb-10 border-l-2 border-ousi-border">
      <div class="absolute -left-[9px] top-0 size-4 rounded-full bg-ousi-accent border-2 border-ousi-background" />
      <div class="flex items-center gap-3 mb-3">
        <h2 class="text-lg font-semibold text-ousi-foreground">v0.1.3</h2>
        <span class="text-xs text-ousi-muted">April 8, 2026</span>
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
    <article id="v0-1-2" class="relative pl-8 pb-10 border-l-2 border-ousi-border">
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
    <article id="v0-1-1" class="relative pl-8 pb-10 border-l-2 border-ousi-border">
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
    <article id="v0-1-0" class="relative pl-8 pb-10 border-l-2 border-ousi-border">
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
