<script setup lang="ts">
import { computed, watch, inject, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const slug = computed(() => (route.params.slug as string[])?.join('/') || 'introduction')

const updateHeadings = inject<(headings: { id: string; text: string; depth: number }[]) => void>('updateHeadings')

const { data: page } = await useAsyncData(`docs-${slug.value}`, () =>
  queryContent('/docs', slug.value).findOne()
)

function extractHeadings() {
  nextTick(() => {
    const headings: { id: string; text: string; depth: number }[] = []
    document.querySelectorAll('.prose h2, .prose h3').forEach(el => {
      headings.push({
        id: el.id,
        text: el.textContent?.trim() ?? '',
        depth: el.tagName === 'H3' ? 3 : 2,
      })
    })
    updateHeadings?.(headings)
  })
}

onMounted(extractHeadings)
watch(() => route.path, extractHeadings)
</script>

<template>
  <div v-if="page">
    <h1 class="text-3xl font-bold text-ousi-foreground mb-2">{{ page.title }}</h1>
    <p v-if="page.description" class="text-ousi-muted text-lg mb-8">{{ page.description }}</p>
    <ContentRenderer :value="page" class="max-w-none" />
  </div>
  <div v-else class="text-ousi-muted">
    Page not found.
  </div>
</template>

<style>
.prose code::before,
.prose code::after {
  content: none;
}

.prose code {
  background-color: var(--ousi-surface-secondary);
  padding: 0.125rem 0.375rem;
  border-radius: var(--ousi-radius-sm);
  font-size: 0.875em;
}

.prose pre code {
  background-color: transparent;
  padding: 0;
}

.prose pre {
  border: 1px solid var(--ousi-border);
  border-radius: var(--ousi-radius-md);
}
</style>
