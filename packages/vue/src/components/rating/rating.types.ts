export type RatingSize = 'sm' | 'md' | 'lg'
export type RatingColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning'

export interface RatingProps {
  modelValue?: number
  defaultValue?: number
  max?: number
  size?: RatingSize
  color?: RatingColor
  readOnly?: boolean
  disabled?: boolean
  halfStars?: boolean
  class?: string
}

export interface RatingEmits {
  'update:modelValue': [value: number]
  'change': [value: number]
}
