import type { HapticInput } from '@ousi-ui/haptics'

export type DropdownSelectionMode = 'none' | 'single' | 'multiple'
export type DropdownItemVariant = 'default' | 'danger'
export type DropdownShadow = 'sm' | 'md' | 'lg' | 'xl'

export interface DropdownProps {
  modelValue?: boolean
  defaultOpen?: boolean
  /** Elevation shadow on the popover. Defaults to 'lg'. */
  shadow?: DropdownShadow
  class?: string
}

export interface DropdownEmits {
  'update:modelValue': [value: boolean]
  'openChange': [value: boolean]
}

export interface DropdownMenuProps {
  selectionMode?: DropdownSelectionMode
  selectedKeys?: Set<string>
  defaultSelectedKeys?: Set<string>
  disabledKeys?: Set<string>
  class?: string
}

export interface DropdownMenuEmits {
  'action': [key: string]
  'selectionChange': [keys: Set<string>]
  'update:selectedKeys': [keys: Set<string>]
}

export interface DropdownItemProps {
  id: string
  variant?: DropdownItemVariant
  disabled?: boolean
  /** Haptic feedback on item click. Pass false to disable. */
  haptic?: HapticInput
  class?: string
}

export interface DropdownPopoverProps {
  placement?: 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end' | 'left' | 'right'
  class?: string
}

export interface DropdownSectionProps {
  title?: string
  class?: string
}
