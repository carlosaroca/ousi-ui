<script setup lang="ts">
import { useNavigation } from '~/composables/useNavigation'
import { useGitHubStars } from '~/composables/useGitHubStars'
import { OToastProvider, OTabs, OCommandPalette, OTooltip, OChip } from '@ousi-ui/vue'
import type { TabItem, CommandItem } from '@ousi-ui/vue'

const { sections, isFlutter } = useNavigation()
const { displayText: ghStars, isEarly: ghEarly } = useGitHubStars()
const route = useRoute()
const router = useRouter()
const sidebarOpen = ref(false)

// ── Theme toggle ──
const themeMode = ref('light')
const themeTabs: TabItem[] = [
  { key: 'light', label: '☀' },
  { key: 'dark', label: '☾' },
]


// ── Platform switch ──
const currentPlatform = computed(() => route.path.startsWith('/flutter') ? 'flutter' : 'vue')

function onPlatformChange(p: string) {
  if (p === 'flutter') router.push('/flutter')
  else router.push('/vue/getting-started/introduction')
}

const platformTabs: TabItem[] = [
  { key: 'vue', label: 'Vue.js' },
  { key: 'flutter', label: 'Flutter' },
]

// ── Main nav tabs ──
const mainTabs = computed(() => {
  if (isFlutter.value) {
    return [
      { label: 'Getting Started', path: '/flutter/getting-started', defaultTo: '/flutter' },
      { label: 'Widgets', path: '/flutter/widgets', defaultTo: '/flutter' },
    ]
  }
  return [
    { label: 'Getting Started', path: '/vue/getting-started', defaultTo: '/vue/getting-started/introduction' },
    { label: 'Components', path: '/vue/components', defaultTo: '/vue/components/button' },
  ]
})

const isTabActive = (path: string) => route.path.startsWith(path)

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
      <div class="mx-auto max-w-[1400px] px-4 sm:px-6">
        <!-- Row 1 -->
        <div class="flex h-14 items-center gap-3">
          <!-- Mobile menu -->
          <button
            class="size-8 flex items-center justify-center rounded-ousi-lg text-ousi-muted hover:bg-ousi-default lg:hidden"
            @click="sidebarOpen = !sidebarOpen"
          >
            <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
          </button>

          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
            <img
              :src="themeMode === 'dark' ? '/logo-light.png' : '/logo-dark.png'"
              alt="Ousi UI"
              class="h-7 w-auto"
            />
            <span class="text-2xl font-extrabold tracking-tight text-ousi-foreground">Ousi</span>
            <span class="text-xs text-ousi-muted hidden sm:inline">v0.1.0</span>
          </NuxtLink>

          <!-- Search trigger -->
          <div class="hidden md:flex flex-1 max-w-md mx-auto">
            <button
              class="flex w-full items-center gap-2 rounded-ousi-xl bg-ousi-default/50 border border-ousi-border px-3 py-1.5 text-sm text-ousi-muted cursor-pointer hover:bg-ousi-default/80 transition-colors"
              @click="searchOpen = true"
            >
              <svg class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              <span>Search...</span>
              <div class="ml-auto flex items-center gap-0.5">
                <kbd class="inline-flex h-5 items-center rounded bg-ousi-default px-1.5 text-[10px] font-medium text-ousi-muted">⌘</kbd>
                <kbd class="inline-flex h-5 items-center rounded bg-ousi-default px-1.5 text-[10px] font-medium text-ousi-muted">K</kbd>
              </div>
            </button>
          </div>

          <!-- Mobile search -->
          <button
            class="size-8 flex items-center justify-center rounded-ousi-lg text-ousi-muted hover:bg-ousi-default md:hidden"
            @click="searchOpen = true"
          >
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          </button>

          <div class="flex-1 md:hidden" />

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
            <div class="hidden sm:block">
              <OTabs
                v-model="themeMode"
                :items="themeTabs"
                size="sm"
              >
                <template #tab="{ item }">
                  <svg v-if="item.key === 'light'" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
                  <svg v-else class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
                </template>
              </OTabs>
            </div>

            <!-- Platform switch -->
            <div class="hidden md:block">
              <OTabs
                :model-value="currentPlatform"
                :items="platformTabs"
                size="sm"
                @update:model-value="onPlatformChange"
              >
                <template #tab="{ item }">
                  <span class="flex items-center gap-1.5">
                    <svg v-if="item.key === 'vue'" class="size-3.5" viewBox="0 0 261.76 226.69"><g transform="matrix(1.3333 0 0 -1.3333 -76.311 313.34)"><path fill="currentColor" d="M178.518 235.006l-36.679-63.514-36.679 63.514h-21.397l58.076-100.58 58.076 100.58z"/></g></svg>
                    <svg v-else class="size-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M14.314 0L2.3 12 6 15.7 21.684 0h-7.37zm.014 11.072L7.857 17.53l6.47 6.47H21.7l-6.46-6.468 6.46-6.46h-7.37z"/></svg>
                    {{ item.label }}
                  </span>
                </template>
              </OTabs>
            </div>
          </div>
        </div>

        <!-- Row 2: Section tabs -->
        <div class="flex items-center gap-1 -mb-px">
          <NuxtLink
            v-for="tab in mainTabs"
            :key="tab.path"
            :to="tab.defaultTo"
            :class="[
              'flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors',
              isTabActive(tab.path)
                ? 'border-ousi-foreground text-ousi-foreground'
                : 'border-transparent text-ousi-muted hover:text-ousi-foreground',
            ]"
          >
            <span class="flex items-center gap-1.5">
              <!-- Docs icon -->
              <svg v-if="tab.label === 'Getting Started'" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              <!-- Components icon -->
              <svg v-else-if="tab.label === 'Components'" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <!-- Widgets icon (Flutter) -->
              <svg v-else-if="tab.label === 'Widgets'" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              {{ tab.label }}
            </span>
          </NuxtLink>
          <NuxtLink
            to="/playground"
            class="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 border-transparent text-ousi-muted hover:text-ousi-foreground transition-colors"
          >
            <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            Playground
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- ══ BODY ══ -->
    <div class="mx-auto max-w-[1400px] flex px-4 sm:px-6">

      <!-- Left Sidebar -->
      <aside
        :class="[
          'fixed inset-y-0 left-0 z-30 w-[240px] border-r border-ousi-border bg-ousi-background transition-transform duration-200',
          'lg:sticky lg:top-[6.5rem] lg:h-[calc(100dvh-6.5rem)] lg:translate-x-0 lg:border-r-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ]"
      >
        <nav class="h-full overflow-y-auto pb-8 px-3 pt-2">
          <ClientOnly>
            <TimelineSidebar
              :sections="sections"
              @navigate="(path: string) => { router.push(path); sidebarOpen = false }"
            />
          </ClientOnly>
        </nav>
      </aside>

      <div v-if="sidebarOpen" class="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm lg:hidden" @click="sidebarOpen = false" />

      <!-- Main content -->
      <main class="flex-1 min-w-0 px-4 py-8 lg:px-8 lg:py-10 max-w-3xl">
        <slot />
      </main>

      <!-- Right sidebar: TOC -->
      <aside class="hidden xl:block w-[200px] shrink-0 pt-10">
        <div class="sticky top-[7.5rem]">
          <p class="flex items-center gap-1.5 text-xs font-semibold text-ousi-muted mb-3">
            <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h7" /></svg>
            On this page
          </p>
          <div id="docs-toc" class="flex flex-col text-[13px]">
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

