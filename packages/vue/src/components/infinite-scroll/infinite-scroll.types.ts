export interface InfiniteScrollProps {
  loading?: boolean
  disabled?: boolean
  threshold?: number
  class?: string
}

export interface InfiniteScrollEmits {
  'load-more': []
}
