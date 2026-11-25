import type { HapticInput } from '@ousi-ui/haptics'

export type SlideButtonVariant = 'primary' | 'success' | 'danger'
export type SlideButtonSize = 'sm' | 'md' | 'lg'
export type SlideButtonShadow = 'none' | 'xs' | 'sm' | 'md'

export interface SlideButtonProps {
  /** Whether it has been slid to the end (v-model). Set it to false to send the thumb back, as
   *  when the action fails. Optional: it keeps its own state. */
  modelValue?: boolean
  /** What sliding will do. Also its accessible name. Defaults to "Slide to confirm". */
  label?: string
  /** Shown once confirmed. Defaults to "Confirmed". */
  confirmedLabel?: string
  /** Shown while `loading`. Defaults to `label`. */
  loadingLabel?: string
  /** Colour of the thumb and of the confirmed track. */
  variant?: SlideButtonVariant
  size?: SlideButtonSize
  /** How far along it must be let go to confirm, from 0.5 to 1. */
  threshold?: number
  /** A spinner in the thumb while the confirmed action runs. */
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  shadow?: SlideButtonShadow
  /** Vibration on confirming. Off unless set. */
  haptic?: HapticInput
  /** Additional CSS classes. Its shape follows `--slide-radius`, its height `--slide-h`. */
  class?: string
}

export interface SlideButtonEmits {
  'update:modelValue': [value: boolean]
  'confirm': []
}

export interface SlideButtonSlotContext {
  /** From 0, at the start, to 1, at the end. */
  progress: number
  confirmed: boolean
  loading: boolean
}

/** One slot for the icon and one for the text of each state: replacing one leaves the rest. */
export interface SlideButtonSlots {
  /** Icon in the thumb before confirming. Replaces the arrow. */
  icon?: (props: SlideButtonSlotContext) => unknown
  /** Icon while `loading`. Replaces the spinner. */
  'loading-icon'?: (props: SlideButtonSlotContext) => unknown
  /** Icon once confirmed. Replaces the check. */
  'confirmed-icon'?: (props: SlideButtonSlotContext) => unknown
  /** Text on the track before confirming. Replaces `label`. */
  label?: (props: SlideButtonSlotContext) => unknown
  /** Text while `loading`. Without it: `loadingLabel`, or else what shows before confirming. */
  'loading-label'?: (props: SlideButtonSlotContext) => unknown
  /** Text once confirmed. Without it: `confirmedLabel`. */
  'confirmed-label'?: (props: SlideButtonSlotContext) => unknown
}
