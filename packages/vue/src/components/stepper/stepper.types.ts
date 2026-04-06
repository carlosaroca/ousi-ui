export type StepperOrientation = 'horizontal' | 'vertical'
export type StepperSize = 'sm' | 'md' | 'lg'
export type StepperColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
export type StepState = 'completed' | 'active' | 'upcoming'

export interface StepItem {
  title: string
  description?: string
  key: string
  icon?: string
  disabled?: boolean
}

export interface StepperProps {
  steps: StepItem[]
  modelValue?: number
  defaultValue?: number
  orientation?: StepperOrientation
  size?: StepperSize
  clickable?: boolean
  color?: StepperColor
  class?: string
}

export interface StepperEmits {
  'update:modelValue': [step: number]
  'change': [step: number]
}

/**
 * Stepper slots:
 *
 * - `step` — Custom step circle content. Receives `{ step, index, state }`.
 * - `connector` — Custom connector between steps. Receives `{ index, completed }`.
 * - `content` — Custom content rendered below each step. Receives `{ step, index, state }`.
 * - `step-{key}` — Per-step custom content slot using the step's key. Receives `{ step, index, state }`.
 */
export interface StepperSlots {
  'step': (props: { step: StepItem; index: number; state: StepState }) => any
  'connector': (props: { index: number; completed: boolean }) => any
  'content': (props: { step: StepItem; index: number; state: StepState }) => any
  [key: `step-${string}`]: (props: { step: StepItem; index: number; state: StepState }) => any
}
