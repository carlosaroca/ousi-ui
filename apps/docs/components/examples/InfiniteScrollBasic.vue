<script setup lang="ts">
import { ref } from 'vue'

const items = ref<number[]>(Array.from({ length: 20 }, (_, i) => i + 1))
const loading = ref(false)

function loadMore() {
  loading.value = true
  setTimeout(() => {
    const start = items.value.length + 1
    for (let i = 0; i < 10; i++) {
      items.value.push(start + i)
    }
    loading.value = false
  }, 1000)
}
</script>
<template>
  <div class="border rounded" style="height: 300px; overflow: auto;">
    <OInfiniteScroll :loading="loading" @load-more="loadMore">
      <div
        v-for="item in items"
        :key="item"
        class="p-3 border-b text-sm"
      >
        Item {{ item }}
      </div>
      <template #loader>
        <div class="p-4 text-center text-sm text-gray-400">
          Loading more...
        </div>
      </template>
    </OInfiniteScroll>
  </div>
</template>
