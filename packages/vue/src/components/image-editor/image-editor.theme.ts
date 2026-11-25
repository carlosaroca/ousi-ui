import { cva } from 'class-variance-authority'

// Its height is a variable, so an app can give the stage more or less room.
export const imageEditorStageTheme =
  'relative w-full touch-none select-none overflow-hidden rounded-ousi-xl bg-ousi-default h-[var(--image-editor-height,min(52dvh,22rem))]'

/** The frame. Its huge shadow is what dims everything outside it. */
export const imageEditorFrameTheme = cva(
  [
    'absolute cursor-move outline-none',
    'shadow-[0_0_0_1px_rgb(255_255_255/0.9),0_0_0_100vmax_rgb(0_0_0/0.55)]',
    'focus-visible:shadow-[0_0_0_2px_var(--ousi-focus),0_0_0_100vmax_rgb(0_0_0/0.55)]',
  ],
  {
    variants: {
      shape: { rect: '', circle: 'rounded-full' },
    },
    defaultVariants: { shape: 'rect' },
  },
)

/** A 44px target around each corner and side, easy to catch with a finger. */
export const imageEditorHandleTheme = cva('absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center', {
  variants: {
    handle: {
      nw: 'left-0 top-0 cursor-nwse-resize',
      n: 'left-1/2 top-0 cursor-ns-resize',
      ne: 'left-full top-0 cursor-nesw-resize',
      e: 'left-full top-1/2 cursor-ew-resize',
      se: 'left-full top-full cursor-nwse-resize',
      s: 'left-1/2 top-full cursor-ns-resize',
      sw: 'left-0 top-full cursor-nesw-resize',
      w: 'left-0 top-1/2 cursor-ew-resize',
    },
  },
})

/** The white mark of a handle: a corner angle or a short bar. */
export const imageEditorMarkTheme = cva('block drop-shadow-[0_0_2px_rgb(0_0_0/0.5)]', {
  variants: {
    handle: {
      nw: 'size-4 translate-x-[7px] translate-y-[7px] border-l-[3px] border-t-[3px] border-white',
      ne: 'size-4 -translate-x-[7px] translate-y-[7px] border-r-[3px] border-t-[3px] border-white',
      se: 'size-4 -translate-x-[7px] -translate-y-[7px] border-b-[3px] border-r-[3px] border-white',
      sw: 'size-4 translate-x-[7px] -translate-y-[7px] border-b-[3px] border-l-[3px] border-white',
      n: 'h-[3px] w-5 rounded-full bg-white',
      s: 'h-[3px] w-5 rounded-full bg-white',
      e: 'h-5 w-[3px] rounded-full bg-white',
      w: 'h-5 w-[3px] rounded-full bg-white',
    },
  },
})
