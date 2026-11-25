import { computed, ref } from 'vue'

/** The way back to where the panel came from. */
export type SwipeDirection = 'up' | 'down' | 'left' | 'right'

interface SwipeDismissOptions {
  /** Undefined turns swiping off. */
  direction: () => SwipeDirection | undefined
  panel: () => HTMLElement | null
  onDismiss: () => void
}

/** Let go past this share of the panel, and it leaves. */
const FAR = 0.4
/** Never less than this many px, so a small panel does not leave at a touch. */
const NEAR = 48
/** A flick: this fast, in px per ms, over at least `FLICK_DISTANCE` px. */
const FLICK = 0.5
const FLICK_DISTANCE = 24
/** The speed is that of the last moments before letting go, in ms. */
const RECENT = 100

const HANDLE = '[data-drawer-handle]'
/** What takes a drag for itself: writing, picking text, moving a thumb. */
const OWN_DRAG =
  'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="slider"], [data-swipe-ignore]'

const isVertical = (direction: SwipeDirection) => direction === 'up' || direction === 'down'

/** Whether something between `from` and the panel moves its own content when dragged this way. */
function ownsGesture(from: Element, panel: Element, direction: SwipeDirection): boolean {
  if (from.closest(OWN_DRAG)) return true
  const vertical = isVertical(direction)

  for (let el: Element | null = from; el && el !== panel.parentElement; el = el.parentElement) {
    if (!(el instanceof HTMLElement)) continue
    const style = getComputedStyle(el)
    // It handles this gesture in script, like a crop box or a colour area.
    if (style.touchAction === 'none' || style.touchAction === (vertical ? 'pan-x' : 'pan-y')) return true

    const room = vertical ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth
    const overflow = vertical ? style.overflowY : style.overflowX
    if (room <= 1 || (overflow !== 'auto' && overflow !== 'scroll')) continue
    // Right to left, a scroll position counts down from 0.
    const at = vertical ? el.scrollTop : style.direction === 'rtl' ? room + el.scrollLeft : el.scrollLeft
    // A finger moving down or right brings back what is above or to the left.
    if (direction === 'down' || direction === 'right' ? at > 0 : at < room - 1) return true
  }
  return false
}

/**
 * Drag a panel back the way it came to dismiss it. A mouse drags it by its handle only, which leaves
 * text free to be selected; a finger swipes from anywhere that does not need the gesture itself, so
 * content scrolls first and the panel follows once there is nothing left to scroll.
 */
export function useSwipeDismiss(options: SwipeDismissOptions) {
  /** How far the panel has been pulled, in px, towards where it leaves. */
  const offset = ref(0)
  const dragging = ref(false)
  const size = ref(0)

  interface Gesture {
    pointer?: number
    x: number
    y: number
    target: Element
    claimed: boolean
    samples: { at: number; along: number }[]
  }
  let gesture: Gesture | undefined

  function begin(x: number, y: number, target: Element, pointer?: number) {
    gesture = { pointer, x, y, target, claimed: false, samples: [{ at: performance.now(), along: 0 }] }
  }

  /** Follows the gesture. True once it is a swipe, so the page must not scroll with it. */
  function follow(x: number, y: number): boolean {
    const current = gesture
    const direction = options.direction()
    const panel = options.panel()
    if (!current || !direction || !panel) return false

    const dx = x - current.x
    const dy = y - current.y
    const along = { down: dy, up: -dy, right: dx, left: -dx }[direction]

    if (!current.claimed) {
      const across = Math.abs(isVertical(direction) ? dx : dy)
      if (along === 0 && across === 0) return false
      const onHandle = !!current.target.closest(HANDLE)
      if (along <= 0 || across > along || (!onHandle && ownsGesture(current.target, panel, direction))) {
        gesture = undefined
        return false
      }
      current.claimed = true
      dragging.value = true
      size.value = isVertical(direction) ? panel.offsetHeight : panel.offsetWidth
    }

    const at = performance.now()
    current.samples = [...current.samples.filter((s) => at - s.at <= RECENT), { at, along }]
    offset.value = Math.max(along, 0)
    return true
  }

  function release() {
    const current = gesture
    gesture = undefined
    if (!current?.claimed) return
    dragging.value = false

    const now = performance.now()
    const recent = current.samples.filter((s) => now - s.at <= RECENT)
    const [first, last] = [recent[0], recent.at(-1)]
    const speed = first && last && last.at > first.at ? (last.along - first.along) / (last.at - first.at) : 0

    const flung = speed > FLICK && offset.value > FLICK_DISTANCE
    // Thrown back towards its place, it stays, however far it had been pulled.
    const returned = speed < -FLICK / 2
    if (!returned && (flung || offset.value > Math.max(size.value * FAR, NEAR))) options.onDismiss()
    else offset.value = 0
  }

  function cancel() {
    gesture = undefined
    dragging.value = false
    offset.value = 0
  }

  /* ── Mouse and pen: by the handle ──────────────────────────────── */

  function onPointerdown(event: PointerEvent) {
    const target = event.target as Element
    if (event.pointerType === 'touch' || event.button > 0 || !options.direction()) return
    if (!target.closest(HANDLE)) return
    event.preventDefault() // no text gets selected on the way
    ;(event.currentTarget as Element).setPointerCapture?.(event.pointerId)
    begin(event.clientX, event.clientY, target, event.pointerId)
  }
  const isFollowed = (event: PointerEvent) => event.pointerType !== 'touch' && gesture?.pointer === event.pointerId
  function onPointermove(event: PointerEvent) {
    if (isFollowed(event)) follow(event.clientX, event.clientY)
  }
  function onPointerup(event: PointerEvent) {
    if (isFollowed(event)) release()
  }
  function onPointercancel(event: PointerEvent) {
    if (isFollowed(event)) cancel()
  }

  /* ── Fingers: from anywhere. Touch events, because only they can hold a scroll back ── */

  function onTouchstart(event: TouchEvent) {
    if (event.touches.length > 1) return cancel()
    if (!options.direction()) return
    const [touch] = event.touches
    begin(touch.clientX, touch.clientY, event.target as Element)
  }
  function onTouchmove(event: TouchEvent) {
    if (event.touches.length > 1) return cancel()
    const [touch] = event.touches
    if (follow(touch.clientX, touch.clientY) && event.cancelable) event.preventDefault()
  }

  return {
    offset,
    dragging,
    /** From 0, in place, to 1, pulled by its whole size. */
    progress: computed(() => (size.value ? Math.min(offset.value / size.value, 1) : 0)),
    reset: cancel,
    handlers: {
      pointerdown: onPointerdown,
      pointermove: onPointermove,
      pointerup: onPointerup,
      pointercancel: onPointercancel,
      touchstart: onTouchstart,
      touchmove: onTouchmove,
      touchend: release,
      touchcancel: cancel,
    },
  }
}
