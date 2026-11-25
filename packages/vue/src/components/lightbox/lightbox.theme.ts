// A viewer is dark in a light theme too, so that nothing competes with the picture. Its colours are
// its own; shape, focus and states come from the theme's tokens.
export const lightboxBackdropTheme = 'absolute inset-0 bg-[var(--lightbox-backdrop,rgb(8_8_10_/_0.95))]'

export const lightboxButtonTheme = [
  'flex size-10 shrink-0 items-center justify-center rounded-ousi-4xl bg-white/10 text-white',
  'cursor-(--ousi-cursor-interactive) transition-[background-color,opacity,transform] duration-150 hover:bg-white/20 active:scale-[0.95] motion-reduce:transition-none',
  'outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-ousi-focus focus-visible:outline-offset-[var(--ousi-ring-offset-width)]',
  // aria-disabled and not disabled: a button that reaches its limit keeps the focus it has.
  'aria-disabled:cursor-(--ousi-cursor-disabled) aria-disabled:opacity-(--ousi-disabled-opacity) aria-disabled:hover:bg-white/10 aria-disabled:active:scale-100',
].join(' ')

export const lightboxThumbnailTheme = [
  'size-14 shrink-0 overflow-hidden rounded-ousi-lg border-2 border-solid transition-[opacity,border-color] duration-150',
  'cursor-(--ousi-cursor-interactive) outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-ousi-focus focus-visible:outline-offset-[var(--ousi-ring-offset-width)]',
].join(' ')
