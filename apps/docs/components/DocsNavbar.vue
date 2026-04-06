<script setup lang="ts">
import { ref } from 'vue'
import { Moon, Sun, Github, Search } from 'lucide-vue-next'

const isDark = ref(true)

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.setAttribute(
    'data-theme',
    isDark.value ? 'dark' : 'light'
  )
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 h-16 border-b border-ousi-border bg-ousi-surface flex items-center px-6 gap-6">
    <!-- Logo -->
    <div class="flex items-center gap-2">
      <span class="font-bold text-ousi-foreground text-lg">Ousi UI</span>
      <span class="text-xs text-ousi-muted bg-ousi-surface-secondary px-1.5 py-0.5 rounded-ousi-sm">v0.1.0</span>
    </div>

    <!-- Nav links -->
    <nav class="flex items-center gap-6">
      <NuxtLink to="/docs/introduction" class="text-sm text-ousi-muted hover:text-ousi-foreground transition-colors">
        Getting Started
      </NuxtLink>
      <NuxtLink to="/docs/components/button" class="text-sm text-ousi-muted hover:text-ousi-foreground transition-colors">
        Components
      </NuxtLink>
    </nav>

    <div class="flex-1" />

    <!-- Search -->
    <button class="flex items-center gap-2 px-3 py-1.5 rounded-ousi-md bg-ousi-surface-secondary text-ousi-muted text-sm hover:text-ousi-foreground transition-colors border border-ousi-border">
      <Search class="w-3.5 h-3.5" />
      <span>Search</span>
      <kbd class="ml-2 text-xs bg-ousi-surface px-1 rounded">⌘K</kbd>
    </button>

    <!-- GitHub -->
    <a href="https://github.com/tu-usuario/ousi-ui" target="_blank" class="text-ousi-muted hover:text-ousi-foreground transition-colors">
      <Github class="w-5 h-5" />
    </a>

    <!-- Theme toggle -->
    <button @click="toggleTheme" class="text-ousi-muted hover:text-ousi-foreground transition-colors">
      <Sun v-if="isDark" class="w-5 h-5" />
      <Moon v-else class="w-5 h-5" />
    </button>
  </header>
</template>
