import type {
  ChartPoint, ChartPalette, ChartLayout, ChartPadding,
  ChartMomentum, ChartReferenceLine, ChartOrderbookData, ChartDegenOptions,
  CandlePoint, ChartSeries,
} from './chart.types'
import { lerp } from './chart.lerp'
import { drawSpline } from './chart.splines'
import { interpolateAtTime } from './chart.hit'
import { deriveTheme, parseColorRgb } from './chart.theme-derive'

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_DELTA_MS = 50
const SCRUB_LERP_SPEED = 0.12
const BADGE_WIDTH_LERP = 0.15
const BADGE_Y_LERP = 0.35
const MOMENTUM_COLOR_LERP = 0.12
const WINDOW_TRANSITION_MS = 750
const WINDOW_BUFFER = 0.05
const WINDOW_BUFFER_NO_BADGE = 0.015
const VALUE_SNAP_THRESHOLD = 0.001
const ADAPTIVE_SPEED_BOOST = 0.2
const FADE_EDGE_WIDTH = 40
const CROSSHAIR_FADE_MIN_PX = 5
const PULSE_INTERVAL = 1500
const PULSE_DURATION = 900
const LOADING_AMPLITUDE_RATIO = 0.07
const LOADING_SCROLL_SPEED = 0.001
const CHART_REVEAL_SPEED_FWD = 0.09
const CHART_REVEAL_SPEED = 0.14
const MOMENTUM_GREEN: [number, number, number] = [34, 197, 94]
const MOMENTUM_RED: [number, number, number] = [239, 68, 68]
const SHAKE_DECAY_RATE = 0.002
const SHAKE_MIN_AMPLITUDE = 0.2
const MAX_PARTICLES = 80
const PARTICLE_LIFETIME = 1.0
const PARTICLE_COOLDOWN_MS = 400
const PARTICLE_MAGNITUDE_THRESHOLD = 0.08
const PARTICLE_MAX_BURSTS = 3
const SVG_NS = 'http://www.w3.org/2000/svg'
const CANDLE_LERP_SPEED = 0.25
const CANDLE_BULL = '#22c55e'
const CANDLE_BEAR = '#ef4444'
const CANDLE_BULL_RGB = [34, 197, 94] as const
const CANDLE_BEAR_RGB = [239, 68, 68] as const
const SERIES_TOGGLE_SPEED = 0.10

// ─── Badge SVG path generators ────────────────────────────���───────────────────
const BADGE_PAD_X = 10
const BADGE_PAD_Y = 3
const BADGE_TAIL_LEN = 5
const BADGE_TAIL_SPREAD = 2.5
const BADGE_LINE_H = 16

function badgeSvgPath(pillW: number, pillH: number, tailLen: number, tailSpread: number): string {
  const r = pillH / 2
  const cx = tailLen + pillW - r
  const tl = tailLen + r
  return `M${tl},0 L${cx},0 A${r},${r},0,0,1,${cx},${pillH} L${tl},${pillH} C${tailLen + 2},${pillH},${3},${r + tailSpread},0,${r} C${3},${r - tailSpread},${tailLen + 2},0,${tl},0 Z`
}

function badgePillOnly(pillW: number, pillH: number): string {
  const r = pillH / 2
  return `M${r},0 L${pillW - r},0 A${r},${r},0,0,1,${pillW - r},${pillH} L${r},${pillH} A${r},${r},0,0,1,${r},0 Z`
}

// ─── Math utilities ───────────────────────────────────────────────────────────

function niceTimeInterval(windowSecs: number): number {
  if (windowSecs <= 15) return 2
  if (windowSecs <= 30) return 5
  if (windowSecs <= 60) return 10
  if (windowSecs <= 120) return 15
  if (windowSecs <= 300) return 30
  if (windowSecs <= 600) return 60
  if (windowSecs <= 1800) return 300
  if (windowSecs <= 3600) return 600
  if (windowSecs <= 14400) return 1800
  if (windowSecs <= 43200) return 3600
  if (windowSecs <= 86400) return 7200
  if (windowSecs <= 604800) return 86400
  return 604800
}

function computeRange(
  visible: ChartPoint[], currentValue: number, referenceValue?: number, exaggerate?: boolean,
): { min: number; max: number } {
  let targetMin = Infinity
  let targetMax = -Infinity
  for (const p of visible) {
    if (p.value < targetMin) targetMin = p.value
    if (p.value > targetMax) targetMax = p.value
  }
  if (currentValue < targetMin) targetMin = currentValue
  if (currentValue > targetMax) targetMax = currentValue
  if (referenceValue !== undefined) {
    if (referenceValue < targetMin) targetMin = referenceValue
    if (referenceValue > targetMax) targetMax = referenceValue
  }
  const rawRange = targetMax - targetMin
  const marginFactor = exaggerate ? 0.01 : 0.12
  const minRange = rawRange * (exaggerate ? 0.02 : 0.1) || (exaggerate ? 0.04 : 0.4)
  if (rawRange < minRange) {
    const mid = (targetMin + targetMax) / 2
    targetMin = mid - minRange / 2
    targetMax = mid + minRange / 2
  } else {
    const margin = rawRange * marginFactor
    targetMin -= margin
    targetMax += margin
  }
  return { min: targetMin, max: targetMax }
}

function detectMomentum(points: ChartPoint[], lookback = 20): ChartMomentum {
  if (points.length < 5) return 'flat'
  const start = Math.max(0, points.length - lookback)
  let min = Infinity
  let max = -Infinity
  for (let i = start; i < points.length; i++) {
    const v = points[i].value
    if (v < min) min = v
    if (v > max) max = v
  }
  const range = max - min
  if (range === 0) return 'flat'
  const tailStart = Math.max(start, points.length - 5)
  const first = points[tailStart].value
  const last = points[points.length - 1].value
  const delta = last - first
  const threshold = range * 0.12
  if (delta > threshold) return 'up'
  if (delta < -threshold) return 'down'
  return 'flat'
}

function getDpr(): number {
  if (typeof window === 'undefined') return 1
  return Math.min(window.devicePixelRatio || 1, 3)
}

// ─── Color utilities ──────────────────────────────────────────────────────────

function parseRgba(color: string): [number, number, number, number] {
  const hex = color.match(/^#([0-9a-f]{3,8})$/i)
  if (hex) {
    let h = hex[1]
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1]
  }
  const rgba = color.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)/)
  if (rgba) return [+rgba[1], +rgba[2], +rgba[3], +rgba[4]]
  const rgb = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (rgb) return [+rgb[1], +rgb[2], +rgb[3], 1]
  return [128, 128, 128, 1]
}

function blendColor(c1: string, c2: string, t: number): string {
  if (t <= 0) return c1
  if (t >= 1) return c2
  const [r1, g1, b1] = parseRgba(c1)
  const [r2, g2, b2] = parseRgba(c2)
  return `rgb(${Math.round(r1 + (r2 - r1) * t)},${Math.round(g1 + (g2 - g1) * t)},${Math.round(b1 + (b2 - b1) * t)})`
}

function lerpColor(a: [number, number, number], b: [number, number, number], t: number): string {
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`
}

// ─── Loading shape ────────────────────────────────────────────────────────────

function loadingY(t: number, centerY: number, amplitude: number, scroll: number): number {
  return centerY + amplitude * (
    Math.sin(t * 9.4 + scroll) * 0.55 +
    Math.sin(t * 15.7 + scroll * 1.3) * 0.3 +
    Math.sin(t * 4.2 + scroll * 0.7) * 0.15
  )
}

function loadingBreath(now_ms: number): number {
  return 0.22 + 0.08 * Math.sin(now_ms / 1200 * Math.PI)
}

// ─── Particle state ───────────────────────────────────────────────────────────

interface Particle {
  x: number; y: number; vx: number; vy: number
  life: number; size: number; color: string
}

interface ParticleState {
  particles: Particle[]
  cooldown: number
  burstCount: number
}

// ─── Grid state ───────────────────────────────────────────────────────────────

interface GridState {
  interval: number
  labels: Map<number, number>
}

interface TimeAxisState {
  labels: Map<number, { alpha: number; text: string }>
}

// ─── Orderbook state ──────────────────────────────────────────────────────────

interface StreamLabel {
  y: number; text: string; green: boolean
  life: number; maxLife: number; intensity: number
}

interface OrderbookState {
  labels: StreamLabel[]
  spawnTimer: number
  smoothSpeed: number
  prevBidTotal: number
  prevAskTotal: number
  churnRate: number
}

// ─── Badge DOM elements ───────────────────────────────────────────────────────

interface BadgeEls {
  container: HTMLDivElement
  svg: SVGSVGElement
  path: SVGPathElement
  text: HTMLSpanElement
  displayW: number
  targetW: number
}

// ─── Engine config (internal) ─────────────────────────────────────────────────

export interface ChartEngineConfig {
  data: ChartPoint[]
  value: number
  theme: 'light' | 'dark'
  color: string
  grid: boolean
  badge: boolean
  badgeVariant: 'default' | 'minimal'
  badgeTail: boolean
  fill: boolean
  pulse: boolean
  momentum: boolean | ChartMomentum
  scrub: boolean
  exaggerate: boolean
  showValue: boolean
  valueMomentumColor: boolean
  degen: boolean | ChartDegenOptions
  window: number
  tooltipY: number
  tooltipOutline: boolean
  orderbook?: ChartOrderbookData
  referenceLine?: ChartReferenceLine
  formatValue: (v: number) => string
  formatTime?: (t: number) => string
  lerpSpeed: number
  padding: ChartPadding
  // Candlestick mode
  mode: 'line' | 'candle'
  candles?: CandlePoint[]
  candleWidth?: number
  liveCandle?: CandlePoint
  // Multi-series
  series?: ChartSeries[]
}

// ─── Engine class ─────────────────────────────────────────────────────────────

export class ChartEngine {
  private canvas: HTMLCanvasElement
  private container: HTMLElement
  private ctx: CanvasRenderingContext2D
  private rafId: number | null = null
  private resizeObserver: ResizeObserver
  private cfg: ChartEngineConfig
  private palette: ChartPalette

  // Callbacks
  private onHover: ((point: (ChartPoint & { x: number; y: number }) | null) => void) | null = null
  private onValue: ((value: string) => void) | null = null
  private onDegen: ((direction: 'up' | 'down') => void) | null = null

  // Canvas size
  private w = 0
  private h = 0

  // Animation state
  private lastFrame = 0
  private displayValue: number
  private displayMin = 0
  private displayMax = 0
  private targetMin = 0
  private targetMax = 0
  private rangeInited = false
  private displayWindow: number
  private windowTrans = { from: 0, to: 0, startMs: 0, rangeFromMin: 0, rangeFromMax: 0, rangeToMin: 0, rangeToMax: 0 }
  private arrowState = { up: 0, down: 0 }
  private gridState: GridState = { interval: 0, labels: new Map() }
  private timeAxisState: TimeAxisState = { labels: new Map() }
  private orderbookState: OrderbookState = {
    labels: [], spawnTimer: 0, smoothSpeed: 60,
    prevBidTotal: 0, prevAskTotal: 0, churnRate: 0,
  }
  private particleState: ParticleState = { particles: [], cooldown: 0, burstCount: 0 }
  private shakeAmplitude = 0
  private badgeColor = { green: 1 }
  private badgeY: number | null = null
  private scrubAmount = 0
  private hoverPixelX: number | null = null
  private lastHover: { x: number; value: number; time: number } | null = null
  private chartReveal = 0
  private lastDataStash: ChartPoint[] = []
  private frozenNow = 0

  // Candle mode state
  private displayCandle: CandlePoint | null = null
  private liveBirthAlpha = 1
  private liveBullBlend = 0.5
  private lineSmoothClose = 0
  private lineSmoothInited = false

  // Multi-series state
  private displayValues = new Map<string, number>()
  private seriesAlphas = new Map<string, number>()
  private seriesPalettes = new Map<string, ChartPalette>()

  // Badge DOM
  private badge: BadgeEls | null = null

  // Bound event handlers
  private boundOnMove: (e: MouseEvent) => void
  private boundOnLeave: () => void
  private boundOnTouchStart: (e: TouchEvent) => void
  private boundOnTouchMove: (e: TouchEvent) => void
  private boundOnTouchEnd: () => void
  private boundVisibility: () => void

  constructor(canvas: HTMLCanvasElement, container: HTMLElement, config: ChartEngineConfig) {
    this.canvas = canvas
    this.container = container
    this.cfg = config
    this.displayValue = config.value
    this.displayWindow = config.window
    this.windowTrans.from = config.window
    this.windowTrans.to = config.window
    this.palette = deriveTheme(config.color, config.theme)

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2d context not available')
    this.ctx = ctx

    // Badge DOM
    this.createBadge()

    // Size
    const rect = container.getBoundingClientRect()
    this.w = rect.width
    this.h = rect.height

    this.resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      this.w = entry.contentRect.width
      this.h = entry.contentRect.height
    })
    this.resizeObserver.observe(container)

    // Events
    this.boundOnMove = (e: MouseEvent) => {
      if (!this.cfg.scrub) return
      const rect = container.getBoundingClientRect()
      this.hoverPixelX = e.clientX - rect.left
    }
    this.boundOnLeave = () => {
      this.hoverPixelX = null
      this.onHover?.(null)
    }
    this.boundOnTouchStart = (e: TouchEvent) => {
      if (!this.cfg.scrub || e.touches.length !== 1) return
      const rect = container.getBoundingClientRect()
      this.hoverPixelX = e.touches[0].clientX - rect.left
    }
    this.boundOnTouchMove = (e: TouchEvent) => {
      if (!this.cfg.scrub || e.touches.length !== 1) return
      e.preventDefault()
      const rect = container.getBoundingClientRect()
      this.hoverPixelX = e.touches[0].clientX - rect.left
    }
    this.boundOnTouchEnd = () => {
      this.hoverPixelX = null
      this.onHover?.(null)
    }
    this.boundVisibility = () => {
      if (!document.hidden && !this.rafId) {
        this.rafId = requestAnimationFrame((ts) => this.loop(ts))
      }
    }

    container.addEventListener('mousemove', this.boundOnMove)
    container.addEventListener('mouseleave', this.boundOnLeave)
    container.addEventListener('touchstart', this.boundOnTouchStart, { passive: true })
    container.addEventListener('touchmove', this.boundOnTouchMove, { passive: false })
    container.addEventListener('touchend', this.boundOnTouchEnd)
    container.addEventListener('touchcancel', this.boundOnTouchEnd)
    document.addEventListener('visibilitychange', this.boundVisibility)

    // Start loop
    this.rafId = requestAnimationFrame((ts) => this.loop(ts))
  }

  update(config: Partial<ChartEngineConfig>): void {
    const prev = this.cfg
    this.cfg = { ...this.cfg, ...config }
    if (config.color !== undefined || config.theme !== undefined) {
      this.palette = deriveTheme(this.cfg.color, this.cfg.theme)
      this.seriesPalettes.clear() // invalidate cached per-series palettes
    }
    if (config.series !== undefined) {
      this.seriesPalettes.clear()
    }
    if (config.scrub === false) {
      this.hoverPixelX = null
    }
  }

  destroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId)
    this.rafId = null
    this.resizeObserver.disconnect()
    this.container.removeEventListener('mousemove', this.boundOnMove)
    this.container.removeEventListener('mouseleave', this.boundOnLeave)
    this.container.removeEventListener('touchstart', this.boundOnTouchStart)
    this.container.removeEventListener('touchmove', this.boundOnTouchMove)
    this.container.removeEventListener('touchend', this.boundOnTouchEnd)
    this.container.removeEventListener('touchcancel', this.boundOnTouchEnd)
    document.removeEventListener('visibilitychange', this.boundVisibility)
    if (this.badge) {
      this.container.removeChild(this.badge.container)
      this.badge = null
    }
  }

  setHoverCallback(cb: (point: (ChartPoint & { x: number; y: number }) | null) => void): void {
    this.onHover = cb
  }

  setValueCallback(cb: (value: string) => void): void {
    this.onValue = cb
  }

  setDegenCallback(cb: (direction: 'up' | 'down') => void): void {
    this.onDegen = cb
  }

  // ─── Badge DOM creation ───────────────────────────────────────────────

  private createBadge(): void {
    const el = document.createElement('div')
    el.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;will-change:transform;display:none;z-index:1;'
    const svg = document.createElementNS(SVG_NS, 'svg')
    svg.style.cssText = 'position:absolute;top:0;left:0;'
    const path = document.createElementNS(SVG_NS, 'path')
    svg.appendChild(path)
    const text = document.createElement('span')
    text.style.cssText = 'position:relative;display:block;color:#fff;white-space:nowrap;'
    el.appendChild(svg)
    el.appendChild(text)
    this.container.appendChild(el)
    this.badge = { container: el, svg, path, text, displayW: 0, targetW: 0 }
  }

  // ─── Main loop ───────────────────────────────────────────���────────────

  private loop(timestamp: number): void {
    if (document.hidden) {
      this.rafId = null
      return
    }

    const { w, h } = this
    if (w === 0 || h === 0) {
      this.rafId = requestAnimationFrame((ts) => this.loop(ts))
      return
    }

    const cfg = this.cfg
    const palette = this.palette
    const ctx = this.ctx
    const now_ms = performance.now()
    const dt = this.lastFrame ? Math.min(now_ms - this.lastFrame, MAX_DELTA_MS) : 16.67
    this.lastFrame = now_ms

    // Resize canvas for DPR
    const dpr = getDpr()
    const targetW = Math.round(w * dpr)
    const targetH = Math.round(h * dpr)
    if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
      this.canvas.width = targetW
      this.canvas.height = targetH
      this.canvas.style.width = `${w}px`
      this.canvas.style.height = `${h}px`
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)

    const pad = cfg.padding
    const chartH = h - pad.top - pad.bottom
    const chartW = w - pad.left - pad.right

    // ─── Mode dispatch ──────────────────────────────────────────────
    const isCandle = cfg.mode === 'candle'
    const isMulti = !isCandle && cfg.series != null && cfg.series.length > 0

    if (isCandle) {
      this.drawCandleMode(ctx, w, h, pad, chartW, chartH, palette, dt, now_ms)
      this.rafId = requestAnimationFrame((ts) => this.loop(ts))
      return
    }

    if (isMulti) {
      this.drawMultiSeriesMode(ctx, w, h, pad, chartW, chartH, palette, dt, now_ms)
      this.rafId = requestAnimationFrame((ts) => this.loop(ts))
      return
    }

    // ─── Line mode pipeline ─────────────────────────────────────────
    const points = cfg.data
    const hasData = points.length >= 2

    // Chart reveal
    const revealTarget = hasData ? 1 : 0
    this.chartReveal = lerp(
      this.chartReveal, revealTarget,
      revealTarget === 1 ? CHART_REVEAL_SPEED_FWD : CHART_REVEAL_SPEED, dt,
    )
    if (Math.abs(this.chartReveal - revealTarget) < 0.005) this.chartReveal = revealTarget
    const chartReveal = this.chartReveal

    if (chartReveal < 0.01) this.rangeInited = false

    // Data stash for reverse morph
    const useStash = !hasData && chartReveal > 0.005 && this.lastDataStash.length >= 2
    if (hasData) this.lastDataStash = points

    if (!hasData && !useStash) {
      this.drawLoading(ctx, w, h, pad, palette, now_ms)
      this.drawEdgeFade(ctx, pad, w, h)
      if (this.badge) this.badge.container.style.display = 'none'
      this.rafId = requestAnimationFrame((ts) => this.loop(ts))
      return
    }

    const effectivePoints = useStash ? this.lastDataStash : points

    // Smooth value
    const valGap = Math.abs(cfg.value - this.displayValue)
    const prevRange = this.displayMax - this.displayMin || 1
    const gapRatio = Math.min(valGap / prevRange, 1)
    const adaptiveSpeed = cfg.lerpSpeed + (1 - gapRatio) * ADAPTIVE_SPEED_BOOST
    if (!useStash) {
      this.displayValue = lerp(this.displayValue, cfg.value, adaptiveSpeed, dt)
      if (Math.abs(this.displayValue - cfg.value) < prevRange * VALUE_SNAP_THRESHOLD) {
        this.displayValue = cfg.value
      }
    }
    const smoothValue = this.displayValue

    // Window transition
    const showMomentum = cfg.momentum !== false
    const buffer = cfg.badge ? WINDOW_BUFFER : WINDOW_BUFFER_NO_BADGE
    if (hasData) this.frozenNow = Date.now() / 1000
    const now = useStash ? this.frozenNow : Date.now() / 1000
    const wt = this.windowTrans
    if (wt.to !== cfg.window) {
      wt.from = this.displayWindow
      wt.to = cfg.window
      wt.startMs = now_ms
      wt.rangeFromMin = this.displayMin
      wt.rangeFromMax = this.displayMax
      const tre = now + cfg.window * buffer
      const tle = tre - cfg.window
      const tv: ChartPoint[] = []
      for (const p of effectivePoints) {
        if (p.time >= tle - 2 && p.time <= tre) tv.push(p)
      }
      if (tv.length > 0) {
        const tr = computeRange(tv, smoothValue, cfg.referenceLine?.value, cfg.exaggerate)
        wt.rangeToMin = tr.min
        wt.rangeToMax = tr.max
      }
    }
    let windowSecs: number
    let windowTransProgress = 0
    if (wt.startMs === 0) {
      windowSecs = cfg.window
    } else {
      const elapsed = now_ms - wt.startMs
      const t = Math.min(elapsed / WINDOW_TRANSITION_MS, 1)
      const eased = (1 - Math.cos(t * Math.PI)) / 2
      windowTransProgress = eased
      windowSecs = Math.exp(Math.log(wt.from) + (Math.log(wt.to) - Math.log(wt.from)) * eased)
      if (t >= 1) {
        windowSecs = cfg.window
        wt.startMs = 0
        windowTransProgress = 0
      }
    }
    this.displayWindow = windowSecs
    const isWindowTransitioning = wt.startMs > 0

    const rightEdge = now + windowSecs * buffer
    const leftEdge = rightEdge - windowSecs

    // Visible points
    const visible: ChartPoint[] = []
    for (const p of effectivePoints) {
      if (p.time >= leftEdge - 2 && p.time <= rightEdge) visible.push(p)
    }
    if (visible.length < 2) {
      if (this.badge) this.badge.container.style.display = 'none'
      this.rafId = requestAnimationFrame((ts) => this.loop(ts))
      return
    }

    // Y range
    const computedRange = computeRange(visible, smoothValue, cfg.referenceLine?.value, cfg.exaggerate)
    if (!this.rangeInited) {
      this.displayMin = computedRange.min
      this.displayMax = computedRange.max
      this.targetMin = computedRange.min
      this.targetMax = computedRange.max
      this.rangeInited = true
    } else if (isWindowTransitioning) {
      this.displayMin = wt.rangeFromMin + (wt.rangeToMin - wt.rangeFromMin) * windowTransProgress
      this.displayMax = wt.rangeFromMax + (wt.rangeToMax - wt.rangeFromMax) * windowTransProgress
      this.targetMin = computedRange.min
      this.targetMax = computedRange.max
    } else {
      this.targetMin = computedRange.min
      this.targetMax = computedRange.max
      this.displayMin = lerp(this.displayMin, this.targetMin, adaptiveSpeed, dt)
      this.displayMax = lerp(this.displayMax, this.targetMax, adaptiveSpeed, dt)
      const pxThreshold = 0.5 * (this.displayMax - this.displayMin) / chartH || 0.001
      if (Math.abs(this.displayMin - this.targetMin) < pxThreshold) this.displayMin = this.targetMin
      if (Math.abs(this.displayMax - this.targetMax) < pxThreshold) this.displayMax = this.targetMax
    }
    const minVal = this.displayMin
    const maxVal = this.displayMax
    const valRange = (maxVal - minVal) || 0.001

    const layout: ChartLayout = {
      w, h, pad, chartW, chartH,
      leftEdge, rightEdge,
      minVal, maxVal, valRange,
      toX: (t: number) => pad.left + ((t - leftEdge) / (rightEdge - leftEdge)) * chartW,
      toY: (v: number) => pad.top + (1 - (v - minVal) / valRange) * chartH,
    }

    // Momentum
    const momentum: ChartMomentum = typeof cfg.momentum === 'string'
      ? cfg.momentum
      : detectMomentum(visible)

    // Hover + scrub
    let hoverX: number | null = null
    let hoverValue: number | null = null
    let hoverTime: number | null = null
    let isActiveHover = false
    if (this.hoverPixelX !== null && this.hoverPixelX >= pad.left && this.hoverPixelX <= w - pad.right) {
      const maxHoverX = layout.toX(now)
      const clampedX = Math.min(this.hoverPixelX, maxHoverX)
      const t = leftEdge + ((clampedX - pad.left) / chartW) * (rightEdge - leftEdge)
      const v = interpolateAtTime(visible, t)
      if (v !== null) {
        hoverValue = v
        hoverTime = t
        hoverX = clampedX
        isActiveHover = true
        this.lastHover = { x: clampedX, value: v, time: t }
        this.onHover?.({ time: t, value: v, x: clampedX, y: layout.toY(v) })
      }
    }
    const scrubTarget = isActiveHover ? 1 : 0
    this.scrubAmount += (scrubTarget - this.scrubAmount) * SCRUB_LERP_SPEED
    if (this.scrubAmount < 0.01) this.scrubAmount = 0
    if (this.scrubAmount > 0.99) this.scrubAmount = 1

    if (!isActiveHover && this.scrubAmount > 0 && this.lastHover) {
      hoverX = this.lastHover.x
      hoverValue = this.lastHover.value
      hoverTime = this.lastHover.time
    }

    // Swing magnitude for particles
    const lookback = Math.min(5, visible.length - 1)
    const recentDelta = lookback > 0 ? Math.abs(visible[visible.length - 1].value - visible[visible.length - 1 - lookback].value) : 0
    const swingMagnitude = valRange > 0 ? Math.min(recentDelta / valRange, 1) : 0

    // ═══════════════════════════════════════════════════════
    // DRAW
    // ═══════════════════════════════════════════════════════

    const reveal = chartReveal
    const revealRamp = (start: number, end: number) => {
      const t = Math.max(0, Math.min(1, (reveal - start) / (end - start)))
      return t * t * (3 - 2 * t)
    }

    // Shake offset
    let shakeX = 0, shakeY = 0
    if (this.shakeAmplitude > SHAKE_MIN_AMPLITUDE) {
      shakeX = (Math.random() - 0.5) * 2 * this.shakeAmplitude
      shakeY = (Math.random() - 0.5) * 2 * this.shakeAmplitude
      ctx.save()
      ctx.translate(shakeX, shakeY)
    }
    this.shakeAmplitude *= Math.pow(SHAKE_DECAY_RATE, dt / 1000)
    if (this.shakeAmplitude < SHAKE_MIN_AMPLITUDE) this.shakeAmplitude = 0

    // 1. Reference line
    if (cfg.referenceLine && reveal > 0.01) {
      ctx.save()
      if (reveal < 1) ctx.globalAlpha = reveal
      this.drawReferenceLine(ctx, layout, palette, cfg.referenceLine)
      ctx.restore()
    }

    // 2. Grid
    if (cfg.grid) {
      const gridAlpha = reveal < 1 ? revealRamp(0.15, 0.7) : 1
      if (gridAlpha > 0.01) {
        ctx.save()
        if (gridAlpha < 1) ctx.globalAlpha = gridAlpha
        this.drawGrid(ctx, layout, palette, cfg.formatValue, dt)
        ctx.restore()
      }
    }

    // 2b. Orderbook
    if (cfg.orderbook && reveal > 0.01) {
      ctx.save()
      if (reveal < 1) ctx.globalAlpha = reveal
      this.drawOrderbook(ctx, layout, palette, cfg.orderbook, dt, swingMagnitude)
      ctx.restore()
    }

    // 3. Line + fill
    const scrubX = this.scrubAmount > 0.05 ? hoverX : null
    const pts = this.drawLine(ctx, layout, palette, visible, smoothValue, now, cfg.fill, scrubX, this.scrubAmount, reveal, now_ms)

    // 4. Time axis
    {
      const timeAlpha = reveal < 1 ? revealRamp(0.15, 0.7) : 1
      if (timeAlpha > 0.01) {
        ctx.save()
        if (timeAlpha < 1) ctx.globalAlpha = timeAlpha
        this.drawTimeAxis(ctx, layout, palette, windowSecs, cfg.window, dt)
        ctx.restore()
      }
    }

    if (pts && pts.length > 0) {
      const lastPt = pts[pts.length - 1]

      // 5. Dot
      let dotScrub = this.scrubAmount
      if (hoverX !== null && dotScrub > 0) {
        const distToLive = lastPt[0] - hoverX
        const fadeStart = Math.min(80, chartW * 0.3)
        dotScrub = distToLive < CROSSHAIR_FADE_MIN_PX ? 0
          : distToLive >= fadeStart ? this.scrubAmount
          : ((distToLive - CROSSHAIR_FADE_MIN_PX) / (fadeStart - CROSSHAIR_FADE_MIN_PX)) * this.scrubAmount
      }
      const dotAlpha = reveal < 0.3 ? 0 : (reveal - 0.3) / 0.7
      if (dotAlpha > 0.01) {
        ctx.save()
        if (dotAlpha < 1) ctx.globalAlpha = dotAlpha
        this.drawDot(ctx, lastPt[0], lastPt[1], palette, cfg.pulse && reveal > 0.6, dotScrub, now_ms)
        ctx.restore()
      }

      // 5b. Arrows
      if (showMomentum) {
        const arrowReveal = reveal < 1 ? revealRamp(0.6, 1) : 1
        if (arrowReveal > 0.01) {
          ctx.save()
          if (arrowReveal < 1) ctx.globalAlpha = arrowReveal
          this.drawArrows(ctx, lastPt[0], lastPt[1], momentum, palette, dt, now_ms)
          ctx.restore()
        }
      }

      // 6. Particles
      const degenOpts = typeof cfg.degen === 'object' ? cfg.degen : (cfg.degen ? {} : null)
      if (degenOpts && reveal > 0.9) {
        const burstIntensity = this.spawnParticles(momentum, lastPt[0], lastPt[1], swingMagnitude, palette.line, dt, degenOpts)
        if (burstIntensity > 0) {
          this.shakeAmplitude = (3 + swingMagnitude * 4) * burstIntensity
          if (momentum === 'up' || momentum === 'down') {
            this.onDegen?.(momentum)
          }
        }
        this.drawParticles(ctx, dt)
      }
    }

    // 7. Edge fade
    this.drawEdgeFade(ctx, pad, w, h)

    // 8. Crosshair
    if (hoverX !== null && hoverValue !== null && hoverTime !== null && pts && pts.length > 0) {
      const lastPt = pts[pts.length - 1]
      const distToLive = lastPt[0] - hoverX
      const fadeStart = Math.min(80, chartW * 0.3)
      const scrubOpacity = distToLive < CROSSHAIR_FADE_MIN_PX ? 0
        : distToLive >= fadeStart ? this.scrubAmount
        : ((distToLive - CROSSHAIR_FADE_MIN_PX) / (fadeStart - CROSSHAIR_FADE_MIN_PX)) * this.scrubAmount
      if (scrubOpacity > 0.01) {
        this.drawCrosshair(ctx, layout, palette, hoverX, hoverValue, hoverTime, scrubOpacity, lastPt[0])
      }
    }

    // Restore shake
    if (shakeX !== 0 || shakeY !== 0) ctx.restore()

    // Badge
    if (this.badge) {
      this.updateBadge(layout, smoothValue, momentum, dt)
    }

    // Value display
    if (cfg.showValue && this.onValue) {
      const displayVal = cfg.valueMomentumColor ? Math.abs(smoothValue) : smoothValue
      this.onValue(cfg.formatValue(displayVal))
    }

    this.rafId = requestAnimationFrame((ts) => this.loop(ts))
  }

  // ─── Candle mode pipeline ──────────────────────────────────────────────

  private drawCandleMode(
    ctx: CanvasRenderingContext2D, w: number, h: number,
    pad: ChartPadding, chartW: number, chartH: number,
    palette: ChartPalette, dt: number, now_ms: number,
  ): void {
    const cfg = this.cfg
    const candles = cfg.candles ?? []
    const candleWidthSecs = cfg.candleWidth ?? 60
    const rawLive = cfg.liveCandle
    const now = Date.now() / 1000
    const buffer = WINDOW_BUFFER_NO_BADGE

    // Window transition
    const wt = this.windowTrans
    if (wt.to !== cfg.window) {
      wt.from = this.displayWindow
      wt.to = cfg.window
      wt.startMs = now_ms
    }
    let windowSecs: number
    if (wt.startMs === 0) {
      windowSecs = cfg.window
    } else {
      const elapsed = now_ms - wt.startMs
      const t = Math.min(elapsed / WINDOW_TRANSITION_MS, 1)
      const eased = (1 - Math.cos(t * Math.PI)) / 2
      windowSecs = Math.exp(Math.log(wt.from) + (Math.log(wt.to) - Math.log(wt.from)) * eased)
      if (t >= 1) { windowSecs = cfg.window; wt.startMs = 0 }
    }
    this.displayWindow = windowSecs

    const rightEdge = now + windowSecs * buffer
    const leftEdge = rightEdge - windowSecs

    // Live candle OHLC lerp
    let smoothLive: CandlePoint | undefined
    if (rawLive) {
      const prev = this.displayCandle
      if (!prev || prev.time !== rawLive.time) {
        this.displayCandle = { ...rawLive, high: rawLive.open, low: rawLive.open, close: rawLive.open }
        this.liveBirthAlpha = 0
      } else {
        const dc = this.displayCandle!
        dc.open = lerp(dc.open, rawLive.open, CANDLE_LERP_SPEED, dt)
        dc.high = lerp(dc.high, rawLive.high, CANDLE_LERP_SPEED, dt)
        dc.low = lerp(dc.low, rawLive.low, CANDLE_LERP_SPEED, dt)
        dc.close = lerp(dc.close, rawLive.close, CANDLE_LERP_SPEED, dt)
      }
      this.liveBirthAlpha = lerp(this.liveBirthAlpha, 1, 0.2, dt)
      if (this.liveBirthAlpha > 0.99) this.liveBirthAlpha = 1
      const dc = this.displayCandle!
      const bullTarget = dc.close >= dc.open ? 1 : 0
      this.liveBullBlend = lerp(this.liveBullBlend, bullTarget, 0.12, dt)
      smoothLive = dc
    } else {
      this.displayCandle = null
    }

    // Visible candles
    const visible: CandlePoint[] = []
    for (const c of candles) {
      if (c.time + candleWidthSecs >= leftEdge && c.time <= rightEdge) visible.push(c)
    }
    if (smoothLive && smoothLive.time + candleWidthSecs >= leftEdge) visible.push(smoothLive)

    if (visible.length < 2) {
      this.drawLoading(ctx, w, h, pad, palette, now_ms)
      this.drawEdgeFade(ctx, pad, w, h)
      if (this.badge) this.badge.container.style.display = 'none'
      return
    }

    // Y range from OHLC
    let rangeMin = Infinity, rangeMax = -Infinity
    for (const c of visible) {
      if (c.low < rangeMin) rangeMin = c.low
      if (c.high > rangeMax) rangeMax = c.high
    }
    const rawRange = rangeMax - rangeMin
    const margin = rawRange * 0.12
    const minRange = rawRange * 0.1 || 0.4
    if (rawRange < minRange) {
      const mid = (rangeMin + rangeMax) / 2
      rangeMin = mid - minRange / 2
      rangeMax = mid + minRange / 2
    } else {
      rangeMin -= margin
      rangeMax += margin
    }

    if (!this.rangeInited) {
      this.displayMin = rangeMin
      this.displayMax = rangeMax
      this.rangeInited = true
    } else {
      this.displayMin = lerp(this.displayMin, rangeMin, 0.15, dt)
      this.displayMax = lerp(this.displayMax, rangeMax, 0.15, dt)
    }
    const minVal = this.displayMin
    const maxVal = this.displayMax
    const valRange = (maxVal - minVal) || 0.001

    const layout: ChartLayout = {
      w, h, pad, chartW, chartH,
      leftEdge, rightEdge, minVal, maxVal, valRange,
      toX: (t: number) => pad.left + ((t - leftEdge) / (rightEdge - leftEdge)) * chartW,
      toY: (v: number) => pad.top + (1 - (v - minVal) / valRange) * chartH,
    }

    // Grid
    if (cfg.grid) {
      this.drawGrid(ctx, layout, palette, cfg.formatValue, dt)
    }

    // Draw candles
    ctx.save()
    ctx.beginPath()
    ctx.rect(pad.left - 1, pad.top, chartW + 2, chartH)
    ctx.clip()
    this.drawCandlesticks(ctx, layout, visible, candleWidthSecs, smoothLive?.time ?? -1, now_ms, 0, 0, this.liveBirthAlpha, this.liveBullBlend)
    ctx.restore()

    // Close price dashed line
    if (smoothLive) {
      this.drawCandleClosePrice(ctx, layout, smoothLive, this.liveBullBlend)
    }

    // Time axis
    this.drawTimeAxis(ctx, layout, palette, windowSecs, cfg.window, dt)

    // Edge fade
    this.drawEdgeFade(ctx, pad, w, h)

    // Crosshair
    if (this.hoverPixelX !== null && this.scrubAmount > 0.01) {
      const hoverX = this.hoverPixelX
      if (hoverX >= pad.left && hoverX <= w - pad.right) {
        const hoverTime = leftEdge + ((hoverX - pad.left) / chartW) * (rightEdge - leftEdge)
        // Find candle at hover
        let hoveredCandle: CandlePoint | null = null
        for (const c of visible) {
          if (hoverTime >= c.time && hoverTime < c.time + candleWidthSecs) { hoveredCandle = c; break }
        }
        if (hoveredCandle) {
          this.drawCandleCrosshair(ctx, layout, palette, hoverX, hoveredCandle, hoverTime)
        }
      }
    }
    // Scrub lerp
    const scrubTarget = this.hoverPixelX !== null ? 1 : 0
    this.scrubAmount += (scrubTarget - this.scrubAmount) * SCRUB_LERP_SPEED
    if (this.scrubAmount < 0.01) this.scrubAmount = 0
    if (this.scrubAmount > 0.99) this.scrubAmount = 1

    if (this.badge) this.badge.container.style.display = 'none'
  }

  // ─── Multi-series mode pipeline ──────────────────────────────────────

  private drawMultiSeriesMode(
    ctx: CanvasRenderingContext2D, w: number, h: number,
    pad: ChartPadding, chartW: number, chartH: number,
    palette: ChartPalette, dt: number, now_ms: number,
  ): void {
    const cfg = this.cfg
    const seriesList = cfg.series!
    const now = Date.now() / 1000
    const buffer = WINDOW_BUFFER_NO_BADGE

    // Window transition
    const wt = this.windowTrans
    if (wt.to !== cfg.window) {
      wt.from = this.displayWindow; wt.to = cfg.window; wt.startMs = now_ms
    }
    let windowSecs: number
    if (wt.startMs === 0) {
      windowSecs = cfg.window
    } else {
      const elapsed = now_ms - wt.startMs
      const t = Math.min(elapsed / WINDOW_TRANSITION_MS, 1)
      windowSecs = Math.exp(Math.log(wt.from) + (Math.log(wt.to) - Math.log(wt.from)) * ((1 - Math.cos(t * Math.PI)) / 2))
      if (t >= 1) { windowSecs = cfg.window; wt.startMs = 0 }
    }
    this.displayWindow = windowSecs

    const rightEdge = now + windowSecs * buffer
    const leftEdge = rightEdge - windowSecs

    // Per-series palettes (cached)
    for (const s of seriesList) {
      if (!this.seriesPalettes.has(s.id)) {
        this.seriesPalettes.set(s.id, deriveTheme(s.color, cfg.theme))
      }
    }

    // Per-series smooth values
    for (const s of seriesList) {
      let dv = this.displayValues.get(s.id) ?? s.value
      const gap = Math.abs(s.value - dv)
      const range = this.displayMax - this.displayMin || 1
      const speed = cfg.lerpSpeed + (1 - Math.min(gap / range, 1)) * ADAPTIVE_SPEED_BOOST
      dv = lerp(dv, s.value, speed, dt)
      if (Math.abs(dv - s.value) < range * VALUE_SNAP_THRESHOLD) dv = s.value
      this.displayValues.set(s.id, dv)
    }

    // Per-series visibility alpha
    for (const s of seriesList) {
      let alpha = this.seriesAlphas.get(s.id) ?? 1
      alpha = lerp(alpha, 1, SERIES_TOGGLE_SPEED, dt)
      if (alpha > 0.99) alpha = 1
      this.seriesAlphas.set(s.id, alpha)
    }

    // Build visible arrays + global range
    type SeriesEntry = { visible: ChartPoint[]; smoothValue: number; pal: ChartPalette; label?: string; alpha: number }
    const entries: SeriesEntry[] = []
    let globalMin = Infinity, globalMax = -Infinity
    for (const s of seriesList) {
      const vis: ChartPoint[] = []
      for (const p of s.data) {
        if (p.time >= leftEdge - 2 && p.time <= rightEdge) vis.push(p)
      }
      const sv = this.displayValues.get(s.id) ?? s.value
      const alpha = this.seriesAlphas.get(s.id) ?? 1
      if (vis.length >= 2) {
        const range = computeRange(vis, sv, cfg.referenceLine?.value, cfg.exaggerate)
        if (range.min < globalMin) globalMin = range.min
        if (range.max > globalMax) globalMax = range.max
        entries.push({ visible: vis, smoothValue: sv, pal: this.seriesPalettes.get(s.id)!, label: s.label, alpha })
      }
    }

    if (entries.length === 0) {
      this.drawLoading(ctx, w, h, pad, palette, now_ms)
      this.drawEdgeFade(ctx, pad, w, h)
      if (this.badge) this.badge.container.style.display = 'none'
      return
    }

    // Smooth range
    const computedRange = { min: isFinite(globalMin) ? globalMin : 0, max: isFinite(globalMax) ? globalMax : 1 }
    if (!this.rangeInited) {
      this.displayMin = computedRange.min; this.displayMax = computedRange.max; this.rangeInited = true
    } else {
      this.displayMin = lerp(this.displayMin, computedRange.min, cfg.lerpSpeed + ADAPTIVE_SPEED_BOOST * 0.5, dt)
      this.displayMax = lerp(this.displayMax, computedRange.max, cfg.lerpSpeed + ADAPTIVE_SPEED_BOOST * 0.5, dt)
    }
    const minVal = this.displayMin, maxVal = this.displayMax
    const valRange = (maxVal - minVal) || 0.001

    const layout: ChartLayout = {
      w, h, pad, chartW, chartH,
      leftEdge, rightEdge, minVal, maxVal, valRange,
      toX: (t: number) => pad.left + ((t - leftEdge) / (rightEdge - leftEdge)) * chartW,
      toY: (v: number) => pad.top + (1 - (v - minVal) / valRange) * chartH,
    }

    // Reference line
    if (cfg.referenceLine) this.drawReferenceLine(ctx, layout, palette, cfg.referenceLine)

    // Grid
    if (cfg.grid) this.drawGrid(ctx, layout, palette, cfg.formatValue, dt)

    // Draw each series line (no fill)
    const allPts: { pts: [number, number][]; pal: ChartPalette; label?: string; alpha: number }[] = []
    for (const entry of entries) {
      if (entry.alpha < 0.01) continue
      ctx.save()
      if (entry.alpha < 1) ctx.globalAlpha = entry.alpha
      const pts = this.drawLine(ctx, layout, entry.pal, entry.visible, entry.smoothValue, now, false, null, 0, 1, now_ms)
      ctx.restore()
      if (pts && pts.length > 0) allPts.push({ pts, pal: entry.pal, label: entry.label, alpha: entry.alpha })
    }

    // Time axis
    this.drawTimeAxis(ctx, layout, palette, windowSecs, cfg.window, dt)

    // Endpoint dots + labels
    for (const entry of allPts) {
      if (entry.alpha < 0.01) continue
      const lastPt = entry.pts[entry.pts.length - 1]
      ctx.save()
      ctx.globalAlpha = entry.alpha
      // Simple colored dot (no white outer ring)
      ctx.beginPath()
      ctx.arc(lastPt[0], lastPt[1], 3, 0, Math.PI * 2)
      ctx.fillStyle = entry.pal.line
      ctx.fill()
      // Label
      if (entry.label) {
        ctx.font = '600 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'
        ctx.textAlign = 'left'
        ctx.fillStyle = entry.pal.line
        ctx.fillText(entry.label, lastPt[0] + 6, lastPt[1] + 3.5)
      }
      ctx.restore()
    }

    // Edge fade
    this.drawEdgeFade(ctx, pad, w, h)

    // Multi-series crosshair
    if (this.hoverPixelX !== null && this.hoverPixelX >= pad.left && this.hoverPixelX <= w - pad.right) {
      const maxHoverX = layout.toX(now)
      const clampedX = Math.min(this.hoverPixelX, maxHoverX)
      const hoverTime = leftEdge + ((clampedX - pad.left) / chartW) * (rightEdge - leftEdge)

      ctx.save()
      ctx.globalAlpha = 0.5
      ctx.strokeStyle = palette.crosshairLine
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(clampedX, pad.top)
      ctx.lineTo(clampedX, h - pad.bottom)
      ctx.stroke()
      ctx.restore()

      // Dots at intersections
      const hoverEntries: { color: string; label: string; value: number }[] = []
      for (const entry of entries) {
        if (entry.alpha < 0.5) continue
        const v = interpolateAtTime(entry.visible, hoverTime)
        if (v !== null) {
          const y = layout.toY(v)
          ctx.beginPath()
          ctx.arc(clampedX, y, 4, 0, Math.PI * 2)
          ctx.fillStyle = entry.pal.line
          ctx.fill()
          hoverEntries.push({ color: entry.pal.line, label: entry.label ?? '', value: v })
        }
      }

      // Tooltip text
      if (hoverEntries.length > 0 && w >= 300) {
        const formatTime = cfg.formatTime ?? this.defaultFormatTime
        const timeText = formatTime(hoverTime)
        ctx.save()
        ctx.font = '400 13px "SF Mono", Menlo, monospace'
        ctx.textAlign = 'left'
        let parts = timeText
        for (const e of hoverEntries) {
          const label = e.label ? `${e.label} ` : ''
          parts += `  ·  ${label}${cfg.formatValue(e.value)}`
        }
        const tw = ctx.measureText(parts).width
        let tx = clampedX - tw / 2
        if (tx < pad.left + 4) tx = pad.left + 4
        if (tx > w - pad.right - tw) tx = w - pad.right - tw
        const ty = pad.top + (cfg.tooltipY ?? 14) + 10
        const mbg = palette.bgRgb
        ctx.shadowColor = `rgba(${mbg[0]},${mbg[1]},${mbg[2]},0.8)`
        ctx.shadowBlur = 6
        ctx.fillStyle = palette.tooltipText
        ctx.fillText(parts, tx, ty)
        ctx.restore()
      }

      this.onHover?.(hoverEntries.length > 0
        ? { time: hoverTime, value: hoverEntries[0].value, x: clampedX, y: layout.toY(hoverEntries[0].value) }
        : null)
    }

    // Scrub lerp
    const scrubTarget = this.hoverPixelX !== null ? 1 : 0
    this.scrubAmount += (scrubTarget - this.scrubAmount) * SCRUB_LERP_SPEED
    if (this.scrubAmount < 0.01) this.scrubAmount = 0

    if (this.badge) this.badge.container.style.display = 'none'
  }

  // ─── Draw: Candlesticks ──────────────────────────────────────────────

  private drawCandlesticks(
    ctx: CanvasRenderingContext2D, layout: ChartLayout,
    candles: CandlePoint[], candleWidthSecs: number,
    liveTime: number, now_ms: number,
    scrubX: number, scrubDim: number,
    liveAlpha: number, liveBullBlend: number,
  ): void {
    const { toX, toY } = layout
    const pxPerSec = layout.chartW / (layout.rightEdge - layout.leftEdge)
    const candlePxW = candleWidthSecs * pxPerSec
    const bodyW = Math.max(1, candlePxW * 0.7)
    const wickW = Math.max(0.8, Math.min(2, bodyW * 0.15))
    const radius = bodyW > 6 ? 1.5 : 0
    const halfBody = bodyW / 2
    const padL = layout.pad.left
    const padR = layout.pad.left + layout.chartW
    const livePulse = 0.12 + Math.sin(now_ms * 0.004) * 0.08

    for (const c of candles) {
      const cx = toX(c.time + candleWidthSecs / 2)
      if (cx + halfBody < padL || cx - halfBody > padR) continue

      const isBull = c.close >= c.open
      const isLive = c.time === liveTime
      let color: string
      if (isLive && liveBullBlend >= 0) {
        const r = Math.round(CANDLE_BEAR_RGB[0] + (CANDLE_BULL_RGB[0] - CANDLE_BEAR_RGB[0]) * liveBullBlend)
        const g = Math.round(CANDLE_BEAR_RGB[1] + (CANDLE_BULL_RGB[1] - CANDLE_BEAR_RGB[1]) * liveBullBlend)
        const b = Math.round(CANDLE_BEAR_RGB[2] + (CANDLE_BULL_RGB[2] - CANDLE_BEAR_RGB[2]) * liveBullBlend)
        color = `rgb(${r},${g},${b})`
      } else {
        color = isBull ? CANDLE_BULL : CANDLE_BEAR
      }

      let candleAlpha = isLive ? liveAlpha : 1
      if (scrubDim > 0.01 && scrubX > 0) {
        const dist = cx - scrubX
        if (dist > 0) candleAlpha *= 1 - scrubDim * 0.5 * Math.min(dist / (bodyW * 1.5), 1)
      }

      const baseAlpha = ctx.globalAlpha
      ctx.globalAlpha = baseAlpha * candleAlpha

      const bodyTop = toY(Math.max(c.open, c.close))
      const bodyBottom = toY(Math.min(c.open, c.close))
      const bodyH = Math.max(1, bodyBottom - bodyTop)
      const wickTop = toY(c.high)
      const wickBottom = toY(c.low)

      // Wicks
      ctx.lineCap = 'round'
      ctx.strokeStyle = color
      if (bodyTop - wickTop > 0.5) {
        ctx.beginPath(); ctx.moveTo(cx, bodyTop); ctx.lineTo(cx, wickTop)
        ctx.lineWidth = wickW; ctx.stroke()
      }
      if (wickBottom - bodyBottom > 0.5) {
        ctx.beginPath(); ctx.moveTo(cx, bodyBottom); ctx.lineTo(cx, wickBottom)
        ctx.lineWidth = wickW; ctx.stroke()
      }

      // Body
      ctx.fillStyle = color
      ctx.beginPath()
      if (radius > 0 && bodyH >= radius * 2) {
        ctx.moveTo(cx - halfBody + radius, bodyTop)
        ctx.lineTo(cx + halfBody - radius, bodyTop)
        ctx.arcTo(cx + halfBody, bodyTop, cx + halfBody, bodyTop + radius, radius)
        ctx.lineTo(cx + halfBody, bodyBottom - radius)
        ctx.arcTo(cx + halfBody, bodyBottom, cx + halfBody - radius, bodyBottom, radius)
        ctx.lineTo(cx - halfBody + radius, bodyBottom)
        ctx.arcTo(cx - halfBody, bodyBottom, cx - halfBody, bodyBottom - radius, radius)
        ctx.lineTo(cx - halfBody, bodyTop + radius)
        ctx.arcTo(cx - halfBody, bodyTop, cx - halfBody + radius, bodyTop, radius)
        ctx.closePath()
      } else {
        ctx.rect(cx - halfBody, bodyTop, bodyW, bodyH)
      }
      ctx.fill()

      // Live glow
      if (isLive) {
        ctx.save()
        ctx.globalAlpha = baseAlpha * candleAlpha * livePulse
        ctx.shadowColor = color; ctx.shadowBlur = 8
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.rect(cx - halfBody, bodyTop, bodyW, bodyH)
        ctx.fill()
        ctx.restore()
      }

      ctx.globalAlpha = baseAlpha
    }
  }

  private drawCandleClosePrice(
    ctx: CanvasRenderingContext2D, layout: ChartLayout,
    liveCandle: CandlePoint, bullBlend: number,
  ): void {
    const y = layout.toY(liveCandle.close)
    if (y < layout.pad.top || y > layout.h - layout.pad.bottom) return
    const isBull = liveCandle.close >= liveCandle.open
    let color: string
    if (bullBlend >= 0) {
      const r = Math.round(CANDLE_BEAR_RGB[0] + (CANDLE_BULL_RGB[0] - CANDLE_BEAR_RGB[0]) * bullBlend)
      const g = Math.round(CANDLE_BEAR_RGB[1] + (CANDLE_BULL_RGB[1] - CANDLE_BEAR_RGB[1]) * bullBlend)
      const b = Math.round(CANDLE_BEAR_RGB[2] + (CANDLE_BULL_RGB[2] - CANDLE_BEAR_RGB[2]) * bullBlend)
      color = `rgb(${r},${g},${b})`
    } else {
      color = isBull ? CANDLE_BULL : CANDLE_BEAR
    }
    ctx.save()
    ctx.setLineDash([4, 4])
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.4
    ctx.beginPath()
    ctx.moveTo(layout.pad.left, y)
    ctx.lineTo(layout.w - layout.pad.right, y)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.restore()
  }

  private drawCandleCrosshair(
    ctx: CanvasRenderingContext2D, layout: ChartLayout, palette: ChartPalette,
    hoverX: number, candle: CandlePoint, hoverTime: number,
  ): void {
    const { h, pad } = layout
    const formatValue = this.cfg.formatValue
    const formatTime = this.cfg.formatTime ?? this.defaultFormatTime
    const isBull = candle.close >= candle.open
    const valueColor = isBull ? CANDLE_BULL : CANDLE_BEAR

    ctx.save()
    ctx.globalAlpha = 0.5
    ctx.strokeStyle = palette.crosshairLine
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(hoverX, pad.top)
    ctx.lineTo(hoverX, h - pad.bottom)
    ctx.stroke()
    ctx.restore()

    if (layout.w < 200) return

    ctx.save()
    ctx.font = '400 13px "SF Mono", Menlo, monospace'
    ctx.textAlign = 'left'

    const parts: { text: string; color: string }[] = layout.w >= 400
      ? [
          { text: 'O ', color: palette.gridLabel }, { text: formatValue(candle.open), color: valueColor },
          { text: '   H ', color: palette.gridLabel }, { text: formatValue(candle.high), color: valueColor },
          { text: '   L ', color: palette.gridLabel }, { text: formatValue(candle.low), color: valueColor },
          { text: '   C ', color: palette.gridLabel }, { text: formatValue(candle.close), color: valueColor },
          { text: '  ·  ', color: palette.gridLabel }, { text: formatTime(hoverTime), color: palette.gridLabel },
        ]
      : [
          { text: 'C ', color: palette.gridLabel }, { text: formatValue(candle.close), color: valueColor },
          { text: '  ·  ', color: palette.gridLabel }, { text: formatTime(hoverTime), color: palette.gridLabel },
        ]

    let totalW = 0
    const widths: number[] = []
    for (const p of parts) { const w = ctx.measureText(p.text).width; widths.push(w); totalW += w }
    let tx = hoverX - totalW / 2
    if (tx < pad.left + 4) tx = pad.left + 4
    if (tx > layout.w - pad.right - totalW) tx = layout.w - pad.right - totalW
    const ty = pad.top + 24

    const bg = palette.bgRgb
    ctx.shadowColor = `rgba(${bg[0]},${bg[1]},${bg[2]},0.8)`
    ctx.shadowBlur = 6
    let cx = tx
    for (let i = 0; i < parts.length; i++) { ctx.fillStyle = parts[i].color; ctx.fillText(parts[i].text, cx, ty); cx += widths[i] }
    ctx.restore()
  }

  // ─── Draw: Loading ────────────────────────────────────────────────────

  private drawLoading(
    ctx: CanvasRenderingContext2D, w: number, h: number,
    pad: ChartPadding, palette: ChartPalette, now_ms: number,
  ): void {
    const chartW = w - pad.left - pad.right
    const chartH = h - pad.top - pad.bottom
    const centerY = pad.top + chartH / 2
    const amplitude = chartH * LOADING_AMPLITUDE_RATIO
    const scroll = now_ms * LOADING_SCROLL_SPEED
    const breath = loadingBreath(now_ms)
    const numPts = 32
    const pts: [number, number][] = []
    for (let i = 0; i <= numPts; i++) {
      const t = i / numPts
      pts.push([pad.left + t * chartW, loadingY(t, centerY, amplitude, scroll)])
    }
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(pts[0][0], pts[0][1])
    drawSpline(ctx, pts)
    ctx.strokeStyle = palette.line
    ctx.lineWidth = palette.lineWidth
    ctx.globalAlpha = breath
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
    ctx.restore()
  }

  // ─── Draw: Edge fade ──────────────────────────────────────────────────

  private drawEdgeFade(ctx: CanvasRenderingContext2D, pad: ChartPadding, w: number, h: number): void {
    ctx.save()
    ctx.globalCompositeOperation = 'destination-out'
    const grad = ctx.createLinearGradient(pad.left, 0, pad.left + FADE_EDGE_WIDTH, 0)
    grad.addColorStop(0, 'rgba(0, 0, 0, 1)')
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, pad.left + FADE_EDGE_WIDTH, h)
    ctx.restore()
  }

  // ─── Draw: Line + fill ────────────────────────────────────────────────

  private drawLine(
    ctx: CanvasRenderingContext2D, layout: ChartLayout, palette: ChartPalette,
    visible: ChartPoint[], smoothValue: number, now: number,
    showFill: boolean, scrubX: number | null, scrubAmount: number,
    chartReveal: number, now_ms: number,
  ): [number, number][] | undefined {
    const { h, pad, toX, toY, chartW, chartH } = layout
    const incomingAlpha = ctx.globalAlpha
    const yMin = pad.top
    const yMax = h - pad.bottom
    const clampY = (y: number) => Math.max(yMin, Math.min(yMax, y))

    const centerY = pad.top + chartH / 2
    const amplitude = chartH * LOADING_AMPLITUDE_RATIO
    const scroll = now_ms * LOADING_SCROLL_SPEED
    const morphY = chartReveal < 1
      ? (rawY: number, x: number) => {
          const t = Math.max(0, Math.min(1, (x - pad.left) / chartW))
          const centerDist = Math.abs(t - 0.5) * 2
          const localReveal = Math.max(0, Math.min(1, (chartReveal - centerDist * 0.4) / 0.6))
          const baseY = loadingY(t, centerY, amplitude, scroll)
          return baseY + (rawY - baseY) * localReveal
        }
      : (rawY: number) => rawY

    const pts: [number, number][] = visible.map((p, i) => {
      const x = toX(p.time)
      const y = i === visible.length - 1
        ? morphY(clampY(toY(smoothValue)), x)
        : morphY(clampY(toY(p.value)), x)
      return [x, y]
    })

    const liveTipX = toX(now)
    const fullRightX = pad.left + chartW
    const tipX = chartReveal < 1 ? liveTipX + (fullRightX - liveTipX) * (1 - chartReveal) : liveTipX
    pts.push([tipX, morphY(clampY(toY(smoothValue)), tipX)])

    if (pts.length < 2) return undefined

    let lineAlpha = 1
    let fillAlpha = 1
    if (chartReveal < 1) {
      const breath = loadingBreath(now_ms)
      lineAlpha = breath + (1 - breath) * chartReveal
      fillAlpha = chartReveal
    }

    const colorT = Math.min(1, chartReveal * 3)
    const strokeColor = chartReveal < 1 ? blendColor(palette.gridLabel, palette.line, colorT) : undefined
    const isScrubbing = scrubX !== null

    // Clip to chart area
    ctx.save()
    ctx.beginPath()
    ctx.rect(pad.left - 1, pad.top, chartW + 2, chartH)
    ctx.clip()

    if (isScrubbing) {
      ctx.save()
      ctx.beginPath()
      ctx.rect(0, 0, scrubX!, h)
      ctx.clip()
      this.renderCurve(ctx, layout, palette, pts, showFill, lineAlpha, fillAlpha, strokeColor)
      ctx.restore()

      ctx.save()
      ctx.beginPath()
      ctx.rect(scrubX!, 0, layout.w - scrubX!, h)
      ctx.clip()
      ctx.globalAlpha = incomingAlpha * (1 - scrubAmount * 0.6)
      this.renderCurve(ctx, layout, palette, pts, showFill, lineAlpha, fillAlpha, strokeColor)
      ctx.restore()
    } else {
      this.renderCurve(ctx, layout, palette, pts, showFill, lineAlpha, fillAlpha, strokeColor)
    }

    ctx.restore() // chart area clip

    // Dashed current-price line
    const realCurrentY = Math.max(pad.top, Math.min(h - pad.bottom, toY(smoothValue)))
    const currentY = chartReveal < 1 ? centerY + (realCurrentY - centerY) * chartReveal : realCurrentY
    ctx.setLineDash([4, 4])
    ctx.strokeStyle = palette.dashLine
    ctx.lineWidth = 1
    const dashBase = isScrubbing ? 1 - scrubAmount * 0.2 : 1
    ctx.globalAlpha = incomingAlpha * (chartReveal < 1 ? dashBase * chartReveal : dashBase)
    ctx.beginPath()
    ctx.moveTo(pad.left, currentY)
    ctx.lineTo(layout.w - pad.right, currentY)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.globalAlpha = incomingAlpha

    // Clamp dot Y
    const last = pts[pts.length - 1]
    last[1] = Math.max(10, Math.min(h - 10, last[1]))

    return pts
  }

  private renderCurve(
    ctx: CanvasRenderingContext2D, layout: ChartLayout, palette: ChartPalette,
    pts: [number, number][], showFill: boolean,
    lineAlpha: number, fillAlpha: number, strokeColor?: string,
  ): void {
    const { h, pad } = layout
    const baseAlpha = ctx.globalAlpha

    if (showFill && fillAlpha > 0.01) {
      ctx.globalAlpha = baseAlpha * fillAlpha
      const grad = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom)
      grad.addColorStop(0, palette.fillTop)
      grad.addColorStop(1, palette.fillBottom)
      ctx.beginPath()
      ctx.moveTo(pts[0][0], h - pad.bottom)
      ctx.lineTo(pts[0][0], pts[0][1])
      drawSpline(ctx, pts)
      ctx.lineTo(pts[pts.length - 1][0], h - pad.bottom)
      ctx.closePath()
      ctx.fillStyle = grad
      ctx.fill()
    }

    ctx.globalAlpha = baseAlpha * lineAlpha
    ctx.beginPath()
    ctx.moveTo(pts[0][0], pts[0][1])
    drawSpline(ctx, pts)
    ctx.strokeStyle = strokeColor ?? palette.line
    ctx.lineWidth = palette.lineWidth
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.stroke()
    ctx.globalAlpha = baseAlpha
  }

  // ─── Draw: Dot ────────────────────────────────────────────────────────

  private drawDot(
    ctx: CanvasRenderingContext2D, x: number, y: number,
    palette: ChartPalette, pulse: boolean, scrubAmount: number, now_ms: number,
  ): void {
    const baseAlpha = ctx.globalAlpha
    const dim = scrubAmount * 0.7

    if (pulse && dim < 0.3) {
      const t = (now_ms % PULSE_INTERVAL) / PULSE_DURATION
      if (t < 1) {
        const radius = 9 + t * 12
        const pulseAlpha = 0.35 * (1 - t) * (1 - dim * 3)
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.strokeStyle = palette.line
        ctx.lineWidth = 1.5
        ctx.globalAlpha = baseAlpha * pulseAlpha
        ctx.stroke()
      }
    }

    const outerRgb = parseColorRgb(palette.badgeOuterBg)
    ctx.save()
    ctx.globalAlpha = baseAlpha
    ctx.shadowColor = palette.badgeOuterShadow
    ctx.shadowBlur = 6 * (1 - dim)
    ctx.shadowOffsetY = 1
    ctx.beginPath()
    ctx.arc(x, y, 6.5, 0, Math.PI * 2)
    ctx.fillStyle = palette.badgeOuterBg
    ctx.fill()
    ctx.restore()

    ctx.globalAlpha = baseAlpha
    ctx.beginPath()
    ctx.arc(x, y, 3.5, 0, Math.PI * 2)
    if (dim > 0.01) {
      const lineRgb = parseColorRgb(palette.line)
      ctx.fillStyle = lerpColor(lineRgb, outerRgb, dim)
    } else {
      ctx.fillStyle = palette.line
    }
    ctx.fill()
  }

  // ─── Draw: Arrows ─────────────────────────────────────────────────────

  private drawArrows(
    ctx: CanvasRenderingContext2D, x: number, y: number,
    momentum: ChartMomentum, palette: ChartPalette, dt: number, now_ms: number,
  ): void {
    const baseAlpha = ctx.globalAlpha
    const arrows = this.arrowState
    const upTarget = momentum === 'up' ? 1 : 0
    const downTarget = momentum === 'down' ? 1 : 0
    arrows.up = lerp(arrows.up, arrows.down < 0.02 ? upTarget : 0, upTarget > arrows.up ? 0.08 : 0.04, dt)
    arrows.down = lerp(arrows.down, arrows.up < 0.02 ? downTarget : 0, downTarget > arrows.down ? 0.08 : 0.04, dt)
    if (arrows.up < 0.01) arrows.up = 0
    if (arrows.down < 0.01) arrows.down = 0
    if (arrows.up > 0.99) arrows.up = 1
    if (arrows.down > 0.99) arrows.down = 1

    const cycle = (now_ms % 1400) / 1400
    const drawChevrons = (dir: -1 | 1, opacity: number) => {
      if (opacity < 0.01) return
      const baseX = x + 19
      ctx.save()
      ctx.strokeStyle = palette.gridLabel
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      for (let i = 0; i < 2; i++) {
        const start = i * 0.2
        const dur = 0.35
        const localT = cycle - start
        const wave = (localT >= 0 && localT < dur) ? Math.sin((localT / dur) * Math.PI) : 0
        const pulse = 0.3 + 0.7 * wave
        ctx.globalAlpha = baseAlpha * opacity * pulse
        const nudge = dir === -1 ? -3 : 3
        const cy = y + dir * (i * 8 - 4) + nudge
        ctx.beginPath()
        ctx.moveTo(baseX - 5, cy - dir * 3.5)
        ctx.lineTo(baseX, cy)
        ctx.lineTo(baseX + 5, cy - dir * 3.5)
        ctx.stroke()
      }
      ctx.restore()
    }
    drawChevrons(-1, arrows.up)
    drawChevrons(1, arrows.down)
    ctx.globalAlpha = baseAlpha
  }

  // ─── Draw: Grid ───────────────────────────────────────────────────────

  private drawGrid(
    ctx: CanvasRenderingContext2D, layout: ChartLayout, palette: ChartPalette,
    formatValue: (v: number) => string, dt: number,
  ): void {
    const { w, h, pad, valRange, minVal, maxVal, toY } = layout
    const chartH = h - pad.top - pad.bottom
    if (chartH <= 0 || valRange <= 0) return
    const pxPerUnit = chartH / valRange
    const state = this.gridState

    // Pick interval with hysteresis
    const pickInterval = (range: number, pxPU: number, minGap: number, prev: number): number => {
      if (prev > 0) {
        const px = prev * pxPU
        if (px >= minGap * 0.5 && px <= minGap * 4) return prev
      }
      const divisorSets = [[2, 2.5, 2], [2, 2, 2.5], [2.5, 2, 2]]
      let best = Infinity
      for (const divs of divisorSets) {
        let span = Math.pow(10, Math.ceil(Math.log10(range)))
        let i = 0
        while (span / divs[i % 3] * pxPU >= minGap) { span /= divs[i % 3]; i++ }
        if (span < best) best = span
      }
      return best === Infinity ? range / 5 : best
    }

    const coarse = pickInterval(valRange, pxPerUnit, 36, state.interval)
    state.interval = coarse
    const fine = coarse / 2
    const finePx = fine * pxPerUnit
    const fineTarget = finePx < 40 ? 0 : finePx >= 60 ? 1 : (finePx - 40) / 20
    const fadeZone = 32
    const edgeAlpha = (y: number) => {
      const fromEdge = Math.min(y - pad.top, h - pad.bottom - y)
      return fromEdge >= fadeZone ? 1 : fromEdge <= 0 ? 0 : fromEdge / fadeZone
    }

    const targets = new Map<number, number>()
    const firstVal = Math.ceil(minVal / fine) * fine
    for (let val = firstVal; val <= maxVal; val += fine) {
      const y = toY(val)
      if (y < pad.top - 2 || y > h - pad.bottom + 2) continue
      const isCoarse = Math.abs(val / coarse - Math.round(val / coarse)) < 0.01
      targets.set(Math.round(val * 1000), (isCoarse ? 1 : fineTarget) * edgeAlpha(y))
    }

    for (const [key, alpha] of state.labels) {
      const target = targets.get(key) ?? 0
      const speed = target >= alpha ? 0.18 : 0.12
      let next = lerp(alpha, target, speed, dt)
      if (Math.abs(next - target) < 0.02) next = target
      if (next < 0.01 && target === 0) state.labels.delete(key)
      else state.labels.set(key, next)
    }
    for (const [key, target] of targets) {
      if (!state.labels.has(key)) state.labels.set(key, target * 0.18)
    }

    const baseAlpha = ctx.globalAlpha
    ctx.setLineDash([1, 3])
    ctx.lineWidth = 1
    ctx.font = palette.labelFont
    ctx.textAlign = 'left'
    for (const [key, alpha] of state.labels) {
      if (alpha < 0.02) continue
      const val = key / 1000
      const y = toY(val)
      if (y < pad.top - 10 || y > h - pad.bottom + 10) continue
      ctx.save()
      ctx.globalAlpha = baseAlpha * alpha
      ctx.strokeStyle = palette.gridLine
      ctx.beginPath()
      ctx.moveTo(pad.left, y)
      ctx.lineTo(w - pad.right, y)
      ctx.stroke()
      ctx.fillStyle = palette.gridLabel
      ctx.fillText(formatValue(val), w - pad.right + 8, y + 4)
      ctx.restore()
    }
    ctx.setLineDash([])
  }

  // ─── Draw: Time axis ──────────────────────────────────────────────────

  private drawTimeAxis(
    ctx: CanvasRenderingContext2D, layout: ChartLayout, palette: ChartPalette,
    windowSecs: number, targetWindowSecs: number, dt: number,
  ): void {
    const { h, pad, leftEdge, rightEdge, toX } = layout
    const chartLeft = pad.left
    const chartRight = layout.w - pad.right
    const chartW = chartRight - chartLeft
    const fadeZone = 50
    const state = this.timeAxisState
    const formatTime = this.cfg.formatTime ?? this.defaultFormatTime

    const edgeAlpha = (x: number) => {
      const fromEdge = Math.min(x - chartLeft, chartRight - x)
      return fromEdge >= fadeZone ? 1 : fromEdge <= 0 ? 0 : fromEdge / fadeZone
    }

    ctx.font = palette.labelFont
    const targetPxPerSec = chartW / targetWindowSecs
    let interval = niceTimeInterval(targetWindowSecs)
    while (interval * targetPxPerSec < 60 && interval < targetWindowSecs) interval *= 2

    const firstTime = Math.ceil((leftEdge - interval) / interval) * interval
    const targets = new Set<number>()
    for (let t = firstTime; t <= rightEdge + interval && targets.size < 30; t += interval) {
      targets.add(Math.round(t * 100))
    }

    for (const key of targets) {
      const text = formatTime(key / 100)
      const existing = state.labels.get(key)
      if (!existing) state.labels.set(key, { alpha: 0, text })
      else existing.text = text
    }

    for (const [key, label] of state.labels) {
      const x = toX(key / 100)
      const target = targets.has(key) ? edgeAlpha(x) : 0
      let next = lerp(label.alpha, target, 0.08, dt)
      if (Math.abs(next - target) < 0.02) next = target
      if (next < 0.01 && target === 0) state.labels.delete(key)
      else label.alpha = next
    }

    const baseAlpha = ctx.globalAlpha
    const lineY = h - pad.bottom
    ctx.strokeStyle = palette.gridLine
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(chartLeft, lineY)
    ctx.lineTo(chartRight, lineY)
    ctx.stroke()
    ctx.textAlign = 'center'

    const labels: { x: number; alpha: number; text: string; w: number }[] = []
    for (const [key, label] of state.labels) {
      if (label.alpha < 0.02) continue
      const x = toX(key / 100)
      if (x < chartLeft - 20 || x > chartRight) continue
      labels.push({ x, alpha: label.alpha, text: label.text, w: ctx.measureText(label.text).width })
    }
    labels.sort((a, b) => a.x - b.x)

    // Resolve overlaps
    const drawn: typeof labels = []
    for (const label of labels) {
      const left = label.x - label.w / 2
      if (drawn.length > 0) {
        const prev = drawn[drawn.length - 1]
        if (left < prev.x + prev.w / 2 + 8) {
          if (label.alpha > prev.alpha) drawn[drawn.length - 1] = label
          continue
        }
      }
      drawn.push(label)
    }

    for (const label of drawn) {
      ctx.save()
      ctx.globalAlpha = baseAlpha * label.alpha
      ctx.strokeStyle = palette.gridLine
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(label.x, lineY)
      ctx.lineTo(label.x, lineY + 5)
      ctx.stroke()
      ctx.fillStyle = palette.timeLabel
      ctx.fillText(label.text, label.x, lineY + 19)
      ctx.restore()
    }
  }

  private defaultFormatTime(t: number): string {
    const d = new Date(t * 1000)
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
  }

  // ─── Draw: Crosshair ─────────────────────────────────────────────────

  private drawCrosshair(
    ctx: CanvasRenderingContext2D, layout: ChartLayout, palette: ChartPalette,
    hoverX: number, hoverValue: number, hoverTime: number,
    scrubOpacity: number, liveDotX: number,
  ): void {
    const { h, pad, toY } = layout
    const y = toY(hoverValue)
    const formatValue = this.cfg.formatValue
    const formatTime = this.cfg.formatTime ?? this.defaultFormatTime

    ctx.save()
    ctx.globalAlpha = scrubOpacity * 0.5
    ctx.strokeStyle = palette.crosshairLine
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(hoverX, pad.top)
    ctx.lineTo(hoverX, h - pad.bottom)
    ctx.stroke()
    ctx.restore()

    const dotRadius = 4 * Math.min(scrubOpacity * 3, 1)
    if (dotRadius > 0.5) {
      ctx.globalAlpha = 1
      ctx.beginPath()
      ctx.arc(hoverX, y, dotRadius, 0, Math.PI * 2)
      ctx.fillStyle = palette.line
      ctx.fill()
    }

    if (scrubOpacity < 0.1 || layout.w < 300) return

    const valueText = formatValue(hoverValue)
    const timeText = formatTime(hoverTime)
    const separator = '  ·  '

    ctx.save()
    ctx.globalAlpha = scrubOpacity
    ctx.font = '400 13px "SF Mono", Menlo, monospace'
    const valueW = ctx.measureText(valueText).width
    const sepW = ctx.measureText(separator).width
    const timeW = ctx.measureText(timeText).width
    const totalW = valueW + sepW + timeW

    let tx = hoverX - totalW / 2
    const minX = pad.left + 4
    const maxX = liveDotX + 7 - totalW
    if (tx < minX) tx = minX
    if (tx > maxX) tx = maxX

    const ty = pad.top + (this.cfg.tooltipY ?? 14) + 10
    ctx.textAlign = 'left'
    const bg = palette.bgRgb
    ctx.shadowColor = `rgba(${bg[0]},${bg[1]},${bg[2]},0.8)`
    ctx.shadowBlur = 6

    ctx.fillStyle = palette.tooltipText
    ctx.globalAlpha = scrubOpacity * 0.9
    ctx.fillText(valueText, tx, ty)
    ctx.fillStyle = palette.gridLabel
    ctx.globalAlpha = scrubOpacity * 0.65
    ctx.fillText(separator + timeText, tx + valueW, ty)
    ctx.restore()
  }

  // ─── Draw: Reference line ─────────────────────────────────────────────

  private drawReferenceLine(
    ctx: CanvasRenderingContext2D, layout: ChartLayout, palette: ChartPalette,
    ref: ChartReferenceLine,
  ): void {
    const { w, h, pad, toY, chartW } = layout
    const y = toY(ref.value)
    if (y < pad.top - 10 || y > h - pad.bottom + 10) return
    const label = ref.label ?? ''

    if (label) {
      ctx.font = '500 11px system-ui, sans-serif'
      const textW = ctx.measureText(label).width
      const centerX = pad.left + chartW / 2
      const gapPad = 8
      ctx.strokeStyle = palette.refLine
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(pad.left, y)
      ctx.lineTo(centerX - textW / 2 - gapPad, y)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(centerX + textW / 2 + gapPad, y)
      ctx.lineTo(w - pad.right, y)
      ctx.stroke()
      ctx.fillStyle = palette.refLabel
      ctx.textAlign = 'center'
      ctx.fillText(label, centerX, y + 4)
    } else {
      ctx.strokeStyle = palette.refLine
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(pad.left, y)
      ctx.lineTo(w - pad.right, y)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }

  // ─── Draw: Orderbook ──────────────────────────────────────────────────

  private drawOrderbook(
    ctx: CanvasRenderingContext2D, layout: ChartLayout, palette: ChartPalette,
    orderbook: ChartOrderbookData, dt: number, swingMagnitude: number,
  ): void {
    const { pad, h, chartH } = layout
    const dtSec = dt / 1000
    const state = this.orderbookState
    const GREEN: [number, number, number] = [34, 197, 94]
    const RED: [number, number, number] = [239, 68, 68]

    if (orderbook.bids.length === 0 && orderbook.asks.length === 0) return
    let maxSize = 0, bidTotal = 0, askTotal = 0
    for (const [, size] of orderbook.bids) { bidTotal += size; if (size > maxSize) maxSize = size }
    for (const [, size] of orderbook.asks) { askTotal += size; if (size > maxSize) maxSize = size }
    if (maxSize === 0) return

    const totalSize = bidTotal + askTotal
    const prevTotal = state.prevBidTotal + state.prevAskTotal
    let churnSignal = 0
    if (prevTotal > 0) {
      churnSignal = Math.min((Math.abs(bidTotal - state.prevBidTotal) + Math.abs(askTotal - state.prevAskTotal)) / prevTotal, 1)
    }
    state.prevBidTotal = bidTotal
    state.prevAskTotal = askTotal
    state.churnRate += (churnSignal - state.churnRate) * (churnSignal > state.churnRate ? 0.3 : 0.05)

    const activity = Math.max(Math.min(swingMagnitude * 5, 1), state.churnRate)
    const targetSpeed = 60 + activity * 100
    state.smoothSpeed += (targetSpeed - state.smoothSpeed) * (1 - Math.pow(0.95, dt / 16.67))
    const speed = state.smoothSpeed

    const labelX = pad.left + 8
    const bottomY = h - pad.bottom - 6
    const topY = pad.top

    state.spawnTimer += dt
    while (state.spawnTimer >= 40 && state.labels.length < 50) {
      state.spawnTimer -= 40
      let tooClose = false
      for (const l of state.labels) { if (Math.abs(l.y - bottomY) < 22) { tooClose = true; break } }
      if (tooClose) break

      const allLevels: { size: number; green: boolean }[] = []
      for (const [, size] of orderbook.bids) allLevels.push({ size, green: true })
      for (const [, size] of orderbook.asks) allLevels.push({ size, green: false })
      let tw = 0
      for (const l of allLevels) tw += l.size
      let r = Math.random() * tw
      let picked = allLevels[0]
      for (const l of allLevels) { r -= l.size; if (r <= 0) { picked = l; break } }
      state.labels.push({
        y: bottomY, text: `+ $${picked.size >= 10 ? Math.round(picked.size) : picked.size.toFixed(1)}`,
        green: picked.green, life: 6, maxLife: 6, intensity: 0.5 + (picked.size / maxSize) * 0.5,
      })
    }

    let writeIdx = 0
    const range = bottomY - topY
    for (const l of state.labels) {
      l.life -= dtSec
      if (l.life <= 0) continue
      const yProgress = range > 0 ? (l.y - topY) / range : 1
      l.y -= speed * (0.7 + 0.3 * yProgress) * dtSec
      if (l.y < topY - 14) continue
      state.labels[writeIdx++] = l
    }
    state.labels.length = writeIdx

    const baseAlpha = ctx.globalAlpha
    ctx.save()
    ctx.font = '500 11px "SF Mono", Menlo, monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    const bg = palette.bgRgb

    for (const l of state.labels) {
      const fadeIn = Math.min((1 - l.life / l.maxLife) * 10, 1)
      const yRatio = (l.y - topY) / chartH
      const fadeOut = yRatio < 0.45 ? yRatio / 0.45 : 1
      const strength = l.intensity * fadeIn * fadeOut
      const base = l.green ? GREEN : RED
      const alpha = 0.55 + strength * 0.4
      const fillColor = `rgba(${base[0]},${base[1]},${base[2]},${alpha})`
      ctx.save()
      ctx.shadowColor = `rgba(${bg[0]},${bg[1]},${bg[2]},0.8)`
      ctx.shadowBlur = 6
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      ctx.fillStyle = fillColor
      ctx.fillText(l.text, labelX, l.y)
      ctx.restore()
    }
    ctx.restore()
  }

  // ─── Particles ────────────────────────────────────────────────────────

  private spawnParticles(
    momentum: ChartMomentum, dotX: number, dotY: number,
    swingMagnitude: number, accentColor: string, dt: number,
    options: ChartDegenOptions,
  ): number {
    const state = this.particleState
    state.cooldown = Math.max(0, state.cooldown - dt)
    if (momentum === 'flat' || state.cooldown > 0) return 0
    if (swingMagnitude < PARTICLE_MAGNITUDE_THRESHOLD) { state.burstCount = 0; return 0 }
    if (momentum === 'down' && !options.downMomentum) return 0
    if (state.burstCount >= PARTICLE_MAX_BURSTS) return 0

    state.cooldown = PARTICLE_COOLDOWN_MS
    const scale = options.scale ?? 1
    const isUp = momentum === 'up'
    const mag = Math.min(swingMagnitude * 5, 1)
    const burstFalloff = mag > 0.6 ? 1 : [1, 0.6, 0.35][state.burstCount] ?? 0.35
    state.burstCount++
    const count = Math.round((12 + mag * 20) * scale * burstFalloff)
    const speedMultiplier = 1.0 + mag * 0.8

    for (let i = 0; i < count && state.particles.length < MAX_PARTICLES; i++) {
      const baseAngle = isUp ? -Math.PI / 2 : Math.PI / 2
      const angle = baseAngle + (Math.random() - 0.5) * Math.PI * 1.2
      const speed = (60 + Math.random() * 100) * speedMultiplier
      state.particles.push({
        x: dotX + (Math.random() - 0.5) * 24, y: dotY + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        life: 1, size: (1 + Math.random() * 1.2) * scale * burstFalloff, color: accentColor,
      })
    }
    return burstFalloff
  }

  private drawParticles(ctx: CanvasRenderingContext2D, dt: number): void {
    const state = this.particleState
    if (state.particles.length === 0) return
    const dtSec = dt / 1000
    ctx.save()
    let writeIdx = 0
    for (const p of state.particles) {
      p.life -= dtSec / PARTICLE_LIFETIME
      if (p.life <= 0) continue
      p.x += p.vx * dtSec
      p.y += p.vy * dtSec
      p.vx *= 0.95
      p.vy *= 0.95
      ctx.globalAlpha = p.life * 0.55
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * (0.5 + p.life * 0.5), 0, Math.PI * 2)
      ctx.fill()
      state.particles[writeIdx++] = p
    }
    state.particles.length = writeIdx
    ctx.restore()
  }

  // ─── Badge DOM update ─────────────────────────────────────────────────

  private updateBadge(
    layout: ChartLayout, smoothValue: number,
    momentum: ChartMomentum, dt: number,
  ): void {
    const badge = this.badge!
    const cfg = this.cfg
    const palette = this.palette
    const chartReveal = this.chartReveal

    if (!cfg.badge || chartReveal < 0.25) {
      badge.container.style.display = 'none'
      return
    }
    badge.container.style.display = ''
    const badgeOpacity = chartReveal < 0.5 ? (chartReveal - 0.25) / 0.25 : 1
    badge.container.style.opacity = badgeOpacity < 1 ? String(badgeOpacity) : ''

    const { w, h, pad } = layout
    const text = cfg.formatValue(smoothValue)
    badge.text.textContent = text
    badge.text.style.font = palette.labelFont
    badge.text.style.lineHeight = `${BADGE_LINE_H}px`
    const tailLen = cfg.badgeTail ? BADGE_TAIL_LEN : 0
    badge.text.style.padding = `${BADGE_PAD_Y}px ${BADGE_PAD_X}px ${BADGE_PAD_Y}px ${tailLen + BADGE_PAD_X}px`

    this.ctx.font = palette.labelFont
    const template = text.replace(/[0-9]/g, '8')
    const targetTextW = this.ctx.measureText(template).width
    badge.targetW = targetTextW
    if (badge.displayW === 0) badge.displayW = targetTextW
    badge.displayW = lerp(badge.displayW, badge.targetW, BADGE_WIDTH_LERP, dt)
    if (Math.abs(badge.displayW - badge.targetW) < 0.3) badge.displayW = badge.targetW

    const pillW = badge.displayW + BADGE_PAD_X * 2
    const pillH = BADGE_LINE_H + BADGE_PAD_Y * 2
    const totalW = tailLen + pillW
    badge.svg.setAttribute('width', String(Math.ceil(totalW)))
    badge.svg.setAttribute('height', String(pillH))
    badge.svg.setAttribute('viewBox', `0 0 ${totalW} ${pillH}`)
    badge.path.setAttribute('d', cfg.badgeTail
      ? badgeSvgPath(pillW, pillH, BADGE_TAIL_LEN, BADGE_TAIL_SPREAD)
      : badgePillOnly(pillW, pillH))

    const centerY = pad.top + layout.chartH / 2
    const realTargetY = Math.max(pad.top, Math.min(h - pad.bottom, layout.toY(smoothValue)))
    const targetBadgeY = chartReveal < 1 ? centerY + (realTargetY - centerY) * chartReveal : realTargetY
    if (this.badgeY === null) this.badgeY = targetBadgeY
    else this.badgeY = lerp(this.badgeY, targetBadgeY, BADGE_Y_LERP, dt)

    const badgeLeft = w - pad.right + 8 - BADGE_PAD_X - tailLen
    const badgeTop = this.badgeY - pillH / 2
    badge.container.style.transform = `translate3d(${badgeLeft}px, ${badgeTop}px, 0)`

    if (cfg.badgeVariant === 'minimal') {
      badge.path.setAttribute('fill', palette.badgeOuterBg)
      badge.text.style.color = palette.tooltipText
      badge.container.style.filter = `drop-shadow(0 1px 4px ${palette.badgeOuterShadow})`
    } else {
      badge.container.style.filter = ''
      badge.text.style.color = '#fff'
      const showMom = cfg.momentum !== false
      if (!showMom) {
        badge.path.setAttribute('fill', palette.line)
      } else {
        const target = momentum === 'up' ? 1 : momentum === 'down' ? 0 : this.badgeColor.green
        this.badgeColor.green = lerp(this.badgeColor.green, target, MOMENTUM_COLOR_LERP, dt)
        if (this.badgeColor.green > 0.99) this.badgeColor.green = 1
        if (this.badgeColor.green < 0.01) this.badgeColor.green = 0
        const g = this.badgeColor.green
        badge.path.setAttribute('fill', `rgb(${Math.round(MOMENTUM_RED[0] + (MOMENTUM_GREEN[0] - MOMENTUM_RED[0]) * g)},${Math.round(MOMENTUM_RED[1] + (MOMENTUM_GREEN[1] - MOMENTUM_RED[1]) * g)},${Math.round(MOMENTUM_RED[2] + (MOMENTUM_GREEN[2] - MOMENTUM_RED[2]) * g)})`)
      }
    }
  }
}
