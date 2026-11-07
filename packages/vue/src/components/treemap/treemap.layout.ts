export interface Rect { x: number; y: number; w: number; h: number }

function worst(row: number[], side: number) {
  const s = row.reduce((a, b) => a + b, 0)
  const max = Math.max(...row)
  const min = Math.min(...row)
  return Math.max((side * side * max) / (s * s), (s * s) / (side * side * min))
}

/**
 * Squarified treemap (Bruls et al.). Returns one rect per input value, in the input order.
 * Zero or negative values get an empty rect.
 */
export function squarify(values: number[], box: Rect): Rect[] {
  const out: Rect[] = values.map(() => ({ x: box.x, y: box.y, w: 0, h: 0 }))
  const total = values.reduce((t, v) => t + Math.max(v, 0), 0)
  if (!total || box.w <= 0 || box.h <= 0) return out

  const scale = (box.w * box.h) / total
  const order = values
    .map((v, i) => ({ i, area: Math.max(v, 0) * scale }))
    .filter((o) => o.area > 0)
    .sort((a, b) => b.area - a.area)

  let { x, y, w, h } = box
  let k = 0
  while (k < order.length) {
    const side = Math.min(w, h)
    const row = [order[k]]
    let areas = [order[k].area]
    k++
    while (k < order.length) {
      const next = [...areas, order[k].area]
      if (worst(next, side) <= worst(areas, side)) {
        row.push(order[k])
        areas = next
        k++
      } else break
    }
    const rowArea = areas.reduce((a, b) => a + b, 0)
    if (w >= h) {
      const colW = rowArea / h
      let yy = y
      row.forEach((o) => {
        const hh = o.area / colW
        out[o.i] = { x, y: yy, w: colW, h: hh }
        yy += hh
      })
      x += colW
      w -= colW
    } else {
      const rowH = rowArea / w
      let xx = x
      row.forEach((o) => {
        const ww = o.area / rowH
        out[o.i] = { x: xx, y, w: ww, h: rowH }
        xx += ww
      })
      y += rowH
      h -= rowH
    }
  }
  return out
}
