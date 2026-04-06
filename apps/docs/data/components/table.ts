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
        code: `<OTable
  :columns="columns"
  :rows="rows"
  selection-mode="multiple"
  @selection-change="onSelect"
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
    { name: 'selectionMode', type: "'none' | 'single' | 'multiple'", default: "'none'", description: 'Selection mode.' },
    { name: 'selectedKeys', type: 'Set<string>', default: '-', description: 'Controlled selected row keys.' },
    { name: 'defaultSelectedKeys', type: 'Set<string>', default: '-', description: 'Default selected keys (uncontrolled).' },
    { name: 'sortDescriptor', type: 'SortDescriptor', default: '-', description: 'Controlled sort state.' },
    { name: 'defaultSortDescriptor', type: 'SortDescriptor', default: '-', description: 'Default sort state.' },
    { name: 'disabledKeys', type: 'Set<string>', default: '-', description: 'Keys of disabled rows.' },
    { name: 'isLoading', type: 'boolean', default: 'false', description: 'Show loading skeleton.' },
    { name: 'loadingRows', type: 'number', default: '5', description: 'Number of skeleton rows when loading.' },
    { name: 'emptyContent', type: 'string', default: '-', description: 'Text shown when rows is empty.' },
    { name: 'showFooter', type: 'boolean', default: 'false', description: 'Show the footer slot area.' },
    { name: 'allowsResizing', type: 'boolean', default: 'false', description: 'Enable column resizing.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'selectionChange', type: '(keys: Set<string>) => void', description: 'Fired when selection changes.' },
    { name: 'sortChange', type: '(descriptor: SortDescriptor) => void', description: 'Fired when sort changes.' },
    { name: 'rowAction', type: '(key: string) => void', description: 'Fired when a row is activated.' },
  ],

  keyboard: [
    { key: 'arrow-up', description: 'Move focus to the previous row.' },
    { key: 'arrow-down', description: 'Move focus to the next row.' },
    { key: 'space', description: 'Toggle selection of the focused row.' },
    { key: 'enter', description: 'Trigger row action on focused row.' },
  ],
}
