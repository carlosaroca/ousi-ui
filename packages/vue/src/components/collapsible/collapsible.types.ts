export interface CollapsibleProps {
  modelValue?: boolean
  defaultOpen?: boolean
  disabled?: boolean
  class?: string
}

export interface CollapsibleEmits {
  'update:modelValue': [value: boolean]
}
