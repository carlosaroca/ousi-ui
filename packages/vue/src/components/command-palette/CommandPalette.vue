<script setup lang="ts">
import { ref, computed, watch, nextTick, toRef, onMounted, onBeforeUnmount } from 'vue'
import { cn, useScrollLock, useMounted, useEscapeKey } from '@ousi-ui/core'
import {
  commandPaletteOverlayTheme,
  commandPaletteTheme,
  commandPaletteInputTheme,
  commandPaletteListTheme,
  commandPaletteGroupTheme,
  commandPaletteItemTheme,
  commandPaletteShortcutTheme,
  commandPaletteKbdTheme,
} from './command-palette.theme'
import type { CommandPaletteProps, CommandPaletteEmits, CommandItem } from './command-palette.types'

const props = withDefaults(defineProps<CommandPaletteProps>(), {
  modelValue: false,
  placeholder: 'Type a command or search...',
  emptyText: 'No results found.',
})

const emit = defineEmits<CommandPaletteEmits>()

const isMounted = useMounted()
const isOpenRef = toRef(props, 'modelValue')

const search = ref('')
const highlightedIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLDivElement | null>(null)

// Scroll lock
useScrollLock(isOpenRef)

// Escape key
useEscapeKey({
  handler: () => close(),
  enabled: isOpenRef,
})

// Cmd/Ctrl+K global shortcut
function handleGlobalKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault()
    emit('update:modelValue', !props.modelValue)
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
})

// Filter items by search query
const filteredItems = computed(() => {
  const query = search.value.toLowerCase()
  if (!query) return props.items
  return props.items.filter(item =>
    item.label.toLowerCase().includes(query),
  )
})

// Group filtered items
const groupedItems = computed(() => {
  const groups = new Map<string, CommandItem[]>()
  for (const item of filteredItems.value) {
    const group = item.group ?? ''
    if (!groups.has(group)) {
      groups.set(group, [])
    }
    groups.get(group)!.push(item)
  }
  return groups
})

// Flat list of all filtered items for keyboard navigation
const flatItems = computed(() => filteredItems.value)

// Reset highlight on search change
watch(search, () => {
  highlightedIndex.value = 0
})

// Auto-focus input on open
watch(isOpenRef, (val) => {
  if (val) {
    search.value = ''
    highlightedIndex.value = 0
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
})

function close() {
  emit('update:modelValue', false)
}

function selectItem(item: CommandItem) {
  if (item.disabled) return
  emit('select', item.key, item)
  close()
}

function handleKeydown(event: KeyboardEvent) {
  const count = flatItems.value.length
  if (count === 0) return

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    highlightedIndex.value = (highlightedIndex.value + 1) % count
    scrollToHighlighted()
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    highlightedIndex.value = (highlightedIndex.value - 1 + count) % count
    scrollToHighlighted()
  } else if (event.key === 'Enter') {
    event.preventDefault()
    const item = flatItems.value[highlightedIndex.value]
    if (item) {
      selectItem(item)
    }
  }
}

function scrollToHighlighted() {
  nextTick(() => {
    const el = listRef.value?.querySelector('[data-highlighted="true"]')
    el?.scrollIntoView({ block: 'nearest' })
  })
}

function onOverlayClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    close()
  }
}

function parseShortcut(shortcut: string): string[] {
  return shortcut.split('+').map(s => s.trim())
}

// Track index across groups for highlighting
function getFlatIndex(item: CommandItem): number {
  return flatItems.value.indexOf(item)
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue && isMounted"
        :class="commandPaletteOverlayTheme"
        @click="onOverlayClick"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
          appear
        >
          <div
            :class="cn(commandPaletteTheme, props.class)"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            @keydown="handleKeydown"
          >
            <!-- Input area -->
            <div class="flex items-center gap-3 px-4">
              <!-- Search icon -->
              <svg
                class="w-5 h-5 text-ousi-muted shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref="inputRef"
                v-model="search"
                :class="commandPaletteInputTheme"
                :placeholder="placeholder"
                type="text"
                aria-label="Search commands"
                autocomplete="off"
              />
            </div>

            <!-- List -->
            <div ref="listRef" :class="commandPaletteListTheme" role="listbox">
              <template v-if="flatItems.length > 0">
                <template v-for="[group, groupItems] in groupedItems" :key="group">
                  <!-- Group label -->
                  <div v-if="group" :class="commandPaletteGroupTheme">
                    {{ group }}
                  </div>

                  <!-- Items -->
                  <div
                    v-for="item in groupItems"
                    :key="item.key"
                    :class="cn(
                      commandPaletteItemTheme,
                      getFlatIndex(item) === highlightedIndex && 'bg-ousi-default',
                      item.disabled && 'opacity-50 cursor-not-allowed',
                    )"
                    :data-highlighted="getFlatIndex(item) === highlightedIndex"
                    role="option"
                    :aria-selected="getFlatIndex(item) === highlightedIndex"
                    :aria-disabled="item.disabled"
                    @click="selectItem(item)"
                    @mouseenter="highlightedIndex = getFlatIndex(item)"
                  >
                    <!-- Icon -->
                    <span v-if="item.icon" class="text-base">{{ item.icon }}</span>

                    <!-- Label -->
                    <span>{{ item.label }}</span>

                    <!-- Shortcut -->
                    <span v-if="item.shortcut" :class="commandPaletteShortcutTheme">
                      <kbd
                        v-for="(key, i) in parseShortcut(item.shortcut)"
                        :key="i"
                        :class="commandPaletteKbdTheme"
                      >
                        {{ key }}
                      </kbd>
                    </span>
                  </div>
                </template>
              </template>

              <!-- Empty state -->
              <div
                v-else
                class="px-3 py-8 text-center text-sm text-ousi-muted"
              >
                {{ emptyText }}
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
