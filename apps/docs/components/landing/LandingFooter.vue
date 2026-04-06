<script setup lang="ts">
import { OSeparator } from '@ousi-ui/vue'

const resources = [
  { label: 'Getting Started', href: '/vue/getting-started/introduction' },
  { label: 'Components', href: '/vue/components/button' },
  { label: 'Theming', href: '/vue/getting-started/theming' },
  { label: 'Colors', href: '/vue/getting-started/colors' },
]

const community = [
  { label: 'GitHub', href: 'https://github.com', external: true },
  { label: 'Discord', href: '#', external: true },
]
</script>

<template>
  <footer class="py-12">
    <div class="mx-auto max-w-5xl px-4 sm:px-6">
      <OSeparator class="mb-10" />

      <div class="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10">
        <!-- Resources -->
        <div>
          <h3 class="text-sm font-semibold text-ousi-foreground mb-3">Resources</h3>
          <ul class="space-y-2">
            <li v-for="link in resources" :key="link.label">
              <NuxtLink :to="link.href" class="text-sm text-ousi-muted hover:text-ousi-foreground transition-colors">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Community -->
        <div>
          <h3 class="text-sm font-semibold text-ousi-foreground mb-3">Community</h3>
          <ul class="space-y-2">
            <li v-for="link in community" :key="link.label">
              <a
                :href="link.href"
                :target="link.external ? '_blank' : undefined"
                :rel="link.external ? 'noopener noreferrer' : undefined"
                class="text-sm text-ousi-muted hover:text-ousi-foreground transition-colors"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- About -->
        <div>
          <h3 class="text-sm font-semibold text-ousi-foreground mb-3">About</h3>
          <p class="text-sm text-ousi-muted leading-relaxed">
            Ousi UI is an open-source Vue 3 component library focused on beautiful design, accessibility, and great developer experience.
          </p>
        </div>
      </div>

      <OSeparator class="mb-6" />

      <div class="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ousi-muted">
        <p>Built with Ousi UI</p>
        <p>&copy; {{ new Date().getFullYear() }} Ousi UI. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
