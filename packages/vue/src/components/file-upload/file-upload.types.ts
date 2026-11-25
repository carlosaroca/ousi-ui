export type FileUploadVariant = 'area' | 'inline' | 'button'
export type FileUploadSize = 'sm' | 'md' | 'lg'
export type FileUploadShadow = 'none' | 'xs' | 'sm' | 'md'
export type FileUploadState = 'idle' | 'uploading' | 'done' | 'error'
export type FileUploadPreview = 'contain' | 'cover' | 'none'
export type FileUploadPaste = 'self' | 'page' | 'none'

/** The family of a file, which picks the drawing of its icon. */
export type FileUploadFileKind =
  | 'doc'
  | 'pdf'
  | 'sheet'
  | 'slides'
  | 'image'
  | 'video'
  | 'audio'
  | 'archive'
  | 'code'
  | 'file'

/** What the app reports for a file it is sending. */
export interface FileUploadStatus {
  /**
   * Without it the state follows the rest: `error` means failed, a `progress` under 100 means
   * uploading and 100 means done. `{ state: 'uploading' }` alone shows a bar with no percentage.
   */
  state?: FileUploadState
  /** From 0 to 100. */
  progress?: number
  /** Why the upload failed. */
  error?: string
}

/**
 * Processes a picked file before it is added: compress, crop, convert. Resolve with the file to add,
 * or with null to drop it. Abort whatever you opened when the signal does.
 */
export type FileUploadTransform = (
  file: File,
  context: { signal: AbortSignal },
) => File | null | Promise<File | null>

/** A file that is already on the server, such as the attachments of a record being edited. */
export interface FileUploadUploadedFile {
  id?: string | number
  name: string
  /** In bytes. */
  size?: number
  /** MIME type. The extension of the name is enough to pick the icon. */
  type?: string
  /** Turns the name into a link that opens in a new tab. */
  url?: string
  /** Image shown in place of the icon. */
  previewUrl?: string
}

export interface FileUploadProps {
  /** Selected files (v-model). Optional: without it the component keeps its own list. */
  modelValue?: File[]
  /** Files already on the server (v-model:uploaded-files), listed before the new ones. */
  uploadedFiles?: FileUploadUploadedFile[]
  /** Label shown above the control. */
  label?: string
  /** Help text shown below the control. */
  description?: string
  /** Error message: activates the error state. */
  errorMessage?: string
  /** Name of the native file input, also used to match form context errors. */
  name?: string
  /** Whether a file is required. An uploaded file counts. */
  required?: boolean
  /** Accepted file types (e.g. "image/*,.pdf"). Also shown in the hint. */
  accept?: string
  /** Allow multiple files. */
  multiple?: boolean
  /** Max file size in bytes. Also shown in the hint. */
  maxSize?: number
  /** Max number of files, counting the uploaded ones. */
  maxFiles?: number
  /** Opens the camera on phones: 'user' for the front one, 'environment' for the back one. */
  capture?: 'user' | 'environment'
  /** Size of the component. */
  size?: FileUploadSize
  /** Disable adding, retrying and removing. Files can still be opened. */
  disabled?: boolean
  /** Visual variant. */
  variant?: FileUploadVariant
  /** Elevation shadow on the dropzone. Defaults to 'none'. */
  shadow?: FileUploadShadow
  /** Enable tactile press animation (scale on focus). Defaults to false. */
  animated?: boolean
  /** Main text of the drop area, or the label of the button in the button variant. */
  text?: string
  /** Replaces the line with the accepted formats and the max size. */
  hint?: string
  /** Upload state of each new file, for progress or an error with a retry button. */
  fileStatus?: (file: File) => FileUploadStatus | undefined
  /**
   * How images show in the list, for new files and uploaded ones: 'contain' (default) the whole
   * image, 'cover' filling the box and cropping what does not fit, 'none' always the icon.
   */
  preview?: FileUploadPreview
  /**
   * Runs on each picked file after the type check and before the size check, one file at a time.
   * The file enters v-model only once it is done.
   */
  transform?: FileUploadTransform
  /** Ask the user before adding a file that `transform` changed. */
  confirmTransform?: boolean
  /**
   * Add files with ⌘V / Ctrl+V: 'self' (default) while the pointer is over the component or focus is
   * inside, 'page' wherever the paste happens, 'none' never.
   */
  paste?: FileUploadPaste
  /** Hide the illustration or icon of the control. */
  hideIcon?: boolean
  /** Hide the list of files, for apps that show their own. */
  hideFileList?: boolean
  /** Hide the line with the accepted formats and the max size. */
  hideHint?: boolean
  /** Additional CSS classes. */
  class?: string
}

export interface FileUploadEmits {
  'update:modelValue': [files: File[]]
  'change': [files: File[]]
  /** A file was rejected. Without a listener the message shows under the control. */
  'error': [message: string]
  /** A new file was taken off the list. If it was uploading, abort the request here. */
  'remove': [file: File]
  /** The retry button of a file whose upload failed. */
  'retry': [file: File]
  /** The name of a file was clicked. Listening to it turns every name into a button. */
  'open': [file: File | FileUploadUploadedFile]
  /** How many files are being transformed or waiting for approval: hold your submit while over 0. */
  'pendingChange': [count: number]
  /** `transform` threw. The user sees that the file could not be processed; the cause is here. */
  'transformError': [error: unknown, file: File]
  'update:uploadedFiles': [files: FileUploadUploadedFile[]]
  /** An uploaded file was taken off the list: delete it on the server from here. */
  'removeUploaded': [file: FileUploadUploadedFile]
}

export interface FileUploadSlots {
  /** Replaces the illustration (area) or the icon (inline and button). */
  icon?: (props: { active: boolean; disabled: boolean }) => unknown
  /** Main text of the control. */
  text?: (props: { active: boolean }) => unknown
  /** The line with the accepted formats and the max size. */
  hint?: () => unknown
  /** The icon or thumbnail of a row. */
  'file-icon'?: (props: {
    file: File | FileUploadUploadedFile
    kind: FileUploadFileKind
    previewUrl: string | undefined
  }) => unknown
  /** Replaces the buttons that approve a transformed file. */
  review?: (props: {
    original: File
    result: File
    /** False when the original breaks `maxSize`. */
    canKeepOriginal: boolean
    accept: () => void
    keepOriginal: () => void
    discard: () => void
    /** Opens the comparison of both images; undefined for other files. */
    compare: (() => void) | undefined
  }) => unknown
  /** Extra actions of a row, before retry and remove. */
  'file-actions'?: (props: { file: File | FileUploadUploadedFile; state: FileUploadState }) => unknown
}
