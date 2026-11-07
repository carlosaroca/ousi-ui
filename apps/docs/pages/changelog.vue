<script setup lang="ts">
import TimelineToc from '~/components/TimelineToc.vue'

useSeoMeta({
  title: 'Changelog | Ousi UI',
  description: 'Release history and changes for Ousi UI.',
})

const tocItems = [
  { id: 'v0-7-1', label: 'v0.7.1' },
  { id: 'v0-7-0', label: 'v0.7.0' },
  { id: 'v0-6-0', label: 'v0.6.0' },
  { id: 'v0-3-1', label: 'v0.3.1' },
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

    <!-- v0.7.1 -->
    <article id="v0-7-1" class="relative pl-8 pb-10 border-l-2 border-ousi-border">
      <div class="absolute -left-[9px] top-0 size-4 rounded-full bg-ousi-accent border-2 border-ousi-background" />
      <div class="flex items-center gap-3 mb-3">
        <h2 class="text-lg font-semibold text-ousi-foreground">v0.7.1</h2>
        <span class="text-xs text-ousi-muted">November 7, 2026</span>
        <span class="text-xs font-medium text-ousi-accent bg-ousi-accent-soft px-2 py-0.5 rounded-full">Latest</span>
      </div>

      <div class="space-y-4">
        <div>
          <h3 class="text-sm font-medium text-ousi-foreground mb-1.5">Added</h3>
          <ul class="space-y-1.5 text-sm text-ousi-muted">
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span><strong class="text-ousi-foreground">OSankey</strong> <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">minWidth</code> (default 400): below it the diagram scrolls sideways with an edge fade instead of squeezing the flows.</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span><strong class="text-ousi-foreground">OHeatmap</strong> <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">minCellWidth</code> and <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">scrollTo</code>: a grid with many columns, like a contribution calendar, scrolls instead of shrinking its cells, and can start at the latest week.</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-sm font-medium text-ousi-foreground mb-1.5">Fixed</h3>
          <ul class="space-y-1.5 text-sm text-ousi-muted">
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">~</span>
              <span>Charts no longer overflow on narrow screens: their SVG fills the container instead of holding a fixed pixel width, so a chart can shrink below its first measured size.</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">~</span>
              <span>Axis labels in the bar, combo, area, dot matrix and heatmap charts are thinned to the ones that fit instead of piling up. Funnel percent pills hide where they do not fit, scatter bubbles scale down on small screens, and the donut, radar, gauge and rings keep their natural size and shrink only when needed.</span>
            </li>
          </ul>
        </div>
      </div>
    </article>

    <!-- v0.7.0 -->
    <article id="v0-7-0" class="relative pl-8 pb-10 border-l-2 border-ousi-border">
      <div class="absolute -left-[9px] top-0 size-4 rounded-full bg-ousi-accent border-2 border-ousi-background" />
      <div class="flex items-center gap-3 mb-3">
        <h2 class="text-lg font-semibold text-ousi-foreground">v0.7.0</h2>
        <span class="text-xs text-ousi-muted">November 6, 2026</span>
      </div>

      <div class="space-y-4">
        <div>
          <h3 class="text-sm font-medium text-ousi-foreground mb-1.5">Added</h3>
          <ul class="space-y-1.5 text-sm text-ousi-muted">
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span><strong class="text-ousi-foreground">Charts</strong>: a new menu section with 13 components, none of them needing a charting library: <strong class="text-ousi-foreground">OBarChart</strong> (vertical or horizontal, grouped or stacked, with a track behind each bar, a ring on the hovered one and custom ticks), <strong class="text-ousi-foreground">OComboChart</strong> (bars and a line on two axes), <strong class="text-ousi-foreground">OAreaChart</strong>, <strong class="text-ousi-foreground">ODonutChart</strong> (donut or pie), <strong class="text-ousi-foreground">ORadarChart</strong>, <strong class="text-ousi-foreground">OScatterChart</strong> (bubbles when a point has a size), <strong class="text-ousi-foreground">OFunnel</strong> (a continuous flow or rows of pills), <strong class="text-ousi-foreground">OHeatmap</strong> (also as a contribution calendar), <strong class="text-ousi-foreground">OTreemap</strong>, <strong class="text-ousi-foreground">OSankey</strong>, <strong class="text-ousi-foreground">OSegmentedGauge</strong>, <strong class="text-ousi-foreground">OActivityRings</strong> and <strong class="text-ousi-foreground">ODotMatrix</strong>.</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span>Every chart reacts to hover and keyboard focus out of the box and also takes <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">v-model:focused</code> to read or drive the highlight, emits events (<code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">point-enter</code>, <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">point-click</code>…), exposes scoped slots for the tooltip, center, legend or labels, accepts any CSS color or a theme token, animates in (and respects reduced motion) and has no card of its own, so you wrap it as you like. The docs add recipes with a header, a period switch and an animated number.</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span><strong class="text-ousi-foreground">OTabs</strong>: <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">scrollFade</code> fades the edge of a scrolling list that still has tabs beyond it, and <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">contained</code> makes the list fill its parent without stretching it, for grid cells and cards in a flex row.</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span><code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">useScrollFade</code> in <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">@ousi-ui/vue</code>, the edge fade behind OScrollShadow and OTabs.</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span><code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">@ousi-ui/nuxt</code> 0.6.0 auto-imports the new components.</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-sm font-medium text-ousi-foreground mb-1.5">Changed</h3>
          <ul class="space-y-1.5 text-sm text-ousi-muted">
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">~</span>
              <span><strong class="text-ousi-foreground">OTabs</strong> scroll sideways when they do not fit, in both variants and with the scrollbar hidden, and the selected tab is brought into view, also from the keyboard. Before, the primary variant overflowed its container.</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">~</span>
              <span>Charts with many items are a single tab stop: the arrow keys, Home and End move between items, and Enter or Space activate the focused one.</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">~</span>
              <span><strong class="text-ousi-foreground">OScrollShadow</strong> now shares its fade logic with OTabs. Nothing changes in how it looks or behaves.</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">~</span>
              <span>The docs menu groups every chart under Charts, and the version in the header and on the home page is read from the package instead of being typed by hand.</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-sm font-medium text-ousi-foreground mb-1.5">Fixed</h3>
          <ul class="space-y-1.5 text-sm text-ousi-muted">
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">•</span>
              <span>OTabs inside a grid cell or a card in a flex row no longer stretch their column when they have many tabs (use the contained prop).</span>
            </li>
          </ul>
        </div>
      </div>
    </article>

    <!-- v0.6.0 -->
    <article id="v0-6-0" class="relative pl-8 pb-10 border-l-2 border-ousi-border">
      <div class="absolute -left-[9px] top-0 size-4 rounded-full bg-ousi-accent border-2 border-ousi-background" />
      <div class="flex items-center gap-3 mb-3">
        <h2 class="text-lg font-semibold text-ousi-foreground">v0.6.0</h2>
        <span class="text-xs text-ousi-muted">October 19, 2026</span>
      </div>

      <div class="space-y-4">
        <div>
          <h3 class="text-sm font-medium text-ousi-foreground mb-1.5">Added</h3>
          <ul class="space-y-1.5 text-sm text-ousi-muted">
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span><strong class="text-ousi-foreground">Layer stack</strong>: dialogs, drawers, popovers, dropdowns, context menus, the command palette and the lists of selects, autocompletes and pickers stack in the order they open, whatever order they mounted in. Escape closes only the top layer, and a press inside a layer opened above (a select list inside a popover, a calendar inside a dialog) no longer dismisses the layers below. Available as <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">useLayer</code> in <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">@ousi-ui/core</code>.</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span><strong class="text-ousi-foreground">OStatus</strong>: a dot in the tone's color plus the text, for tables and lists, in the <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">dot</code>, <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">halo</code> and <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">tinted</code> variants.</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span><code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">#start</code> and <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">#end</code> slots on <strong class="text-ousi-foreground">OSelect</strong> and <strong class="text-ousi-foreground">OAutocomplete</strong>, with the same look as OInput.</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span><code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">focus()</code> and <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">blur()</code> on every field component.</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span>Built-in component texts in English and Spanish, picked by the configured locale; the plugin's <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">messages</code> option replaces any of them.</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span>Dialog sizes up to 5xl, drawer sizes up to full, file upload with v-model and progress, server search in OAutocomplete, and tabs with an overflow menu.</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-sm font-medium text-ousi-foreground mb-1.5">Changed</h3>
          <ul class="space-y-1.5 text-sm text-ousi-muted">
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">~</span>
              <span>Fields send <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">aria-*</code>, <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">id</code>, <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">name</code>, <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">inputmode</code>, <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">autocomplete</code>, <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">data-*</code> and the other native attributes to their real control; <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">class</code>, <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">style</code> and listeners stay on the root. A passed <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">id</code> keeps the label association.</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">~</span>
              <span><strong class="text-ousi-foreground">ONumberField</strong> formats and parses with the configured locale (or its <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">locale</code> prop) and accepts that locale's separators when typing, so in es-CO <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">1.234,5</code> reads as 1234.5. Phones get a numeric or decimal keyboard.</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">~</span>
              <span><strong class="text-ousi-foreground">OChip</strong> redesigned: radius from the theme scale, soft as the default variant, sizes one step larger.</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">~</span>
              <span>Dialogs and drawers close on a backdrop click only when the press started on the backdrop, and their focus trap covers the layers opened from them.</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-sm font-medium text-ousi-foreground mb-1.5">Fixed</h3>
          <ul class="space-y-1.5 text-sm text-ousi-muted">
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">•</span>
              <span>ONumberField with format options no longer reformats while typing, reads percentages as fractions and keeps the value when the field is left without edits.</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">•</span>
              <span>Nested overlays no longer unlock page scroll early, and focus returns to its trigger when a popover, dropdown, context menu or picker closes.</span>
            </li>
          </ul>
        </div>
      </div>
    </article>

    <!-- v0.3.1 -->
    <article id="v0-3-1" class="relative pl-8 pb-10 border-l-2 border-ousi-border">
      <div class="absolute -left-[9px] top-0 size-4 rounded-full bg-ousi-accent border-2 border-ousi-background" />
      <div class="flex items-center gap-3 mb-3">
        <h2 class="text-lg font-semibold text-ousi-foreground">v0.3.1</h2>
        <span class="text-xs text-ousi-muted">May 3, 2026</span>
      </div>

      <div class="space-y-4">
        <div>
          <h3 class="text-sm font-medium text-ousi-foreground mb-1.5">Added</h3>
          <ul class="space-y-1.5 text-sm text-ousi-muted">
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span><strong class="text-ousi-foreground">OTimePicker</strong>: new component with iOS-style wheel popover. True 3D rotation
              (<code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">perspective</code> + per-item
              <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">rotateX</code>), infinite scroll on hour/minute/second wheels,
              fade mask at the edges, mouse drag (touch keeps native momentum), haptic feedback on every value change,
              and full <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">min</code>/<code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">max</code> enforcement
              (out-of-range items are dimmed, struck through, and skipped on scroll).
              Supports <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">hour12</code>,
              <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">granularity: 'hour' | 'minute' | 'second'</code>,
              <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">interval</code> for the minute wheel,
              <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">variant: 'primary' | 'secondary'</code>,
              and the standard label/description/error/disabled/readonly/required field props.</span>
            </li>
          </ul>
        </div>
      </div>
    </article>

    <!-- v0.3.0 -->
    <article id="v0-3-0" class="relative pl-8 pb-10 border-l-2 border-ousi-border">
      <div class="absolute -left-[9px] top-0 size-4 rounded-full bg-ousi-accent border-2 border-ousi-background" />
      <div class="flex items-center gap-3 mb-3">
        <h2 class="text-lg font-semibold text-ousi-foreground">v0.3.0</h2>
        <span class="text-xs text-ousi-muted">May 2, 2026</span>
      </div>

      <div class="space-y-4">
        <div>
          <h3 class="text-sm font-medium text-ousi-foreground mb-1.5">Added</h3>
          <ul class="space-y-1.5 text-sm text-ousi-muted">
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span>OButton: <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">ripple</code> prop (default <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">true</code>): Material-style ripple from the click point</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span>OButton: <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">animationType</code> prop with <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">#animate</code> slot: swap default content on hover with <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">vertical</code> / <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">scale</code> / <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">rotate</code></span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span>ODialog: <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">preventClose</code> prop: block dismissal via Escape and backdrop click. The X button still works unless also hidden via <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">hideCloseButton</code></span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span>ODialog: close button repositioned outside the panel with shadow at rest and press-in feel on hover. Radius adapts to <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">--ousi-radius</code> via <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">rounded-ousi-xl</code></span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span>OAutocomplete: <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">scrollShadow</code> prop (default <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">true</code>): fade indicator at top/bottom of long option lists, native scrollbar hidden</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span>ODatePicker and ODateRangePicker: new <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">variant: 'primary' | 'secondary'</code> prop matching the rest of the field family</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span>Docs: Dialog examples rewritten with realistic content (confirm-delete, pricing, rename, terms, prevent-close); long-list demo for Autocomplete; Variants and Clearable sections for date pickers; Animate Slot demo for Button</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-medium text-ousi-foreground mb-1.5">Changed</h3>
          <ul class="space-y-1.5 text-sm text-ousi-muted">
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-warning mt-0.5">~</span>
              <span>ODialog: default <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">placement</code> changed from <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">'auto'</code> to <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">'center'</code>. Mobile no longer sticks dialogs to the bottom by default</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-medium text-ousi-foreground mb-1.5">Fixed</h3>
          <ul class="space-y-1.5 text-sm text-ousi-muted">
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-warning mt-0.5">~</span>
              <span>ODatePicker and ODateRangePicker: setting <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">v-model</code> to <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">null</code> now clears the displayed segments. Previously the watcher only handled non-null values</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-warning mt-0.5">~</span>
              <span>OAutocomplete: native scrollbar no longer clashes with the rounded popover edges on long lists</span>
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
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-danger mt-0.5">!</span>
              <span>Renamed <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">variant="ghost"</code> to <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">variant="text"</code> on OButton, OChip, and OToast action</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-danger mt-0.5">!</span>
              <span>Compound components flattened: <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">OCard.Header</code> → <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">OCardHeader</code> across Card, Dialog, Dropdown, ButtonGroup, BentoGrid</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-danger mt-0.5">!</span>
              <span>Removed <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">fullWidth</code> prop from 13 field components: fields always stretch now</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-medium text-ousi-foreground mb-1.5">Added</h3>
          <ul class="space-y-1.5 text-sm text-ousi-muted">
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span>Layered shadow system with tintable <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">--ousi-shadow-color</code> token: xs/sm/md/lg/xl/2xl</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span><code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">shadow</code> prop on 40+ components, each with scoped ranges</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span><code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">animated</code> prop on fields: iOS-style tactile scale on focus</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span><code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">v-tooltip</code> directive and <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">useTooltip</code> composable as alternatives to the <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">&lt;OTooltip&gt;</code> wrapper</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span>Complete <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">@ousi-ui/nuxt</code> module with auto-imports + <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">unplugin-vue-components</code> resolver</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span><code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">sideEffects</code> field in package.json for reliable tree-shaking</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span>Redesigned OCodeBlock</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-medium text-ousi-foreground mb-1.5">Fixed</h3>
          <ul class="space-y-1.5 text-sm text-ousi-muted">
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-warning mt-0.5">~</span>
              <span>Tooltip no longer breaks child layouts: uses <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">display: contents</code> wrapper instead of <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">inline-flex</code></span>
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
        <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
          <span class="text-ousi-warning mt-0.5">~</span>
          <span>Fixed Card border-radius: reduced from 4xl to 3xl for better visual consistency</span>
        </li>
        <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
          <span class="text-ousi-accent mt-0.5">+</span>
          <span>Theme now auto-scans @ousi-ui/vue classes: no manual @source needed in Tailwind v4</span>
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
        <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
          <span class="text-ousi-warning mt-0.5">~</span>
          <span>Fixed npm/yarn install: bundled @ousi-ui/core and @ousi-ui/haptics into @ousi-ui/vue to eliminate workspace:* protocol errors</span>
        </li>
        <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
          <span class="text-ousi-accent mt-0.5">+</span>
          <span>Added Google Analytics to docs and playground</span>
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
        <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
          <span class="text-ousi-accent mt-0.5">+</span>
          <span>New OTimelineNav component: animated sidebar navigation with SVG curved line</span>
        </li>
        <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
          <span class="text-ousi-accent mt-0.5">+</span>
          <span>Added Changelog page to docs</span>
        </li>
        <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
          <span class="text-ousi-accent mt-0.5">+</span>
          <span>GitHub stars counter with smart caching in header</span>
        </li>
        <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
          <span class="text-ousi-accent mt-0.5">+</span>
          <span>Footer with gradient logo, links, and social icons on landing</span>
        </li>
        <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
          <span class="text-ousi-accent mt-0.5">+</span>
          <span>Playground integrated into docs site (no separate server)</span>
        </li>
        <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
          <span class="text-ousi-warning mt-0.5">~</span>
          <span>Fixed ImageCompare and Resizable drag on mobile (touch-action: none)</span>
        </li>
        <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
          <span class="text-ousi-warning mt-0.5">~</span>
          <span>Fixed secondary variant on Input, Textarea, NumberField, Select</span>
        </li>
        <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
          <span class="text-ousi-warning mt-0.5">~</span>
          <span>Fixed dark mode for Toast, sidebar highlight, TOC highlight</span>
        </li>
        <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
          <span class="text-ousi-warning mt-0.5">~</span>
          <span>Fixed Checkbox click on label/description areas</span>
        </li>
        <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
          <span class="text-ousi-warning mt-0.5">~</span>
          <span>Fixed MagneticButton: now uses OButton internally</span>
        </li>
        <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
          <span class="text-ousi-danger mt-0.5">-</span>
          <span>Removed Dock component (easily replicated with CSS)</span>
        </li>
        <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
          <span class="text-ousi-danger mt-0.5">-</span>
          <span>Removed Disclosure/DisclosureGroup (redundant with Collapsible + Accordion)</span>
        </li>
        <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
          <span class="text-ousi-danger mt-0.5">-</span>
          <span>Removed AvatarGroup (replicated with flex + ring classes)</span>
        </li>
        <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
          <span class="text-ousi-danger mt-0.5">-</span>
          <span>Removed Sidebar component (deferred to next release)</span>
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
        <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
          <span class="text-ousi-accent mt-0.5">+</span>
          <span>Added README to npm packages</span>
        </li>
        <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
          <span class="text-ousi-warning mt-0.5">~</span>
          <span>Fixed all TypeScript build errors for clean CI</span>
        </li>
        <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
          <span class="text-ousi-warning mt-0.5">~</span>
          <span>Fixed Switch pill shape: now fully rounded</span>
        </li>
        <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
          <span class="text-ousi-warning mt-0.5">~</span>
          <span>Fixed Switch track color for dark mode</span>
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
        The first public release of Ousi UI: a component library for Vue & Flutter.
      </p>
      <div class="space-y-4">
        <div>
          <h3 class="text-sm font-medium text-ousi-foreground mb-1.5">Highlights</h3>
          <ul class="space-y-1.5 text-sm text-ousi-muted">
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span>74 Vue 3 components</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span>Tailwind CSS v4 with OKLCH color system</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span>Light & dark mode via data-theme</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span>Theme Playground with CSS export + URL sharing</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span>OChart: real-time canvas chart (line, candlestick, multi-series)</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span>Full documentation site with live examples</span>
            </li>
            <li class="flex items-start gap-2 [&>span:last-child]:min-w-0 [&>span:last-child]:[overflow-wrap:anywhere]">
              <span class="text-ousi-accent mt-0.5">+</span>
              <span>Published to npm: @ousi-ui/vue, @ousi-ui/theme, @ousi-ui/tokens</span>
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
