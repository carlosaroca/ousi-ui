<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  headings: { id: string; text: string; depth: number }[]
}>()

const activeId = ref('')

let observer: IntersectionObserver | null = null

function setupObserver() {
  observer?.disconnect()
  observer = new IntersectionObserver(
    entries => {
      const visible = entries.find(e => e.isIntersecting)
      if (visible) activeId.value = visible.target.id
    },
    { rootMargin: '-64px 0px -60% 0px', threshold: 0 }
  )
  props.headings.forEach(h => {
    const el = document.getElementById(h.id)
    if (el) observer!.observe(el)
  })
}

onMounted(setupObserver)
watch(() => props.headings, setupObserver)
onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div class="space-y-1">
    <p class="text-xs font-semibold text-ousi-muted uppercase tracking-wider mb-4">
      On this page
    </p>
    <a
      v-for="heading in headings"
      :key="heading.id"
      :href="`#${heading.id}`"
      class="block text-sm py-0.5 transition-colors duration-150"
      :class="[
        heading.depth === 3 ? 'pl-3' : '',
        activeId === heading.id
          ? 'text-ousi-accent'
          : 'text-ousi-muted hover:text-ousi-foreground'
      ]"
    >
      {{ heading.text }}
    </a>
  </div>
</template>
