<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, toRef, useId, watch } from 'vue'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import { cn, useControllableState, useFocusScope, useLayer, useMounted } from '@ousi-ui/core'
import { useOusiMessages } from '../../config'
import { OButton } from '../button'
import { tourCardTheme, tourSpotlightTheme } from './tour.theme'
import type { TourEmits, TourProps, TourSlotContext, TourSlots, TourStep } from './tour.types'

const props = withDefaults(defineProps<TourProps>(), {
  modelValue: false,
  step: undefined,
  padding: 8,
  showProgress: true,
  showCloseButton: true,
  closeOnEscape: true,
  shadow: 'xl',
})
const emit = defineEmits<TourEmits>()
defineSlots<TourSlots>()

const text = useOusiMessages()
const isMounted = useMounted()
const titleId = useId()
const descriptionId = useId()

const isOpen = computed(() => !!props.modelValue && props.steps.length > 0)

const stepValue = useControllableState<number>({
  prop: toRef(props, 'step') as never,
  defaultValue: 0,
  onChange: (value) => emit('update:step', value),
})
const index = computed(() => Math.min(Math.max(stepValue.value, 0), Math.max(props.steps.length - 1, 0)))
const current = computed<TourStep | undefined>(() => props.steps[index.value])
const isLast = computed(() => index.value >= props.steps.length - 1)

function goTo(step: number) {
  const to = Math.min(Math.max(step, 0), props.steps.length - 1)
  if (to !== index.value) stepValue.value = to
}
function prev() {
  goTo(index.value - 1)
}
function next() {
  if (!isLast.value) return goTo(index.value + 1)
  emit('finish')
  emit('update:modelValue', false)
}
function close() {
  emit('skip', index.value)
  emit('update:modelValue', false)
}

// A run starts at the beginning, unless the app says which step it is on.
watch(isOpen, (open) => {
  // Only when it is a change: otherwise opening would report a move that did not happen.
  if (open && props.step === undefined && stepValue.value !== 0) stepValue.value = 0
})

/* ── The target ────────────────────────────────────────────────── */

const target = shallowRef<Element | null>(null)
/** False while the target of a step is being looked for. */
const ready = ref(false)
const box = ref({ x: 0, y: 0, width: 0, height: 0 })
/** True just after a change of step: the highlight and the card glide. Afterwards they follow the
 *  page at once, so they do not trail behind a scroll. */
const gliding = ref(false)

/** How long to wait for a target that is not there yet, as after a change of route, in ms. */
const PATIENCE = 600
const GLIDE = 400

function find(step: TourStep): Element | null {
  const wanted = step.target
  if (!wanted) return null
  let el: Element | null | undefined
  try {
    el = typeof wanted === 'string' ? document.querySelector(wanted) : typeof wanted === 'function' ? wanted() : wanted
  } catch {
    return null // a selector that is not one
  }
  if (!el?.isConnected) return null
  const rect = el.getBoundingClientRect()
  return rect.width > 0 || rect.height > 0 ? el : null
}

function measure() {
  const el = target.value
  if (!el) return
  const { x, y, width, height } = el.getBoundingClientRect()
  box.value = { x, y, width, height }
}

function reveal(el: Element) {
  const rect = el.getBoundingClientRect()
  const room = props.padding
  const inView =
    rect.top >= room && rect.left >= room && rect.bottom <= window.innerHeight - room && rect.right <= window.innerWidth - room
  if (inView) return
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // Something taller than the screen is shown from its top.
  el.scrollIntoView({ block: rect.height > window.innerHeight ? 'start' : 'center', inline: 'nearest', behavior: still ? 'auto' : 'smooth' })
}

let search = 0
let glideTimer: ReturnType<typeof setTimeout> | undefined
function show(step: TourStep | undefined) {
  const mine = ++search
  if (!step) return
  const until = performance.now() + PATIENCE
  const attempt = () => {
    if (mine !== search) return
    const found = find(step)
    if (!found && step.target && performance.now() < until) {
      ready.value = false
      requestAnimationFrame(attempt)
      return
    }
    // Nothing to glide from on the first step, nor out of a wait.
    gliding.value = ready.value
    clearTimeout(glideTimer)
    glideTimer = setTimeout(() => (gliding.value = false), GLIDE)
    target.value = found
    ready.value = true
    if (found) {
      reveal(found)
      measure()
    }
  }
  attempt()
}

// What makes a step another one. Not the object: steps written in a template are new on every
// render, and would send the page scrolling back to the target each time.
const stepKey = computed(() => {
  const step = current.value
  if (!step) return ''
  return JSON.stringify([index.value, step.id, step.title, typeof step.target === 'string' ? step.target : ''])
})

watch(
  [isOpen, stepKey, isMounted],
  ([open, , mounted]) => {
    if (!open || !mounted) {
      search++
      ready.value = false
      target.value = null
      return
    }
    // After the page has drawn what this step may have asked for.
    nextTick(() => isOpen.value && show(current.value))
  },
  { immediate: true },
)

/* ── The card ──────────────────────────────────────────────────── */

const root = ref<HTMLElement | null>(null)
const card = ref<HTMLElement | null>(null)

const { floatingStyles, isPositioned } = useFloating(target as never, card, {
  strategy: 'fixed',
  placement: () => current.value?.placement ?? 'bottom',
  middleware: computed(() => [
    offset(props.padding + 12),
    flip({ padding: 12, fallbackAxisSideDirection: 'start' }),
    // Kept on screen even if that means lying on a large target.
    shift({ padding: 12, crossAxis: true }),
  ]),
  transform: false,
  whileElementsMounted: autoUpdate,
})

// Follows the target as the page scrolls, resizes or moves under it.
let stopFollowing: (() => void) | undefined
watch(
  [target, card],
  ([el, floating]) => {
    stopFollowing?.()
    stopFollowing = el && floating ? autoUpdate(el, floating, measure) : undefined
  },
  { flush: 'post' },
)
onBeforeUnmount(() => {
  stopFollowing?.()
  clearTimeout(glideTimer)
  search++
})

const centered = computed(() => ready.value && !target.value)
const cardStyle = computed(() => {
  if (centered.value) return { position: 'fixed' as const, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }
  return { ...floatingStyles.value, visibility: ready.value && isPositioned.value ? undefined : ('hidden' as const) }
})

const hole = computed(() => {
  if (!target.value) return null
  const { x, y, width, height } = box.value
  const p = props.padding
  return { x: x - p, y: y - p, width: width + p * 2, height: height + p * 2 }
})
const spotlightStyle = computed(() => {
  const h = hole.value
  // Nothing to point at: a point in the middle, whose shadow covers everything.
  if (!h) return { left: '50%', top: '50%', width: '0px', height: '0px', outlineWidth: '0px' }
  return { left: `${h.x}px`, top: `${h.y}px`, width: `${h.width}px`, height: `${h.height}px` }
})

const isInteractive = computed(() => !!current.value?.interactive && !!target.value)
// What takes the clicks. All of the screen, or all of it but the highlight when that can be used.
const blockers = computed(() => {
  const h = hole.value
  if (!isInteractive.value || !h) return [{ inset: '0px' }]
  const top = `${Math.max(h.y, 0)}px`
  const height = `${Math.max(h.height + Math.min(h.y, 0), 0)}px`
  return [
    { left: '0px', right: '0px', top: '0px', height: top },
    { left: '0px', right: '0px', top: `${h.y + h.height}px`, bottom: '0px' },
    { left: '0px', width: `${Math.max(h.x, 0)}px`, top, height },
    { left: `${h.x + h.width}px`, right: '0px', top, height },
  ]
})

/* ── Layer and focus ───────────────────────────────────────────── */

const { zIndex } = useLayer(isOpen, {
  elements: root,
  modal: true,
  onEscape: () => props.closeOnEscape && close(),
})
// Focus stays in the card, unless the step is about using something outside it.
useFocusScope({
  containerRef: card,
  enabled: computed(() => isOpen.value && ready.value && !isInteractive.value),
  restoreFocus: false,
})

// Buttons come and go between steps; focus is not left on the page behind.
watch([index, ready], async () => {
  if (!isOpen.value || !ready.value || isInteractive.value) return
  await nextTick()
  requestAnimationFrame(() => {
    if (!isOpen.value || !card.value || card.value.contains(document.activeElement)) return
    ;(card.value.querySelector<HTMLElement>('[data-autofocus]') ?? card.value).focus({ preventScroll: true })
  })
})

function onKeydown(event: KeyboardEvent) {
  if (event.defaultPrevented || (event.target as Element).closest('input, textarea, select, [contenteditable]')) return
  const rtl = !!card.value && getComputedStyle(card.value).direction === 'rtl'
  if (event.key === (rtl ? 'ArrowLeft' : 'ArrowRight') && !isLast.value) next()
  else if (event.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) prev()
  else return
  event.preventDefault()
}

const progress = computed(() =>
  text.value.tourProgress.replace('{step}', String(index.value + 1)).replace('{total}', String(props.steps.length)),
)
const slotProps = computed<TourSlotContext>(() => ({
  step: current.value!,
  index: index.value,
  total: props.steps.length,
  next,
  prev,
  close,
}))

defineExpose({ next, prev, goTo, close })
</script>

<template>
  <Teleport v-if="isOpen && isMounted" to="body">
    <div ref="root" data-slot="tour">
      <div
        v-for="(area, i) in blockers"
        :key="i"
        data-part="blocker"
        class="fixed"
        :style="{ ...area, zIndex }"
        aria-hidden="true"
        @mousedown.prevent
      />
      <div
        data-part="spotlight"
        :class="[tourSpotlightTheme, gliding && 'transition-[left,top,width,height] duration-300 ease-ousi-out-fluid motion-reduce:transition-none']"
        :style="{ ...spotlightStyle, zIndex, opacity: ready ? 1 : 0 }"
        aria-hidden="true"
      />

      <div
        ref="card"
        data-part="card"
        role="dialog"
        :aria-modal="isInteractive ? undefined : 'true'"
        :aria-labelledby="titleId"
        :aria-describedby="current?.description ? descriptionId : undefined"
        tabindex="-1"
        :class="cn(tourCardTheme({ shadow }), gliding && 'transition-[left,top] duration-300 ease-ousi-out-fluid motion-reduce:transition-none', props.class)"
        :style="{ ...cardStyle, zIndex }"
        @keydown="onKeydown"
      >
        <div class="flex items-start gap-3">
          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <h2 :id="titleId" class="text-base font-semibold text-ousi-foreground">{{ current?.title }}</h2>
            <p v-if="current?.description" :id="descriptionId" class="text-ousi-muted">{{ current.description }}</p>
          </div>
          <button
            v-if="showCloseButton"
            type="button"
            data-part="close"
            class="-mr-1 -mt-1 flex size-7 shrink-0 items-center justify-center rounded-full text-ousi-muted transition-colors hover:bg-ousi-default hover:text-ousi-foreground focus-visible:outline-2 focus-visible:outline-ousi-focus"
            :aria-label="text.tourClose"
            @click="close"
          >
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <slot v-bind="slotProps" />

        <slot name="footer" v-bind="slotProps">
          <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div v-if="showProgress && steps.length > 1" data-part="progress" class="flex items-center gap-2">
              <span class="flex items-center gap-1" aria-hidden="true">
                <span
                  v-for="(_, i) in steps"
                  :key="i"
                  class="h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none"
                  :class="i === index ? 'w-4 bg-ousi-accent' : 'w-1.5 bg-ousi-default'"
                />
              </span>
              <span class="text-xs tabular-nums text-ousi-muted">{{ progress }}</span>
            </div>
            <div class="ml-auto flex items-center gap-2">
              <OButton v-if="index > 0" variant="text" size="sm" data-part="back" @click="prev">{{ text.tourBack }}</OButton>
              <OButton size="sm" data-part="next" data-autofocus @click="next">{{ isLast ? text.tourDone : text.tourNext }}</OButton>
            </div>
          </div>
        </slot>

        <!-- Focus stays on the same button between steps, so each one is read out. -->
        <span class="sr-only" aria-live="polite">{{ progress }}. {{ current?.title }}. {{ current?.description }}</span>
      </div>
    </div>
  </Teleport>
</template>
