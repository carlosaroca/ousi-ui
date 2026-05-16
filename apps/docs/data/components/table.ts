import type { ComponentData } from './types'

export const tableData: ComponentData = {
  title: 'Table',
  description: 'Display structured data in rows and columns with sorting and selection.',
  category: 'Data Display',
  importCode: "import { OTable } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'TableBasic',
        code: `<OTable
  :columns="[
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
  ]"
  :rows="[
    { id: '1', name: 'Alice', role: 'Admin' },
    { id: '2', name: 'Bob', role: 'Editor' },
  ]"
/>`,
      },
    },
    {
      id: 'shadows',
      title: 'Shadows',
      example: {
        component: 'TableShadows',
        code: `<OTable shadow="none" :columns="columns" :rows="rows" />   <!-- default -->
<OTable shadow="xs" :columns="columns" :rows="rows" />
<OTable shadow="sm" :columns="columns" :rows="rows" />
<OTable shadow="md" :columns="columns" :rows="rows" />`,
      },
    },
    {
      id: 'sorting',
      title: 'Sorting',
      example: {
        component: 'TableSorting',
        code: `<OTable
  :columns="[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'age', label: 'Age', sortable: true },
  ]"
  :rows="rows"
  @sort-change="onSortChange"
/>`,
      },
    },
    {
      id: 'single-selection',
      title: 'Single Selection',
      example: {
        component: 'TableSingleSelection',
        code: `<OTable
  :columns="columns"
  :rows="rows"
  selection-mode="single"
  @selection-change="onSelect"
/>`,
      },
    },
    {
      id: 'multiple-selection',
      title: 'Multiple Selection',
      example: {
        component: 'TableMultipleSelection',
        code: `<!-- Shift+click on a checkbox selects the range from the last anchor. -->
<OTable
  :columns="columns"
  :rows="rows"
  selection-mode="multiple"
  @selection-change="onSelect"
/>`,
      },
    },
    {
      id: 'row-only-selection',
      title: 'Row-Only Selection (hidden checkbox)',
      example: {
        component: 'TableRowOnlySelection',
        code: `<!-- Click anywhere on a row to toggle. Shift+click still selects ranges. -->
<OTable
  :columns="columns"
  :rows="rows"
  selection-mode="multiple"
  :show-selection-column="false"
/>`,
      },
    },
    {
      id: 'sticky-header',
      title: 'Sticky Header',
      example: {
        component: 'TableStickyHeader',
        code: `<OTable
  :columns="columns"
  :rows="rows"
  sticky-header
  style="--ousi-table-max-height: 24rem"
/>`,
      },
    },
    {
      id: 'expandable',
      title: 'Expandable Rows',
      example: {
        component: 'TableExpandable',
        code: `<OTable :columns="columns" :rows="rows" expandable>
  <template #expanded-row="{ row }">
    <div class="p-3 text-sm">
      <p><strong>Email:</strong> {{ row.email }}</p>
      <p><strong>Address:</strong> {{ row.address }}</p>
    </div>
  </template>
</OTable>`,
      },
    },
    {
      id: 'multi-sort',
      title: 'Multi-Column Sort',
      example: {
        component: 'TableMultiSort',
        code: `<!-- Shift+click on a sortable header adds a secondary sort. -->
<OTable
  :columns="[
    { key: 'team', label: 'Team', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'score', label: 'Score', sortable: true, align: 'right' },
  ]"
  :rows="rows"
  multi-sort
/>`,
      },
    },
    {
      id: 'sticky-columns',
      title: 'Sticky Columns',
      example: {
        component: 'TableStickyColumns',
        code: `<!-- Pin any column to either edge via the column's "sticky" prop.
     Multiple pinned columns stack with cumulative offsets.
     Implicit columns (expand / checkbox) auto-pin when needed.
     Set widths that fit your content — sticky cells are locked to that width. -->
<OTable
  :columns="[
    { key: 'id',     label: '#',      width: 56,  sticky: 'left' },
    { key: 'name',   label: 'Name',   width: 150, sticky: 'left' },
    { key: 'team',   label: 'Team',   width: 110 },
    { key: 'role',   label: 'Role',   width: 170 },
    { key: 'email',  label: 'Email',  width: 200 },
    { key: 'phone',  label: 'Phone',  width: 140 },
    { key: 'salary', label: 'Salary', width: 96,  sticky: 'right', align: 'right' },
  ]"
  :rows="rows"
/>`,
      },
    },
    {
      id: 'density',
      title: 'Density',
      example: {
        component: 'TableDensity',
        code: `<OTable :columns="columns" :rows="rows" density="compact" />
<OTable :columns="columns" :rows="rows" density="normal" />   <!-- default -->
<OTable :columns="columns" :rows="rows" density="relaxed" />`,
      },
    },
    {
      id: 'columns-toggle',
      title: 'Right-click context menu',
      example: {
        component: 'TableColumnsToggle',
        code: `<script setup>
import { ref } from 'vue'
import { OTable, OContextMenu } from '@ousi-ui/vue'

const tableRef = ref()

// 1. Define the menu items you want on right-click.
const menuItems = [
  { key: 'view',      label: 'View details' },
  { key: 'duplicate', label: 'Duplicate row' },
  { key: 'sep',       label: '', separator: true },
  { key: 'hide-email', label: 'Toggle Email column' },
  { key: 'export',    label: 'Export to CSV…' },
]

// 2. Handle each action. The table exposes toggleColumn() and exportCSV().
function handle(key) {
  if (key === 'view')        console.log('view')          // your handler
  if (key === 'duplicate')   console.log('duplicate')     // your handler
  if (key === 'hide-email')  tableRef.value?.toggleColumn('email')
  if (key === 'export')      tableRef.value?.exportCSV()
}
&lt;/script&gt;

<template>
  <!-- Wrap the table in OContextMenu — right-click anywhere on it opens the menu. -->
  <OContextMenu :items="menuItems" @select="handle">
    <OTable ref="tableRef" :columns="columns" :rows="rows" />
  </OContextMenu>
</template>`,
      },
    },
    {
      id: 'csv-export',
      title: 'CSV Export',
      example: {
        component: 'TableCsvExport',
        code: `<OTable ref="tableRef" :columns="columns" :rows="rows" />

<OButton @click="tableRef?.exportCSV({ filename: 'employees.csv' })">
  Export CSV
</OButton>`,
      },
    },
    {
      id: 'resizable-columns',
      title: 'Resizable Columns',
      example: {
        component: 'TableResizable',
        code: `<!-- Drag the right edge of a column header. The resizer is also keyboard-
     accessible: focus it and use ArrowLeft/Right (Shift = 1px, Ctrl = 24px). -->
<OTable
  :columns="[
    { key: 'name', label: 'Name', resizable: true, width: 200 },
    { key: 'role', label: 'Role', resizable: true, width: 160 },
    { key: 'team', label: 'Team', resizable: true, width: 140 },
  ]"
  :rows="rows"
  allows-resizing
/>`,
      },
    },
    {
      id: 'custom-cells',
      title: 'Custom Cells',
      example: {
        component: 'TableCustomCells',
        code: `<OTable :columns="columns" :rows="rows">
  <template #cell-status="{ row }">
    <OChip :color="row.active ? 'success' : 'danger'" size="sm">
      {{ row.active ? 'Active' : 'Inactive' }}
    </OChip>
  </template>
</OTable>`,
      },
    },
    {
      id: 'empty-state',
      title: 'Empty State',
      example: {
        component: 'TableEmptyState',
        code: `<OTable
  :columns="columns"
  :rows="[]"
  empty-content="No data available."
/>`,
      },
    },
    {
      id: 'loading',
      title: 'Loading',
      example: {
        component: 'TableLoading',
        code: `<OTable
  :columns="columns"
  :rows="[]"
  :is-loading="true"
  :loading-rows="3"
/>`,
      },
    },
    {
      id: 'with-pagination',
      title: 'With Pagination',
      example: {
        component: 'TableWithPagination',
        code: `<OTable :columns="columns" :rows="paginatedRows" show-footer>
  <template #footer>
    <OPagination :total="50" :page="page" @update:page="page = $event" />
  </template>
</OTable>`,
      },
    },
  ],

  props: [
    { name: 'columns', type: 'TableColumn[]', default: '-', description: 'Column definitions.' },
    { name: 'rows', type: 'Record<string, any>[]', default: '-', description: 'Row data array.' },
    { name: 'rowKey', type: 'string', default: "'id'", description: 'Key property on each row.' },
    { name: 'variant', type: "'primary' | 'secondary'", default: "'primary'", description: 'Visual variant.' },
    { name: 'shadow', type: "'none' | 'xs' | 'sm' | 'md'", default: "'none'", description: 'Elevation shadow.' },
    { name: 'selectionMode', type: "'none' | 'single' | 'multiple'", default: "'none'", description: 'Selection mode.' },
    { name: 'showSelectionColumn', type: 'boolean', default: 'true', description: "Show the checkbox column when selectionMode='multiple'. When false, the row click toggles selection without rendering checkboxes." },
    { name: 'selectedKeys', type: 'Set<string>', default: '-', description: 'Controlled selected row keys.' },
    { name: 'defaultSelectedKeys', type: 'Set<string>', default: '-', description: 'Default selected keys (uncontrolled).' },
    { name: 'sortDescriptor', type: 'SortDescriptor', default: '-', description: 'Controlled sort state (single column).' },
    { name: 'defaultSortDescriptor', type: 'SortDescriptor', default: '-', description: 'Default sort state (single column).' },
    { name: 'sortDescriptors', type: 'SortDescriptor[]', default: '-', description: 'Controlled multi-column sort state. Used when multiSort is true.' },
    { name: 'defaultSortDescriptors', type: 'SortDescriptor[]', default: '-', description: 'Default multi-column sort state.' },
    { name: 'multiSort', type: 'boolean', default: 'false', description: 'Allow sorting by multiple columns — shift+click adds a secondary sort.' },
    { name: 'stickyHeader', type: 'boolean', default: 'false', description: 'Stick the header to the top while the body scrolls.' },
    { name: 'density', type: "'compact' | 'normal' | 'relaxed'", default: "'normal'", description: 'Row height density.' },
    { name: 'hiddenColumns', type: 'Set<string>', default: '-', description: 'Controlled set of column keys to hide. Pair with v-model:hidden-columns.' },
    { name: 'defaultHiddenColumns', type: 'Set<string>', default: '-', description: 'Default set of column keys to hide (uncontrolled).' },
    { name: 'expandable', type: 'boolean', default: 'false', description: 'Show an expand toggle column. Pair with the #expanded-row slot.' },
    { name: 'expandedKeys', type: 'Set<string>', default: '-', description: 'Controlled expanded row keys.' },
    { name: 'defaultExpandedKeys', type: 'Set<string>', default: '-', description: 'Default expanded row keys.' },
    { name: 'disabledKeys', type: 'Set<string>', default: '-', description: 'Keys of disabled rows.' },
    { name: 'isLoading', type: 'boolean', default: 'false', description: 'Show loading skeleton.' },
    { name: 'loadingRows', type: 'number', default: '5', description: 'Number of skeleton rows when loading.' },
    { name: 'emptyContent', type: 'string', default: '-', description: 'Text shown when rows is empty.' },
    { name: 'showFooter', type: 'boolean', default: 'false', description: 'Show the footer slot area.' },
    { name: 'allowsResizing', type: 'boolean', default: 'false', description: 'Enable column resizing (mouse drag or keyboard ArrowLeft/Right when the resizer is focused).' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'selectionChange', type: '(keys: Set<string>) => void', description: 'Fired when selection changes.' },
    { name: 'sortChange', type: '(descriptor: SortDescriptor | SortDescriptor[]) => void', description: 'Fired when sort changes. Payload is an array when multiSort is enabled.' },
    { name: 'expansionChange', type: '(keys: Set<string>) => void', description: 'Fired when the set of expanded rows changes.' },
    { name: 'rowAction', type: '(key: string) => void', description: 'Fired when a row is activated.' },
    { name: 'rowContextMenu', type: '(row, event: MouseEvent) => void', description: 'Fired on right-click over a data row. Call event.preventDefault() to suppress the native menu.' },
    { name: 'columnContextMenu', type: '(column: TableColumn, event: MouseEvent) => void', description: 'Fired on right-click over a column header.' },
  ],

  methods: [
    {
      name: 'exportCSV',
      type: '(options?: { filename?: string; includeHidden?: boolean }) => void',
      description: 'Download the current display state as CSV. Honors sort and column visibility unless includeHidden is true. Defaults: filename="table.csv".',
    },
    {
      name: 'toggleColumn',
      type: '(key: string) => void',
      description: 'Show or hide the column with the given key. Updates hiddenColumns and emits update:hiddenColumns.',
    },
    {
      name: 'hiddenColumns',
      type: 'Ref<Set<string>>',
      description: 'Reactive ref to the current set of hidden column keys. Read-only — use toggleColumn (or v-model:hidden-columns) to mutate.',
    },
  ],

  keyboard: [
    { key: 'arrow-up / arrow-down', description: 'Move focus to the cell above / below.' },
    { key: 'arrow-left / arrow-right', description: 'Move focus to the cell on the left / right.' },
    { key: 'home / end', description: 'Move focus to the first / last cell of the current row.' },
    { key: 'ctrl-home / ctrl-end', description: 'Move focus to the first cell of the first row / last cell of the last row.' },
    { key: 'space / enter', description: 'Toggle selection (or trigger row action when no selection mode is set).' },
    { key: 'shift-click', description: 'Select a range of rows from the last anchor — only when selectionMode is "multiple".' },
    { key: 'shift-click on sortable header', description: 'Add a secondary sort column when multiSort is enabled.' },
    { key: 'arrow-left / arrow-right on focused resizer', description: 'Resize the column (Shift = 1px, Ctrl/Cmd = 24px). Requires allowsResizing.' },
  ],
}
