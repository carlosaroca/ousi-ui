export interface DisclosureProps {
  /** Controlled open state (v-model). */
  modelValue?: boolean
  /** Whether the disclosure starts open. */
  defaultOpen?: boolean
  /** Disable the disclosure. */
  disabled?: boolean
  /** Additional CSS classes. */
  class?: string
}

export interface DisclosureEmits {
  'update:modelValue': [value: boolean]
  'change': [value: boolean]
}

export interface DisclosureGroupProps {
  /** Controlled list of expanded item keys (v-model). */
  modelValue?: string[]
  /** Keys of items expanded by default. */
  defaultExpandedKeys?: string[]
  /** Allow multiple items open at once. Default: false. */
  allowMultiple?: boolean
  /** Additional CSS classes. */
  class?: string
}

export interface DisclosureGroupEmits {
  'update:modelValue': [value: string[]]
  'change': [value: string[]]
}
