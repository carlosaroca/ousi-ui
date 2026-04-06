export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'
export type AvatarShape = 'circle' | 'square'

export interface AvatarProps {
  /** URL of the avatar image. */
  src?: string
  /** Alt text for the image. */
  alt?: string
  /** Full name used to generate initials as fallback. */
  name?: string
  /** Size of the avatar. */
  size?: AvatarSize
  /** Shape of the avatar. */
  shape?: AvatarShape
  /** Additional CSS classes (merged, never replaced). */
  class?: string
}

export interface AvatarSlots {
  /** Custom fallback content when image fails and no name is provided. */
  fallback?: () => unknown
}
