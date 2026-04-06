<script setup lang="ts">
const props = defineProps<{
  id: string
  title: string
}>()

const copied = ref(false)

function copyLink() {
  const url = `${window.location.origin}${window.location.pathname}#${props.id}`
  navigator.clipboard.writeText(url)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <h2
    :id="id"
    class="group flex items-center gap-2 text-lg font-semibold text-ousi-foreground mb-3 scroll-mt-28"
  >
    <a :href="`#${id}`" class="hover:underline underline-offset-4 decoration-ousi-border">
      {{ title }}
    </a>
    <button
      class="opacity-0 group-hover:opacity-100 transition-opacity size-6 flex items-center justify-center rounded-ousi-md text-ousi-muted hover:text-ousi-foreground hover:bg-ousi-default"
      @click.prevent="copyLink"
    >
      <svg v-if="!copied" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      </svg>
      <svg v-else class="size-3.5 text-ousi-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </button>
  </h2>
</template>
