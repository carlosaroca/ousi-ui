<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useOusiMessages } from '../../config'
import { OButton } from '../button'
import { ODialog, ODialogBody, ODialogFooter, ODialogHeader } from '../dialog'

// Both versions in the same place, one at a time: switching back and forth is what shows a loss.
// It works for any change, a crop included. "Actual size" draws both as wide as the original, to
// check that small text can still be read.
const props = defineProps<{
  open: boolean
  title: string
  original: File
  result: File
  originalSize: string
  resultSize: string
  canKeepOriginal: boolean
  disabled: boolean
}>()
const emit = defineEmits<{ close: []; accept: []; keepOriginal: [] }>()

const ousiText = useOusiMessages()

const showing = ref<'result' | 'original'>('result')
const zoomed = ref(false)
const originalWidth = ref(0)
const urls = ref<{ original: string; result: string }>()

function release() {
  if (!urls.value) return
  URL.revokeObjectURL(urls.value.original)
  URL.revokeObjectURL(urls.value.result)
  urls.value = undefined
}
watch(
  () => [props.original, props.result],
  () => {
    release()
    showing.value = 'result'
    zoomed.value = false
    originalWidth.value = 0
    urls.value = {
      original: URL.createObjectURL(props.original),
      result: URL.createObjectURL(props.result),
    }
  },
  { immediate: true },
)
onBeforeUnmount(release)

const versions = computed(() => [
  { key: 'result' as const, label: `${ousiText.value.newVersion} · ${props.resultSize}` },
  { key: 'original' as const, label: `${ousiText.value.originalVersion} · ${props.originalSize}` },
])
const imageStyle = computed(() =>
  zoomed.value && originalWidth.value ? { width: `${originalWidth.value}px`, maxWidth: 'none' } : undefined,
)
const onOriginalLoad = (event: Event) => {
  originalWidth.value = (event.target as HTMLImageElement).naturalWidth
}
</script>

<template>
  <ODialog :model-value="open" size="2xl" @update:model-value="!$event && emit('close')">
    <ODialogHeader :title="title" />
    <ODialogBody>
      <div class="flex flex-col gap-3" data-slot="file-upload-compare">
        <div class="flex flex-wrap items-center gap-1">
          <OButton
            v-for="version in versions"
            :key="version.key"
            size="sm"
            :variant="showing === version.key ? 'soft' : 'text'"
            :aria-pressed="showing === version.key"
            :data-version="version.key"
            @click="showing = version.key"
          >
            {{ version.label }}
          </OButton>
          <OButton
            size="sm"
            :variant="zoomed ? 'soft' : 'outline'"
            :aria-pressed="zoomed"
            class="ml-auto"
            data-slot="file-upload-compare-zoom"
            @click="zoomed = !zoomed"
          >
            {{ ousiText.actualSize }}
          </OButton>
        </div>
        <!-- Focusable, so the keyboard can scroll the enlarged image. -->
        <div v-if="urls" class="max-h-[55dvh] overflow-auto rounded-ousi-xl bg-ousi-default" tabindex="0">
          <img
            v-show="showing === 'result'"
            :src="urls.result"
            :alt="ousiText.newVersion"
            class="mx-auto h-auto max-w-full"
            :style="imageStyle"
          />
          <img
            v-show="showing === 'original'"
            :src="urls.original"
            :alt="ousiText.originalVersion"
            class="mx-auto h-auto max-w-full"
            :style="imageStyle"
            @load="onOriginalLoad"
          />
        </div>
      </div>
    </ODialogBody>
    <ODialogFooter>
      <OButton v-if="canKeepOriginal" size="sm" variant="outline" :disabled="disabled" data-slot="file-upload-compare-keep" @click="emit('keepOriginal')">
        {{ ousiText.keepOriginal }}
      </OButton>
      <OButton size="sm" :disabled="disabled" data-slot="file-upload-compare-accept" @click="emit('accept')">
        {{ ousiText.useNewVersion }}
      </OButton>
    </ODialogFooter>
  </ODialog>
</template>
