import {
  canvasImage,
  encodeImage,
  openSource,
  outputType,
  writtenFile,
  type DecodedImage,
} from '../../image/compress-image'
import { isUntouched, pixelCrop, turnedSize, type EditState, type Rect, type Size } from './image-editor.geometry'
import type { ImageEditorOutput } from './image-editor.types'

export interface EditedFile {
  file: File
  width: number
  height: number
}

/** The subset of a 2D context the painting needs, so a test can follow it. */
export type PaintContext = Pick<CanvasRenderingContext2D, 'scale' | 'translate' | 'rotate' | 'drawImage'>

/**
 * Paints the framed part of the turned picture over a canvas of w × h. A canvas applies the last
 * transform first, so this reads backwards: draw, rotate, mirror, move into the frame, scale. That is
 * the same order as the CSS of the preview.
 */
export function paintEdit(
  context: PaintContext,
  source: CanvasImageSource,
  natural: Size,
  state: EditState,
  crop: Rect,
  w: number,
  h: number,
) {
  const turned = turnedSize(natural, state.rotation)
  context.scale(w / crop.width, h / crop.height)
  context.translate(turned.width / 2 - crop.x, turned.height / 2 - crop.y)
  context.scale(state.flipX ? -1 : 1, state.flipY ? -1 : 1)
  context.rotate((state.rotation * Math.PI) / 180)
  context.drawImage(source, -natural.width / 2, -natural.height / 2, natural.width, natural.height)
}

export async function openEdit(file: File, natural: Size, state: EditState): Promise<DecodedImage | null> {
  const opened = await openSource(file)
  if (!opened) return null
  const crop = pixelCrop(state.crop, turnedSize(natural, state.rotation))
  return canvasImage(
    crop.width,
    crop.height,
    (context, w, h) => paintEdit(context, opened.source, natural, state, crop, w, h),
    opened.close,
  )
}

/** The picture as edited, written within the output settings. */
export async function exportEdit(
  file: File,
  natural: Size,
  state: EditState,
  output: ImageEditorOutput,
  signal?: AbortSignal,
  open: typeof openEdit = openEdit,
): Promise<EditedFile> {
  const { maxSize, maxDimension, type, quality } = output
  // Nothing to change: the file goes out as it came, with all its quality and metadata.
  const asItIs =
    isUntouched(state, natural) &&
    (maxSize === undefined || file.size <= maxSize) &&
    (maxDimension === undefined || Math.max(natural.width, natural.height) <= maxDimension) &&
    (type === undefined || type === file.type) &&
    quality === undefined
  if (asItIs) return { file, ...natural }

  const image = await open(file, natural, state)
  if (!image) throw new Error('The browser cannot open this image')
  try {
    const encoded = await encodeImage(
      image,
      type ?? outputType(file.type, false, image),
      { maxSize, maxDimension, quality: quality ?? 0.9, signal },
      type === undefined,
    )
    return { file: writtenFile(encoded.blob, file), width: encoded.width, height: encoded.height }
  } finally {
    image.close()
  }
}
