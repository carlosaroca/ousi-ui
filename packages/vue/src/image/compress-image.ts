export type CompressImageType = 'image/jpeg' | 'image/webp' | 'image/png'

export interface CompressImageOptions {
  /** Weight to reach, in bytes. */
  maxSize?: number
  /** The longest side is brought down to this many pixels. */
  maxDimension?: number
  /** Output format. Without it the format is kept, and changes only when the weight asks for it. */
  type?: CompressImageType
  /** Quality of the first try, from 0 to 1. Defaults to 0.85. */
  quality?: number
  /** Quality is not lowered past this: the image is made smaller instead. Defaults to 0.7. */
  minQuality?: number
  /** To reach the weight the longest side is not shrunk below this, so text stays readable. Defaults to 800. */
  minDimension?: number
  signal?: AbortSignal
}

/** An opened image. The browser one draws on a canvas; tests put their own in its place. */
export interface DecodedImage {
  width: number
  height: number
  hasTransparency: () => boolean
  /** The blob may come in another type when the browser cannot write the one asked for. */
  encode: (width: number, height: number, type: CompressImageType, quality: number) => Promise<Blob | null>
  close: () => void
}

export type ImageDecoder = (file: File) => Promise<DecodedImage | null>

// GIF and SVG are left alone: a canvas would keep one frame of the first and flatten the second.
const COMPRESSIBLE = /^image\/(jpe?g|png|webp|bmp|avif|heic|heif)$/i
const EXTENSIONS: Record<string, string> = { 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/png': 'png' }
// Phones stop drawing past roughly this many pixels in one canvas.
const MAX_PIXELS = 16_000_000

const bytes = async (file: Blob, start: number, length: number) =>
  new Uint8Array(await file.slice(start, start + length).arrayBuffer())
const text = (data: Uint8Array, start = 0, length = 4) =>
  String.fromCharCode(...data.subarray(start, start + length))

/** Animated PNG and WebP files would come out of a canvas as a still picture. */
export async function isAnimatedImage(file: File): Promise<boolean> {
  if (file.type === 'image/webp') {
    const head = await bytes(file, 0, 21)
    return text(head, 12) === 'VP8X' && (head[20] & 0x02) !== 0
  }
  if (file.type !== 'image/png') return false
  // The animation chunk comes before the first image data.
  let offset = 8
  for (let chunk = 0; chunk < 64 && offset + 8 <= file.size; chunk++) {
    const head = await bytes(file, offset, 8)
    // A truncated file: it will fail to open, or open as a still picture.
    if (head.length < 8) return false
    const name = text(head, 4)
    if (name === 'acTL') return true
    if (name === 'IDAT') return false
    offset += 12 + new DataView(head.buffer).getUint32(0)
  }
  return false
}

function throwIfAborted(signal: AbortSignal | undefined) {
  if (signal?.aborted) throw signal.reason ?? new DOMException('Aborted', 'AbortError')
}

function renamed(name: string, type: string): string {
  const extension = EXTENSIONS[type]
  if (!extension) return name
  const dot = name.lastIndexOf('.')
  return `${dot > 0 ? name.slice(0, dot) : name}.${extension}`
}

/** Whether a browser may open it and draw it again. GIF and SVG are never rewritten. */
export const isCompressibleType = (type: string) => COMPRESSIBLE.test(type)

/** The format a picture is written in when none is asked for. A heavy PNG has to change to get lighter. */
export function outputType(source: string, heavy: boolean, image: DecodedImage): CompressImageType {
  const keeps = source === 'image/jpeg' || source === 'image/webp' || (source === 'image/png' && !heavy)
  if (keeps) return source as CompressImageType
  return image.hasTransparency() ? 'image/webp' : 'image/jpeg'
}

export interface EncodedImage {
  blob: Blob
  width: number
  height: number
}

/**
 * Writes an opened image within the limits: quality goes down first, then the dimensions. With
 * `mayChangeType`, a PNG that does not fit moves to a format that can get lighter.
 */
export async function encodeImage(
  image: DecodedImage,
  startType: CompressImageType,
  options: CompressImageOptions,
  mayChangeType = false,
): Promise<EncodedImage> {
  const { maxSize, maxDimension, signal, quality = 0.85, minDimension = 800 } = options
  const minQuality = Math.min(options.minQuality ?? 0.7, quality)
  const longest = Math.max(image.width, image.height)
  let scale = Math.min(
    1,
    maxDimension ? maxDimension / longest : 1,
    Math.sqrt(MAX_PIXELS / (image.width * image.height)),
  )
  // A small picture may still lose half its side.
  const smallestSide = Math.min(minDimension, (longest * scale) / 2)
  let type = startType

  async function encode(at: number): Promise<EncodedImage> {
    const width = Math.max(1, Math.round(image.width * scale))
    const height = Math.max(1, Math.round(image.height * scale))
    let blob = await image.encode(width, height, type, at)
    if (blob && blob.type !== type) {
      type = image.hasTransparency() ? 'image/png' : 'image/jpeg'
      blob = await image.encode(width, height, type, at)
    }
    throwIfAborted(signal)
    if (!blob) throw new Error('The browser could not write the image')
    return { blob, width, height }
  }

  const fits = ({ blob }: EncodedImage) => maxSize === undefined || blob.size <= maxSize

  let current = await encode(quality)
  if (mayChangeType && type === 'image/png' && !fits(current)) {
    type = image.hasTransparency() ? 'image/webp' : 'image/jpeg'
    current = await encode(quality)
  }
  for (let step = 0; step < 10 && !fits(current); step++) {
    // PNG has no quality to lower.
    if (type !== 'image/png' && minQuality < quality) {
      let best = await encode(minQuality)
      if (fits(best)) {
        let low = minQuality
        let high = quality
        for (let i = 0; i < 4; i++) {
          const middle = (low + high) / 2
          const next = await encode(middle)
          if (fits(next)) {
            best = next
            low = middle
          } else high = middle
        }
        return best
      }
      current = best
    }
    const side = longest * scale
    if (side <= smallestSide + 0.5) break
    // Weight grows roughly with the pixels, so with the square of the scale.
    const factor = Math.min(0.9, Math.max(0.5, Math.sqrt(maxSize! / current.blob.size) * 0.95))
    scale = Math.max(side * factor, smallestSide) / longest
    current = await encode(quality)
  }
  // The lightest it could make within the limits, even if still over: the caller checks the size.
  return current
}

export function writtenFile(blob: Blob, original: File): File {
  return new File([blob], renamed(original.name, blob.type), {
    type: blob.type,
    lastModified: original.lastModified,
  })
}

export async function compressWith(
  decode: ImageDecoder,
  file: File,
  options: CompressImageOptions = {},
): Promise<File> {
  const { maxSize, maxDimension, signal } = options
  throwIfAborted(signal)

  const heavy = maxSize !== undefined && file.size > maxSize
  const converts = options.type !== undefined && options.type !== file.type
  if (!heavy && !converts && !maxDimension) return file
  if (!isCompressibleType(file.type) || (await isAnimatedImage(file))) return file

  const image = await decode(file)
  // A format this browser cannot open, such as HEIC in most of them.
  if (!image) return file

  try {
    const oversized = maxDimension !== undefined && Math.max(image.width, image.height) > maxDimension
    if (!heavy && !converts && !oversized) return file
    const { blob } = await encodeImage(image, options.type ?? outputType(file.type, heavy, image), options)
    // Writing it again can make a small file heavier: then the original is better.
    if (blob.size >= file.size && !converts && !oversized) return file
    return writtenFile(blob, file)
  } finally {
    image.close()
  }
}

async function loadElement(file: Blob): Promise<HTMLImageElement | null> {
  const url = URL.createObjectURL(file)
  try {
    const element = new Image()
    element.src = url
    await element.decode()
    return element
  } catch {
    return null
  } finally {
    URL.revokeObjectURL(url)
  }
}

export interface OpenedSource {
  source: ImageBitmap | HTMLImageElement
  width: number
  height: number
  close: () => void
}

/** Opens a picture upright, or resolves with null when the browser cannot. */
export async function openSource(file: Blob): Promise<OpenedSource | null> {
  let source: ImageBitmap | HTMLImageElement | null = null
  try {
    // Phone photos are stored sideways with a note on how to turn them.
    source = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    source = await loadElement(file)
  }
  if (!source) return null
  const opened = source
  return {
    source: opened,
    width: 'naturalWidth' in opened ? opened.naturalWidth : opened.width,
    height: 'naturalHeight' in opened ? opened.naturalHeight : opened.height,
    close: () => {
      if ('close' in opened) opened.close()
    },
  }
}

/** A DecodedImage of the given size, painted on a canvas by `paint`. */
export function canvasImage(
  width: number,
  height: number,
  paint: (context: CanvasRenderingContext2D, width: number, height: number) => void,
  release: () => void = () => {},
): DecodedImage {
  const canvas = document.createElement('canvas')
  let transparent: boolean | undefined

  function draw(w: number, h: number, background?: string) {
    canvas.width = w
    canvas.height = h
    const context = canvas.getContext('2d')!
    if (background) {
      context.fillStyle = background
      context.fillRect(0, 0, w, h)
    }
    context.imageSmoothingQuality = 'high'
    context.save()
    paint(context, w, h)
    context.restore()
    return context
  }

  return {
    width,
    height,
    hasTransparency() {
      if (transparent === undefined) {
        const scale = Math.min(1, Math.sqrt(MAX_PIXELS / (width * height)))
        const w = Math.max(1, Math.round(width * scale))
        const h = Math.max(1, Math.round(height * scale))
        const { data } = draw(w, h).getImageData(0, 0, w, h)
        transparent = false
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] < 255) {
            transparent = true
            break
          }
        }
      }
      return transparent
    },
    encode(w, h, type, at) {
      // JPEG has no transparency, and a canvas would turn it black.
      draw(w, h, type === 'image/jpeg' ? '#fff' : undefined)
      return new Promise((resolve) => canvas.toBlob(resolve, type, at))
    },
    close() {
      release()
      // Gives the memory back at once, which matters on phones.
      canvas.width = canvas.height = 0
    },
  }
}

const decodeInBrowser: ImageDecoder = async (file) => {
  const opened = await openSource(file)
  if (!opened) return null
  return canvasImage(
    opened.width,
    opened.height,
    (context, w, h) => context.drawImage(opened.source, 0, 0, w, h),
    opened.close,
  )
}

/**
 * Makes an image lighter in the browser: lowers the quality first, then the dimensions. Whatever it
 * cannot improve (a GIF, an SVG, a PDF, an animation) comes back as it was. It does its best within
 * `minQuality` and `minDimension`, so check `result.size` when the limit is strict.
 *
 * Writing an image again drops its metadata, such as the place and date of a photo.
 */
export function compressImage(file: File, options?: CompressImageOptions): Promise<File> {
  return compressWith(decodeInBrowser, file, options)
}
