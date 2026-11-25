<script setup lang="ts">
import { computed, onBeforeUnmount, ref, shallowRef, toRaw } from 'vue'
import { useOusiMessages } from '../../config'
import { isAnimatedImage, isCompressibleType } from '../../image/compress-image'
import { OButton } from '../button'
import { ODialog, ODialogBody, ODialogFooter, ODialogHeader } from '../dialog'
import OImageEditor from './ImageEditor.vue'
import type {
  ImageEditorDialogEmits,
  ImageEditorDialogProps,
  ImageEditorEditOptions,
} from './image-editor.types'

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
  original?: File
  keepUntouched: boolean
  done: boolean
  resolve: (file: File | null) => void
}

const request = shallowRef<Request>()
let nextId = 0
let closing: ReturnType<typeof setTimeout> | undefined

/** The user asked to start again from the picture as it first was. */
const fromOriginal = ref(false)
const source = computed(() => {
  const asked = request.value
  if (!asked) return props.src
  return fromOriginal.value ? asked.original : asked.file
})

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
async function edit(file: File, options: ImageEditorEditOptions = {}): Promise<File | null> {
  if (!isCompressibleType(file.type) || (await isAnimatedImage(file))) return file
  const { signal } = options
  if (signal?.aborted) return null
  return new Promise((resolve) => {
    // A second call takes the editor over: the first one counts as cancelled.
    finish(request.value, null)
    clearTimeout(closing)
    const { original } = options
    const asked: Request = {
      id: ++nextId,
      file,
      original: original && toRaw(original) !== toRaw(file) ? original : undefined,
      keepUntouched: !!options.keepUntouched,
      done: false,
      resolve,
    }
    fromOriginal.value = false
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
    const untouched = asked?.keepUntouched && !editor.value.dirty && !fromOriginal.value
    const file = untouched ? asked.file : await editor.value.export()
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
    :prevent-close="!!editor?.dirty || fromOriginal"
    @update:model-value="!$event && cancel()"
  >
    <ODialogHeader :title="title ?? ousiText.editImage" />
    <ODialogBody>
      <!-- A shorter stage, so the tools and buttons fit a phone screen too. -->
      <OImageEditor
        ref="editor"
        :key="`${request?.id ?? 'open'}-${fromOriginal}`"
        v-bind="editorProps"
        :src="source"
        class="[--image-editor-height:min(40dvh,22rem)]"
      />
    </ODialogBody>
    <ODialogFooter>
      <OButton
        v-if="request?.original && !fromOriginal"
        variant="text"
        size="sm"
        class="mr-auto"
        data-slot="image-editor-original"
        @click="fromOriginal = true"
      >
        {{ ousiText.startFromOriginal }}
      </OButton>
      <OButton variant="outline" size="sm" data-slot="image-editor-cancel" @click="cancel">
        {{ ousiText.cancel }}
      </OButton>
      <OButton size="sm" :disabled="!editor?.ready" :loading="saving" data-slot="image-editor-save" @click="save">
        {{ ousiText.save }}
      </OButton>
    </ODialogFooter>
  </ODialog>
</template>
