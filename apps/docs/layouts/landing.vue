<script setup lang="ts">
import { OToastProvider, OCommandPalette } from '@ousi-ui/vue'
import type { CommandItem } from '@ousi-ui/vue'
import { useNavigation } from '~/composables/useNavigation'
import { useGitHubStars } from '~/composables/useGitHubStars'

const { sections } = useNavigation()
const { displayText: ghStars, isEarly: ghEarly } = useGitHubStars()
const router = useRouter()

const mobileMenuOpen = ref(false)

// ── Theme toggle ──
const themeMode = ref('light')
function toggleTheme() {
  themeMode.value = themeMode.value === 'light' ? 'dark' : 'light'
}

// ── Command Palette / Search ──
const searchOpen = ref(false)

const searchItems = computed<CommandItem[]>(() => {
  const items: CommandItem[] = []
  for (const section of sections.value) {
    for (const item of section.items) {
      items.push({
        key: item.path,
        label: item.title,
        group: section.title,
        shortcut: item.badge || undefined,
      })
    }
  }
  return items
})

function onSearchSelect(key: string) {
  router.push(key)
  searchOpen.value = false
}
</script>

<template>
  <div class="min-h-dvh bg-ousi-background" :data-theme="themeMode" :class="{ dark: themeMode === 'dark' }">
    <!-- Toast provider -->
    <ClientOnly>
      <OToastProvider />
    </ClientOnly>

    <!-- Command Palette -->
    <ClientOnly>
      <OCommandPalette
        v-model="searchOpen"
        :items="searchItems"
        placeholder="Search components, pages..."
        empty-text="No results found"
        @select="onSearchSelect"
      />
    </ClientOnly>

    <!-- ══ FLOATING PILL NAVBAR ══ -->
    <header class="fixed top-4 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <div class="pointer-events-auto flex h-12 items-center gap-1.5 rounded-full border border-ousi-border/50 bg-ousi-surface/70 backdrop-blur-xl px-2.5 shadow-ousi-lg max-w-full">

        <!-- Mobile menu -->
        <button
          class="size-9 flex items-center justify-center rounded-full text-ousi-muted hover:bg-ousi-default/60 transition md:hidden"
          @click="mobileMenuOpen = !mobileMenuOpen"
          aria-label="Menu"
        >
          <svg v-if="!mobileMenuOpen" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
          <svg v-else class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 px-4 shrink-0">
          <img
            :src="themeMode === 'dark' ? '/logo-light.png' : '/logo-dark.png'"
            alt="Ousi UI"
            class="h-6 w-auto"
          />
          <span class="text-lg font-extrabold tracking-tight text-ousi-foreground">Ousi</span>
        </NuxtLink>

        <!-- Divider -->
        <div class="hidden md:block h-6 w-px bg-ousi-border/60 mx-2" />

        <!-- Nav links (desktop only) -->
        <nav class="hidden md:flex items-center gap-1">
          <NuxtLink
            to="/vue/getting-started/introduction"
            class="flex items-center gap-2 h-9 px-4 rounded-full text-sm font-medium text-ousi-muted hover:text-ousi-foreground hover:bg-ousi-default/60 transition"
          >
            <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Docs
          </NuxtLink>
          <NuxtLink
            to="/vue/components/button"
            class="flex items-center gap-2 h-9 px-4 rounded-full text-sm font-medium text-ousi-muted hover:text-ousi-foreground hover:bg-ousi-default/60 transition"
          >
            <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Components
          </NuxtLink>
          <NuxtLink
            to="/playground"
            class="flex items-center gap-2 h-9 px-4 rounded-full text-sm font-medium text-ousi-muted hover:text-ousi-foreground hover:bg-ousi-default/60 transition"
          >
            <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            Playground
          </NuxtLink>
        </nav>

        <!-- Divider -->
        <div class="hidden md:block h-6 w-px bg-ousi-border/60 mx-2" />

        <!-- Search trigger (desktop) -->
        <button
          class="hidden md:flex items-center gap-2.5 h-9 rounded-full bg-ousi-default/40 pl-4 pr-2 text-sm text-ousi-muted hover:bg-ousi-default/60 transition"
          @click="searchOpen = true"
        >
          <svg class="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          <span>Search</span>
          <kbd class="inline-flex h-5 items-center gap-0.5 rounded-md bg-ousi-surface/80 px-1.5 text-[10px] font-medium text-ousi-muted">⌘K</kbd>
        </button>

        <!-- Mobile search -->
        <button
          class="size-9 flex items-center justify-center rounded-full text-ousi-muted hover:bg-ousi-default/60 transition md:hidden"
          @click="searchOpen = true"
          aria-label="Search"
        >
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
        </button>

        <!-- GitHub stars -->
        <a
          href="https://github.com/carlosaroca/ousi-ui"
          target="_blank"
          class="hidden sm:flex items-center gap-2 h-9 rounded-full px-4 text-ousi-muted hover:text-ousi-foreground hover:bg-ousi-default/60 transition"
        >
          <svg class="size-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          <span class="text-[11px] font-medium leading-none">
            {{ ghEarly ? 'Rate us' : ghStars ? `${ghStars}` : 'GitHub' }}
          </span>
          <svg v-if="ghStars && !ghEarly" class="size-3 text-ousi-warning shrink-0" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
        </a>

        <!-- Theme toggle (single icon button) -->
        <button
          class="size-9 flex items-center justify-center rounded-full text-ousi-muted hover:bg-ousi-default/60 hover:text-ousi-foreground transition"
          :aria-label="themeMode === 'light' ? 'Switch to dark' : 'Switch to light'"
          @click="toggleTheme"
        >
          <svg v-if="themeMode === 'light'" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
          <svg v-else class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
        </button>
      </div>
    </header>

    <!-- Mobile menu dropdown -->
    <div
      v-if="mobileMenuOpen"
      class="fixed inset-0 z-30 md:hidden"
      @click="mobileMenuOpen = false"
    >
      <div class="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div
        class="absolute top-20 left-4 right-4 rounded-ousi-3xl border border-ousi-border bg-ousi-surface/90 backdrop-blur-xl p-2 shadow-ousi-xl"
        @click.stop
      >
        <nav class="flex flex-col gap-0.5">
          <NuxtLink
            to="/vue/getting-started/introduction"
            class="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-ousi-foreground rounded-ousi-2xl hover:bg-ousi-default transition-colors"
            @click="mobileMenuOpen = false"
          >
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Docs
          </NuxtLink>
          <NuxtLink
            to="/vue/components/button"
            class="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-ousi-foreground rounded-ousi-2xl hover:bg-ousi-default transition-colors"
            @click="mobileMenuOpen = false"
          >
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Components
          </NuxtLink>
          <NuxtLink
            to="/playground"
            class="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-ousi-foreground rounded-ousi-2xl hover:bg-ousi-default transition-colors"
            @click="mobileMenuOpen = false"
          >
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            Playground
          </NuxtLink>
          <a
            href="https://github.com/carlosaroca/ousi-ui"
            target="_blank"
            class="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-ousi-foreground rounded-ousi-2xl hover:bg-ousi-default transition-colors"
          >
            <svg class="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
        </nav>
      </div>
    </div>

    <!-- ══ MAIN CONTENT ══ -->
    <main class="pt-20">
      <slot />
    </main>

    <DocsFooter />
  </div>
</template>
