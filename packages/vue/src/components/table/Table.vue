<script setup lang="ts">
import { ref, computed, toRef, nextTick, watch } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import { OSkeleton } from '../skeleton'
import { OCheckbox } from '../checkbox'
import {
  tableRootTheme,
  tableScrollContainerTheme,
  tableContentTheme,
  tableHeaderTheme,
  tableColumnTheme,
  tableColumnSeparatorTheme,
  tableBodyTheme,
  tableRowTheme,
  tableCellTheme,
  tableFooterTheme,
  tableColumnResizerTheme,
  tableSortIndicatorTheme,
  tableSortRankTheme,
  tableStickyCellTheme,
  tableStickyHeaderCellTheme,
  tableExpandToggleTheme,
  tableExpandedRowTheme,
  tableEmptyTheme,
} from './table.theme'
import type { TableProps, TableEmits, SortDescriptor } from './table.types'

const props = withDefaults(defineProps<TableProps>(), {
  rowKey: 'id',
  variant: 'primary',
  shadow: 'none',
  selectionMode: 'none',
  showSelectionColumn: true,
  loadingRows: 5,
  isLoading: false,
  showFooter: false,
  allowsResizing: false,
  stickyHeader: false,
  expandable: false,
  multiSort: false,
  manualSort: false,
  density: 'normal',
  emptyContent: 'No data available',
})

const emit = defineEmits<TableEmits>()

// ── Column visibility ──
const hiddenColumns = useControllableState<Set<string>>({
  prop: toRef(props, 'hiddenColumns') as any,
  defaultValue: props.defaultHiddenColumns ?? new Set<string>(),
  onChange: (val) => emit('update:hiddenColumns', val),
})

const displayColumns = computed(() =>
  props.columns.filter((c) => !hiddenColumns.value.has(c.key)),
)

function toggleColumn(key: string) {
  const next = new Set(hiddenColumns.value)
  next.has(key) ? next.delete(key) : next.add(key)
  hiddenColumns.value = next
}

// ── Selection ──
const selectedKeys = useControllableState<Set<string>>({
  prop: toRef(props, 'selectedKeys') as any,
  defaultValue: props.defaultSelectedKeys ?? new Set<string>(),
  onChange: (val) => emit('selectionChange', val),
})

const allKeys = computed(() =>
  props.rows
    .filter((r) => !props.disabledKeys?.has(String(r[props.rowKey])))
    .map((r) => String(r[props.rowKey])),
)

const isAllSelected = computed(() =>
  allKeys.value.length > 0 && allKeys.value.every((k) => selectedKeys.value.has(k)),
)

const isSomeSelected = computed(() =>
  allKeys.value.some((k) => selectedKeys.value.has(k)) && !isAllSelected.value,
)

// Anchor for shift-click range selection.
let lastSelectionAnchor: string | null = null

function toggleSelection(key: string, ev?: MouseEvent | KeyboardEvent) {
  if (props.selectionMode === 'none') return
  const next = new Set(selectedKeys.value)
  if (props.selectionMode === 'single') {
    next.clear()
    if (!selectedKeys.value.has(key)) next.add(key)
    lastSelectionAnchor = key
    selectedKeys.value = next
    return
  }

  // Multi-select with shift → select range from anchor to current
  if (ev && 'shiftKey' in ev && ev.shiftKey && lastSelectionAnchor) {
    const keys = allKeys.value
    const a = keys.indexOf(lastSelectionAnchor)
    const b = keys.indexOf(key)
    if (a >= 0 && b >= 0) {
      const [from, to] = a < b ? [a, b] : [b, a]
      // Use the anchor's selection state to decide select-vs-deselect intent.
      const shouldSelect = selectedKeys.value.has(lastSelectionAnchor)
      for (let i = from; i <= to; i++) {
        if (shouldSelect) next.add(keys[i])
        else next.delete(keys[i])
      }
      selectedKeys.value = next
      return
    }
  }

  // Regular toggle
  next.has(key) ? next.delete(key) : next.add(key)
  lastSelectionAnchor = key
  selectedKeys.value = next
}

function toggleAll() {
  if (props.selectionMode !== 'multiple') return
  selectedKeys.value = isAllSelected.value ? new Set() : new Set(allKeys.value)
  lastSelectionAnchor = null
}

// ── Sorting (single + multi) ──
// Internal representation is always an array. We mirror it to the public emit
// shape based on the `multiSort` prop.
const initialSorts: SortDescriptor[] = props.multiSort
  ? (props.sortDescriptors ?? props.defaultSortDescriptors ?? [])
  : props.sortDescriptor
    ? [props.sortDescriptor]
    : props.defaultSortDescriptor
      ? [props.defaultSortDescriptor]
      : []
const sortDescriptors = ref<SortDescriptor[]>(initialSorts)

watch(() => props.sortDescriptor, (v) => {
  if (props.multiSort) return
  sortDescriptors.value = v ? [v] : []
})
watch(() => props.sortDescriptors, (v) => {
  if (!props.multiSort) return
  if (v) sortDescriptors.value = [...v]
})

function emitSort() {
  if (props.multiSort) emit('sortChange', sortDescriptors.value)
  else emit('sortChange', sortDescriptors.value[0] ?? { column: '', direction: null })
}

function nextDirection(cur: SortDescriptor['direction']): SortDescriptor['direction'] {
  if (cur === 'asc') return 'desc'
  if (cur === 'desc') return null
  return 'asc'
}

function onSort(column: string, ev?: MouseEvent | KeyboardEvent) {
  const multi = props.multiSort && ev && 'shiftKey' in ev && ev.shiftKey
  const existing = sortDescriptors.value.find((s) => s.column === column)
  const dir = nextDirection(existing?.direction ?? null)

  if (!multi) {
    // Replace whole sort with single column (or clear if cycled to null).
    sortDescriptors.value = dir ? [{ column, direction: dir }] : []
  } else {
    // Multi-sort: add/update/remove this column without touching others.
    const next = sortDescriptors.value.filter((s) => s.column !== column)
    if (dir) next.push({ column, direction: dir })
    sortDescriptors.value = next
  }
  emitSort()
}

function sortStateFor(column: string): { direction: SortDescriptor['direction']; rank: number } {
  const idx = sortDescriptors.value.findIndex((s) => s.column === column)
  if (idx === -1) return { direction: null, rank: 0 }
  return { direction: sortDescriptors.value[idx].direction, rank: idx + 1 }
}

// Mirror to the legacy `sortDescriptor` shape for templates that only care about the
// primary sort (the heading still highlights the most recent / only sort).
const primarySort = computed<SortDescriptor>(() =>
  sortDescriptors.value[0] ?? { column: '', direction: null },
)

// ── Display rows — apply client-side sort unless `manualSort` is set. ──
// Server-side flows pass `manualSort` and feed already-sorted rows.
const displayRows = computed(() => {
  if (props.manualSort) return props.rows
  const active = sortDescriptors.value.filter((s) => s.direction)
  if (active.length === 0) return props.rows

  const arr = [...props.rows]
  arr.sort((a, b) => {
    for (const s of active) {
      const av = a[s.column]
      const bv = b[s.column]
      if (av === bv) continue
      // Numbers vs strings — `>` works for both, but be safe with null/undefined.
      if (av == null) return s.direction === 'asc' ? -1 : 1
      if (bv == null) return s.direction === 'asc' ? 1 : -1
      const cmp = av > bv ? 1 : -1
      return s.direction === 'asc' ? cmp : -cmp
    }
    return 0
  })
  return arr
})

// ── Column resizing ──
const columnWidths = ref<Record<string, number>>({})
const resizingColumn = ref<string | null>(null)
const RESIZE_STEP = 8

function clampWidth(colKey: string, w: number): number {
  const col = props.columns.find((c) => c.key === colKey)
  const min = col?.minWidth ?? 50
  const max = col?.maxWidth ?? 9999
  return Math.min(max, Math.max(min, w))
}

function currentWidth(colKey: string): number {
  const fromState = columnWidths.value[colKey]
  if (typeof fromState === 'number') return fromState
  const col = props.columns.find((c) => c.key === colKey)
  return typeof col?.width === 'number' ? col.width : 120
}

function startResize(e: PointerEvent, colKey: string) {
  resizingColumn.value = colKey
  const startX = e.clientX
  const startWidth = currentWidth(colKey)

  function onMove(ev: PointerEvent) {
    columnWidths.value[colKey] = clampWidth(colKey, startWidth + ev.clientX - startX)
  }
  function onUp() {
    resizingColumn.value = null
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerup', onUp)
  }
  document.addEventListener('pointermove', onMove)
  document.addEventListener('pointerup', onUp)
}

function handleResizerKeydown(e: KeyboardEvent, colKey: string) {
  const step = e.shiftKey ? 1 : e.ctrlKey || e.metaKey ? 24 : RESIZE_STEP
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    columnWidths.value[colKey] = clampWidth(colKey, currentWidth(colKey) - step)
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    columnWidths.value[colKey] = clampWidth(colKey, currentWidth(colKey) + step)
  }
}

function getColStyle(col: (typeof props.columns)[number]) {
  const w = columnWidths.value[col.key] ?? col.width
  if (!w) return {}
  return { width: typeof w === 'number' ? `${w}px` : w }
}

// ── Expansion ──
const expandedKeys = useControllableState<Set<string>>({
  prop: toRef(props, 'expandedKeys') as any,
  defaultValue: props.defaultExpandedKeys ?? new Set<string>(),
  onChange: (val) => emit('expansionChange', val),
})

function toggleExpand(key: string) {
  const next = new Set(expandedKeys.value)
  next.has(key) ? next.delete(key) : next.add(key)
  expandedKeys.value = next
}

function isExpanded(key: string): boolean {
  return expandedKeys.value.has(key)
}

// ── Row helpers ──
function getRowKey(row: Record<string, any>): string {
  return String(row[props.rowKey])
}
function isRowSelected(row: Record<string, any>): boolean {
  return selectedKeys.value.has(getRowKey(row))
}
function isRowDisabled(row: Record<string, any>): boolean {
  return props.disabledKeys?.has(getRowKey(row)) ?? false
}

// ── Keyboard navigation (cell-by-cell, roving tabindex pattern) ──
//
// We track a single "active cell" coordinate (row, col). The cell at this
// coordinate gets tabindex=0; all others get -1. Arrow keys move the
// coordinate and programmatically focus the new cell.

const activeRow = ref(0)
const activeCol = ref(0)
const tableRef = ref<HTMLTableElement | null>(null)

// Render the checkbox column only when multi-select AND the user hasn't opted to hide it.
const showCheckboxColumn = computed(() =>
  props.selectionMode === 'multiple' && props.showSelectionColumn,
)

const totalCols = computed(() => {
  let n = displayColumns.value.length
  if (props.expandable) n += 1
  if (showCheckboxColumn.value) n += 1
  return n
})

function isCellActive(rowIdx: number, colIdx: number): boolean {
  return activeRow.value === rowIdx && activeCol.value === colIdx
}

function focusCell(rowIdx: number, colIdx: number) {
  const total = totalCols.value
  const maxRow = props.rows.length - 1
  if (maxRow < 0) return
  const r = Math.min(Math.max(0, rowIdx), maxRow)
  const c = Math.min(Math.max(0, colIdx), total - 1)
  activeRow.value = r
  activeCol.value = c
  nextTick(() => {
    const el = tableRef.value?.querySelector<HTMLElement>(
      `tbody [data-row="${r}"][data-col="${c}"]`,
    )
    el?.focus()
  })
}

function handleCellKeydown(e: KeyboardEvent, rowIdx: number, colIdx: number) {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      focusCell(rowIdx + 1, colIdx)
      break
    case 'ArrowUp':
      e.preventDefault()
      focusCell(rowIdx - 1, colIdx)
      break
    case 'ArrowRight':
      e.preventDefault()
      focusCell(rowIdx, colIdx + 1)
      break
    case 'ArrowLeft':
      e.preventDefault()
      focusCell(rowIdx, colIdx - 1)
      break
    case 'Home':
      e.preventDefault()
      if (e.ctrlKey || e.metaKey) focusCell(0, 0)
      else focusCell(rowIdx, 0)
      break
    case 'End':
      e.preventDefault()
      if (e.ctrlKey || e.metaKey) focusCell(props.rows.length - 1, totalCols.value - 1)
      else focusCell(rowIdx, totalCols.value - 1)
      break
    case 'Enter':
    case ' ': {
      const row = displayRows.value[rowIdx]
      if (!row || isRowDisabled(row)) break
      // Expand-column cell → toggle expansion.
      if (props.expandable && colIdx === 0) {
        e.preventDefault()
        toggleExpand(getRowKey(row))
        break
      }
      // Otherwise: toggle selection if selectable; else fire row action.
      e.preventDefault()
      if (props.selectionMode !== 'none') toggleSelection(getRowKey(row), e)
      else emit('rowAction', getRowKey(row))
      break
    }
  }
}

// Border-radius inline style for primary variant
const rootRadiusStyle = computed(() =>
  props.variant === 'primary'
    ? { borderRadius: 'calc(var(--ousi-radius, 0.5rem) * 2.5)' }
    : {},
)

// ── CSV export — public method exposed via defineExpose ──
function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  // Quote if it contains comma, double-quote, or newline. Double-up inner quotes.
  if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`
  return str
}

function exportCSV(options: { filename?: string; includeHidden?: boolean } = {}) {
  if (typeof document === 'undefined') return // SSR guard
  const { filename = 'table.csv', includeHidden = false } = options
  const cols = includeHidden ? props.columns : displayColumns.value
  const lines: string[] = []
  // Header
  lines.push(cols.map((c) => csvEscape(c.label)).join(','))
  // Body — uses displayRows so filter + sort applied state is exported
  for (const row of displayRows.value) {
    lines.push(cols.map((c) => csvEscape(row[c.key])).join(','))
  }
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

// Public surface — methods + state the consumer can wire to their own UI
// (toolbar buttons, dropdown menus, OContextMenu wrapper, etc.).
defineExpose({
  exportCSV,
  toggleColumn,
  hiddenColumns,
})

// Column index for the first DATA column (after expand + checkbox columns).
const dataColumnsOffset = computed(() => {
  let o = 0
  if (props.expandable) o += 1
  if (showCheckboxColumn.value) o += 1
  return o
})

// ── Sticky columns ──
// Compute cumulative offsets so multiple sticky-left or sticky-right columns
// stack correctly. The implicit expand/checkbox columns are auto-sticky on the
// left when any data column is sticky-left, so they don't scroll out of view.

const EXPAND_COL_WIDTH = 40    // matches w-10
const CHECKBOX_COL_WIDTH = 48  // matches w-12

function explicitWidth(col: (typeof props.columns)[number]): number {
  const w = columnWidths.value[col.key] ?? col.width
  return typeof w === 'number' ? w : 120
}

const stickyLeftMap = computed<Record<string, { offset: number; isEdge: boolean }>>(() => {
  const out: Record<string, { offset: number; isEdge: boolean }> = {}
  const hasAnyLeft = props.columns.some((c) => c.sticky === 'left')
  if (!hasAnyLeft) return out

  let running = 0
  if (props.expandable) {
    out.__expand = { offset: running, isEdge: false }
    running += EXPAND_COL_WIDTH
  }
  if (showCheckboxColumn.value) {
    out.__checkbox = { offset: running, isEdge: false }
    running += CHECKBOX_COL_WIDTH
  }
  for (const col of props.columns) {
    if (col.sticky === 'left') {
      out[col.key] = { offset: running, isEdge: false }
      running += explicitWidth(col)
    }
  }
  // Mark the rightmost left-sticky entry as the edge (gets the shadow).
  const lastKey = Object.keys(out).pop()
  if (lastKey) out[lastKey].isEdge = true
  return out
})

const stickyRightMap = computed<Record<string, { offset: number; isEdge: boolean }>>(() => {
  const out: Record<string, { offset: number; isEdge: boolean }> = {}
  const rightSticky = props.columns.filter((c) => c.sticky === 'right')
  if (rightSticky.length === 0) return out

  let running = 0
  for (const col of [...rightSticky].reverse()) {
    out[col.key] = { offset: running, isEdge: false }
    running += explicitWidth(col)
  }
  // The leftmost right-sticky entry (first one encountered scanning left-to-right) is the edge.
  if (rightSticky[0]) out[rightSticky[0].key].isEdge = true
  return out
})

/** Returns inline styles + classes to apply to a sticky cell, or null if not sticky. */
function stickyMeta(key: string): { side: 'left' | 'right'; offset: number; isEdge: boolean } | null {
  if (key in stickyLeftMap.value) {
    return { side: 'left', offset: stickyLeftMap.value[key].offset, isEdge: stickyLeftMap.value[key].isEdge }
  }
  if (key in stickyRightMap.value) {
    return { side: 'right', offset: stickyRightMap.value[key].offset, isEdge: stickyRightMap.value[key].isEdge }
  }
  return null
}

function stickyInline(key: string): Record<string, string> {
  const m = stickyMeta(key)
  if (!m) return {}
  const style: Record<string, string> = { [m.side]: `${m.offset}px` }
  // Lock the cell's width so the offset math holds even when the table
  // layout would otherwise shrink the column to fit. Without this, td cells
  // can render narrower than the corresponding th, leaving visible gaps
  // between adjacent sticky cells.
  let width: number | null = null
  if (key === '__expand') width = EXPAND_COL_WIDTH
  else if (key === '__checkbox') width = CHECKBOX_COL_WIDTH
  else {
    const col = props.columns.find((c) => c.key === key)
    if (col) width = explicitWidth(col)
  }
  if (width != null) {
    style.width = `${width}px`
    style.minWidth = `${width}px`
    style.maxWidth = `${width}px`
  }
  return style
}

function stickyClassesFor(key: string, isHeader: boolean): string {
  const m = stickyMeta(key)
  if (!m) return ''
  const theme = isHeader ? tableStickyHeaderCellTheme : tableStickyCellTheme
  return theme({ variant: props.variant, edge: m.isEdge ? m.side : 'none' })
}
</script>

<template>
  <div
    :class="cn(tableRootTheme({ variant, shadow }), props.class)"
    :style="rootRadiusStyle"
  >
    <!-- Optional toolbar slot — for custom UIs (export buttons, density switcher, etc) -->
    <div v-if="$slots.toolbar" class="flex items-center justify-end gap-2 px-2 pt-1.5 pb-1">
      <slot name="toolbar" :hidden-columns="hiddenColumns" :toggle-column="toggleColumn" :export-csv="exportCSV" />
    </div>

    <div :class="tableScrollContainerTheme({ stickyHeader })">
      <table ref="tableRef" :class="tableContentTheme">
        <!-- Header -->
        <thead :class="tableHeaderTheme({ variant, sticky: stickyHeader })">
          <tr>
            <!-- Expand toggle column -->
            <th
              v-if="expandable"
              :class="cn(
                'w-10 px-2 py-2.5',
                variant === 'secondary' ? 'bg-ousi-default rounded-l-ousi-2xl' : '',
                stickyClassesFor('__expand', true),
              )"
              :style="stickyInline('__expand')"
            />

            <!-- Select-all checkbox -->
            <th
              v-if="showCheckboxColumn"
              :class="cn(
                'w-12 px-4 py-2.5',
                variant === 'secondary' && !expandable ? 'bg-ousi-default rounded-l-ousi-2xl' : '',
                stickyClassesFor('__checkbox', true),
              )"
              :style="stickyInline('__checkbox')"
            >
              <OCheckbox
                tabindex="-1"
                :model-value="isAllSelected"
                :indeterminate="isSomeSelected"
                @update:model-value="toggleAll"
              />
            </th>

            <th
              v-for="(col, ci) in displayColumns"
              :key="col.key"
              :class="cn(tableColumnTheme({ variant, sortable: col.sortable, align: col.align }), stickyClassesFor(col.key, true))"
              :style="{ ...getColStyle(col), ...stickyInline(col.key) }"
              :aria-sort="
                sortStateFor(col.key).direction === 'asc' ? 'ascending'
                  : sortStateFor(col.key).direction === 'desc' ? 'descending'
                  : undefined
              "
              tabindex="0"
              @click="col.sortable && onSort(col.key, $event)"
              @keydown.enter.prevent="col.sortable && onSort(col.key, $event)"
              @keydown.space.prevent="col.sortable && onSort(col.key, $event)"
              @contextmenu="emit('columnContextMenu', col, $event)"
            >
              <span class="inline-flex items-center gap-1">
                <slot :name="`column-${col.key}`" :column="col">
                  {{ col.label }}
                </slot>

                <!-- Sort indicator -->
                <svg
                  v-if="col.sortable"
                  :class="tableSortIndicatorTheme"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <path
                    v-if="sortStateFor(col.key).direction === 'asc'"
                    d="M12 19V5M5 12l7-7 7 7"
                    stroke-linecap="round" stroke-linejoin="round"
                  />
                  <path
                    v-else-if="sortStateFor(col.key).direction === 'desc'"
                    d="M12 5v14M5 12l7 7 7-7"
                    stroke-linecap="round" stroke-linejoin="round"
                  />
                  <path
                    v-else
                    d="M8 9l4-4 4 4M16 15l-4 4-4-4"
                    stroke-linecap="round" stroke-linejoin="round"
                  />
                </svg>

                <!-- Multi-sort rank badge -->
                <span
                  v-if="multiSort && sortStateFor(col.key).direction && sortDescriptors.length > 1"
                  :class="tableSortRankTheme"
                  :aria-label="`Sort priority ${sortStateFor(col.key).rank}`"
                >
                  {{ sortStateFor(col.key).rank }}
                </span>
              </span>

              <!-- Column separator -->
              <span
                v-if="ci < displayColumns.length - 1 && !allowsResizing"
                :class="tableColumnSeparatorTheme"
                aria-hidden="true"
              />

              <!-- Resizer (focusable for keyboard) -->
              <div
                v-if="allowsResizing && col.resizable !== false"
                :class="tableColumnResizerTheme"
                :data-resizing="resizingColumn === col.key || undefined"
                role="separator"
                aria-orientation="vertical"
                :aria-label="`Resize column ${col.label}`"
                tabindex="0"
                @pointerdown.stop="startResize($event, col.key)"
                @keydown="handleResizerKeydown($event, col.key)"
              />
            </th>
          </tr>
        </thead>

        <!-- Body -->
        <tbody :class="tableBodyTheme">
          <!-- Loading skeleton -->
          <template v-if="isLoading">
            <tr v-for="i in loadingRows" :key="`sk-${i}`">
              <td v-if="expandable" class="px-2 py-3 w-10" />
              <td v-if="showCheckboxColumn" class="px-4 py-3 w-12">
                <OSkeleton class="h-4 w-4 rounded-ousi-md" />
              </td>
              <td v-for="col in displayColumns" :key="col.key" :class="tableCellTheme({ variant, density })">
                <OSkeleton :class="`h-4 rounded-ousi-sm ${i % 2 === 0 ? 'w-3/4' : 'w-full'}`" />
              </td>
            </tr>
          </template>

          <!-- Empty state -->
          <tr v-else-if="displayRows.length === 0">
            <td :colspan="totalCols" :class="tableEmptyTheme">
              <slot name="empty">{{ emptyContent }}</slot>
            </td>
          </tr>

          <!-- Data rows -->
          <template v-else>
            <template v-for="(row, rowIdx) in displayRows" :key="getRowKey(row)">
              <tr
                :class="tableRowTheme({
                  disabled: isRowDisabled(row),
                  clickable: selectionMode !== 'none' || expandable,
                  selectable: selectionMode === 'multiple',
                })"
                :data-selected="isRowSelected(row) || undefined"
                :data-disabled="isRowDisabled(row) || undefined"
                :aria-selected="selectionMode !== 'none' ? isRowSelected(row) : undefined"
                :aria-expanded="expandable ? isExpanded(getRowKey(row)) : undefined"
                @contextmenu="emit('rowContextMenu', row, $event)"
              >
                <!-- Expand toggle -->
                <td
                  v-if="expandable"
                  :class="cn(tableCellTheme({ variant, density, selected: isRowSelected(row) }), 'w-10 px-2', stickyClassesFor('__expand', false))"
                  :style="stickyInline('__expand')"
                  :data-row="rowIdx"
                  :data-col="0"
                  :tabindex="isCellActive(rowIdx, 0) ? 0 : -1"
                  @keydown="handleCellKeydown($event, rowIdx, 0)"
                  @focus="activeRow = rowIdx; activeCol = 0"
                >
                  <button
                    type="button"
                    tabindex="-1"
                    :class="tableExpandToggleTheme"
                    :style="isExpanded(getRowKey(row)) ? 'transform: rotate(90deg)' : ''"
                    :aria-label="isExpanded(getRowKey(row)) ? 'Collapse row' : 'Expand row'"
                    @click.stop="toggleExpand(getRowKey(row))"
                  >
                    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                </td>

                <!-- Row checkbox -->
                <td
                  v-if="showCheckboxColumn"
                  :class="cn(tableCellTheme({ variant, density, selected: isRowSelected(row) }), 'w-12', stickyClassesFor('__checkbox', false))"
                  :style="stickyInline('__checkbox')"
                  :data-row="rowIdx"
                  :data-col="expandable ? 1 : 0"
                  :tabindex="isCellActive(rowIdx, expandable ? 1 : 0) ? 0 : -1"
                  @click.stop="toggleSelection(getRowKey(row), $event)"
                  @keydown="handleCellKeydown($event, rowIdx, expandable ? 1 : 0)"
                  @focus="activeRow = rowIdx; activeCol = expandable ? 1 : 0"
                >
                  <OCheckbox
                    tabindex="-1"
                    :model-value="isRowSelected(row)"
                    :disabled="isRowDisabled(row)"
                  />
                </td>

                <!-- Data cells -->
                <td
                  v-for="(col, colIdx) in displayColumns"
                  :key="col.key"
                  :class="cn(tableCellTheme({ variant, density, selected: isRowSelected(row) }), stickyClassesFor(col.key, false))"
                  :style="{ textAlign: col.align ?? 'left', ...stickyInline(col.key) }"
                  :data-row="rowIdx"
                  :data-col="dataColumnsOffset + colIdx"
                  :tabindex="isCellActive(rowIdx, dataColumnsOffset + colIdx) ? 0 : -1"
                  @click="selectionMode !== 'none'
                    ? toggleSelection(getRowKey(row), $event)
                    : emit('rowAction', getRowKey(row))"
                  @keydown="handleCellKeydown($event, rowIdx, dataColumnsOffset + colIdx)"
                  @focus="activeRow = rowIdx; activeCol = dataColumnsOffset + colIdx"
                >
                  <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]" :column="col">
                    {{ row[col.key] }}
                  </slot>
                </td>
              </tr>

              <!-- Expanded row content -->
              <tr v-if="expandable && isExpanded(getRowKey(row))" :class="tableExpandedRowTheme({ variant })">
                <td :colspan="totalCols" class="px-4 py-3 border-b border-ousi-separator/50">
                  <slot name="expanded-row" :row="row" :close="() => toggleExpand(getRowKey(row))">
                    <pre class="text-xs text-ousi-muted">{{ row }}</pre>
                  </slot>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div v-if="showFooter || $slots.footer" :class="tableFooterTheme">
      <slot name="footer" />
    </div>
  </div>
</template>
