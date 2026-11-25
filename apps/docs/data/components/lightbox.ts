import type { ComponentData } from './types'

export const lightboxData: ComponentData = {
  title: 'Lightbox',
  description: 'Pictures over the whole screen: zoom with two fingers, a double tap or the wheel, swipe between them, and swipe down to close.',
  category: 'Media',
  importCode: 'import { OLightbox } from \'@ousi-ui/vue\'',

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'LightboxBasic',
        code: `<script setup lang="ts">
import { OLightbox } from '@ousi-ui/vue'

// Pictures drawn here, so the example asks nothing of another site. Use the addresses of your own.
function scene(width: number, height: number, sky: string, hill: string, sun: string) {
  const svg =
    \`<svg xmlns="http://www.w3.org/2000/svg" width="\${width}" height="\${height}" viewBox="0 0 100 100" preserveAspectRatio="none">\` +
    \`<rect width="100" height="100" fill="\${sky}"/><circle cx="72" cy="28" r="11" fill="\${sun}"/>\` +
    \`<path d="M0 72 28 44 50 66 68 50 100 76V100H0Z" fill="\${hill}"/><path d="M0 86 36 68 62 84 82 74 100 84V100H0Z" fill="#00000030"/></svg>\`
  return \`data:image/svg+xml,\${encodeURIComponent(svg)}\`
}

const images = [
  { src: scene(1600, 1000, '#9cc9ff', '#2f6f4f', '#ffd24a'), alt: 'Green hills under a blue sky', caption: 'Morning in the hills' },
  { src: scene(900, 1300, '#ffb38a', '#7a3b69', '#fff0c2'), alt: 'Purple hills at sunset', caption: 'A tall one: portrait pictures fit too' },
  { src: scene(1200, 1200, '#1f2a5c', '#0e1430', '#e8ecff'), alt: 'Dark hills under the moon', caption: 'Night' },
  { src: scene(1800, 900, '#cfeee4', '#176b87', '#ff7d5c'), alt: 'Blue hills and a red sun' },
]
</script>
<template>
  <OLightbox :images="images">
    <!-- The trigger slot draws what opens it, wherever the component is placed. -->
    <template #trigger="{ open }">
      <div class="grid w-full max-w-md grid-cols-4 gap-2">
        <button
          v-for="(image, index) in images"
          :key="image.alt"
          type="button"
          class="aspect-square overflow-hidden rounded-ousi-xl outline-none transition-transform duration-150 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-ousi-focus"
          :aria-label="\`Open: \${image.alt}\`"
          @click="open(index)"
        >
          <img :src="image.src" alt="" class="size-full object-cover" />
        </button>
      </div>
    </template>
  </OLightbox>
</template>`,
      },
    },
    {
      id: 'actions',
      title: 'Download, actions and captions',
      example: {
        component: 'LightboxActions',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { OButton, OLightbox } from '@ousi-ui/vue'

function swatch(color: string, text: string) {
  const svg =
    \`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="\${color}"/>\` +
    \`<text x="600" y="440" font-family="sans-serif" font-size="120" font-weight="600" text-anchor="middle" fill="#fff">\${text}</text></svg>\`
  return \`data:image/svg+xml,\${encodeURIComponent(svg)}\`
}
const all = () => [
  { id: 1, src: swatch('#1b5cff', 'Receipt 1'), alt: 'Receipt 1', downloadName: 'receipt-1.svg', amount: '$48.00' },
  { id: 2, src: swatch('#7c5cff', 'Receipt 2'), alt: 'Receipt 2', downloadName: 'receipt-2.svg', amount: '$112.50' },
  { id: 3, src: swatch('#f6623a', 'Receipt 3'), alt: 'Receipt 3', downloadName: 'receipt-3.svg', amount: '$9.90' },
]

const receipts = ref(all())
const open = ref(false)
const index = ref(0)
// Removing the picture on show shows the next one; removing the last closes the viewer.
const remove = (position: number) => receipts.value.splice(position, 1)
</script>
<template>
  <div class="flex flex-col items-center gap-3">
    <OButton variant="outline" :disabled="!receipts.length" @click="open = true">
      View {{ receipts.length }} receipts
    </OButton>
    <OButton v-if="receipts.length < 3" variant="text" size="sm" @click="receipts = all()">Bring them back</OButton>

    <OLightbox v-model="open" v-model:index="index" :images="receipts" downloadable loop>
      <template #actions="{ index: position }">
        <button type="button" class="h-10 rounded-ousi-4xl bg-white/10 px-4 text-sm font-medium transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-ousi-focus" @click="remove(position)">
          Delete
        </button>
      </template>
      <template #caption="{ image }">
        <span class="font-semibold">{{ (image as { amount?: string }).amount }}</span>
        <span class="text-white/70"> · {{ image.downloadName }}</span>
      </template>
    </OLightbox>
  </div>
</template>`,
      },
    },
    {
      id: 'files',
      title: 'With FileUpload',
      example: {
        component: 'LightboxFiles',
        code: `<script setup lang="ts">
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

// OFileUpload emits \`open\` when the name of a file is clicked.
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
</template>`,
      },
    },
  ],

  props: [
    { name: 'images', type: '(LightboxImage | string)[]', default: '-', description: 'Addresses, or { id?, src, alt?, caption?, thumbnail?, downloadName? }.' },
    { name: 'modelValue', type: 'boolean', default: '-', description: 'Whether it is open (v-model). Optional: the trigger slot and open() work without it.' },
    { name: 'index', type: 'number', default: '-', description: 'The picture on show, from 0 (v-model:index).' },
    { name: 'loop', type: 'boolean', default: 'false', description: 'From the last picture on to the first, and back.' },
    { name: 'thumbnails', type: 'boolean', default: 'true', description: 'A strip to jump between pictures, when there is more than one.' },
    { name: 'showCounter', type: 'boolean', default: 'true', description: '"2 of 5".' },
    { name: 'zoomable', type: 'boolean', default: 'true', description: 'Zoom with two fingers, a double tap or click, the wheel, the buttons, or the keyboard: + and - zoom, 0 returns to the normal size.' },
    { name: 'maxZoom', type: 'number', default: '4', description: 'The most a picture can be enlarged.' },
    { name: 'downloadable', type: 'boolean', default: 'false', description: 'A button that downloads the picture. For a picture on another site the browser opens it in a new tab instead.' },
    { name: 'closeOnBackdrop', type: 'boolean', default: 'true', description: 'A tap or click beside the picture closes it.' },
    { name: 'swipeToClose', type: 'boolean', default: 'true', description: 'Dragging the picture downwards closes it.' },
    { name: 'label', type: 'string', default: '\'Image viewer\'', description: 'Accessible name of the viewer.' },
    { name: 'animated', type: 'boolean', default: 'true', description: 'Animates opening and turning. Off with prefers-reduced-motion.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes on the viewer. The background follows --lightbox-backdrop; shape, focus and disabled states follow the theme tokens. It is dark in light themes too.' },
  ],

  slots: [
    { name: 'trigger', type: '{ open: (index?: number) => void }', description: 'Drawn where the component is placed: what opens the viewer.' },
    { name: 'actions', type: '{ image, index, total, zoom, close }', description: 'More buttons in the bar, such as share or delete.' },
    { name: 'caption', type: '{ image, index, total, zoom, close }', description: 'Under the picture. Replaces its caption.' },
    { name: 'error', type: '{ image, index, total, zoom, close }', description: 'In place of a picture that did not load.' },
    { name: 'close-icon', type: '{ image, index, total, zoom, close }', description: 'Icon of the close button.' },
    { name: 'previous-icon', type: '{ image, index, total, zoom, close }', description: 'Icon of the previous button.' },
    { name: 'next-icon', type: '{ image, index, total, zoom, close }', description: 'Icon of the next button.' },
    { name: 'zoom-in-icon', type: '{ image, index, total, zoom, close }', description: 'Icon of the zoom in button.' },
    { name: 'zoom-out-icon', type: '{ image, index, total, zoom, close }', description: 'Icon of the zoom out button.' },
    { name: 'download-icon', type: '{ image, index, total, zoom, close }', description: 'Icon of the download button.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '[open: boolean]', description: 'Opened or closed.' },
    { name: 'update:index', type: '[index: number]', description: 'Another picture is on show.' },
    { name: 'close', type: '[]', description: 'It closed.' },
    { name: 'error', type: '[image: LightboxImage, index: number]', description: 'A picture did not load.' },
  ],

  methods: [
    { name: 'open', type: '(index?: number) => void', description: 'Opens, at a picture if given.' },
    { name: 'close', type: '() => void', description: 'Closes.' },
    { name: 'next', type: '() => void', description: 'The next picture.' },
    { name: 'previous', type: '() => void', description: 'The one before.' },
    { name: 'goTo', type: '(index: number) => void', description: 'Jumps to a picture.' },
    { name: 'zoomIn', type: '() => void', description: 'Enlarges.' },
    { name: 'zoomOut', type: '() => void', description: 'Reduces.' },
    { name: 'resetZoom', type: '() => void', description: 'Back to its normal size.' },
  ],

  keyboard: [
    { key: 'left', description: 'Previous picture (next in right-to-left). Zoomed in, looks around.' },
    { key: 'right', description: 'Next picture. Zoomed in, looks around.' },
    { key: 'up', description: 'Zoomed in, looks up.' },
    { key: 'down', description: 'Zoomed in, looks down.' },
    { key: 'home', description: 'First picture.' },
    { key: 'end', description: 'Last picture.' },
    { key: 'escape', description: 'Closes.' },
    { key: 'tab', description: 'Stays in the viewer. The thumbnails are one stop.' },
  ],

  aria: [
    { attribute: 'role="dialog" aria-modal="true"', condition: 'when open', description: 'Focus moves to Close, stays inside, and returns to what opened it.' },
    { attribute: 'role="status"', condition: 'always', description: 'Reads the position and alt text of each picture.' },
    { attribute: 'aria-current="true"', condition: 'on a thumbnail', description: 'The picture on show.' },
    { attribute: 'aria-disabled', condition: 'at a limit', description: 'A button at its limit keeps focus.' },
  ],
}
