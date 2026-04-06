export type TagInputSize = 'sm' | 'md' | 'lg'
export type TagInputColor = 'accent' | 'success' | 'warning' | 'danger' | 'default'

export interface TagInputProps {
  /** Tags array (v-model). */
  modelValue?: string[]
  /** Default tags when uncontrolled. */
  defaultValue?: string[]
  /** Placeholder shown when no tags and input is empty. */
  placeholder?: string
  /** Label text above the field. */
  label?: string
  /** Helper text below the field. */
  description?: string
  /** Error message — activates error state. */
  errorMessage?: string
  /** Field name for form context. */
  name?: string
  /** Size of the field and chips. */
  size?: TagInputSize
  /** Color of the tag chips. */
  color?: TagInputColor
  /** Visual variant (matches Input). */
  variant?: 'primary' | 'secondary'
  /** Max number of tags. */
  maxTags?: number
  /** Allow duplicate tags. */
  allowDuplicates?: boolean
  /** Required field. */
  required?: boolean
  /** Disable the field. */
  disabled?: boolean
  /** Additional CSS classes. */
  class?: string
}

export interface TagInputEmits {
  'update:modelValue': [value: string[]]
  'add': [tag: string]
  'remove': [tag: string]
}
