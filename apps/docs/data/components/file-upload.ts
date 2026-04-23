import type { ComponentData } from './types'

export const fileUploadData: ComponentData = {
  title: 'FileUpload',
  description: 'A drag-and-drop file upload zone with validation support.',
  category: 'Forms',
  importCode: "import { OFileUpload } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'FileUploadBasic',
        code: `<script setup lang="ts">
function onFilesChange(files: File[]) {
  console.log('Files:', files)
}
</script>

<template>
  <OFileUpload @change="onFilesChange" />
</template>`,
      },
    },
    {
      id: 'accept',
      title: 'Accepted File Types',
      example: {
        component: 'FileUploadRestricted',
        code: `<OFileUpload
  accept=".jpg,.png"
  :max-size="5242880"
  @change="onFilesChange"
  @error="onError"
/>`,
      },
    },
    {
      id: 'max-size',
      title: 'Max File Size',
      example: {
        component: 'FileUploadRestricted',
        code: `<!-- maxSize is in bytes — 5242880 = 5 MB -->
<OFileUpload
  :max-size="5242880"
  @error="onError"
/>`,
      },
    },
    {
      id: 'inline',
      title: 'Inline Variant',
      example: {
        component: 'FileUploadInline',
        code: `<OFileUpload variant="inline" multiple @change="onFilesChange" />`,
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'FileUploadSizes',
        code: `<OFileUpload size="sm" variant="inline" />
<OFileUpload size="md" variant="inline" />
<OFileUpload size="lg" variant="inline" />`,
      },
    },
    {
      id: 'animated',
      title: 'Animated',
      example: {
        component: 'FileUploadAnimated',
        code: `<OFileUpload />
<OFileUpload animated />`,
      },
    },
  ],

  props: [
    { name: 'accept', type: 'string', default: '-', description: 'Comma-separated list of accepted file extensions or MIME types.' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow selecting multiple files.' },
    { name: 'maxSize', type: 'number', default: '-', description: 'Maximum file size in bytes.' },
    { name: 'maxFiles', type: 'number', default: '-', description: 'Maximum number of files allowed when multiple is true.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the component — affects padding, text, icon, and the browse button.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the upload zone.' },
    { name: 'variant', type: "'area' | 'inline'", default: "'area'", description: 'Layout variant. "area" is the default tall drop zone; "inline" is a compact horizontal strip.' },
    { name: 'shadow', type: "'none' | 'xs' | 'sm' | 'md'", default: "'none'", description: 'Elevation shadow.' },
    { name: 'animated', type: 'boolean', default: 'false', description: 'Tactile press animation — scales to 98% on focus.' },
  ],

  emits: [
    { name: 'change', type: '(files: File[]) => void', description: 'Fired when files are selected or dropped.' },
    { name: 'error', type: '(error: { type: string; message: string }) => void', description: 'Fired when a validation error occurs (wrong type, size exceeded, etc.).' },
  ],

  bestPractices: [
    { text: 'Clearly indicate accepted file types and size limits in the drop zone.', good: true },
    { text: 'Provide feedback after files are selected, such as a file list.', good: true },
    { text: 'Show progress indicators for large file uploads.', good: true },
    { text: 'Allow uploads without communicating file restrictions.', good: false },
  ],
}
