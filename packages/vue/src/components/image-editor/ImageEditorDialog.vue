<script setup lang="ts">
import { computed, onBeforeUnmount, ref, shallowRef } from 'vue'
import { useOusiMessages } from '../../config'
import { isAnimatedImage, isCompressibleType } from '../../image/compress-image'
import { OButton } from '../button'
import { ODialog, ODialogBody, ODialogFooter, ODialogHeader } from '../dialog'
import OImageEditor from './ImageEditor.vue'
import type { ImageEditorDialogEmits, ImageEditorDialogProps } from './image-editor.types'

const props = withDefaults(defineProps<ImageEditorDialogProps>(), {
  open: false,
  title: undefined,
  src: undefined,
  aspectRatio: undefined,
  aspectRatios: undefined,
  shape: 'rect',
  hideOutputSettings: false,
  maxSize: undefined,
  maxDimension: undefined,
  type: undefined,
  quality: undefined,
})
const emit = defineEmits<ImageEditorDialogEmits>()

const ousiText = useOusiMessages()
const editor = ref<InstanceType<typeof OImageEditor>>()
const saving = ref(false)

const editorProps = computed(() => ({
  aspectRatio: props.aspectRatio,
  aspectRatios: props.aspectRatios,
  shape: props.shape,
  hideOutputSettings: props.hideOutputSettings,
  maxSize: props.maxSize,
  maxDimension: props.maxDimension,
  type: props.type,
  quality: props.quality,
}))

/* ── edit(): open, wait for the user, answer ───────────────────── */

interface Request {
  id: number
  file: File
  done: boolean
  resolve: (file: File | null) => void
}

const request = shallowRef<Request>()
let nextId = 0
let closing: ReturnType<typeof setTimeout> | undefined

const isOpen = computed(() => !!request.value || props.open)

function finish(asked: Request | undefined, result: File | null) {
  if (!asked || asked.done) return
  asked.done = true
  asked.resolve(result)
  if (request.value !== asked) return
  // Stays open a moment: with several files, the next one is already on its way.
  closing = setTimeout(() => (request.value = undefined), 80)
}

/**
 * Opens the editor on a file and resolves with the result, or with null if the user cancels. What
 * cannot be edited (a PDF, a GIF, an animation) resolves at once, as it is: made to be passed to the
 * `transform` of OFileUpload.
 */
async function edit(file: File, options: { signal?: AbortSignal } = {}): Promise<File | null> {
  if (!isCompressibleType(file.type) || (await isAnimatedImage(file))) return file
  const { signal } = options
  if (signal?.aborted) return null
  return new Promise((resolve) => {
    // A second call takes the editor over: the first one counts as cancelled.
    finish(request.value, null)
    clearTimeout(closing)
    const asked: Request = { id: ++nextId, file, done: false, resolve }
    request.value = asked
    signal?.addEventListener('abort', () => finish(asked, null), { once: true })
  })
}

function cancel() {
  if (request.value) return finish(request.value, null)
  emit('cancel')
  emit('update:open', false)
}

async function save() {
  const asked = request.value
  if (!editor.value || saving.value || asked?.done) return
  saving.value = true
  try {
    const file = await editor.value.export()
    if (asked) finish(asked, file)
    else {
      emit('save', file)
      emit('update:open', false)
    }
  } catch {
    // The editor stays open, so the user can change a setting or cancel.
  } finally {
    saving.value = false
  }
}

onBeforeUnmount(() => {
  clearTimeout(closing)
  const asked = request.value
  if (asked && !asked.done) asked.resolve(null)
})

defineExpose({ edit })
</script>

<template>
  <!-- Once something changed, Escape or a click outside would throw the work away. -->
  <ODialog
    :model-value="isOpen"
    size="2xl"
    :prevent-close="!!editor?.dirty"
    @update:model-value="!$event && cancel()"
  >
    <ODialogHeader :title="title ?? ousiText.editImage" />
    <ODialogBody>
      <!-- A shorter stage, so the tools and buttons fit a phone screen too. -->
      <OImageEditor
        ref="editor"
        :key="request?.id ?? 'open'"
        v-bind="editorProps"
        :src="request?.file ?? src"
        class="[--image-editor-height:min(40dvh,22rem)]"
      />
    </ODialogBody>
    <ODialogFooter>
      <OButton variant="outline" size="sm" data-slot="image-editor-cancel" @click="cancel">
        {{ ousiText.cancel }}
      </OButton>
      <OButton size="sm" :disabled="!editor?.ready" :loading="saving" data-slot="image-editor-save" @click="save">
        {{ ousiText.save }}
      </OButton>
    </ODialogFooter>
  </ODialog>
</template>
