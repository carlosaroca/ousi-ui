export type ResizableDirection = 'horizontal' | 'vertical'

export interface ResizableProps {
  direction?: ResizableDirection
  defaultSize?: number
  minSize?: number
  maxSize?: number
  class?: string
}

export interface ResizableEmits {
  'resize': [size: number]
}
