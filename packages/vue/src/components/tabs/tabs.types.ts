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
  /** Stretch horizontal tabs to share the full width. Defaults to `false`: each tab is as wide
   *  as its label, and a secondary list scrolls when the tabs overflow. */
  fullWidth?: boolean
  /** What horizontal tabs do when they don't fit: 'scroll' sideways (default) or collect the
   *  ones that don't fit under a "More" menu. 'menu' has no effect with `fullWidth`. */
  overflow?: 'scroll' | 'menu'
  /** Fill the width of the parent without making the parent wider. Use it inside grid cells, cards
   *  in a flex row and other flex/grid children, where a long list of tabs would otherwise stretch
   *  its column. Needs a parent with a defined width. Defaults to `false`. */
  contained?: boolean
  /** Fade the edge(s) of a horizontal list that still has tabs beyond it, like OScrollShadow.
   *  Only applies while the tabs scroll. Defaults to `true`. */
  scrollFade?: boolean
  /** Hide the secondary variant's track border (the long underline / left rail).
   *  Has no effect on `primary`. The active-tab indicator is unaffected. Defaults to `false`. */
  hideBorder?: boolean
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
