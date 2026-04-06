<script setup lang="ts">
import { OToastProvider, OTabs, OCommandPalette, OTooltip, OChip } from '@ousi-ui/vue'
import type { TabItem, CommandItem } from '@ousi-ui/vue'
import { useNavigation } from '~/composables/useNavigation'
import { useGitHubStars } from '~/composables/useGitHubStars'

const { sections } = useNavigation()
const { displayText: ghStars, isEarly: ghEarly } = useGitHubStars()
const route = useRoute()
const router = useRouter()

const mobileMenuOpen = ref(false)

// ── Theme toggle ──
const themeMode = ref('light')
const themeTabs: TabItem[] = [
  { key: 'light', label: '☀' },
  { key: 'dark', label: '☾' },
]

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

// Cmd/Ctrl+K is handled by OCommandPalette internally
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

    <!-- ══ TOP NAVBAR ══ -->
    <header class="sticky top-0 z-40 border-b border-ousi-border bg-ousi-background/95 backdrop-blur-md">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="flex h-14 items-center gap-3">
          <!-- Mobile menu button -->
          <button
            class="size-8 flex items-center justify-center rounded-ousi-lg text-ousi-muted hover:bg-ousi-default md:hidden"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg v-if="!mobileMenuOpen" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
            <svg v-else class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>

          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
            <img
              :src="themeMode === 'dark' ? '/logo-light.png' : '/logo-dark.png'"
              alt="Ousi UI"
              class="h-7 w-auto"
            />
            <span class="text-2xl font-extrabold tracking-tight text-ousi-foreground">Ousi</span>
            <span class="text-xs text-ousi-muted hidden sm:inline">v0.1.2</span>
          </NuxtLink>

          <div class="flex-1" />

          <!-- Nav links (hidden on mobile) -->
          <div class="hidden md:flex items-center gap-1">
            <NuxtLink
              to="/vue/getting-started/introduction"
              class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-ousi-muted hover:text-ousi-foreground transition-colors rounded-ousi-lg hover:bg-ousi-default/50"
            >
              <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              Docs
            </NuxtLink>
            <NuxtLink
              to="/vue/components/button"
              class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-ousi-muted hover:text-ousi-foreground transition-colors rounded-ousi-lg hover:bg-ousi-default/50"
            >
              <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Components
            </NuxtLink>
            <NuxtLink
              to="/playground"
              class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-ousi-muted hover:text-ousi-foreground transition-colors rounded-ousi-lg hover:bg-ousi-default/50"
            >
              <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              Playground
            </NuxtLink>
          </div>

          <!-- Search trigger -->
          <button
            class="hidden md:flex items-center gap-2 rounded-ousi-xl bg-ousi-default/50 border border-ousi-border px-3 py-1.5 text-sm text-ousi-muted cursor-pointer hover:bg-ousi-default/80 transition-colors"
            @click="searchOpen = true"
          >
            <svg class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <span>Search...</span>
            <div class="ml-auto flex items-center gap-0.5">
              <kbd class="inline-flex h-5 items-center rounded bg-ousi-default px-1.5 text-[10px] font-medium text-ousi-muted">⌘</kbd>
              <kbd class="inline-flex h-5 items-center rounded bg-ousi-default px-1.5 text-[10px] font-medium text-ousi-muted">K</kbd>
            </div>
          </button>

          <!-- Mobile search -->
          <button
            class="size-8 flex items-center justify-center rounded-ousi-lg text-ousi-muted hover:bg-ousi-default md:hidden"
            @click="searchOpen = true"
          >
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          </button>

          <!-- Right actions -->
          <div class="flex items-center gap-2 shrink-0">
            <!-- GitHub -->
            <a
              href="https://github.com/carlosaroca/ousi-ui"
              target="_blank"
              class="hidden sm:flex h-7 items-center gap-1.5 rounded-ousi-2xl border border-ousi-border pl-2 pr-3 text-ousi-muted hover:text-ousi-foreground hover:bg-ousi-default/50 transition-colors"
            >
              <svg class="size-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              <span class="text-[11px] font-medium leading-none">
                {{ ghEarly ? 'Rate us' : ghStars ? `${ghStars}` : 'GitHub' }}
              </span>
              <svg v-if="ghStars && !ghEarly" class="size-3 text-ousi-warning" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            </a>

            <!-- Theme toggle -->
            <div class="compact-tabs">
              <OTabs
                v-model="themeMode"
                :items="themeTabs"
              >
                <template #tab="{ item }">
                  <svg v-if="item.key === 'light'" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
                  <svg v-else class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
                </template>
              </OTabs>
            </div>
          </div>
        </div>
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
        class="absolute top-14 left-0 right-0 border-b border-ousi-border bg-ousi-background p-4"
        @click.stop
      >
        <nav class="flex flex-col gap-1">
          <NuxtLink
            to="/vue/getting-started/introduction"
            class="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-ousi-foreground rounded-ousi-lg hover:bg-ousi-default transition-colors"
            @click="mobileMenuOpen = false"
          >
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Docs
          </NuxtLink>
          <NuxtLink
            to="/vue/components/button"
            class="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-ousi-foreground rounded-ousi-lg hover:bg-ousi-default transition-colors"
            @click="mobileMenuOpen = false"
          >
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Components
          </NuxtLink>
          <NuxtLink
            to="/playground"
            class="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-ousi-foreground rounded-ousi-lg hover:bg-ousi-default transition-colors"
            @click="mobileMenuOpen = false"
          >
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            Playground
          </NuxtLink>
          <a
            href="https://github.com/carlosaroca/ousi-ui"
            target="_blank"
            class="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-ousi-foreground rounded-ousi-lg hover:bg-ousi-default transition-colors"
          >
            <svg class="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
        </nav>
      </div>
    </div>

    <!-- ══ MAIN CONTENT ══ -->
    <main>
      <slot />
    </main>

    <DocsFooter />
  </div>
</template>

<style scoped>
.compact-tabs :deep([role="tablist"]) {
  padding: 2px;
}
.compact-tabs :deep([role="tab"]) {
  height: 26px;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
