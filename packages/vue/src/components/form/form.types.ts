export type ValidationBehavior = 'native' | 'aria'

export interface FormProps {
  /** HTML form action URL. */
  action?: string
  /** HTTP method. */
  method?: 'get' | 'post'
  /** Encoding type. */
  encType?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain'
  /** Target window. */
  target?: '_self' | '_blank' | '_parent' | '_top'
  /** Validation behavior. */
  validationBehavior?: ValidationBehavior
  /** Server-side validation errors keyed by field name. */
  validationErrors?: Record<string, string | string[]>
  /** Accessible label. */
  ariaLabel?: string
  /** ID of labelling element. */
  ariaLabelledby?: string
  /** Additional CSS classes. */
  class?: string
}

export interface FormEmits {
  'submit': [event: SubmitEvent]
  'reset': [event: Event]
  'invalid': [event: Event]
}
