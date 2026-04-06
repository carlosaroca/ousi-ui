<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { cn } from '@ousi-ui/core'
import type { TypewriterProps } from './typewriter.types'
import { typewriterTheme } from './typewriter.theme'

const props = withDefaults(defineProps<TypewriterProps>(), {
  speed: 50,
  deleteSpeed: 30,
  delay: 2000,
  loop: true,
  cursor: true,
  cursorChar: '|',
})

const displayedText = ref('')
const isActive = ref(false)

let timeoutId: ReturnType<typeof setTimeout> | null = null
let currentIndex = 0 // index in the strings array

const strings = computed<string[]>(() =>
  Array.isArray(props.text) ? props.text : [props.text],
)

function clearTimer() {
  if (timeoutId !== null) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

function typeChar(text: string, charIndex: number, onComplete: () => void) {
  if (charIndex <= text.length) {
    displayedText.value = text.slice(0, charIndex)
    timeoutId = setTimeout(() => {
      typeChar(text, charIndex + 1, onComplete)
    }, props.speed)
  } else {
    onComplete()
  }
}

function deleteChar(onComplete: () => void) {
  if (displayedText.value.length > 0) {
    displayedText.value = displayedText.value.slice(0, -1)
    timeoutId = setTimeout(() => {
      deleteChar(onComplete)
    }, props.deleteSpeed)
  } else {
    onComplete()
  }
}

function runCycle() {
  const strs = strings.value
  if (strs.length === 0) return

  const currentStr = strs[currentIndex]

  typeChar(currentStr, 0, () => {
    // Single string, no array cycling
    if (strs.length === 1 && !props.loop) return

    // Pause then delete
    timeoutId = setTimeout(() => {
      deleteChar(() => {
        currentIndex = (currentIndex + 1) % strs.length

        // Stop if not looping and we've gone through all strings
        if (!props.loop && currentIndex === 0) return

        // Small pause before typing next
        timeoutId = setTimeout(() => {
          runCycle()
        }, 100)
      })
    }, props.delay)
  })
}

function start() {
  clearTimer()
  currentIndex = 0
  displayedText.value = ''
  isActive.value = true
  runCycle()
}

onMounted(() => {
  start()
})

watch(() => props.text, () => {
  start()
})

onBeforeUnmount(() => {
  clearTimer()
  isActive.value = false
})
</script>

<template>
  <span :class="cn(typewriterTheme, props.class)">
    <span>{{ displayedText }}</span>
    <span
      v-if="cursor"
      :style="{
        display: 'inline-block',
        marginLeft: '2px',
        animation: 'blink 1s step-end infinite',
      }"
      aria-hidden="true"
    >{{ cursorChar }}</span>
  </span>
</template>

<style>
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
