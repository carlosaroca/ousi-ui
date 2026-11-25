import { computed, inject, onScopeDispose, provide, ref, watch } from 'vue'
import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { ChartPoint } from '@ousi-ui/vue'

/**
 * One clock for the whole landing bento.
 *
 * Every tile loops its own little demo (typing, toggling, filling, hovering), but none of them
 * owns a timer: the clock lives here, once, and a tile derives what it shows from `t` (seconds).
 * That is one interval for two dozen tiles, they all start together, and a tile is easy to
 * reason about: same time in, same picture out.
 *
 * The clock stops while the bento is off screen or the tab is hidden, and never runs for
 * people who ask for reduced motion (tiles then show the picture at REST_T).
 */

const BEAT_MS = 80

/**
 * The moment tiles show when the clock is frozen: typing done, code verified, every task ticked, the
 * deploy finished, nothing mid-spin. Tiles are written so this second looks good; change a tile's
 * timing and check this one still does.
 */
const REST_T = 4.6

/** A media query as a ref that follows the browser. */
export function useMedia(query: string): Ref<boolean> {
  const mql = window.matchMedia(query)
  const matches = ref(mql.matches)
  const update = () => { matches.value = mql.matches }
  mql.addEventListener('change', update)
  onScopeDispose(() => mql.removeEventListener('change', update))
  return matches
}

/** Width of an element in px, kept up to date. It is 0 until the element exists. */
export function useElementWidth(target: Ref<HTMLElement | null>): Ref<number> {
  const width = ref(0)
  let observer: ResizeObserver | null = null
  watch(target, (el) => {
    observer?.disconnect()
    observer = null
    if (!el) return
    width.value = el.getBoundingClientRect().width
    observer = new ResizeObserver(([entry]) => { width.value = entry.contentRect.width })
    observer.observe(el)
  }, { immediate: true, flush: 'post' })
  onScopeDispose(() => observer?.disconnect())
  return width
}

function useInView(target: Ref<HTMLElement | null>): Ref<boolean> {
  const inView = ref(false)
  let observer: IntersectionObserver | null = null
  watch(target, (el) => {
    observer?.disconnect()
    observer = null
    if (!el) return
    observer = new IntersectionObserver(([entry]) => { inView.value = entry.isIntersecting })
    observer.observe(el)
  }, { immediate: true, flush: 'post' })
  onScopeDispose(() => observer?.disconnect())
  return inView
}

function usePageVisible(): Ref<boolean> {
  const visible = ref(document.visibilityState === 'visible')
  const update = () => { visible.value = document.visibilityState === 'visible' }
  document.addEventListener('visibilitychange', update)
  onScopeDispose(() => document.removeEventListener('visibilitychange', update))
  return visible
}

export interface Showcase {
  /** Seconds the bento has been running. */
  t: ComputedRef<number>
  /** Turns true the first time the bento scrolls into view, and stays true. Starts the entrance. */
  entered: Ref<boolean>
  /** Index of the current slot when time is cut every `seconds`: 0, 1, 2... */
  slot: (seconds: number) => ComputedRef<number>
  /** True when the visitor prefers reduced motion. Nothing moves and tiles show a still picture. */
  reduced: Ref<boolean>
  /** A live line that gets a new point every 1.2 s. */
  revenue: { data: Ref<ChartPoint[]>; value: Ref<number> }
}

const KEY: InjectionKey<Showcase> = Symbol('landing-showcase')

export function provideShowcase(target: Ref<HTMLElement | null>): Showcase {
  const reduced = useMedia('(prefers-reduced-motion: reduce)')
  const pageVisible = usePageVisible()
  const inView = useInView(target)
  const running = computed(() => !reduced.value && inView.value && pageVisible.value)

  const entered = ref(false)
  watch(inView, (on) => { if (on) entered.value = true })

  const beat = ref(0)
  let timer: ReturnType<typeof setInterval> | null = null
  const stop = () => { if (timer) clearInterval(timer); timer = null }
  watch(running, (on) => {
    stop()
    if (on) timer = setInterval(() => { beat.value++ }, BEAT_MS)
  }, { immediate: true })
  onScopeDispose(stop)

  const t = computed(() => (reduced.value ? REST_T : (beat.value * BEAT_MS) / 1000))
  const slot = (seconds: number) => computed(() => Math.floor(t.value / seconds))

  // Live series: starts with a minute of history, then walks forward.
  const now = Date.now() / 1000
  let v = 100
  const history: ChartPoint[] = []
  for (let i = 60; i >= 0; i--) {
    v += (Math.random() - 0.3) * 1.4
    history.push({ time: now - i * 5, value: Math.max(v, 0) })
  }
  const data = ref<ChartPoint[]>(history)
  const value = ref(v)
  const tick = slot(1.2)
  watch(tick, () => {
    value.value += (Math.random() - 0.3) * 1.2
    data.value = [...data.value.slice(-120), { time: Date.now() / 1000, value: Math.max(value.value, 0) }]
  })

  const showcase: Showcase = { t, entered, slot, reduced, revenue: { data, value } }
  provide(KEY, showcase)
  return showcase
}

export function useShowcase(): Showcase {
  const showcase = inject(KEY)
  if (!showcase) throw new Error('useShowcase() needs a parent that called provideShowcase()')
  return showcase
}
