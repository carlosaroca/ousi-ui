import type { HapticInput } from '@ousi-ui/haptics'

export type SwitchShadow = 'none' | 'xs' | 'sm'

export interface SwitchProps {
  /** Controlled checked state (v-model). */
  modelValue?: boolean
  /** Default checked state when uncontrolled. */
  defaultValue?: boolean
  /** Label text. */
  label?: string
  /** Help text below the label. */
  description?: string
  /** Size of the switch. */
  size?: 'sm' | 'md' | 'lg'
  /** Elevation shadow on the track. Defaults to 'none'. */
  shadow?: SwitchShadow
  /** Whether the switch is disabled. */
  disabled?: boolean
  /** Whether the switch is read-only. */
  readonly?: boolean
  /** Haptic feedback on toggle. Pass false to disable. */
  haptic?: HapticInput
  /** Additional CSS classes. */
  class?: string
}

export interface SwitchEmits {
  'update:modelValue': [value: boolean]
  'change': [value: boolean]
}
