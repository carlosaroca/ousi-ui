export type TextareaShadow = 'none' | 'xs' | 'sm' | 'md'

export interface TextareaProps {
  /** Controlled value (v-model). */
  modelValue?: string
  /** Default value when uncontrolled. */
  defaultValue?: string
  /** Placeholder text. */
  placeholder?: string
  /** Label text. */
  label?: string
  /** Help text below the textarea. */
  description?: string
  /** Field name — used for form context error matching. */
  name?: string
  /** Error message — activates error state. */
  errorMessage?: string
  /** Number of visible rows. Default: 3. */
  rows?: number
  /** Minimum rows for auto-resize. */
  minRows?: number
  /** Maximum rows for auto-resize. 0 = no limit. */
  maxRows?: number
  /** Auto-resize with content. */
  autoResize?: boolean
  /** CSS resize behavior. */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  /** Visual variant. */
  variant?: 'primary' | 'secondary'
  /** Elevation shadow. Defaults to 'xs'. */
  shadow?: TextareaShadow
  /** Enable tactile press animation (scale on focus). Defaults to false. */
  animated?: boolean
  /** Whether the textarea is disabled. */
  disabled?: boolean
  /** Whether the textarea is read-only. */
  readonly?: boolean
  /** Whether the textarea is required. */
  required?: boolean
  /** Additional CSS classes. */
  class?: string
}

export interface TextareaEmits {
  'update:modelValue': [value: string]
  'change': [value: string]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}
