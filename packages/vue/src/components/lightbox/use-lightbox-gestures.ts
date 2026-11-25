import { ref, shallowRef } from 'vue'
import { AT_REST, clamp, clampPan, distance, middle, zoomAt, type Point, type Size, type View } from './lightbox.geometry'

interface GestureOptions {
  stage: () => HTMLElement | null
  picture: () => HTMLElement | null
  zoomable: () => boolean
  maxZoom: () => number
  /** Whether there is a picture to go to: 1 the next, -1 the one before. */
  canGo: (way: 1 | -1) => boolean
  /** Whether there is more than one picture, so a sideways drag means something. */
  many: () => boolean
  rtl: () => boolean
  onGo: (way: 1 | -1) => void
  canDismiss: () => boolean
  onDismiss: () => void
  /** A tap beside the picture. */
  onTapOutside: () => void
}

/** Movement under this many px is a tap, not a drag. */
const SLOP = 8
/** Past this share of the stage, or this far in px at the least, a sideways drag changes picture. */
const TURN_SHARE = 0.2
const TURN_LEAST = 50
const DISMISS = 120
/** A flick: this fast in px per ms, over at least `FLICK_LEAST` px. */
const FLICK = 0.4
const FLICK_LEAST = 30
const RECENT = 100
const DOUBLE_TAP_MS = 300
const DOUBLE_TAP_PX = 30
/** What a double tap zooms to. */
const TAP_ZOOM = 2.5

type Mode = 'idle' | 'pending' | 'pan' | 'turn' | 'dismiss' | 'pinch' | 'ignored'

/**
 * The gestures on the picture. Two fingers zoom; one pans a zoomed picture, and on one at its normal
 * size turns to the next sideways or throws it away downwards. A double tap zooms in and out, and
 * so does the wheel.
 */
export function useLightboxGestures(options: GestureOptions) {
  const view = shallowRef<View>(AT_REST)
  /** How far a drag has taken the whole picture, to turn the page or to dismiss. */
  const drag = shallowRef<Point>({ x: 0, y: 0 })
  /** True while a pointer moves the picture: it follows at once, without easing. */
  const holding = ref(false)

  const pointers = new Map<number, Point>()
  let mode: Mode = 'idle'
  let start: Point = { x: 0, y: 0 }
  let startView: View = AT_REST
  let pinch = { apart: 1, at: { x: 0, y: 0 } as Point }
  let onPicture = false
  let samples: { at: number; point: Point }[] = []
  let lastTap: { at: number; point: Point } | undefined

  const stageSize = (): Size => {
    const el = options.stage()
    return { width: el?.clientWidth ?? 0, height: el?.clientHeight ?? 0 }
  }
  const pictureSize = (): Size => {
    const el = options.picture()
    return { width: el?.offsetWidth ?? 0, height: el?.offsetHeight ?? 0 }
  }
  /** From the centre of the stage, where the picture's own centre is at rest. */
  function fromCentre(point: Point): Point {
    const box = options.stage()!.getBoundingClientRect()
    return { x: point.x - box.left - box.width / 2, y: point.y - box.top - box.height / 2 }
  }

  function show(next: View) {
    view.value = next.scale <= 1.001 ? AT_REST : clampPan(next, pictureSize(), stageSize())
  }
  function zoomTo(scale: number, at: Point = { x: 0, y: 0 }) {
    if (!options.zoomable()) return
    const to = clamp(scale, 1, Math.max(options.maxZoom(), 1))
    show(zoomAt(view.value, to, at))
  }
  const zoomBy = (factor: number, at?: Point) => zoomTo(view.value.scale * factor, at)
  const pan = (dx: number, dy: number) => show({ ...view.value, x: view.value.x + dx, y: view.value.y + dy })

  function settle() {
    mode = 'idle'
    holding.value = false
    drag.value = { x: 0, y: 0 }
  }
  function reset() {
    pointers.clear()
    lastTap = undefined
    view.value = AT_REST
    settle()
  }
  /** The stage changed size: what was in reach may not be any more. */
  const fit = () => show(view.value)

  function begin(point: Point) {
    start = point
    startView = view.value
    samples = [{ at: performance.now(), point }]
  }

  function onPointerdown(event: PointerEvent) {
    if (event.button > 0 || pointers.size >= 2) return
    const point = { x: event.clientX, y: event.clientY }
    ;(event.currentTarget as Element).setPointerCapture?.(event.pointerId)
    event.preventDefault() // no image gets dragged away, no text selected
    pointers.set(event.pointerId, point)
    holding.value = true
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()]
      mode = options.zoomable() ? 'pinch' : 'ignored'
      pinch = { apart: distance(a, b) || 1, at: middle(a, b) }
      startView = view.value
      drag.value = { x: 0, y: 0 }
      return
    }
    mode = 'pending'
    onPicture = !!options.picture()?.contains(event.target as Node)
    begin(point)
  }

  function onPointermove(event: PointerEvent) {
    if (!pointers.has(event.pointerId)) return
    const point = { x: event.clientX, y: event.clientY }
    pointers.set(event.pointerId, point)

    if (mode === 'pinch') {
      const [a, b] = [...pointers.values()]
      const now = middle(a, b)
      const scale = clamp((startView.scale * distance(a, b)) / pinch.apart, 1, Math.max(options.maxZoom(), 1))
      // What was between the fingers stays between them, wherever they go.
      const zoomed = zoomAt(startView, scale, fromCentre(pinch.at))
      show({ scale, x: zoomed.x + now.x - pinch.at.x, y: zoomed.y + now.y - pinch.at.y })
      return
    }

    const dx = point.x - start.x
    const dy = point.y - start.y
    if (mode === 'pending') {
      if (Math.hypot(dx, dy) < SLOP) return
      if (view.value.scale > 1) mode = 'pan'
      else if (Math.abs(dx) >= Math.abs(dy)) mode = options.many() ? 'turn' : 'ignored'
      else mode = dy > 0 && options.canDismiss() ? 'dismiss' : 'ignored'
    }
    const at = performance.now()
    samples = [...samples.filter((s) => at - s.at <= RECENT), { at, point }]

    if (mode === 'pan') show({ scale: startView.scale, x: startView.x + dx, y: startView.y + dy })
    else if (mode === 'turn') {
      // Dragged towards the left, or the right from right to left, comes the next one.
      const way = (dx < 0) !== options.rtl() ? 1 : -1
      // Where there is nothing to turn to, it gives a little and no more.
      drag.value = { x: options.canGo(way) ? dx : dx * 0.25, y: 0 }
    } else if (mode === 'dismiss') drag.value = { x: 0, y: Math.max(dy, 0) }
  }

  function speed(axis: 'x' | 'y') {
    const now = performance.now()
    const recent = samples.filter((s) => now - s.at <= RECENT)
    const [first, last] = [recent[0], recent.at(-1)]
    return first && last && last.at > first.at ? (last.point[axis] - first.point[axis]) / (last.at - first.at) : 0
  }

  function tap(point: Point) {
    if (!onPicture) {
      lastTap = undefined
      options.onTapOutside()
      return
    }
    const now = performance.now()
    if (lastTap && now - lastTap.at <= DOUBLE_TAP_MS && distance(lastTap.point, point) <= DOUBLE_TAP_PX) {
      lastTap = undefined
      if (view.value.scale > 1) view.value = AT_REST
      else zoomTo(Math.min(TAP_ZOOM, options.maxZoom()), fromCentre(point))
      return
    }
    lastTap = { at: now, point }
  }

  function onPointerup(event: PointerEvent) {
    if (!pointers.delete(event.pointerId)) return
    if (pointers.size === 1) {
      // One finger of a pinch lifted: the other carries on from where things are, without a jump.
      const [left] = [...pointers.values()]
      mode = view.value.scale > 1 ? 'pan' : 'ignored'
      begin(left)
      return
    }
    const ended = mode
    const { x, y } = drag.value
    settle()

    if (ended === 'pending') return tap({ x: event.clientX, y: event.clientY })
    lastTap = undefined
    if (ended === 'turn') {
      const moved = event.clientX - start.x
      const fast = speed('x')
      const flung = Math.abs(fast) > FLICK && Math.abs(moved) > FLICK_LEAST && Math.sign(fast) === Math.sign(moved)
      const far = Math.abs(moved) > Math.max(stageSize().width * TURN_SHARE, TURN_LEAST)
      const way = (moved < 0) !== options.rtl() ? 1 : -1
      if ((far || flung) && x !== 0 && options.canGo(way)) options.onGo(way)
    } else if (ended === 'dismiss') {
      const fast = speed('y')
      // Thrown back up, it stays.
      if (fast > -FLICK / 2 && (y > DISMISS || (fast > FLICK && y > FLICK_LEAST))) options.onDismiss()
    }
  }

  function onPointercancel(event: PointerEvent) {
    if (!pointers.delete(event.pointerId)) return
    if (!pointers.size) settle()
  }

  function onWheel(event: WheelEvent) {
    if (!options.zoomable()) return
    event.preventDefault()
    // A pinch on a trackpad arrives as a wheel with Ctrl, in much smaller steps.
    zoomBy(Math.exp(-event.deltaY * (event.ctrlKey ? 0.01 : 0.002)), fromCentre({ x: event.clientX, y: event.clientY }))
  }

  return {
    view,
    drag,
    holding,
    zoomTo,
    zoomBy,
    pan,
    fit,
    reset,
    handlers: {
      pointerdown: onPointerdown,
      pointermove: onPointermove,
      pointerup: onPointerup,
      pointercancel: onPointercancel,
      wheel: onWheel,
    },
  }
}
