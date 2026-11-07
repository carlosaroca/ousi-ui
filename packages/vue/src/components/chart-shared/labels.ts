/**
 * Which axis labels fit without touching each other, from left to right.
 * `xs` is the anchor of every label in px. Empty labels are never shown (and take no room),
 * so sparse labels such as months over a week-by-week calendar work too.
 */
export function visibleLabels(
  labels: string[],
  xs: number[],
  opts: { anchor?: 'middle' | 'start'; charWidth?: number; gap?: number } = {},
): boolean[] {
  const { anchor = 'middle', charWidth = 6.4, gap = 8 } = opts
  let lastRight = -Infinity
  return labels.map((label, i) => {
    if (!label) return false
    const w = label.length * charWidth
    const left = anchor === 'middle' ? xs[i] - w / 2 : xs[i]
    if (left < lastRight + gap) return false
    lastRight = left + w
    return true
  })
}
