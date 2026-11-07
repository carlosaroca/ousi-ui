const STEPS = [1, 2, 2.5, 5, 10]

/** Nice axis domain with exactly `n` intervals, so two axes share the same grid lines. */
export function niceDomain(min: number, max: number, n = 4, fixedMin?: number): { lo: number; hi: number; step: number } {
  if (!isFinite(min) || !isFinite(max)) return { lo: 0, hi: n, step: 1 }
  if (max === min) max = min + 1
  const raw = (max - (fixedMin ?? min)) / n
  const mag = Math.pow(10, Math.floor(Math.log10(raw)))
  for (let k = 0; k < 40; k++) {
    const step = STEPS[k % STEPS.length] * mag * Math.pow(10, Math.floor(k / STEPS.length))
    const lo = fixedMin ?? Math.floor(min / step) * step
    if (lo + n * step >= max - 1e-9) return { lo, hi: lo + n * step, step }
  }
  return { lo: fixedMin ?? min, hi: max, step: (max - min) / n }
}

/** Monotone cubic interpolation (no overshoot) as an SVG path. */
export function monotonePath(pts: [number, number][]): string {
  const n = pts.length
  if (n === 0) return ''
  if (n === 1) return `M${pts[0][0]},${pts[0][1]}`
  const dx: number[] = []
  const m: number[] = []
  for (let i = 0; i < n - 1; i++) {
    dx.push(pts[i + 1][0] - pts[i][0])
    m.push((pts[i + 1][1] - pts[i][1]) / (dx[i] || 1))
  }
  const t: number[] = [m[0]]
  for (let i = 1; i < n - 1; i++) t.push(m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2)
  t.push(m[n - 2])
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) { t[i] = 0; t[i + 1] = 0; continue }
    const a = t[i] / m[i]
    const b = t[i + 1] / m[i]
    const s = a * a + b * b
    if (s > 9) {
      const k = 3 / Math.sqrt(s)
      t[i] = k * a * m[i]
      t[i + 1] = k * b * m[i]
    }
  }
  let d = `M${pts[0][0]},${pts[0][1]}`
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3
    d += `C${pts[i][0] + h},${pts[i][1] + t[i] * h} ${pts[i + 1][0] - h},${pts[i + 1][1] - t[i + 1] * h} ${pts[i + 1][0]},${pts[i + 1][1]}`
  }
  return d
}

export function linearPath(pts: [number, number][]): string {
  return pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join('')
}

/** Bar with rounded top corners, and optionally rounded bottom corners too. */
export function barPath(x: number, y: number, w: number, h: number, radius: number, roundBottom = false): string {
  const r = Math.max(Math.min(radius, w / 2, roundBottom ? h / 2 : h), 0)
  const base = y + h
  if (r === 0) return `M${x},${base}V${y}H${x + w}V${base}Z`
  if (roundBottom) {
    return `M${x},${y + r}A${r},${r} 0 0 1 ${x + r},${y}H${x + w - r}A${r},${r} 0 0 1 ${x + w},${y + r}V${base - r}A${r},${r} 0 0 1 ${x + w - r},${base}H${x + r}A${r},${r} 0 0 1 ${x},${base - r}Z`
  }
  return `M${x},${base}V${y + r}A${r},${r} 0 0 1 ${x + r},${y}H${x + w - r}A${r},${r} 0 0 1 ${x + w},${y + r}V${base}Z`
}
