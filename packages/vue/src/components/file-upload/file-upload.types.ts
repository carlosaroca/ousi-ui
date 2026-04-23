export type FileUploadVariant = 'area' | 'inline'
export type FileUploadSize = 'sm' | 'md' | 'lg'
export type FileUploadShadow = 'none' | 'xs' | 'sm' | 'md'

export interface FileUploadProps {
  /** Accepted file types (e.g. "image/*,.pdf"). */
  accept?: string
  /** Allow multiple files. */
  multiple?: boolean
  /** Max file size in bytes. */
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
  /** Additional CSS classes. */
  class?: string
}

export interface FileUploadEmits {
  'change': [files: File[]]
  'error': [message: string]
}
