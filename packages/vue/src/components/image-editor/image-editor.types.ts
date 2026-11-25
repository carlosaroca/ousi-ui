import type { CompressImageType } from '../../image'

export type ImageEditorShape = 'rect' | 'circle'

export interface ImageEditorRatio {
  label: string
  /** Width divided by height; without it the crop is free. */
  value?: number
}

export interface ImageEditorProps {
  /** The picture: a file, a blob or a URL. Another origin needs CORS. */
  src?: File | Blob | string
  /** Fixes the shape of the crop (width / height) and hides the choice. */
  aspectRatio?: number
  /** Shapes to choose from when it is not fixed. */
  aspectRatios?: ImageEditorRatio[]
  /** 'circle' draws a round, square crop, for avatars. The file written is square. */
  shape?: ImageEditorShape
  /** Weight to reach, in bytes. */
  maxSize?: number
  /** Longest side of the result, in pixels. */
  maxDimension?: number
  /** Output format. Without it the format of the picture is kept when possible. */
  type?: CompressImageType
  /** Quality, from 0 to 1. Defaults to 0.9. */
  quality?: number
  /** Hide the size, format and quality settings. */
  hideOutputSettings?: boolean
  /** Additional CSS classes. */
  class?: string
}

/** What the editor writes out. Every setting is optional. */
export type ImageEditorOutput = Pick<ImageEditorProps, 'maxSize' | 'maxDimension' | 'type' | 'quality'>

export interface ImageEditorEmits {
  /** The picture is open and can be edited. */
  'ready': []
  /** The picture could not be opened or written. */
  'error': [error: unknown]
}

export interface ImageEditorDialogProps extends ImageEditorProps {
  /** Open state (v-model:open). Not needed when you use `edit()`. */
  open?: boolean
  /** Heading of the dialog. */
  title?: string
}

export interface ImageEditorDialogEmits {
  'update:open': [open: boolean]
  /** Saved while opened with `open`. With `edit()` the file is what the promise resolves with. */
  'save': [file: File]
  'cancel': []
}
