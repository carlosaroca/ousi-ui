export type ImageCompareOrientation = 'horizontal' | 'vertical'

export interface ImageCompareProps {
  /** Source URL for the "before" (left/top) image. */
  beforeSrc: string
  /** Source URL for the "after" (right/bottom) image. */
  afterSrc: string
  /** Alt text for the before image. */
  beforeAlt?: string
  /** Alt text for the after image. */
  afterAlt?: string
  /** Label shown on the before side. */
  beforeLabel?: string
  /** Label shown on the after side. */
  afterLabel?: string
  /** Initial position as percentage (0-100). Default: 50. */
  modelValue?: number
  /** Default position when uncontrolled. Default: 50. */
  defaultValue?: number
  /** Orientation of the divider. Default: 'horizontal'. */
  orientation?: ImageCompareOrientation
  /** Show the divider line. Default: true. */
  showDivider?: boolean
  /** Show the drag handle. Default: true. */
  showHandle?: boolean
  /** Border radius. Uses design system token. */
  rounded?: boolean
  /** Disable interaction. */
  disabled?: boolean
  /** Additional CSS classes. */
  class?: string
}

export interface ImageCompareEmits {
  'update:modelValue': [value: number]
  'change': [value: number]
}
