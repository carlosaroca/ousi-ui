<script setup lang="ts">
import { ref } from 'vue'
import { ODrawer, OButton } from '@ousi-ui/vue'
const open = ref(false)
const name = ref('')
</script>
<template>
  <OButton @click="open = true">Edit Profile</OButton>
  <ODrawer v-model="open" title="Edit Profile" description="Update your account details.">
    <form class="flex flex-col gap-4 p-4" @submit.prevent="open = false">
      <label class="text-sm font-medium">
        Name
        <input v-model="name" class="mt-1 w-full rounded border px-3 py-2 text-sm" />
      </label>
      <OButton type="submit">Save</OButton>
    </form>
  </ODrawer>
</template>
