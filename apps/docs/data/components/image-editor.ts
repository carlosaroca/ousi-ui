import type { ComponentData } from './types'

export const imageEditorData: ComponentData = {
  title: 'ImageEditor',
  description: 'Crop, rotate, mirror and zoom a picture in the browser, and write it under a size limit. On its own, in a dialog, or inside OFileUpload.',
  category: 'Media',
  importCode: "import { OImageEditor, OImageEditorDialog } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'ImageEditorBasic',
        code: `<script setup lang="ts">
const editor = ref<InstanceType<typeof OImageEditor>>()

async function apply() {
  const file = await editor.value!.export()
}
</script>

<template>
  <!-- src: a File, a Blob or a URL (another origin needs CORS). -->
  <OImageEditor ref="editor" :src="photo" />
  <OButton @click="apply">Export</OButton>
</template>`,
      },
    },
    {
      id: 'avatar',
      title: 'Round avatar, with OFileUpload',
      example: {
        component: 'ImageEditorAvatar',
        code: `<OFileUpload
  v-model="photo"
  variant="button"
  accept="image/*"
  :transform="(file, { signal }) => editor!.edit(file, { signal })"
/>
<!-- A round crop; the file written is square, so show it round with CSS. -->
<OImageEditorDialog
  ref="editor"
  shape="circle"
  :max-dimension="512"
  :max-size="200 * 1024"
  hide-output-settings
/>`,
      },
    },
    {
      id: 'upload',
      title: 'Crop each upload',
      example: {
        component: 'ImageEditorUpload',
        code: `<!-- edit() resolves with the edited file, or null if the user cancels, which drops it.
     What cannot be edited (a PDF, a GIF, an animation) comes back at once, as it was. -->
<OFileUpload
  multiple
  accept="image/*,.pdf"
  :max-size="500 * 1024"
  :transform="(file, { signal }) => editor!.edit(file, { signal })"
/>
<OImageEditorDialog ref="editor" :max-size="500 * 1024" />

<!-- Or open it yourself. -->
<OImageEditorDialog v-model:open="open" :src="photo" @save="use" />

<!-- Other shapes, or a fixed one. -->
<OImageEditor :src="photo" :aspect-ratios="[{ label: 'ID card', value: 85.6 / 54 }, { label: 'Free' }]" />
<OImageEditor :src="photo" :aspect-ratio="16 / 9" />`,
      },
    },
  ],

  props: [
    { name: 'src', type: 'File | Blob | string', default: '-', description: 'The picture to edit. A URL of another origin needs CORS.' },
    { name: 'aspectRatio', type: 'number', default: '-', description: 'Fixes the shape of the crop (width / height) and hides the choice.' },
    { name: 'aspectRatios', type: '{ label: string; value?: number }[]', default: 'Free, 1:1, 4:3, 3:4, 16:9', description: 'Shapes to choose from; the first one starts selected. Without value the crop is free.' },
    { name: 'shape', type: "'rect' | 'circle'", default: "'rect'", description: 'circle draws a round crop for avatars. The file written is square.' },
    { name: 'maxSize', type: 'number', default: '-', description: 'Bytes to reach: quality goes down first, then dimensions. The editor shows the real weight and says if it is still over.' },
    { name: 'maxDimension', type: 'number', default: '-', description: 'Longest side of the result, in pixels. Never enlarges.' },
    { name: 'type', type: "'image/jpeg' | 'image/webp' | 'image/png'", default: '-', description: 'Output format. Without it the format is kept when possible.' },
    { name: 'quality', type: 'number', default: '0.9', description: 'Quality of the result, from 0 to 1.' },
    { name: 'hideOutputSettings', type: 'boolean', default: 'false', description: 'Hide the size, format and quality settings.' },
    { name: 'class', type: 'string', default: '-', description: 'Classes of the outer element. The CSS variable --image-editor-height sets the height of the stage.' },
  ],

  emits: [
    { name: 'ready', type: '() => void', description: 'The picture is open.' },
    { name: 'error', type: '(error: unknown) => void', description: 'The picture could not be opened or written.' },
  ],

  methods: [
    { name: 'export', type: '() => Promise<File>', description: 'The picture as edited. With nothing to change, the very file that came in.' },
    { name: 'reset', type: '() => void', description: 'Undoes every change.' },
    { name: 'rotate', type: '(clockwise?: boolean) => void', description: 'A quarter turn.' },
    { name: 'flip', type: "(axis: 'horizontal' | 'vertical') => void", description: 'Mirrors what is on screen.' },
    { name: 'dirty / ready', type: 'boolean', description: 'Whether the user changed something, and whether the picture is open.' },
  ],

  parts: [
    {
      name: 'OImageEditorDialog',
      description: 'The editor in a dialog with Save and Cancel. It takes every prop of OImageEditor. Its method edit(file, { signal }) opens it and resolves with the result, or null on Cancel. Once something changed, Escape and a click outside no longer close it.',
      props: [
        { name: 'open', type: 'boolean', default: 'false', description: 'Open state (v-model:open), when you do not use edit().' },
        { name: 'title', type: 'string', default: "'Edit image'", description: 'Heading of the dialog.' },
      ],
      emits: [
        { name: 'save', type: '(file: File) => void', description: 'Saved, when opened with open.' },
        { name: 'cancel', type: '() => void', description: 'Cancelled, when opened with open.' },
        { name: 'update:open', type: '(open: boolean) => void', description: 'v-model:open update.' },
      ],
    },
  ],

  keyboard: [
    { key: 'left', description: 'With the other arrows, moves the crop. Click the crop or Tab to it first.' },
    { key: 'shift', description: 'With the arrows, makes the crop wider, narrower, taller or shorter. Plus and minus zoom.' },
  ],

  aria: [
    { attribute: 'role="group"', condition: 'crop frame', description: 'Focusable and named "Crop area", with the keys described.' },
    { attribute: 'aria-pressed', condition: 'shapes', description: 'Marks the chosen one.' },
    { attribute: 'aria-live="polite"', condition: 'weight', description: 'Reads the weight when the editing pauses.' },
  ],

  bestPractices: [
    { text: 'Set `maxSize` and `maxDimension` to what your server accepts, and check them there too.', good: true },
    { text: 'Hide the output settings when the user only needs to frame the picture.', good: true },
    { text: 'Writing a picture again drops its metadata, such as place and date. Do not use the editor where you need them.', good: false },
  ],
}
