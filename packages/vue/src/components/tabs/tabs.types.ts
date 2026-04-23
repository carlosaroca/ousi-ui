import type { HapticInput } from '@ousi-ui/haptics'

export interface TabItem {
  key: string
  label: string
  disabled?: boolean
}

export type TabsSize = 'sm' | 'md' | 'lg'
export type TabsShadow = 'none' | 'xs' | 'sm' | 'md'

export interface TabsProps {
  /** Active tab key (v-model). */
  modelValue?: string
  /** Default active tab key. */
  defaultValue?: string
  /** Tab items. */
  items: TabItem[]
  /** Visual variant. */
  variant?: 'primary' | 'secondary'
  /** Size of the tabs. */
  size?: TabsSize
  /** Elevation shadow on the tabs list. Defaults to 'none'. */
  shadow?: TabsShadow
  /** Layout orientation. */
  orientation?: 'horizontal' | 'vertical'
  /** Show separator lines between tabs. */
  showSeparator?: boolean
  /** Haptic feedback on tab switch. Pass false to disable. */
  haptic?: HapticInput
  /** Additional CSS classes. */
  class?: string
}

export interface TabsEmits {
  'update:modelValue': [value: string]
  'change': [value: string]
}
