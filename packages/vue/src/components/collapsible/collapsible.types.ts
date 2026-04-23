export type CollapsibleShadow = 'none' | 'xs' | 'sm' | 'md'

export interface CollapsibleProps {
  modelValue?: boolean
  defaultOpen?: boolean
  disabled?: boolean
  /** Elevation shadow. Defaults to 'none'. */
  shadow?: CollapsibleShadow
  class?: string
}

export interface CollapsibleEmits {
  'update:modelValue': [value: boolean]
}
