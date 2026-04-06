<script setup lang="ts">
import { ref, computed, toRef } from 'vue'
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
  tableEmptyTheme,
} from './table.theme'
import type { TableProps, TableEmits, SortDescriptor } from './table.types'

const props = withDefaults(defineProps<TableProps>(), {
  rowKey: 'id',
  variant: 'primary',
  selectionMode: 'none',
  loadingRows: 5,
  isLoading: false,
  showFooter: false,
  allowsResizing: false,
  emptyContent: 'No data available',
})

const emit = defineEmits<TableEmits>()

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

function toggleSelection(key: string) {
  if (props.selectionMode === 'none') return
  const next = new Set(selectedKeys.value)
  if (props.selectionMode === 'single') {
    next.clear()
    if (!selectedKeys.value.has(key)) next.add(key)
  } else {
    next.has(key) ? next.delete(key) : next.add(key)
  }
  selectedKeys.value = next
}

function toggleAll() {
  if (props.selectionMode !== 'multiple') return
  selectedKeys.value = isAllSelected.value ? new Set() : new Set(allKeys.value)
}

// ── Sorting ──
const sortDescriptor = useControllableState<SortDescriptor>({
  prop: toRef(props, 'sortDescriptor') as any,
  defaultValue: props.defaultSortDescriptor ?? { column: '', direction: null },
  onChange: (val) => emit('sortChange', val),
})

function onSort(column: string) {
  const cur = sortDescriptor.value
  let direction: 'asc' | 'desc' | null
  if (cur.column === column) {
    direction = cur.direction === 'asc' ? 'desc' : cur.direction === 'desc' ? null : 'asc'
  } else {
    direction = 'asc'
  }
  sortDescriptor.value = { column, direction }
}

// ── Column resizing ──
const columnWidths = ref<Record<string, number>>({})
const resizingColumn = ref<string | null>(null)

function startResize(e: MouseEvent, colKey: string, startWidth: number) {
  resizingColumn.value = colKey
  const startX = e.clientX

  function onMove(ev: MouseEvent) {
    const col = props.columns.find((c) => c.key === colKey)
    const min = col?.minWidth ?? 50
    const max = col?.maxWidth ?? 9999
    columnWidths.value[colKey] = Math.min(max, Math.max(min, startWidth + ev.clientX - startX))
  }

  function onUp() {
    resizingColumn.value = null
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function getColStyle(col: (typeof props.columns)[number]) {
  const w = columnWidths.value[col.key] ?? col.width
  if (!w) return {}
  return { width: typeof w === 'number' ? `${w}px` : w }
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

// Border-radius inline style for primary variant
const rootRadiusStyle = computed(() =>
  props.variant === 'primary'
    ? { borderRadius: 'calc(var(--ousi-radius, 0.5rem) * 2.5)' }
    : {},
)
</script>

<template>
  <div
    :class="cn(tableRootTheme({ variant }), props.class)"
    :style="rootRadiusStyle"
  >
    <div :class="tableScrollContainerTheme">
      <table :class="tableContentTheme">
        <!-- Header -->
        <thead :class="tableHeaderTheme({ variant })">
          <tr>
            <!-- Select-all checkbox -->
            <th v-if="selectionMode === 'multiple'" :class="['w-12 px-4 py-2.5', variant === 'secondary' ? 'bg-ousi-default rounded-l-ousi-2xl' : '']">
              <OCheckbox
                :model-value="isAllSelected"
                :indeterminate="isSomeSelected"
                @update:model-value="toggleAll"
              />
            </th>

            <th
              v-for="(col, ci) in columns"
              :key="col.key"
              :class="tableColumnTheme({ variant, sortable: col.sortable, align: col.align })"
              :style="getColStyle(col)"
              :aria-sort="
                sortDescriptor.column === col.key
                  ? sortDescriptor.direction === 'asc' ? 'ascending'
                    : sortDescriptor.direction === 'desc' ? 'descending'
                    : 'none'
                  : undefined
              "
              tabindex="0"
              @click="col.sortable && onSort(col.key)"
              @keydown.enter.prevent="col.sortable && onSort(col.key)"
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
                    v-if="sortDescriptor.column === col.key && sortDescriptor.direction === 'asc'"
                    d="M12 19V5M5 12l7-7 7 7"
                    stroke-linecap="round" stroke-linejoin="round"
                  />
                  <path
                    v-else-if="sortDescriptor.column === col.key && sortDescriptor.direction === 'desc'"
                    d="M12 5v14M5 12l7 7 7-7"
                    stroke-linecap="round" stroke-linejoin="round"
                  />
                  <path
                    v-else
                    d="M8 9l4-4 4 4M16 15l-4 4-4-4"
                    stroke-linecap="round" stroke-linejoin="round"
                  />
                </svg>
              </span>

              <!-- Column separator -->
              <span
                v-if="ci < columns.length - 1 && !allowsResizing"
                :class="tableColumnSeparatorTheme"
                aria-hidden="true"
              />

              <!-- Resizer -->
              <div
                v-if="allowsResizing && col.resizable !== false"
                :class="tableColumnResizerTheme"
                :data-resizing="resizingColumn === col.key || undefined"
                @mousedown.stop="startResize(
                  $event,
                  col.key,
                  columnWidths[col.key] ?? (typeof col.width === 'number' ? col.width : 120),
                )"
              />
            </th>
          </tr>
        </thead>

        <!-- Body -->
        <tbody :class="tableBodyTheme">
          <!-- Loading skeleton -->
          <template v-if="isLoading">
            <tr v-for="i in loadingRows" :key="`sk-${i}`">
              <td v-if="selectionMode === 'multiple'" class="px-4 py-3 w-12">
                <OSkeleton class="h-4 w-4 rounded-ousi-md" />
              </td>
              <td
                v-for="col in columns"
                :key="col.key"
                :class="tableCellTheme({ variant })"
              >
                <OSkeleton :class="['h-4 rounded-ousi-sm', i % 2 === 0 ? 'w-3/4' : 'w-full']" />
              </td>
            </tr>
          </template>

          <!-- Empty state -->
          <tr v-else-if="rows.length === 0">
            <td
              :colspan="selectionMode === 'multiple' ? columns.length + 1 : columns.length"
              :class="tableEmptyTheme"
            >
              <slot name="empty">{{ emptyContent }}</slot>
            </td>
          </tr>

          <!-- Data rows -->
          <template v-else>
            <tr
              v-for="row in rows"
              :key="getRowKey(row)"
              :class="tableRowTheme({
                disabled: isRowDisabled(row),
                clickable: selectionMode !== 'none',
              })"
              :data-selected="isRowSelected(row) || undefined"
              :data-disabled="isRowDisabled(row) || undefined"
              :aria-selected="selectionMode !== 'none' ? isRowSelected(row) : undefined"
              tabindex="0"
              @click="selectionMode !== 'none'
                ? toggleSelection(getRowKey(row))
                : emit('rowAction', getRowKey(row))"
              @keydown.enter="selectionMode !== 'none'
                ? toggleSelection(getRowKey(row))
                : emit('rowAction', getRowKey(row))"
            >
              <!-- Row checkbox -->
              <td
                v-if="selectionMode === 'multiple'"
                :class="cn(tableCellTheme({ variant, selected: isRowSelected(row) }), 'w-12')"
                @click.stop="toggleSelection(getRowKey(row))"
              >
                <OCheckbox
                  :model-value="isRowSelected(row)"
                  :disabled="isRowDisabled(row)"
                />
              </td>

              <!-- Data cells -->
              <td
                v-for="col in columns"
                :key="col.key"
                :class="tableCellTheme({ variant, selected: isRowSelected(row) })"
                :style="{ textAlign: col.align ?? 'left' }"
              >
                <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]" :column="col">
                  {{ row[col.key] }}
                </slot>
              </td>
            </tr>
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
