/**
 * The arithmetic of the editor, with no DOM. Everything is in pixels of the picture as it is shown:
 * after turning and mirroring it.
 */

export interface Size {
  width: number
  height: number
}

export interface Rect extends Size {
  x: number
  y: number
}

export type QuarterTurn = 0 | 90 | 180 | 270

/** How the picture is turned: first rotated clockwise, then mirrored as it appears on screen. */
export interface Orientation {
  rotation: QuarterTurn
  flipX: boolean
  flipY: boolean
}

export interface EditState extends Orientation {
  crop: Rect
}

export type Handle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function turnedSize(natural: Size, rotation: QuarterTurn): Size {
  return rotation % 180 === 0
    ? { width: natural.width, height: natural.height }
    : { width: natural.height, height: natural.width }
}

/** The largest rectangle of a ratio (width / height) that fits, centred. Without ratio, everything. */
export function largestCrop(bounds: Size, ratio?: number): Rect {
  if (!ratio) return { x: 0, y: 0, ...bounds }
  const width = Math.min(bounds.width, bounds.height * ratio)
  const height = width / ratio
  return { x: (bounds.width - width) / 2, y: (bounds.height - height) / 2, width, height }
}

/** Keeps a crop inside the picture, moving it without changing its size. */
export function moveCrop(crop: Rect, dx: number, dy: number, bounds: Size): Rect {
  return {
    ...crop,
    x: clamp(crop.x + dx, 0, bounds.width - crop.width),
    y: clamp(crop.y + dy, 0, bounds.height - crop.height),
  }
}

/** The smallest side a crop may have: small, but still something that can be grabbed. */
export const smallestSide = (bounds: Size) => Math.max(1, Math.min(32, bounds.width, bounds.height))

/**
 * Zooming in makes the crop smaller; the view then enlarges it to fill the stage. `focus` is the
 * point that stays put, as a fraction of the crop: its middle by default.
 */
export function zoomCrop(
  crop: Rect,
  factor: number,
  bounds: Size,
  focus: { x: number; y: number } = { x: 0.5, y: 0.5 },
): Rect {
  const ratio = crop.width / crop.height
  const largest = largestCrop(bounds, ratio)
  const least = smallestSide(bounds)
  const minWidth = Math.min(largest.width, Math.max(least, least * ratio))
  const width = clamp(crop.width / factor, minWidth, largest.width)
  const height = width / ratio
  return moveCrop(
    {
      x: crop.x + (crop.width - width) * focus.x,
      y: crop.y + (crop.height - height) * focus.y,
      width,
      height,
    },
    0,
    0,
    bounds,
  )
}

/** 1 when the crop is as large as its shape allows; 2 when it shows half that width. */
export function zoomOf(crop: Rect, bounds: Size): number {
  return largestCrop(bounds, crop.width / crop.height).width / crop.width
}

export const setZoom = (crop: Rect, zoom: number, bounds: Size) =>
  zoomCrop(crop, zoom / zoomOf(crop, bounds), bounds)

/** Drags one handle by (dx, dy). With a ratio, the opposite corner or side stays where it is. */
export function resizeCrop(
  crop: Rect,
  handle: Handle,
  dx: number,
  dy: number,
  bounds: Size,
  ratio?: number,
): Rect {
  const west = handle.includes('w')
  const east = handle.includes('e')
  const north = handle.includes('n')
  const south = handle.includes('s')
  const least = smallestSide(bounds)

  if (!ratio) {
    let left = crop.x
    let top = crop.y
    let right = crop.x + crop.width
    let bottom = crop.y + crop.height
    if (west) left = clamp(left + dx, 0, right - least)
    if (east) right = clamp(right + dx, left + least, bounds.width)
    if (north) top = clamp(top + dy, 0, bottom - least)
    if (south) bottom = clamp(bottom + dy, top + least, bounds.height)
    return { x: left, y: top, width: right - left, height: bottom - top }
  }

  // The side that stays, and on a side handle the middle of the other axis.
  const anchorX = west ? crop.x + crop.width : east ? crop.x : crop.x + crop.width / 2
  const anchorY = north ? crop.y + crop.height : south ? crop.y : crop.y + crop.height / 2

  const grownX = east ? dx : west ? -dx : 0
  const grownY = south ? dy : north ? -dy : 0
  // On a corner, whichever axis the pointer pushed further decides.
  const byWidth = (east || west) && (!(north || south) || Math.abs(grownX) >= Math.abs(grownY * ratio))
  const wanted = byWidth ? crop.width + grownX : (crop.height + grownY) * ratio

  const roomX = west ? anchorX : east ? bounds.width - anchorX : 2 * Math.min(anchorX, bounds.width - anchorX)
  const roomY = north ? anchorY : south ? bounds.height - anchorY : 2 * Math.min(anchorY, bounds.height - anchorY)
  const most = Math.min(roomX, roomY * ratio)
  const width = clamp(wanted, Math.min(most, Math.max(least, least * ratio)), most)
  const height = width / ratio

  return {
    x: west ? anchorX - width : east ? anchorX : anchorX - width / 2,
    y: north ? anchorY - height : south ? anchorY : anchorY - height / 2,
    width,
    height,
  }
}

/** Gives a crop a new shape around its middle, as large as the old one allows. */
export function reshapeCrop(crop: Rect, ratio: number | undefined, bounds: Size): Rect {
  if (!ratio) return crop
  const largest = largestCrop(bounds, ratio)
  // The same area, so changing shape back and forth does not shrink the crop each time.
  const width = Math.min(largest.width, Math.sqrt(crop.width * crop.height * ratio))
  const height = width / ratio
  return moveCrop(
    { x: crop.x + (crop.width - width) / 2, y: crop.y + (crop.height - height) / 2, width, height },
    0,
    0,
    bounds,
  )
}

/**
 * Turns what is on screen a quarter turn, the crop with it, so the same part stays framed. Turning
 * after mirroring is the same as mirroring the other way after turning, hence the swapped flips.
 */
export function rotateEdit(state: EditState, natural: Size, clockwise: boolean): EditState {
  const bounds = turnedSize(natural, state.rotation)
  const { x, y, width, height } = state.crop
  const crop = clockwise
    ? { x: bounds.height - (y + height), y: x, width: height, height: width }
    : { x: y, y: bounds.width - (x + width), width: height, height: width }
  return {
    rotation: ((state.rotation + (clockwise ? 90 : 270)) % 360) as QuarterTurn,
    flipX: state.flipY,
    flipY: state.flipX,
    crop,
  }
}

/** Mirrors what is on screen, the crop with it. */
export function flipEdit(state: EditState, natural: Size, axis: 'horizontal' | 'vertical'): EditState {
  const bounds = turnedSize(natural, state.rotation)
  const crop = { ...state.crop }
  if (axis === 'horizontal') crop.x = bounds.width - (crop.x + crop.width)
  else crop.y = bounds.height - (crop.y + crop.height)
  return {
    ...state,
    flipX: axis === 'horizontal' ? !state.flipX : state.flipX,
    flipY: axis === 'vertical' ? !state.flipY : state.flipY,
    crop,
  }
}

export function initialEdit(natural: Size, ratio?: number): EditState {
  return { rotation: 0, flipX: false, flipY: false, crop: largestCrop(natural, ratio) }
}

/** Whether the picture would come out as it went in. */
export function isUntouched(state: EditState, natural: Size): boolean {
  const { crop } = state
  return (
    state.rotation === 0 &&
    !state.flipX &&
    !state.flipY &&
    Math.round(crop.x) === 0 &&
    Math.round(crop.y) === 0 &&
    Math.round(crop.width) === natural.width &&
    Math.round(crop.height) === natural.height
  )
}

/** The crop in whole pixels, never outside the picture. */
export function pixelCrop(crop: Rect, bounds: Size): Rect {
  const x = clamp(Math.round(crop.x), 0, bounds.width - 1)
  const y = clamp(Math.round(crop.y), 0, bounds.height - 1)
  return {
    x,
    y,
    width: clamp(Math.round(crop.width), 1, bounds.width - x),
    height: clamp(Math.round(crop.height), 1, bounds.height - y),
  }
}

/** Where the picture goes on the stage: the crop centred and as large as the stage lets it be. */
export function viewOf(crop: Rect, stage: Size, padding: number) {
  const scale = Math.max(
    0,
    Math.min((stage.width - 2 * padding) / crop.width, (stage.height - 2 * padding) / crop.height),
  )
  return {
    scale,
    /** Position of the picture's top left corner. */
    x: stage.width / 2 - (crop.x + crop.width / 2) * scale,
    y: stage.height / 2 - (crop.y + crop.height / 2) * scale,
  }
}
