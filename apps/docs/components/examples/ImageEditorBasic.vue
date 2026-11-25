<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import { OButton, OFileUpload, OImageEditor } from '@ousi-ui/vue'

// A photo drawn here, so there is something to edit. Yours replaces it.
function samplePhoto(): Promise<File> {
  const canvas = document.createElement('canvas')
  canvas.width = 1600
  canvas.height = 1067
  const context = canvas.getContext('2d')!
  const sky = context.createLinearGradient(0, 0, 0, 1067)
  sky.addColorStop(0, '#1e3a8a')
  sky.addColorStop(1, '#fdba74')
  context.fillStyle = sky
  context.fillRect(0, 0, 1600, 1067)
  const hill = (color: string, points: number[]) => {
    context.fillStyle = color
    context.beginPath()
    context.moveTo(0, 1067)
    for (let i = 0; i < points.length; i += 2) context.lineTo(points[i], points[i + 1])
    context.lineTo(1600, 1067)
    context.fill()
  }
  context.fillStyle = '#fef08a'
  context.beginPath()
  context.arc(1150, 420, 110, 0, Math.PI * 2)
  context.fill()
  hill('#4338ca', [0, 760, 380, 470, 700, 740, 1040, 560, 1600, 820])
  hill('#1e1b4b', [0, 900, 520, 700, 900, 900, 1330, 740, 1600, 900])
  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(new File([blob!], 'hills.jpg', { type: 'image/jpeg' })), 'image/jpeg', 0.95),
  )
}

const source = shallowRef<File>()
const editor = ref<InstanceType<typeof OImageEditor>>()
const result = ref<{ url: string; name: string }>()

async function apply() {
  const file = await editor.value!.export()
  if (result.value) URL.revokeObjectURL(result.value.url)
  result.value = { url: URL.createObjectURL(file), name: `${file.name} · ${Math.round(file.size / 1024)} KB` }
}

onMounted(async () => (source.value = await samplePhoto()))
onBeforeUnmount(() => result.value && URL.revokeObjectURL(result.value.url))
</script>

<template>
  <div class="flex w-full max-w-xl flex-col gap-4">
    <OImageEditor ref="editor" :src="source" />
    <div class="flex flex-wrap items-center justify-between gap-2">
      <OFileUpload
        variant="button"
        size="sm"
        text="Use your own photo"
        accept="image/*"
        hide-file-list
        hide-hint
        class="!w-auto"
        @change="(files) => files[0] && (source = files[0])"
      />
      <OButton size="sm" @click="apply">Export</OButton>
    </div>
    <figure v-if="result" class="flex flex-col items-center gap-1">
      <img :src="result.url" alt="Exported image" class="max-h-56 max-w-full rounded-ousi-lg" />
      <figcaption class="text-xs text-ousi-muted">{{ result.name }}</figcaption>
    </figure>
  </div>
</template>
