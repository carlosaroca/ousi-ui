import type { FileUploadFileKind, FileUploadState, FileUploadStatus } from './file-upload.types'

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB']

function unitOf(bytes: number): number {
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < UNITS.length - 1) {
    value /= 1024
    unit++
  }
  return unit
}

/** One decimal while the number is short: "4.6 MB", but "305 KB". */
const decimalsOf = (value: number, unit: number) => (unit === 0 || value >= 100 ? 0 : 1)

export function formatFileSize(bytes: number, locale: string): string {
  const unit = unitOf(bytes)
  const value = bytes / 1024 ** unit
  const format = new Intl.NumberFormat(locale, { maximumFractionDigits: decimalsOf(value, unit) })
  return `${format.format(value)} ${UNITS[unit]}`
}

/** "2.9 / 4.6 MB": both numbers in the unit of the total. */
export function formatTransfer(sent: number, total: number, locale: string): string {
  const unit = unitOf(total)
  const whole = total / 1024 ** unit
  const decimals = decimalsOf(whole, unit)
  // The sent part keeps its decimals while it grows, so the line does not change width.
  const part = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(sent / 1024 ** unit)
  return `${part} / ${formatFileSize(total, locale)}`
}

export function formatPercent(percent: number, locale: string): string {
  return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(
    percent / 100,
  )
}

export function stateOf(status: FileUploadStatus | undefined): FileUploadState {
  if (!status) return 'idle'
  if (status.state) return status.state
  if (status.error) return 'error'
  if (status.progress === undefined) return 'idle'
  return status.progress >= 100 ? 'done' : 'uploading'
}

export function isAccepted(file: File, accept: string | undefined): boolean {
  if (!accept) return true
  return accept.split(',').some((token) => {
    const type = token.trim().toLowerCase()
    if (!type) return false
    if (type.startsWith('.')) return file.name.toLowerCase().endsWith(type)
    if (type.endsWith('/*')) return file.type.toLowerCase().startsWith(type.slice(0, -1))
    return file.type.toLowerCase() === type
  })
}

const EXTENSIONS: Record<Exclude<FileUploadFileKind, 'file'>, string> = {
  pdf: 'pdf',
  doc: 'doc docx odt rtf txt md pages',
  sheet: 'xls xlsx csv tsv ods numbers',
  slides: 'ppt pptx odp key',
  image: 'jpg jpeg png gif webp svg avif bmp heic heif tif tiff ico psd ai fig sketch',
  video: 'mp4 mov webm avi mkv m4v',
  audio: 'mp3 wav ogg m4a flac aac',
  archive: 'zip rar 7z tar gz tgz bz2',
  code: 'js ts jsx tsx vue json html css scss xml yml yaml php py rb go rs java sql sh dart',
}

const KIND_BY_EXTENSION = new Map(
  Object.entries(EXTENSIONS).flatMap(([kind, list]) =>
    list.split(' ').map((extension) => [extension, kind as FileUploadFileKind]),
  ),
)

/** The extension decides; the MIME type is the fallback for names without a known one. */
export function fileKind(name: string, type = ''): FileUploadFileKind {
  const dot = name.lastIndexOf('.')
  const byName = dot >= 0 ? KIND_BY_EXTENSION.get(name.slice(dot + 1).toLowerCase()) : undefined
  if (byName) return byName
  const mime = type.toLowerCase()
  if (mime === 'application/pdf') return 'pdf'
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  if (mime.startsWith('audio/')) return 'audio'
  if (/csv|spreadsheet|ms-excel/.test(mime)) return 'sheet'
  if (/presentation|ms-powerpoint/.test(mime)) return 'slides'
  if (/wordprocessing|msword|^text\/plain$/.test(mime)) return 'doc'
  if (/zip|compressed|x-tar/.test(mime)) return 'archive'
  return 'file'
}

/** Image types every current browser can draw, so a thumbnail will not come out broken. */
export function isPreviewable(type: string): boolean {
  return /^image\/(png|jpe?g|gif|webp|avif|bmp|svg\+xml)$/i.test(type)
}

let segmenter: { segment(text: string): Iterable<{ segment: string }> } | undefined

/** Characters as a reader sees them: an accent or an emoji is never split in two. */
function characters(text: string): string[] {
  const Segmenter = (Intl as any).Segmenter
  if (!Segmenter) return Array.from(text)
  segmenter ??= new Segmenter()
  return Array.from(segmenter!.segment(text), (part) => part.segment)
}

/**
 * Splits a name so that it can be cut in the middle: the first part takes the ellipsis and the
 * second keeps the end of the name and its extension in sight. A short name comes back whole.
 */
export function splitName(name: string): [start: string, end: string] {
  const all = characters(name)
  const dot = all.lastIndexOf('.')
  const suffix = dot > 0 ? all.slice(dot) : []
  // A long or spaced piece after the last dot is part of the name, not an extension.
  const extension = suffix.length <= 8 && !suffix.some((c) => /\s/.test(c)) ? suffix.length : 0
  const kept = extension + 4
  if (all.length <= kept + 3) return [name, '']
  return [all.slice(0, -kept).join(''), all.slice(-kept).join('')]
}

/** A stored URL may come from user data: only web and blob addresses become links. */
export function safeUrl(url: string | undefined): string | undefined {
  if (!url) return undefined
  try {
    const { protocol } = new URL(url, 'https://relative.invalid/')
    return ['http:', 'https:', 'blob:'].includes(protocol) ? url : undefined
  } catch {
    return undefined
  }
}
