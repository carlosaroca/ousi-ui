<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { cn } from '@ousi-ui/core'
import type { AnimatedNumberProps } from './animated-number.types'
import {
  animatedNumberTheme,
  animatedNumberPrefixTheme,
  animatedNumberSuffixTheme,
} from './animated-number.theme'

const props = withDefaults(defineProps<AnimatedNumberProps>(), {
  animation: 'roll',
  duration: 600,
  trend: 'auto',
  animated: true,
  animateOnMount: false,
})

// ── Formatting ──
function formatValue(val: number): string {
  if (props.formatOptions || props.locale) {
    return new Intl.NumberFormat(props.locale, props.formatOptions).format(val)
  }
  return String(val)
}

// ── State ──
const ready = ref(false)
const rootRef = ref<HTMLElement | null>(null)
const charHeight = ref(24) // will be measured

// ── ROLL state ──
// Each digit position stores its current digit value
// The strip translateY transitions when this changes
const rollDigits = ref<{ char: string; isDigit: boolean; digit: number; key: string }[]>([])
const rollAnimating = ref(false)

function parseChars(formatted: string) {
  const chars = formatted.split('')
  const result: typeof rollDigits.value = []

  // Find the decimal separator to key digits stably
  let decPos = -1
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] === '.' || (chars[i] === ',' && i > 0 && /\d/.test(chars[i - 1] || '') && /\d/.test(chars[i + 1] || ''))) {
      decPos = i
      break
    }
  }

  // Integer digits keyed RTL, fraction digits keyed LTR
  const intEnd = decPos >= 0 ? decPos : chars.length
  let intIdx = 0
  // Count integer digits
  for (let i = intEnd - 1; i >= 0; i--) {
    if (/\d/.test(chars[i])) intIdx++
  }

  let intCounter = intIdx - 1
  let fracCounter = 0
  let symCounter = 0

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]
    const d = parseInt(ch)
    const isDigit = !isNaN(d)

    let key: string
    if (isDigit && i < intEnd) {
      key = `i${intCounter--}`
    } else if (isDigit && i > intEnd) {
      key = `f${fracCounter++}`
    } else {
      key = `s${symCounter++}:${ch}`
    }

    result.push({ char: ch, isDigit, digit: isDigit ? d : -1, key })
  }

  return result
}

// ── COUNT state ──
const countDisplay = ref('')
let countRaf = 0

// ── SLIDE/FADE/FLIP state ──
const oldText = ref('')
const newText = ref('')
const dir = ref(1)
const phase = ref<'idle' | 'start' | 'end'>('idle')
let phaseTimer = 0

// ── Lifecycle ──
onMounted(() => {
  const f = formatValue(props.value)
  rollDigits.value = parseChars(f)
  countDisplay.value = f
  newText.value = f

  // Measure character height from the root element's font metrics
  if (rootRef.value) {
    const temp = document.createElement('span')
    temp.textContent = '0'
    temp.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;'
    // Inherit font from root
    const cs = getComputedStyle(rootRef.value)
    temp.style.font = cs.font
    temp.style.fontSize = cs.fontSize
    temp.style.lineHeight = cs.lineHeight
    document.body.appendChild(temp)
    charHeight.value = temp.offsetHeight
    document.body.removeChild(temp)
  }

  ready.value = true
})

onBeforeUnmount(() => {
  cancelAnimationFrame(countRaf)
  clearTimeout(phaseTimer)
})

// ── Watch value ──
watch(() => props.value, (newVal, oldVal) => {
  const f = formatValue(newVal)

  if (!props.animated || !ready.value) {
    rollDigits.value = parseChars(f)
    countDisplay.value = f
    newText.value = f
    return
  }

  // Direction
  dir.value = props.trend === 'up' ? 1 : props.trend === 'down' ? -1 : (newVal >= oldVal ? 1 : -1)

  switch (props.animation) {
    case 'count':
      animateCount(oldVal, newVal)
      break
    case 'roll':
      rollAnimating.value = true
      rollDigits.value = parseChars(f)
      break
    case 'slide':
    case 'fade':
    case 'flip':
      triggerBlockAnimation(formatValue(oldVal), f)
      break
  }
})

// ── Count tween ──
function animateCount(from: number, to: number) {
  cancelAnimationFrame(countRaf)
  const start = performance.now()
  const dur = props.duration
  function tick(now: number) {
    const progress = Math.min((now - start) / dur, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = from + (to - from) * eased
    const decimals = (to.toString().split('.')[1] || '').length
    countDisplay.value = formatValue(Number(current.toFixed(decimals)))
    if (progress < 1) countRaf = requestAnimationFrame(tick)
    else countDisplay.value = formatValue(to)
  }
  countRaf = requestAnimationFrame(tick)
}

// ── Block animation (slide/fade/flip) ──
function triggerBlockAnimation(oldF: string, newF: string) {
  clearTimeout(phaseTimer)
  oldText.value = oldF
  newText.value = newF
  phase.value = 'start'

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      phase.value = 'end'
      phaseTimer = window.setTimeout(() => {
        phase.value = 'idle'
      }, props.duration + 100)
    })
  })
}

const isBlockAnim = computed(() => phase.value !== 'idle')
const atEnd = computed(() => phase.value === 'end')

// ── Easing ──
const ease = 'cubic-bezier(0.16, 1, 0.3, 1)'

// ── Inline style helpers ──
const h = computed(() => charHeight.value)

function rollStripStyle(digit: number) {
  return {
    position: 'absolute' as const,
    top: '0',
    left: '0',
    right: '0',
    display: 'flex',
    flexDirection: 'column' as const,
    transform: `translateY(${-digit * h.value}px)`,
    transition: rollAnimating.value ? `transform ${props.duration}ms ${ease}` : 'none',
    willChange: 'transform',
  }
}

const cellStyle = computed(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: `${h.value}px`,
  flexShrink: 0,
}))

const slotStyle = computed(() => ({
  position: 'relative' as const,
  display: 'inline-block',
  overflow: 'hidden',
  verticalAlign: 'top',
  height: `${h.value}px`,
  maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
}))

// Block container style
const blockStyle = {
  position: 'relative' as const,
  display: 'inline-flex',
  overflow: 'hidden',
  verticalAlign: 'top',
}

const absStyle = {
  position: 'absolute' as const,
  inset: '0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  willChange: 'transform, opacity',
}

const spacerStyle = {
  visibility: 'hidden' as const,
  display: 'inline-block',
  pointerEvents: 'none' as const,
}

// Old/new transforms for slide/flip
function oldBlockStyle() {
  const d = dir.value
  if (props.animation === 'slide') {
    return {
      ...absStyle,
      transform: atEnd.value ? `translateY(${d > 0 ? '-100' : '100'}%)` : 'translateY(0)',
      opacity: atEnd.value ? 0 : 1,
      transition: atEnd.value ? `transform ${props.duration}ms ${ease}, opacity ${props.duration}ms ${ease}` : 'none',
    }
  }
  if (props.animation === 'flip') {
    return {
      ...absStyle,
      transform: atEnd.value ? `rotateX(${d > 0 ? '-90' : '90'}deg)` : 'rotateX(0deg)',
      opacity: atEnd.value ? 0 : 1,
      transition: atEnd.value ? `transform ${props.duration}ms ${ease}, opacity ${props.duration}ms ${ease}` : 'none',
      backfaceVisibility: 'hidden' as const,
      transformOrigin: d > 0 ? 'bottom center' : 'top center',
    }
  }
  // fade
  return {
    ...absStyle,
    opacity: atEnd.value ? 0 : 1,
    transition: atEnd.value ? `opacity ${props.duration}ms ease` : 'none',
  }
}

function newBlockStyle() {
  const d = dir.value
  if (props.animation === 'slide') {
    return {
      ...absStyle,
      transform: atEnd.value ? 'translateY(0)' : `translateY(${d > 0 ? '100' : '-100'}%)`,
      opacity: atEnd.value ? 1 : 0,
      transition: atEnd.value ? `transform ${props.duration}ms ${ease}, opacity ${props.duration}ms ${ease}` : 'none',
    }
  }
  if (props.animation === 'flip') {
    return {
      ...absStyle,
      transform: atEnd.value ? 'rotateX(0deg)' : `rotateX(${d > 0 ? '90' : '-90'}deg)`,
      opacity: atEnd.value ? 1 : 0.01,
      transition: atEnd.value ? `transform ${props.duration}ms ${ease}, opacity ${props.duration}ms ${ease}` : 'none',
      backfaceVisibility: 'hidden' as const,
      transformOrigin: d > 0 ? 'top center' : 'bottom center',
    }
  }
  // fade
  return {
    ...absStyle,
    opacity: atEnd.value ? 1 : 0,
    transition: atEnd.value ? `opacity ${props.duration}ms ease` : 'none',
  }
}

const flipWrapStyle = computed(() => ({
  ...blockStyle,
  perspective: '400px',
}))
</script>

<template>
  <span ref="rootRef" :class="cn(animatedNumberTheme, props.class)">
    <span v-if="prefix" :class="animatedNumberPrefixTheme">{{ prefix }}</span>

    <!-- ═══ COUNT ═══ -->
    <template v-if="animation === 'count'">
      <span>{{ countDisplay }}</span>
    </template>

    <!-- ═══ ROLL ═══ -->
    <template v-else-if="animation === 'roll' && ready">
      <span
        v-for="info in rollDigits"
        :key="info.key"
        :style="info.isDigit ? slotStyle : undefined"
      >
        <template v-if="info.isDigit">
          <!-- Invisible spacer for width -->
          <span :style="{ visibility: 'hidden', display: 'inline-block', pointerEvents: 'none' }" aria-hidden="true">0</span>
          <!-- Vertical strip of 0–9 -->
          <span :style="rollStripStyle(info.digit)">
            <span v-for="d in 10" :key="d - 1" :style="cellStyle">{{ d - 1 }}</span>
          </span>
        </template>
        <template v-else>{{ info.char }}</template>
      </span>
    </template>

    <!-- ═══ SLIDE ═══ -->
    <template v-else-if="animation === 'slide'">
      <span :style="blockStyle">
        <span :style="spacerStyle">{{ newText }}</span>
        <template v-if="isBlockAnim">
          <span :style="oldBlockStyle()">{{ oldText }}</span>
          <span :style="newBlockStyle()">{{ newText }}</span>
        </template>
        <span v-else :style="absStyle">{{ newText }}</span>
      </span>
    </template>

    <!-- ═══ FADE ═══ -->
    <template v-else-if="animation === 'fade'">
      <span :style="blockStyle">
        <span :style="spacerStyle">{{ newText }}</span>
        <template v-if="isBlockAnim">
          <span :style="oldBlockStyle()">{{ oldText }}</span>
          <span :style="newBlockStyle()">{{ newText }}</span>
        </template>
        <span v-else :style="absStyle">{{ newText }}</span>
      </span>
    </template>

    <!-- ═══ FLIP ═══ -->
    <template v-else-if="animation === 'flip'">
      <span :style="flipWrapStyle">
        <span :style="spacerStyle">{{ newText }}</span>
        <template v-if="isBlockAnim">
          <span :style="oldBlockStyle()">{{ oldText }}</span>
          <span :style="newBlockStyle()">{{ newText }}</span>
        </template>
        <span v-else :style="absStyle">{{ newText }}</span>
      </span>
    </template>

    <span v-if="suffix" :class="animatedNumberSuffixTheme">{{ suffix }}</span>
  </span>
</template>
