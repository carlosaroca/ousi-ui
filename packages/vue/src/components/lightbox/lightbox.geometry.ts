export interface Point {
  x: number
  y: number
}
export interface Size {
  width: number
  height: number
}
/** How the picture is shown: its zoom, and how far its centre is from the centre of the stage. */
export interface View extends Point {
  scale: number
}

export const AT_REST: View = { scale: 1, x: 0, y: 0 }

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

/**
 * A picture moves only as far as it hangs over the stage on each side: no empty band can be dragged
 * into view, and one that fits stays in the middle.
 */
export function clampPan(view: View, picture: Size, stage: Size): View {
  const reach = (of: number, within: number) => Math.max((of * view.scale - within) / 2, 0)
  const across = reach(picture.width, stage.width)
  const down = reach(picture.height, stage.height)
  // Adding 0 turns -0 into 0.
  return { scale: view.scale, x: clamp(view.x, -across, across) + 0, y: clamp(view.y, -down, down) + 0 }
}

/** Zooms to `scale`, keeping what is under `at` (from the centre of the stage) where it is. */
export function zoomAt(view: View, scale: number, at: Point): View {
  const by = scale / view.scale
  return { scale, x: at.x - (at.x - view.x) * by, y: at.y - (at.y - view.y) * by }
}

export const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y)
export const middle = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })
