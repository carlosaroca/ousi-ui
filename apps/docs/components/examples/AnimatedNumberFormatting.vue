<script setup lang="ts">
import { ref } from 'vue'

const price = ref(1299.99)

function changePrice() {
  price.value = Math.floor(Math.random() * 5000 * 100) / 100
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <OAnimatedNumber
      :value="price"
      animation="count"
      :format-options="{ style: 'currency', currency: 'USD' }"
      prefix="Total: "
      class="text-2xl font-semibold text-ousi-foreground"
    />
    <OButton size="sm" @click="changePrice">Change Price</OButton>
  </div>
</template>
