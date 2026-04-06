<script setup lang="ts">
import { ref, computed } from 'vue'
import { cn } from '@ousi-ui/core'
import type { DockProps, DockEmits } from './dock.types'
import { dockTheme, dockItemTheme, dockIconTheme, dockLabelTheme } from './dock.theme'

const props = withDefaults(defineProps<DockProps>(), {
  magnification: 28,
  distance: 100,
  baseSize: 40,
})

const emit = defineEmits<DockEmits>()

const mouseX = ref<number | null>(null)
const hoveredIndex = ref(-1)
const itemRefs = ref<HTMLElement[]>([])

function setItemRef(el: any, i: number) {
  if (el instanceof HTMLElement) itemRefs.value[i] = el
}

function getItemSize(index: number): number {
  if (mouseX.value === null) return props.baseSize
  const el = itemRefs.value[index]
  if (!el) return props.baseSize

  const rect = el.getBoundingClientRect()
  const itemCenter = rect.left + rect.width / 2
  const dist = Math.abs(mouseX.value - itemCenter)
  const normalized = dist / props.distance
  const scale = Math.exp(-(normalized * normalized) / 2)

  return props.baseSize + props.magnification * scale
}

function onMouseMove(e: MouseEvent) {
  mouseX.value = e.clientX
}

function onMouseLeave() {
  mouseX.value = null
  hoveredIndex.value = -1
}

function onClick(index: number) {
  const item = props.items[index]
  emit('select', item.key, item)
}
</script>

<template>
  <div
    :class="cn(dockTheme, props.class)"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <div
      v-for="(item, i) in items"
      :key="item.key"
      :ref="(el) => setItemRef(el, i)"
      :class="dockItemTheme"
      class="relative"
      @mouseenter="hoveredIndex = i"
      @click="onClick(i)"
    >
      <!-- Tooltip -->
      <div
        v-if="hoveredIndex === i"
        :class="dockLabelTheme"
      >{{ item.label }}</div>

      <!-- Icon -->
      <div
        :class="dockIconTheme"
        :style="{
          width: getItemSize(i) + 'px',
          height: getItemSize(i) + 'px',
          fontSize: (getItemSize(i) * 0.5) + 'px',
          transition: mouseX !== null ? 'width 200ms ease, height 200ms ease, font-size 200ms ease' : 'width 400ms cubic-bezier(0.34, 1.56, 0.64, 1), height 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }"
      >
        <slot name="icon" :item="item" :index="i">
          {{ item.icon }}
        </slot>
      </div>
    </div>
  </div>
</template>
