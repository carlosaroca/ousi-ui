/**
 * The arithmetic of ring charts whose segments have round ends. Units are those of a viewBox centred
 * on (50, 50); angles are in degrees, 0° at 3 o'clock, clockwise.
 *
 * Each segment is a line with round ends, and one ends exactly where the next begins: the two round
 * ends fall on the same circle, so a joint has no lumps. A segment is cut around the round start of
 * the one that follows, which fills the cut; to separate them, the cut is wider by an even ring.
 */

export const toRadians = (degrees: number) => (degrees * Math.PI) / 180
export const toDegrees = (radians: number) => (radians * 180) / Math.PI

/**
 * Splits `room` degrees in proportion to `sizes`, giving every positive size at least `least`, so a
 * tiny segment can still be seen. What that takes comes out of the larger ones.
 */
export function shareArc(sizes: number[], room: number, least: number): number[] {
  const available = Math.max(room, 0)
  const count = sizes.filter((size) => size > 0).length
  const floor = Math.min(least, available / Math.max(count, 1))
  const small = new Set<number>()

  for (;;) {
    const free = available - small.size * floor
    const sum = sizes.reduce((total, size, i) => (small.has(i) || size <= 0 ? total : total + size), 0)
    const tooSmall = sizes.flatMap((size, i) =>
      size > 0 && !small.has(i) && (free * size) / sum < floor ? [i] : [],
    )
    if (tooSmall.length === 0) {
      return sizes.map((size, i) => (size <= 0 ? 0 : small.has(i) ? floor : (free * size) / sum))
    }
    for (const i of tooSmall) small.add(i)
  }
}

const rounded = (value: number) => Number(value.toFixed(3))

export function pointAt(degrees: number, radius: number): { x: number; y: number } {
  const angle = toRadians(degrees)
  return { x: rounded(50 + Math.cos(angle) * radius), y: rounded(50 + Math.sin(angle) * radius) }
}

/** A line along the band. Drawn in two halves, so that a whole turn does not collapse to nothing. */
export function arcLine(from: number, to: number, radius: number): string {
  const end = Math.min(to, from + 360)
  const half = (degrees: number, large: boolean) => {
    const { x, y } = pointAt(degrees, radius)
    return `A${radius},${radius} 0 ${large ? 1 : 0} 1 ${x},${y}`
  }
  const middle = (from + end) / 2
  const start = pointAt(from, radius)
  return `M${start.x},${start.y}${half(middle, middle - from > 180)}${half(end, end - middle > 180)}`
}

/**
 * A clip path, to use with `clip-rule="evenodd"`, that keeps everything but a circle. A clip and not
 * a mask: what a clip hides does not take the pointer either, so the segment seen is the one hovered.
 */
export function outsideCircle(x: number, y: number, radius: number): string {
  const r = rounded(radius)
  return `M-20,-20H120V120H-20ZM${rounded(x - r)},${y}a${r},${r} 0 1 0 ${rounded(2 * r)},0a${r},${r} 0 1 0 ${rounded(-2 * r)},0Z`
}

export interface JointedArc {
  /** The line of the segment, from its start to the start of the next one. */
  d: string
  /** Clip that carves its end around what follows, when something does and has to be set apart. */
  clip?: string
  /** The middle of the segment, in degrees. */
  mid: number
}

export interface JointedRing {
  /** The angle each segment is proportional to; 0 leaves it out. */
  sizes: number[]
  start: number
  sweep: number
  radius: number
  thickness: number
  /** Space between two segments, in degrees at the middle of the band. */
  gap: number
  joined: boolean
  /** The shortest a segment may be, past what covers it, as a share of the thickness. */
  least?: number
}

/** The lines and cuts of a ring or an open arc made of segments with round ends. */
export function jointedArcs(ring: JointedRing): (JointedArc | undefined)[] {
  const { radius, thickness, start } = ring
  const sweep = Math.min(ring.sweep, 360)
  const closed = sweep >= 360
  const width = ring.joined || ring.gap <= 0 ? 0 : toRadians(ring.gap) * radius
  const spans = shareArc(ring.sizes, sweep, toDegrees((width + thickness * (ring.least ?? 0.5)) / radius))
  const shown = spans.flatMap((span, i) => (span > 0 ? [i] : []))

  let cursor = start
  return spans.map((span, i) => {
    const from = cursor
    const to = (cursor += span)
    if (span <= 0) return undefined

    const followed = shown.length > 1 && (closed || i !== shown.at(-1))
    // Joined segments are cut too: two that lie on each other show it as soon as one is faded, and
    // at the close of a circle the last one would lie over the first. That cut is a hair narrow, so
    // no seam of background shows.
    const cut = !followed ? undefined : width > 0 ? thickness / 2 + width : thickness / 2 - 0.1
    const next = pointAt(to, radius)
    return {
      d: arcLine(from, to, radius),
      clip: cut === undefined ? undefined : outsideCircle(next.x, next.y, cut),
      mid: from + span / 2,
    }
  })
}
