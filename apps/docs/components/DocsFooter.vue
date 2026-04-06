<template>
  <footer class="border-t border-ousi-border mt-16">
    <div class="mx-auto max-w-[1400px] px-4 sm:px-6 py-12 sm:py-16">

      <!-- Top section -->
      <div class="flex flex-col sm:flex-row items-start gap-10 sm:gap-16">

        <!-- Brand -->
        <div class="flex flex-col gap-4 max-w-xs">
          <div class="flex items-center gap-3">
            <img src="/logo-gradient.png" alt="Ousi UI" class="h-10 w-auto" />
            <span class="text-xl font-extrabold tracking-tight text-ousi-foreground">Ousi UI</span>
          </div>
          <p class="text-sm text-ousi-muted leading-relaxed">
            A beautiful, accessible component library for Vue and Flutter. 74+ components with dark mode, OKLCH colors, and full TypeScript support.
          </p>
          <div class="flex items-center gap-3 mt-1">
            <!-- GitHub -->
            <a href="https://github.com/carlosaroca/ousi-ui" target="_blank" class="text-ousi-muted hover:text-ousi-foreground transition-colors">
              <svg class="size-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <!-- X / Twitter -->
            <a href="https://x.com/CarlosArocaC" target="_blank" class="text-ousi-muted hover:text-ousi-foreground transition-colors">
              <svg class="size-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>

        <!-- Links grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 flex-1">

          <!-- Getting Started -->
          <div class="flex flex-col gap-3">
            <p class="text-xs font-semibold text-ousi-foreground uppercase tracking-wider">Getting Started</p>
            <NuxtLink to="/vue/getting-started/introduction" class="text-sm text-ousi-muted hover:text-ousi-foreground transition-colors">Introduction</NuxtLink>
            <NuxtLink to="/vue/getting-started/installation" class="text-sm text-ousi-muted hover:text-ousi-foreground transition-colors">Installation</NuxtLink>
            <NuxtLink to="/vue/getting-started/theming" class="text-sm text-ousi-muted hover:text-ousi-foreground transition-colors">Theming</NuxtLink>
            <NuxtLink to="/playground" class="text-sm text-ousi-muted hover:text-ousi-foreground transition-colors">Playground</NuxtLink>
          </div>

          <!-- Components -->
          <div class="flex flex-col gap-3">
            <p class="text-xs font-semibold text-ousi-foreground uppercase tracking-wider">Components</p>
            <NuxtLink to="/vue/components/button" class="text-sm text-ousi-muted hover:text-ousi-foreground transition-colors">Button</NuxtLink>
            <NuxtLink to="/vue/components/input" class="text-sm text-ousi-muted hover:text-ousi-foreground transition-colors">Input</NuxtLink>
            <NuxtLink to="/vue/components/chart" class="text-sm text-ousi-muted hover:text-ousi-foreground transition-colors">Chart</NuxtLink>
            <NuxtLink to="/vue/components/dialog" class="text-sm text-ousi-muted hover:text-ousi-foreground transition-colors">Dialog</NuxtLink>
          </div>

          <!-- Community -->
          <div class="flex flex-col gap-3">
            <p class="text-xs font-semibold text-ousi-foreground uppercase tracking-wider">Community</p>
            <a href="https://github.com/carlosaroca/ousi-ui" target="_blank" class="text-sm text-ousi-muted hover:text-ousi-foreground transition-colors">GitHub</a>
            <a href="https://x.com/CarlosArocaC" target="_blank" class="text-sm text-ousi-muted hover:text-ousi-foreground transition-colors">Twitter / X</a>
            <a href="https://carlosaroca.com" target="_blank" class="text-sm text-ousi-muted hover:text-ousi-foreground transition-colors">Author</a>
          </div>

        </div>
      </div>

      <!-- Bottom bar -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-ousi-border">
        <p class="text-xs text-ousi-muted">
          &copy; {{ new Date().getFullYear() }} Ousi UI. Built by
          <a href="https://carlosaroca.com" target="_blank" class="text-ousi-foreground hover:underline">Carlos Aroca</a>.
        </p>
        <p class="text-xs text-ousi-muted">
          Released under the MIT License.
        </p>
      </div>

    </div>
  </footer>
</template>
