export interface LightboxImage {
  /** Unique key. Falls back to the address. */
  id?: string | number
  src: string
  /** What the picture shows, for screen readers. */
  alt?: string
  /** Shown under it. */
  caption?: string
  /** A small version for the strip of thumbnails. Falls back to `src`. */
  thumbnail?: string
  /** File name for the download button. */
  downloadName?: string
}

export interface LightboxProps {
  /** The pictures, or just their addresses. */
  images: (LightboxImage | string)[]
  /** Whether it is open (v-model). Optional: the `trigger` slot and `open()` work without it. */
  modelValue?: boolean
  /** The picture on show, from 0 (v-model:index). */
  index?: number
  /** From the last picture on to the first, and back. */
  loop?: boolean
  /** A strip to jump between pictures, when there is more than one. */
  thumbnails?: boolean
  /** "2 of 5". */
  showCounter?: boolean
  zoomable?: boolean
  /** The most a picture can be enlarged. */
  maxZoom?: number
  /** A button that downloads the picture. From another site the browser opens it instead. */
  downloadable?: boolean
  /** A tap or click beside the picture closes it. */
  closeOnBackdrop?: boolean
  /** Dragging a picture downwards closes it. */
  swipeToClose?: boolean
  /** Accessible name of the viewer. */
  label?: string
  animated?: boolean
  /** Additional CSS classes on the viewer. Its background follows `--lightbox-backdrop`. */
  class?: string
}

export interface LightboxEmits {
  'update:modelValue': [open: boolean]
  'update:index': [index: number]
  'close': []
  /** A picture did not load. */
  'error': [image: LightboxImage, index: number]
}

export interface LightboxSlotContext {
  image: LightboxImage
  index: number
  total: number
  /** 1 at its normal size. */
  zoom: number
  close: () => void
}

export interface LightboxSlots {
  /** Drawn where the component is placed: what opens the viewer. */
  trigger?: (props: { open: (index?: number) => void }) => unknown
  /** Under the picture. Replaces its caption. */
  caption?: (props: LightboxSlotContext) => unknown
  /** More buttons in the bar, such as share or delete. */
  actions?: (props: LightboxSlotContext) => unknown
  /** In place of a picture that did not load. */
  error?: (props: LightboxSlotContext) => unknown
  'close-icon'?: (props: LightboxSlotContext) => unknown
  'previous-icon'?: (props: LightboxSlotContext) => unknown
  'next-icon'?: (props: LightboxSlotContext) => unknown
  'zoom-in-icon'?: (props: LightboxSlotContext) => unknown
  'zoom-out-icon'?: (props: LightboxSlotContext) => unknown
  'download-icon'?: (props: LightboxSlotContext) => unknown
}
