<script setup lang="ts">
import TimelineToc from '~/components/TimelineToc.vue'

useSeoMeta({
  title: 'Animation — Ousi UI',
  description: 'Animation system, easing functions, and motion components in Ousi UI.',
})

const tocItems = [
  { id: 'animation-philosophy', label: 'Animation Philosophy' },
  { id: 'built-in-animations', label: 'Built-in Animations' },
  { id: 'easing-functions', label: 'Easing Functions' },
  { id: 'animated-number', label: 'AnimatedNumber' },
  { id: 'marquee', label: 'Marquee' },
  { id: 'typewriter', label: 'Typewriter' },
  { id: 'reducing-motion', label: 'Reducing Motion' },
]
</script>

<template>
  <div>
    <Teleport to="#docs-toc">
      <TimelineToc :items="tocItems" />
    </Teleport>
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-1">
        <OChip color="accent" variant="soft" size="sm">Handbook</OChip>
      </div>
      <h1 class="text-3xl font-bold text-ousi-foreground tracking-tight">Animation</h1>
      <p class="mt-1.5 text-base text-ousi-muted">Subtle, purposeful motion that makes interfaces feel alive without getting in the way.</p>
    </div>

    <div class="space-y-12">

      <!-- Animation Philosophy -->
      <section id="animation-philosophy">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Animation Philosophy</h2>
        <p class="text-sm text-ousi-foreground leading-relaxed mb-4">
          Ousi UI uses subtle, purposeful animations that reinforce user actions without creating distraction.
          The animation system is built on two pillars: <strong>spring physics</strong> for natural, organic motion
          and <strong>CSS transitions</strong> for simple state changes like hover and focus.
        </p>
        <ul class="space-y-2.5 text-sm text-ousi-foreground">
          <li class="flex items-start gap-2">
            <svg class="size-4 text-ousi-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <span><strong>Purposeful</strong> — every animation serves a function: guiding focus, confirming actions, or revealing relationships.</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="size-4 text-ousi-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <span><strong>Fast</strong> — most transitions complete in 150-300ms. Nothing blocks user interaction.</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="size-4 text-ousi-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <span><strong>Accessible</strong> — all motion respects <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">prefers-reduced-motion</code> out of the box.</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="size-4 text-ousi-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <span><strong>GPU-accelerated</strong> — animations use <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">transform</code> and <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">opacity</code> to stay on the compositor thread.</span>
          </li>
        </ul>
      </section>

      <OSeparator />

      <!-- Built-in Animations -->
      <section id="built-in-animations">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Built-in Animations</h2>
        <p class="text-sm text-ousi-muted mb-4">
          Components ship with carefully tuned animations that activate automatically. No configuration needed.
        </p>

        <div class="overflow-x-auto rounded-ousi-xl border border-ousi-border">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-ousi-border bg-ousi-surface-secondary/50">
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Component</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Animation</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Duration</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Easing</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">ODialog</td>
                <td class="px-4 py-3 text-ousi-foreground">Scale + fade entrance with backdrop blur</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">200ms</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">Bounce</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">ODrawer</td>
                <td class="px-4 py-3 text-ousi-foreground">Slide in from edge with overlay fade</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">300ms</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">Expo out</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">OAccordion</td>
                <td class="px-4 py-3 text-ousi-foreground">Smooth height transition with bounce easing</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">250ms</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">Bounce</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">OTooltip</td>
                <td class="px-4 py-3 text-ousi-foreground">Scale + opacity with configurable delay</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">150ms</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">Smooth</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">OPopover</td>
                <td class="px-4 py-3 text-ousi-foreground">Scale + opacity from anchor point</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">150ms</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">Smooth</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">OTabs</td>
                <td class="px-4 py-3 text-ousi-foreground">Active indicator slide transition</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">200ms</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">Smooth</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">ODropdown</td>
                <td class="px-4 py-3 text-ousi-foreground">Scale from trigger with opacity</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">150ms</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">Bounce</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">OElasticSlider</td>
                <td class="px-4 py-3 text-ousi-foreground">Wave expansion effect on slide</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">400ms</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">Bounce</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <OSeparator />

      <!-- Easing Functions -->
      <section id="easing-functions">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Easing Functions</h2>
        <p class="text-sm text-ousi-muted mb-4">
          Ousi UI ships with three custom easing curves tuned for UI interactions. Each creates a distinct
          feel that matches the intent of the animation.
        </p>

        <div class="overflow-x-auto rounded-ousi-xl border border-ousi-border mb-4">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-ousi-border bg-ousi-surface-secondary/50">
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Name</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Value</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Character</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Used by</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">Bounce</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">cubic-bezier(0.34, 1.56, 0.64, 1)</td>
                <td class="px-4 py-3 text-ousi-foreground">Playful, spring-like overshoot</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">Dialog, Accordion, Dropdown</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">Smooth</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">cubic-bezier(0.32, 0.72, 0, 1)</td>
                <td class="px-4 py-3 text-ousi-foreground">Elegant, decelerating motion</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">Tooltip, Popover, Tabs</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">Expo out</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">cubic-bezier(0.16, 1, 0.3, 1)</td>
                <td class="px-4 py-3 text-ousi-foreground">Fast start, slow end</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">Drawer, sheet transitions</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
          <CodeBlock :code="`/* Use these easings in your own components */\n.my-element {\n  /* Bounce — playful overshoot */\n  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);\n\n  /* Smooth — elegant deceleration */\n  transition: opacity 150ms cubic-bezier(0.32, 0.72, 0, 1);\n\n  /* Expo out — fast start, gentle landing */\n  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);\n}`" show-copy />
        </div>
      </section>

      <OSeparator />

      <!-- AnimatedNumber -->
      <section id="animated-number">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">AnimatedNumber</h2>
        <p class="text-sm text-ousi-muted mb-4">
          The <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">OAnimatedNumber</code> component
          provides five distinct animation modes for transitioning between numeric values. Perfect for dashboards,
          counters, and data visualizations.
        </p>

        <div class="overflow-x-auto rounded-ousi-xl border border-ousi-border mb-4">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-ousi-border bg-ousi-surface-secondary/50">
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Mode</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Effect</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Best for</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">roll</td>
                <td class="px-4 py-3 text-ousi-foreground">Digits roll up/down like a slot machine</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">Counters, scoreboards</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">count</td>
                <td class="px-4 py-3 text-ousi-foreground">Increments through intermediate values</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">Statistics, totals</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">slide</td>
                <td class="px-4 py-3 text-ousi-foreground">Old value slides out, new slides in</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">Prices, timers</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">fade</td>
                <td class="px-4 py-3 text-ousi-foreground">Cross-fade between old and new values</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">Subtle updates, percentages</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">flip</td>
                <td class="px-4 py-3 text-ousi-foreground">3D flip card transition per digit</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">Clocks, countdown timers</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
          <CodeBlock :code="`<script setup>\nconst count = ref(1234)\n</script>\n\n<template>\n  <!-- Slot-machine roll effect -->\n  <OAnimatedNumber :value=&quot;count&quot; mode=&quot;roll&quot; />\n\n  <!-- Smooth counting with formatting -->\n  <OAnimatedNumber\n    :value=&quot;count&quot;\n    mode=&quot;count&quot;\n    :duration=&quot;800&quot;\n    :format=&quot;(n) => n.toLocaleString()&quot;\n  />\n\n  <!-- 3D flip with custom easing -->\n  <OAnimatedNumber :value=&quot;count&quot; mode=&quot;flip&quot; :duration=&quot;600&quot; />\n</template>`" show-copy />
        </div>
      </section>

      <OSeparator />

      <!-- Marquee -->
      <section id="marquee">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Marquee</h2>
        <p class="text-sm text-ousi-muted mb-4">
          The <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">OMarquee</code> component
          creates infinite scrolling content powered by the Web Animations API. It supports horizontal and vertical
          directions, customizable speed, and automatic pausing on hover.
        </p>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
          <CodeBlock :code="`<!-- Basic horizontal marquee -->\n<OMarquee :speed=&quot;40&quot; pauseOnHover>\n  <div class=&quot;flex gap-8&quot;>\n    <img src=&quot;/logo-1.svg&quot; class=&quot;h-8&quot; />\n    <img src=&quot;/logo-2.svg&quot; class=&quot;h-8&quot; />\n    <img src=&quot;/logo-3.svg&quot; class=&quot;h-8&quot; />\n  </div>\n</OMarquee>\n\n<!-- Vertical marquee with gradient fade -->\n<OMarquee direction=&quot;vertical&quot; :speed=&quot;30&quot; fade>\n  <div v-for=&quot;item in testimonials&quot; :key=&quot;item.id&quot;>\n    <OCard class=&quot;p-4 mb-4&quot;>{{ item.text }}</OCard>\n  </div>\n</OMarquee>\n\n<!-- Reverse direction -->\n<OMarquee :speed=&quot;50&quot; reverse>\n  <slot />\n</OMarquee>`" show-copy />
        </div>
      </section>

      <OSeparator />

      <!-- Typewriter -->
      <section id="typewriter">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Typewriter</h2>
        <p class="text-sm text-ousi-muted mb-4">
          The <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">OTypewriter</code> component
          creates a typing effect with configurable speed, cursor styling, and looping. Great for hero sections
          and onboarding flows.
        </p>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
          <CodeBlock :code="`<!-- Single string -->\n<OTypewriter text=&quot;Welcome to Ousi UI&quot; :speed=&quot;80&quot; />\n\n<!-- Loop through multiple strings -->\n<OTypewriter\n  :text=&quot;['Build fast.', 'Ship faster.', 'Sleep well.']&quot;\n  :speed=&quot;60&quot;\n  :deleteSpeed=&quot;40&quot;\n  :delay=&quot;2000&quot;\n  loop\n/>\n\n<!-- Custom cursor -->\n<OTypewriter\n  text=&quot;Type something amazing...&quot;\n  cursor=&quot;_&quot;\n  :speed=&quot;100&quot;\n  class=&quot;text-2xl font-bold text-ousi-accent&quot;\n/>`" show-copy />
        </div>
      </section>

      <OSeparator />

      <!-- Reducing Motion -->
      <section id="reducing-motion">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Reducing Motion</h2>
        <p class="text-sm text-ousi-foreground leading-relaxed mb-4">
          All Ousi UI animations respect the
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">prefers-reduced-motion</code>
          media query. When a user has enabled reduced motion in their OS settings, components automatically
          skip animations and apply instant state changes instead.
        </p>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden mb-4">
          <CodeBlock :code="`/* Ousi UI does this internally for all animated components */\n@media (prefers-reduced-motion: reduce) {\n  *,\n  *::before,\n  *::after {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n    scroll-behavior: auto !important;\n  }\n}\n\n/* You can also use Tailwind's motion-reduce variant */\n<OButton class=&quot;motion-reduce:transition-none&quot;>No Transition</OButton>`" show-copy />
        </div>

        <p class="text-sm text-ousi-muted leading-relaxed">
          You can also programmatically check the user's motion preference using the
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">useReducedMotion()</code> composable:
        </p>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden mt-4">
          <CodeBlock :code="`<script setup>\nimport { useReducedMotion } from '@ousi-ui/core'\n\nconst prefersReduced = useReducedMotion()\n</script>\n\n<template>\n  <div>\n    <OAnimatedNumber\n      :value=&quot;count&quot;\n      :mode=&quot;prefersReduced ? 'fade' : 'roll'&quot;\n      :duration=&quot;prefersReduced ? 0 : 600&quot;\n    />\n  </div>\n</template>`" show-copy />
        </div>
      </section>
    </div>
  </div>
</template>
