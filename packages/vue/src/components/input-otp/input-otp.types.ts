export type OtpSlotType = 'digit' | 'alpha' | 'alphanumeric'
export type InputOtpShadow = 'none' | 'xs' | 'sm' | 'md'

export interface OtpGroup {
  slots: number
}

export interface InputOtpProps {
  /** Current value (v-model). */
  modelValue?: string
  /** Default value. */
  defaultValue?: string
  /** Total number of slots. Default: 6. */
  length?: number
  /** Group slots with separators between groups. */
  groups?: OtpGroup[]
  /** Which characters to accept. Default: 'digit'. */
  type?: OtpSlotType
  /** Visual variant. */
  variant?: 'primary' | 'secondary'
  /** Elevation shadow on each slot. Defaults to 'xs'. */
  shadow?: InputOtpShadow
  /** Enable tactile press animation (scale on focus). Defaults to false. */
  animated?: boolean
  /** Size of the slots. Default: 'md'. */
  size?: 'sm' | 'md' | 'lg'
  /** Label text. */
  label?: string
  /** Description text. */
  description?: string
  /** Error message — activates error state. */
  errorMessage?: string
  /** Disable the input. */
  disabled?: boolean
  /** Read-only mode. */
  readonly?: boolean
  /** Mark as required. */
  required?: boolean
  /** Shake slots on error. Default: true. */
  shakeOnError?: boolean
  /** Clear slots on error. Default: false. */
  clearOnError?: boolean
  /** Delay between clears in ms. Default: 80. */
  clearDelay?: number
  /** Mask values like a password. Default: false. */
  mask?: boolean
  /** Placeholder per empty slot. Default: '○'. */
  placeholder?: string
  /** Additional CSS classes. */
  class?: string
}

export interface InputOtpEmits {
  'update:modelValue': [value: string]
  'change': [value: string]
  /** Emitted when all slots are filled. */
  'complete': [value: string]
  /** Emitted after auto-clear on error. */
  'clear': []
}
