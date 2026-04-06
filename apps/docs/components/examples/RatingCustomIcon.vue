<script setup lang="ts">
import { ref } from 'vue'
import { ORating } from '@ousi-ui/vue'
const hearts = ref(3)
const flames = ref(4)
</script>
<template>
  <div class="flex flex-col gap-6">
    <div>
      <p class="text-xs text-ousi-muted mb-2">Hearts</p>
      <ORating v-model="hearts" color="danger" size="lg">
        <template #icon="{ fill, active }">
          <svg viewBox="0 0 24 24" class="size-full" :fill="active ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </template>
      </ORating>
    </div>
    <div>
      <p class="text-xs text-ousi-muted mb-2">Flames</p>
      <ORating v-model="flames" color="warning" size="lg">
        <template #icon="{ active }">
          <svg viewBox="0 0 24 24" class="size-full" :fill="active ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5">
            <path d="M12 12c2-2.96 0-7-1-8 0 3.04-4 6.5-4 8 0 2.21 2.24 4 5 4s5-1.79 5-4c0-2-2-4-3-5-.5 2.5-2 3-2 5z" />
          </svg>
        </template>
      </ORating>
    </div>
  </div>
</template>
