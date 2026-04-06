<script setup lang="ts">
const route = useRoute()
const slug = computed(() => {
  const s = route.params.slug
  return Array.isArray(s) ? s.join('/') : s || ''
})

const { data: page } = await useAsyncData(`content-${slug.value}`, () =>
  queryCollection('docs').path('/' + slug.value).first(),
)
</script>

<template>
  <div v-if="page" class="prose prose-sm max-w-none">
    <h1>{{ page.title }}</h1>
    <p v-if="page.description" class="text-ousi-muted">{{ page.description }}</p>
    <ContentRenderer :value="page" />
  </div>
  <div v-else class="py-12 text-center">
    <p class="text-ousi-muted">Page not found</p>
  </div>
</template>
