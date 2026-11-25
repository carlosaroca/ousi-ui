<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { OFileUpload, OLightbox } from '@ousi-ui/vue'

const files = ref<File[]>([])
const open = ref(false)
const index = ref(0)

// An address for each file chosen, made once and given back when the page goes.
const addresses = new Map<File, string>()
function addressOf(file: File) {
  if (!addresses.has(file)) addresses.set(file, URL.createObjectURL(file))
  return addresses.get(file)!
}
onBeforeUnmount(() => addresses.forEach((address) => URL.revokeObjectURL(address)))

const chosen = computed(() => files.value.filter((file) => file.type.startsWith('image/')))
const images = computed(() =>
  chosen.value.map((file) => ({ src: addressOf(file), alt: file.name, caption: file.name, downloadName: file.name })),
)

// OFileUpload emits `open` when the name of a file is clicked.
function view(file: unknown) {
  const position = chosen.value.indexOf(file as File)
  if (position < 0) return
  index.value = position
  open.value = true
}
</script>
<template>
  <div class="w-full max-w-md">
    <OFileUpload v-model="files" multiple accept="image/*" label="Photos" hint="Add some, then click a name to view it" @open="view" />
    <OLightbox v-model="open" v-model:index="index" :images="images" />
  </div>
</template>
