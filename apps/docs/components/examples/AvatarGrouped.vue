<script setup lang="ts">
import { OAvatar, OTooltip } from '@ousi-ui/vue'

const users = [
  { name: 'Carlos Roca', src: 'https://i.pravatar.cc/150?u=1' },
  { name: 'Ana Torres', src: 'https://i.pravatar.cc/150?u=2' },
  { name: 'Bob Martinez', src: 'https://i.pravatar.cc/150?u=3' },
  { name: 'Eva Chen', src: 'https://i.pravatar.cc/150?u=4' },
]
</script>
<template>
  <div class="flex -space-x-2.5">
    <OTooltip v-for="user in users" :key="user.name" :content="user.name" :delay="0">
      <OAvatar
        :src="user.src"
        :name="user.name"
        size="md"
        class="ring-[1.5px] ring-ousi-background transition-transform duration-200 ease-out hover:-translate-y-1.5 cursor-pointer relative"
      />
    </OTooltip>
    <OTooltip content="3 more" :delay="0">
      <OAvatar
        name="+3"
        size="md"
        class="ring-[1.5px] ring-ousi-background transition-transform duration-200 ease-out hover:-translate-y-1.5 cursor-pointer relative"
      />
    </OTooltip>
  </div>
</template>
