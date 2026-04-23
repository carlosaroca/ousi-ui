export type SkeletonAnimation = 'shimmer' | 'pulse' | 'none'
export type SkeletonShadow = 'none' | 'xs' | 'sm'

export interface SkeletonProps {
  /** Animation type. */
  animation?: SkeletonAnimation
  /** Elevation shadow. Defaults to 'none'. */
  shadow?: SkeletonShadow
  /** Additional CSS classes for dimensions and radius. */
  class?: string
}
