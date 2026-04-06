<script setup lang="ts">
import { ref } from 'vue'
import { ODrawer, OButton } from '@ousi-ui/vue'
const open = ref(false)
const placement = ref<'left' | 'right' | 'top' | 'bottom'>('right')
function show(p: 'left' | 'right' | 'top' | 'bottom') { placement.value = p; open.value = true }
</script>
<template>
  <div class="flex gap-3">
    <OButton variant="outline" @click="show('left')">Left</OButton>
    <OButton variant="outline" @click="show('right')">Right</OButton>
    <OButton variant="outline" @click="show('top')">Top</OButton>
    <OButton variant="outline" @click="show('bottom')">Bottom</OButton>
  </div>
  <ODrawer v-model="open" :placement="placement" :title="`${placement} Drawer`">
    <p>This drawer slides in from the {{ placement }}.</p>
  </ODrawer>
</template>
