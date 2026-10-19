/**
 * The layer behind dialogs and drawers. Colors come from theme tokens (`--ousi-backdrop`,
 * `--ousi-backdrop-subtle`, `--ousi-backdrop-glass`) so an app can tune them per mode.
 */
export type OverlayBackdrop = 'opaque' | 'subtle' | 'blur' | 'glass' | 'transparent'

export const backdropVariants: Record<OverlayBackdrop, string> = {
  opaque: 'bg-ousi-backdrop',
  subtle: 'bg-ousi-backdrop-subtle',
  blur: 'bg-ousi-backdrop-subtle backdrop-blur-md',
  glass: 'bg-ousi-backdrop-glass backdrop-blur-xl backdrop-saturate-150',
  transparent: 'bg-transparent',
}
