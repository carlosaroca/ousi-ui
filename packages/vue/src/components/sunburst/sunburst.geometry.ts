import { pointAt, toDegrees, toRadians } from '../chart-shared/arc'

export interface Sector {
  /** Angles in degrees, 0° at 3 o'clock, clockwise. */
  from: number
  to: number
  inner: number
  outer: number
}

const n = (value: number) => Number(value.toFixed(3))

/** A whole ring: two circles, the inner one cut out by the even-odd rule. */
function ringPath({ inner, outer }: Sector): string {
  const circle = (r: number) => `M${n(50 - r)},50a${n(r)},${n(r)} 0 1 0 ${n(2 * r)},0a${n(r)},${n(r)} 0 1 0 ${n(-2 * r)},0Z`
  return circle(outer) + circle(inner)
}

/**
 * The outline of a piece of a ring with soft corners, keeping half the gap clear on each side. The
 * clearance is a width and not an angle, so the two sides of a gap stay parallel from the inner edge
 * to the outer one. Null when nothing would be left to see.
 */
export function sectorPath(sector: Sector, gap: number, corner: number): string | null {
  const { from, to } = sector
  const half = Math.max(gap, 0) / 2
  const inner = sector.inner + half
  const outer = sector.outer - half
  if (to - from >= 359.999) return ringPath({ ...sector, inner, outer })

  const span = to - from
  const turn = (r: number, side: number) => Math.min(span / 2, toDegrees(Math.asin(Math.min(1, side / r))))
  // What is left of the inner edge, the shortest one, once the gap is taken from it.
  const room = ((span * Math.PI) / 180) * inner - 2 * half
  if (room <= 0.15 || outer - inner <= 0.15) return null
  const c = Math.max(0, Math.min(corner, room / 2.05, (outer - inner) / 2.05))

  const at = (degrees: number, r: number) => {
    const { x, y } = pointAt(degrees, r)
    return `${x},${y}`
  }
  // A point on a straight side: `along` from the centre, `side` away from the sector's boundary.
  const onSide = (degrees: number, along: number, side: number) => {
    const a = (degrees * Math.PI) / 180
    return `${n(50 + Math.cos(a) * along - Math.sin(a) * side)},${n(50 + Math.sin(a) * along + Math.cos(a) * side)}`
  }
  const along = (r: number, side: number) => Math.sqrt(Math.max(r * r - side * side, 0))

  const outerFrom = from + turn(outer - c, half + c)
  const outerTo = to - turn(outer - c, half + c)
  const innerFrom = from + turn(inner + c, half + c)
  const innerTo = to - turn(inner + c, half + c)
  const arc = (r: number, end: number, start: number, sweep: 0 | 1) =>
    `A${n(r)},${n(r)} 0 ${Math.abs(end - start) > 180 ? 1 : 0} ${sweep} ${at(end, r)}`
  const soft = (end: string) => (c > 0 ? `A${n(c)},${n(c)} 0 0 1 ${end}` : `L${end}`)

  return (
    `M${at(outerFrom, outer)}` +
    arc(outer, outerTo, outerFrom, 1) +
    soft(onSide(to, along(outer - c, half + c), -half)) +
    `L${onSide(to, along(inner + c, half + c), -half)}` +
    soft(at(innerTo, inner)) +
    arc(inner, innerFrom, innerTo, 0) +
    soft(onSide(from, along(inner + c, half + c), half)) +
    `L${onSide(from, along(outer - c, half + c), half)}` +
    soft(at(outerFrom, outer)) +
    'Z'
  )
}

export interface SectorLabel {
  text: string
  /** Written along the arc, or outwards along the radius. */
  along: 'arc' | 'radius'
  transform: string
}

/** A cut name keeps at least this many letters, or it says nothing and is not written. */
const FEWEST_LETTERS = 4

/**
 * Where a name goes on a sector: along the arc if it fits whole, else along the radius, else cut on
 * whichever has more room. Upright on both sides of the chart.
 */
export function sectorLabel(name: string, sector: Sector, gap: number, font: number): SectorLabel | undefined {
  const { from, to, inner, outer } = sector
  const radius = (inner + outer) / 2
  const thickness = outer - inner - gap
  const length = toRadians(to - from) * radius - gap
  const character = font * 0.56
  const line = font * 1.3

  // A straight line of text leaves a curved band if it is too long: it may stray by half of what the
  // band has to spare.
  const spare = thickness - line
  const arcRoom = spare < 0 ? 0 : Math.max(Math.min(length - 1.5, Math.sqrt(8 * radius * (spare / 2 + 0.4))), 0)
  const radiusRoom = length < line ? 0 : thickness - 1.6

  const need = name.length * character
  const along: SectorLabel['along'] =
    need <= arcRoom ? 'arc' : need <= radiusRoom ? 'radius' : arcRoom >= radiusRoom ? 'arc' : 'radius'
  const room = along === 'arc' ? arcRoom : radiusRoom

  let text = name
  if (need > room) {
    const letters = Math.floor(room / character) - 1
    if (letters < FEWEST_LETTERS) return undefined
    text = `${name.slice(0, letters).trimEnd()}…`
  }

  const angle = (from + to) / 2
  const turned = ((angle % 360) + 360) % 360
  // Along the arc a name is upside down in the lower half; along the radius, in the left one.
  const turn = along === 'arc' ? (turned > 0 && turned < 180 ? -90 : 90) : turned > 90 && turned < 270 ? 180 : 0
  return { text, along, transform: `translate(50 50) rotate(${angle}) translate(${radius} 0) rotate(${turn})` }
}
