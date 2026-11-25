import type { WaterfallDatum, WaterfallKind } from './waterfall-chart.types'

export interface WaterfallStep {
  kind: WaterfallKind
  value: number
  start: number
  end: number
}

const amount = (value: unknown) => (Number.isFinite(Number(value)) ? Number(value) : 0)
/** Without it, adding 0.1 and 0.2 shows as 0.30000000000000004. */
const tidy = (value: number) => Number(value.toPrecision(12))

/** Where each bar starts and ends as the changes add up. */
export function runWaterfall(data: WaterfallDatum[]): WaterfallStep[] {
  let running = 0
  return data.map((datum) => {
    if (datum.total) {
      if (datum.value !== undefined) running = amount(datum.value)
      return { kind: 'total', value: running, start: 0, end: running }
    }
    const value = amount(datum.value)
    const start = running
    running = tidy(running + value)
    return { kind: value < 0 ? 'decrease' : 'increase', value, start, end: running }
  })
}
