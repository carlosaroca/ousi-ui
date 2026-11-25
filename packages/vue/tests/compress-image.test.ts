import { describe, it, expect, vi } from 'vitest'
import {
  compressWith,
  isAnimatedImage,
  type CompressImageType,
  type ImageDecoder,
} from '../src/image/compress-image'

const KB = 1024

/** A file of `size` bytes that does not hold them. */
function picture(name: string, size: number, type = 'image/jpeg'): File {
  const made = new File(['x'], name, { type, lastModified: 7 })
  Object.defineProperty(made, 'size', { value: size })
  return made
}

/**
 * An imaginary camera: the weight grows with the pixels and the quality. `weight` is the size of
 * the full picture at quality 0.85.
 */
function codec({
  width = 4000,
  height = 3000,
  weight = 2000 * KB,
  transparent = false,
  writes = ['image/jpeg', 'image/webp', 'image/png'] as string[],
} = {}) {
  const tries: { width: number; type: CompressImageType; quality: number; size: number }[] = []
  let closed = false
  const decode: ImageDecoder = async () => ({
    width,
    height,
    hasTransparency: () => transparent,
    async encode(w, h, type, quality) {
      const pixels = (w * h) / (width * height)
      const loss = type === 'image/png' ? 1 : 0.15 + quality
      const size = Math.round(weight * pixels * loss)
      const written = writes.includes(type) ? type : 'image/png'
      tries.push({ width: w, type, quality, size })
      return { size, type: written, slice: () => new Blob(), arrayBuffer: async () => new ArrayBuffer(0) } as unknown as Blob
    },
    close: () => void (closed = true),
  })
  return { decode, tries, isClosed: () => closed }
}

// The fake blobs carry a size the File constructor cannot read, so it is read back from the tries.
const written = (c: ReturnType<typeof codec>) => c.tries.at(-1)!

describe('compressImage', () => {
  it('returns a file already under the limit untouched, without opening it', async () => {
    const decode = vi.fn()
    const file = picture('a.jpg', 100 * KB)
    expect(await compressWith(decode, file, { maxSize: 500 * KB })).toBe(file)
    expect(decode).not.toHaveBeenCalled()
  })

  it.each([
    ['a.gif', 'image/gif'],
    ['a.svg', 'image/svg+xml'],
    ['a.pdf', 'application/pdf'],
  ])('leaves %s alone', async (name, type) => {
    const decode = vi.fn()
    const file = picture(name, 5000 * KB, type)
    expect(await compressWith(decode, file, { maxSize: 10 })).toBe(file)
    expect(decode).not.toHaveBeenCalled()
  })

  it('returns the file when the browser cannot open it', async () => {
    const file = picture('a.heic', 900 * KB, 'image/heic')
    expect(await compressWith(async () => null, file, { maxSize: KB })).toBe(file)
  })

  it('lowers the quality first, and keeps the highest one that fits', async () => {
    const c = codec({ weight: 560 * KB })
    const out = await compressWith(c.decode, picture('a.jpg', 900 * KB), { maxSize: 500 * KB })
    expect(out).not.toBeUndefined()
    expect(c.tries.every((t) => t.width === 4000)).toBe(true)
    const fitting = c.tries.filter((t) => t.size <= 500 * KB).map((t) => t.quality)
    expect(Math.max(...fitting)).toBeGreaterThan(0.7)
    expect(c.isClosed()).toBe(true)
  })

  it('shrinks the picture when quality alone is not enough, never below the quality floor', async () => {
    const c = codec({ weight: 4000 * KB })
    await compressWith(c.decode, picture('a.jpg', 5000 * KB), { maxSize: 500 * KB })
    expect(Math.min(...c.tries.map((t) => t.quality))).toBeGreaterThanOrEqual(0.7)
    expect(written(c).width).toBeLessThan(4000)
    expect(written(c).width).toBeGreaterThanOrEqual(800)
  })

  it('stops at minDimension and gives back its lightest try, even if still over', async () => {
    const c = codec({ weight: 900_000 * KB })
    const out = await compressWith(c.decode, picture('a.jpg', 900_000 * KB), { maxSize: KB, minDimension: 1000 })
    expect(Math.min(...c.tries.map((t) => t.width))).toBe(1000)
    expect(out.name).toBe('a.jpg')
  })

  it('brings the longest side down to maxDimension', async () => {
    const c = codec()
    await compressWith(c.decode, picture('a.jpg', 100 * KB), { maxDimension: 1000, maxSize: 5000 * KB })
    expect(c.tries).toHaveLength(1)
    expect(c.tries[0].width).toBe(1000)
  })

  it('does not rewrite a picture already within maxDimension', async () => {
    const file = picture('a.jpg', 100 * KB)
    const c = codec({ width: 800, height: 600 })
    expect(await compressWith(c.decode, file, { maxDimension: 1000 })).toBe(file)
    expect(c.tries).toHaveLength(0)
  })

  it('turns a heavy opaque PNG into JPEG, renaming it and keeping its date', async () => {
    const c = codec({ weight: 400 * KB })
    const out = await compressWith(c.decode, picture('scan.final.png', 3000 * KB, 'image/png'), { maxSize: 500 * KB })
    expect(written(c).type).toBe('image/jpeg')
    expect(out.name).toBe('scan.final.jpg')
    expect(out.type).toBe('image/jpeg')
    expect(out.lastModified).toBe(7)
  })

  it('keeps transparency, as WebP', async () => {
    const c = codec({ weight: 400 * KB, transparent: true })
    const out = await compressWith(c.decode, picture('logo.png', 3000 * KB, 'image/png'), { maxSize: 500 * KB })
    expect(out.name).toBe('logo.webp')
  })

  it('stays with PNG when transparency matters and the browser cannot write WebP', async () => {
    const c = codec({ weight: 3000 * KB, transparent: true, writes: ['image/jpeg', 'image/png'] })
    const out = await compressWith(c.decode, picture('logo.png', 3000 * KB, 'image/png'), { maxSize: 500 * KB })
    expect(out.type).toBe('image/png')
    expect(written(c).width).toBeLessThan(4000)
  })

  it('stops when the signal aborts', async () => {
    const controller = new AbortController()
    controller.abort()
    await expect(compressWith(codec().decode, picture('a.jpg', 900 * KB), { maxSize: KB, signal: controller.signal })).rejects.toThrow()
  })

  it('takes a truncated PNG for a still picture instead of failing', async () => {
    expect(await isAnimatedImage(new File([new Uint8Array(11)], 'cut.png', { type: 'image/png' }))).toBe(false)
  })

  it('tells animations from still pictures', async () => {
    const chunk = (name: string, length = 0) => {
      const data = new Uint8Array(12 + length)
      new DataView(data.buffer).setUint32(0, length)
      data.set([...name].map((c) => c.charCodeAt(0)), 4)
      return data
    }
    const png = (...chunks: Uint8Array[]) => new File([new Uint8Array(8), ...chunks], 'a.png', { type: 'image/png' })
    expect(await isAnimatedImage(png(chunk('IHDR', 13), chunk('iCCP', 100), chunk('acTL', 8), chunk('IDAT')))).toBe(true)
    expect(await isAnimatedImage(png(chunk('IHDR', 13), chunk('IDAT'), chunk('acTL', 8)))).toBe(false)

    const webp = (flags: number) => {
      const data = new Uint8Array(30)
      data.set([...'RIFF....WEBPVP8X'].map((c) => c.charCodeAt(0)))
      data[20] = flags
      return new File([data], 'a.webp', { type: 'image/webp' })
    }
    expect(await isAnimatedImage(webp(0x02))).toBe(true)
    expect(await isAnimatedImage(webp(0x10))).toBe(false)
  })
})
