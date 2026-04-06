<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@ousi-ui/core'
import {
  timelineTheme,
  timelineEntryTheme,
  timelineSeparatorTheme,
  timelineConnectorTheme,
  timelineMarkerTheme,
  timelineContentTheme,
  timelineOppositeTheme,
} from './timeline.theme'
import type { TimelineProps } from './timeline.types'

const props = withDefaults(defineProps<TimelineProps>(), {
  align: 'left',
  layout: 'vertical',
})

const isVertical = computed(() => props.layout === 'vertical')
const isAlternate = computed(() => props.align === 'alternate')

function getContentSide(index: number): 'left' | 'right' {
  if (props.align === 'left') return 'left'
  if (props.align === 'right') return 'right'
  // Alternate: even = left, odd = right
  return index % 2 === 0 ? 'left' : 'right'
}
</script>

<template>
  <div :class="cn(timelineTheme({ layout }), props.class)">
    <div
      v-for="(item, index) in items"
      :key="item.key"
      :class="timelineEntryTheme({ layout })"
    >
      <!-- ═══ VERTICAL LAYOUT ═══ -->
      <template v-if="isVertical">
        <!-- Opposite content (left side in right-align, or alternating) -->
        <div
          v-if="align === 'right' || (isAlternate && getContentSide(index) === 'right')"
          :class="timelineContentTheme({ layout })"
          :style="isAlternate ? { textAlign: 'right' } : undefined"
        >
          <slot
            :name="`content-${item.key}`"
            :item="item"
            :index="index"
          >
            {{ item.content }}
          </slot>
        </div>

        <!-- Opposite text for alternate mode (shows on the other side) -->
        <div
          v-else-if="isAlternate"
          :class="timelineOppositeTheme({ layout })"
          :style="{ textAlign: 'right' }"
        >
          <slot :name="`opposite-${item.key}`" :item="item" :index="index">
            {{ item.opposite }}
          </slot>
        </div>

        <!-- Separator: top connector + marker + bottom connector -->
        <div :class="timelineSeparatorTheme({ layout })">
          <!-- Top connector (hidden for first item) -->
          <div
            :class="timelineConnectorTheme({ layout })"
            :style="index === 0 ? { visibility: 'hidden' } : undefined"
          />

          <!-- Marker -->
          <div :class="timelineMarkerTheme({ color: item.color ?? 'accent', hasIcon: !!$slots[`marker-${item.key}`] || !!item.icon })">
            <slot :name="`marker-${item.key}`" :item="item" :index="index">
              <slot name="marker" :item="item" :index="index" />
            </slot>
          </div>

          <!-- Bottom connector (hidden for last item) -->
          <div
            :class="timelineConnectorTheme({ layout })"
            :style="index === items.length - 1 ? { visibility: 'hidden' } : undefined"
          />
        </div>

        <!-- Content (left side in left-align, or alternating) -->
        <div
          v-if="align === 'left' || (isAlternate && getContentSide(index) === 'left')"
          :class="timelineContentTheme({ layout })"
        >
          <slot
            :name="`content-${item.key}`"
            :item="item"
            :index="index"
          >
            {{ item.content }}
          </slot>
        </div>

        <!-- Opposite text for alternate mode -->
        <div
          v-else-if="isAlternate"
          :class="timelineOppositeTheme({ layout })"
        >
          <slot :name="`opposite-${item.key}`" :item="item" :index="index">
            {{ item.opposite }}
          </slot>
        </div>
      </template>

      <!-- ═══ HORIZONTAL LAYOUT ═══ -->
      <template v-else>
        <!-- Top content (opposite in alternate) -->
        <div
          v-if="isAlternate && index % 2 === 1"
          :class="timelineOppositeTheme({ layout })"
        >
          <slot :name="`opposite-${item.key}`" :item="item" :index="index">
            {{ item.opposite }}
          </slot>
        </div>
        <div
          v-else
          :class="timelineContentTheme({ layout })"
        >
          <slot :name="`content-${item.key}`" :item="item" :index="index">
            {{ item.content }}
          </slot>
        </div>

        <!-- Separator: left connector + marker + right connector -->
        <div :class="timelineSeparatorTheme({ layout })">
          <div
            :class="timelineConnectorTheme({ layout })"
            :style="index === 0 ? { visibility: 'hidden' } : undefined"
          />
          <div :class="timelineMarkerTheme({ color: item.color ?? 'accent', hasIcon: !!$slots[`marker-${item.key}`] || !!item.icon })">
            <slot :name="`marker-${item.key}`" :item="item" :index="index">
              <slot name="marker" :item="item" :index="index" />
            </slot>
          </div>
          <div
            :class="timelineConnectorTheme({ layout })"
            :style="index === items.length - 1 ? { visibility: 'hidden' } : undefined"
          />
        </div>

        <!-- Bottom content -->
        <div
          v-if="isAlternate && index % 2 === 1"
          :class="timelineContentTheme({ layout })"
        >
          <slot :name="`content-${item.key}`" :item="item" :index="index">
            {{ item.content }}
          </slot>
        </div>
        <div
          v-else
          :class="timelineOppositeTheme({ layout })"
        >
          <slot :name="`opposite-${item.key}`" :item="item" :index="index">
            {{ item.opposite }}
          </slot>
        </div>
      </template>
    </div>
  </div>
</template>
