export type FileUploadVariant = 'area' | 'inline'
export type FileUploadSize = 'sm' | 'md' | 'lg'
export type FileUploadShadow = 'none' | 'xs' | 'sm' | 'md'

/** What the app reports for a file it is sending: progress from 0 to 100, or an error. */
export interface FileUploadStatus {
  progress?: number
  error?: string
}

export interface FileUploadProps {
  /** Selected files (v-model). Optional: without it the component keeps its own list. */
  modelValue?: File[]
  /** Accepted file types (e.g. "image/*,.pdf"). Also shown under the drop area. */
  accept?: string
  /** Allow multiple files. */
  multiple?: boolean
  /** Max file size in bytes. Also shown under the drop area. */
  maxSize?: number
  /** Max number of files. */
  maxFiles?: number
  /** Size of the component. */
  size?: FileUploadSize
  /** Disable the upload. */
  disabled?: boolean
  /** Visual variant. */
  variant?: FileUploadVariant
  /** Elevation shadow on the dropzone. Defaults to 'none'. */
  shadow?: FileUploadShadow
  /** Enable tactile press animation (scale on focus). Defaults to false. */
  animated?: boolean
  /** Upload state of each listed file, for a progress bar or an error with a retry button. */
  fileStatus?: (file: File) => FileUploadStatus | undefined
  /** Hide the list of selected files, for apps that show their own. */
  hideFileList?: boolean
  /** Hide the line with the accepted formats and the max size. */
  hideHint?: boolean
  /** Additional CSS classes. */
  class?: string
}

export interface FileUploadEmits {
  'update:modelValue': [files: File[]]
  'change': [files: File[]]
  /** A file was rejected. Without a listener the message shows under the drop area. */
  'error': [message: string]
  /** A file was taken off the list. */
  'remove': [file: File]
  /** The retry button of a file whose `fileStatus` has an error. */
  'retry': [file: File]
}
