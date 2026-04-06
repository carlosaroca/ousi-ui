export type SkeletonAnimation = 'shimmer' | 'pulse' | 'none'

export interface SkeletonProps {
  /** Animation type. */
  animation?: SkeletonAnimation
  /** Additional CSS classes for dimensions and radius. */
  class?: string
}
