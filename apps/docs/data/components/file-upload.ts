import type { ComponentData } from './types'

export const fileUploadData: ComponentData = {
  title: 'FileUpload',
  description: 'Drop area, strip or button to add files, with validation, upload progress, image previews and a file list.',
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
  <OFileUpload
    multiple
    accept=".jpg,.png,.pdf"
    :max-size="5 * 1024 * 1024"
    @change="onFilesChange"
  />
</template>`,
      },
    },
    {
      id: 'accept',
      title: 'Accepted types and size',
      example: {
        component: 'FileUploadRestricted',
        code: `<!-- maxSize is in bytes: 5242880 = 5 MB -->
<!-- Without an @error listener, the reason of each rejected file shows under the area. -->
<OFileUpload accept=".jpg,.png" :max-size="5242880" @change="onFilesChange" />`,
      },
    },
    {
      id: 'states',
      title: 'Status of every file',
      example: {
        component: 'FileUploadStates',
        code: `<script setup lang="ts">
// Waiting, uploading, uploading without a known progress, done and failed.
const statuses: (FileUploadStatus | undefined)[] = [
  undefined,
  { progress: 64 },
  { state: 'uploading' },
  { progress: 100 },
  { error: 'Connection lost' },
]
const statusOf = (file: File) => statuses[files.indexOf(file)]
</script>

<template>
  <OFileUpload :model-value="files" :file-status="statusOf" multiple />
</template>`,
      },
    },
    {
      id: 'progress',
      title: 'Upload with useFileUpload',
      example: {
        component: 'FileUploadProgress',
        code: `<script setup lang="ts">
import { OFileUpload, useFileUpload } from '@ousi-ui/vue'

// You write how one file is sent. useFileUpload(upload, options) does the rest: a file that
// enters the list is uploaded, and one that leaves it is aborted.
const { files, statusOf, retry, isUploading } = useFileUpload(
  async (file, { onProgress, signal }) => {
    const body = new FormData()
    body.append('file', file)
    const { data } = await axios.post('/files', body, {
      signal,
      onUploadProgress: (event) => onProgress((event.progress ?? 0) * 100),
    })
    return data
  },
  {
    concurrency: 3, // files sent at once; the rest wait
    onSuccess: (file, data) => {},
    onError: (file, error) => {},
    // Without it a failed row says "Upload failed", translated.
    errorMessage: (error) => undefined,
  },
)
// Also returned: resultOf(file), cancel(file) and clear().
</script>

<template>
  <OFileUpload v-model="files" :file-status="statusOf" multiple @retry="retry" />
</template>`,
      },
    },
    {
      id: 'uploaded',
      title: 'Uploaded files',
      example: {
        component: 'FileUploadUploaded',
        code: `<script setup lang="ts">
// What your API returns for the record being edited.
const saved = ref<FileUploadUploadedFile[]>([
  { id: 1, name: 'Signed contract.pdf', size: 312000, url: '/files/1' },
  { id: 2, name: 'Floor plan.png', size: 1840000, previewUrl: '/files/2/thumb' },
])
const added = ref<File[]>([])
</script>

<template>
  <OFileUpload
    v-model="added"
    v-model:uploaded-files="saved"
    multiple
    label="Attachments"
    :max-files="5"
    @open="preview"
    @remove-uploaded="deleteOnServer"
  />
</template>`,
      },
    },
    {
      id: 'preview',
      title: 'Image previews',
      example: {
        component: 'FileUploadPreview',
        code: `<!-- The same setting for the images you pick and for uploaded files with a previewUrl. -->
<OFileUpload preview="contain" /> <!-- default: the whole image -->
<OFileUpload preview="cover" />   <!-- fills the box, cropping: good for photos -->
<OFileUpload preview="none" />    <!-- no thumbnails: always the icon -->`,
      },
    },
    {
      id: 'compress',
      title: 'Compress to fit a limit',
      example: {
        component: 'FileUploadCompress',
        code: `<script setup lang="ts">
import { OFileUpload, compressImage, type FileUploadTransform } from '@ousi-ui/vue'

const LIMIT = 500 * 1024

// transform runs after the type check and before the size check, one file at a time.
// Return the file to add, or null to drop it.
const compress: FileUploadTransform = (file, { signal }) =>
  compressImage(file, { maxSize: LIMIT, signal })
</script>

<template>
  <!-- With a transform that compresses, write your own hint: bigger photos are welcome. -->
  <OFileUpload
    multiple
    accept="image/*"
    :max-size="LIMIT"
    :transform="compress"
    hint="Photos are reduced to 500 KB for you"
  />
</template>

<!--
compressImage(file, options) also works on its own. It returns a File:
  maxSize       bytes to reach
  maxDimension  longest side, in pixels
  type          'image/jpeg' | 'image/webp' | 'image/png' (default: keep it unless the weight asks)
  quality       first try, default 0.85
  minQuality    never below, default 0.7: then it shrinks
  minDimension  the longest side is not shrunk below, default 800
  signal        to abort
It lowers quality, then dimensions. A PDF, GIF, SVG or animation comes back as it was, and so
may a format the browser cannot open. It does its best within those limits, so check result.size
when you use it without OFileUpload. Writing a photo again drops its metadata (place, date).
Your server still has to check type and size.
-->`,
      },
    },
    {
      id: 'approval',
      title: 'Approve the change',
      example: {
        component: 'FileUploadApproval',
        code: `<!-- confirm-transform: a changed file waits until the user takes the new version, keeps the
     original (only if it is within max-size) or discards it. Until then it is not in v-model. -->
<OFileUpload
  v-model="files"
  multiple
  accept="image/*"
  :max-size="5 * 1024 * 1024"
  :transform="(file, { signal }) => compressImage(file, { maxSize: 500 * 1024, signal })"
  confirm-transform
  @pending-change="(count) => (pending = count)"
/>
<OButton :disabled="pending > 0">Send</OButton>

<!-- Your own approval buttons. -->
<OFileUpload :transform="compress" confirm-transform>
  <template #review="{ original, result, canKeepOriginal, accept, keepOriginal, discard, compare }">
    <OButton size="sm" @click="accept">Use the light one</OButton>
    <OButton v-if="compare" size="sm" variant="text" @click="compare">See both</OButton>
  </template>
</OFileUpload>`,
      },
    },
    {
      id: 'paste',
      title: 'Paste from the clipboard',
      example: {
        component: 'FileUploadPaste',
        code: `<!-- Default: with the pointer over the component or focus inside it. -->
<OFileUpload accept="image/*" multiple />

<!-- Wherever the paste happens, for a screen with one uploader. -->
<OFileUpload paste="page" />

<!-- Off. -->
<OFileUpload paste="none" />`,
      },
    },
    {
      id: 'forms',
      title: 'In a form',
      example: {
        component: 'FileUploadForm',
        code: `<OFileUpload
  v-model="contract"
  name="contract"
  label="Signed contract"
  description="One PDF up to 10 MB."
  :error-message="error"
  accept=".pdf"
  :max-size="10 * 1024 * 1024"
  required
/>

<OFileUpload disabled label="Invoices" text="Uploads are closed" hide-hint />`,
      },
    },
    {
      id: 'button',
      title: 'Button variant',
      example: {
        component: 'FileUploadButton',
        code: `<OFileUpload variant="button" text="Attach a file" accept=".pdf" :max-size="5 * 1024 * 1024" />

<!-- On phones, capture opens the camera. -->
<OFileUpload
  variant="button"
  size="lg"
  text="Take a photo of the receipt"
  accept="image/*"
  capture="environment"
  hide-hint
/>

<!-- As tall as the fields beside it. -->
<div class="flex flex-wrap items-start gap-2">
  <OInput placeholder="Reference" class="min-w-32 flex-1" />
  <OFileUpload variant="button" text="Attach" hide-file-list class="!w-auto" />
</div>`,
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
      id: 'customization',
      title: 'Customization',
      example: {
        component: 'FileUploadCustom',
        code: `<!-- Variables: --file-upload-radius, --file-upload-border and --file-upload-bg.
     Each part also has a data-slot attribute to style it from CSS. -->
<OFileUpload
  multiple
  text="Attach files to INV-1043"
  hint="Harbor Labs · JPG, PNG or PDF up to 5 MB"
  class="[--file-upload-radius:0.5rem] [--file-upload-bg:var(--ousi-surface)]"
>
  <template #file-actions="{ file }">
    <OButton variant="text" size="sm" @click="download(file)">Download</OButton>
  </template>
</OFileUpload>

<OFileUpload text="Drop your avatar" accept="image/*" size="sm">
  <template #icon="{ active }">
    <AvatarIcon :class="active && 'scale-110'" />
  </template>
</OFileUpload>`,
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
    { name: 'modelValue', type: 'File[]', default: '-', description: 'Selected files (v-model). Without it the component keeps its own list; bind it to clear the list after an upload.' },
    { name: 'uploadedFiles', type: '{ id?, name, size?, type?, url?, previewUrl? }[]', default: '[]', description: 'Files already on the server (v-model:uploaded-files), listed first as done. A url turns the name into a link. In a single file field a new file takes their place until it is removed.' },
    { name: 'label', type: 'string', default: '-', description: 'Label above the control.' },
    { name: 'description', type: 'string', default: '-', description: 'Help text below the control.' },
    { name: 'errorMessage', type: 'string', default: '-', description: 'Error below the control; activates the error state. With name, errors of OForm are picked up too.' },
    { name: 'name', type: 'string', default: '-', description: 'Name of the native file input, which holds every selected file, dropped ones included.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'A file is required. An uploaded file counts.' },
    { name: 'accept', type: 'string', default: '-', description: 'Comma-separated list of accepted file extensions or MIME types.' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow selecting multiple files. The same file is not added twice.' },
    { name: 'maxSize', type: 'number', default: '-', description: 'Maximum file size in bytes. With a transform it applies to what comes out of it.' },
    { name: 'maxFiles', type: 'number', default: '-', description: 'Maximum number of files when multiple is true, counting the uploaded ones. The hint names it.' },
    { name: 'capture', type: "'user' | 'environment'", default: '-', description: 'On phones, opens the front or back camera.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the component: affects padding, text, icon and the browse button.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable adding, retrying and removing. Files can still be opened.' },
    { name: 'variant', type: "'area' | 'inline' | 'button'", default: "'area'", description: 'Layout. "area" is the tall drop zone, "inline" a compact strip and "button" a single button with the hint beside it. All three accept drops.' },
    { name: 'shadow', type: "'none' | 'xs' | 'sm' | 'md'", default: "'none'", description: 'Elevation shadow.' },
    { name: 'animated', type: 'boolean', default: 'false', description: 'Tactile press animation on the area and the strip.' },
    { name: 'text', type: 'string', default: '-', description: 'Main text of the area or strip, or the label of the button.' },
    { name: 'hint', type: 'string', default: '-', description: 'Replaces the line with the accepted formats and the max size.' },
    { name: 'fileStatus', type: '(file: File) => { state?, progress?, error? } | undefined', default: '-', description: "Upload state per new file. A progress under 100 shows a bar, 100 a check and error a retry button. { state: 'uploading' } shows a bar without a percentage." },
    { name: 'transform', type: '(file: File, context: { signal: AbortSignal }) => File | null | Promise<File | null>', default: '-', description: 'Processes each picked file (compress, crop, convert) after the type check and before the size check, one at a time. Resolve with the file to add or null to drop it. It enters v-model only when done.' },
    { name: 'confirmTransform', type: 'boolean', default: 'false', description: 'A file that transform changed waits for the user: take the new version, keep the original (when it is within maxSize) or discard. Images can be compared side by side in a dialog. A file returned unchanged is added at once.' },
    { name: 'preview', type: "'contain' | 'cover' | 'none'", default: "'contain'", description: 'How images show in the list, new ones and uploaded ones with a previewUrl: the whole image, cropped to fill, or always the icon.' },
    { name: 'paste', type: "'self' | 'page' | 'none'", default: "'self'", description: 'Add files with ⌘V or Ctrl+V: while the pointer is over the component or focus is inside, anywhere on the page, or never. In a text field, copied text wins over the picture that travels with it.' },
    { name: 'hideIcon', type: 'boolean', default: 'false', description: 'Hide the illustration or icon of the control.' },
    { name: 'hideFileList', type: 'boolean', default: 'false', description: 'Hide the list of files.' },
    { name: 'hideHint', type: 'boolean', default: 'false', description: 'Hide the formats and max size line.' },
    { name: 'class', type: 'string', default: '-', description: 'Classes of the outer element.' },
  ],

  slots: [
    { name: 'icon', type: '{ active, disabled }', description: 'Replaces the illustration of the area, or the icon of the strip and the button.' },
    { name: 'text', type: '{ active }', description: 'Main text of the control.' },
    { name: 'hint', type: 'slot', description: 'The line with the accepted formats and the max size.' },
    { name: 'review', type: '{ original, result, canKeepOriginal, accept, keepOriginal, discard, compare }', description: 'Replaces the buttons that approve a transformed file. compare is undefined when they are not both images.' },
    { name: 'file-icon', type: '{ file, kind, previewUrl }', description: 'Icon or thumbnail of a row.' },
    { name: 'file-actions', type: '{ file, state }', description: 'Extra actions of a row, before retry and remove.' },
  ],

  emits: [
    { name: 'change', type: '(files: File[]) => void', description: 'Fired when the list of new files changes.' },
    { name: 'update:modelValue', type: '(files: File[]) => void', description: 'v-model update.' },
    { name: 'error', type: '(message: string) => void', description: 'Fired once per rejected file (format, size or duplicate) and once when there are too many. Without a listener the component shows the messages under the control.' },
    { name: 'remove', type: '(file: File) => void', description: 'Fired when a new file is taken off the list, one by one on a form reset too. It may be uploading: abort the request here (useFileUpload does it for you).' },
    { name: 'retry', type: '(file: File) => void', description: 'Fired by the retry button of a failed file.' },
    { name: 'open', type: '(file: File | FileUploadUploadedFile) => void', description: 'Fired by a click on a name. Listening to it turns every name into a button.' },
    { name: 'pendingChange', type: '(count: number) => void', description: 'How many files are being transformed or waiting for approval. Hold your submit while over 0; a native form is already blocked.' },
    { name: 'transformError', type: '(error: unknown, file: File) => void', description: 'transform threw. The user is told the file could not be processed, and the original is not added.' },
    { name: 'update:uploadedFiles', type: '(files: FileUploadUploadedFile[]) => void', description: 'v-model:uploaded-files update.' },
    { name: 'removeUploaded', type: '(file: FileUploadUploadedFile) => void', description: 'Fired when an uploaded file is taken off the list: delete it on the server from here.' },
  ],

  methods: [
    { name: 'focus', type: '(options?: FocusOptions) => void', description: 'Moves focus to the file input.' },
    { name: 'blur', type: '() => void', description: 'Removes focus from the file input.' },
  ],

  keyboard: [
    { key: 'tab', description: 'Moves to the control, then to the name (when it can be opened) and the buttons of each row.' },
    { key: 'enter', description: 'On the control, opens the file picker of the system. Space does too.' },
    { key: 'command', description: 'With V (Ctrl+V on Windows and Linux), adds the files of the clipboard while focus is in the component.' },
  ],

  aria: [
    { attribute: 'input type="file"', condition: 'always', description: 'The native input is the control in the three variants. It is named by the label and the text, and described by the hint, the description or the error.' },
    { attribute: 'aria-invalid', condition: 'with an error', description: 'Set on the input.' },
    { attribute: 'role="status"', condition: 'an upload ends', description: 'Says which file was uploaded or why it failed.' },
    { attribute: 'role="alert"', condition: 'error or rejected files', description: 'Announces why.' },
    { attribute: 'role="progressbar"', condition: 'while uploading', description: 'Named after the file; without a value when the progress is unknown.' },
    { attribute: 'aria-label', condition: 'row buttons', description: 'Retry, remove and cancel name their file.' },
  ],

  bestPractices: [
    { text: 'Clearly indicate accepted file types and size limits.', good: true },
    { text: 'Upload each file as it is chosen, and disable the submit button while `isUploading`.', good: true },
    { text: 'Let `useFileUpload` run the uploads. If you write your own, abort the request in `remove`.', good: true },
    { text: 'Check type and size again on the server.', good: true },
    { text: 'Use `confirm-transform` for photographed documents, so the user can check that the text is still readable.', good: true },
    { text: 'Allow uploads without communicating file restrictions.', good: false },
  ],
}
