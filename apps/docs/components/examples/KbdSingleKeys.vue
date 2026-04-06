<script setup lang="ts">
import { OKbd } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-wrap gap-3">
    <OKbd keys="command" />
    <OKbd keys="shift" />
    <OKbd keys="option" />
    <OKbd keys="ctrl" />
    <OKbd keys="enter" />
    <OKbd keys="escape" />
  </div>
</template>
