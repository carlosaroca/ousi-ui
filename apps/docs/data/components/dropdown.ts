import type { ComponentData } from './types'

export const dropdownData: ComponentData = {
  title: 'Dropdown',
  description: 'A menu that appears below a trigger, offering a list of actions.',
  category: 'Overlays',
  importCode: "import { ODropdown } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'DropdownUsage',
        code: `<ODropdown>
  <ODropdownTrigger>
    <OButton>Options</OButton>
  </ODropdownTrigger>
  <ODropdownPopover>
    <ODropdownMenu>
      <ODropdownItem id="edit">Edit</ODropdownItem>
      <ODropdownItem id="duplicate">Duplicate</ODropdownItem>
      <ODropdownItem id="delete">Delete</ODropdownItem>
    </ODropdownMenu>
  </ODropdownPopover>
</ODropdown>`,
      },
    },
    {
      id: 'selection',
      title: 'Selection',
      example: {
        component: 'DropdownSelection',
        code: `<ODropdownMenu v-model:selected-keys="view" selection-mode="single">
  <ODropdownItem id="list"><ODropdownItemIndicator />List</ODropdownItem>
  <ODropdownItem id="grid"><ODropdownItemIndicator />Grid</ODropdownItem>
</ODropdownMenu>

<ODropdownMenu v-model:selected-keys="columns" selection-mode="multiple">
  <ODropdownItem id="name"><ODropdownItemIndicator />Name</ODropdownItem>
  <ODropdownItem id="status"><ODropdownItemIndicator />Status</ODropdownItem>
</ODropdownMenu>`,
      },
    },
    {
      id: 'with-icons',
      title: 'With Icons',
      example: {
        component: 'DropdownWithIcons',
        code: `<ODropdownItem id="edit">
  <template #start><PencilIcon class="size-4" /></template>
  Edit
</ODropdownItem>`,
      },
    },
    {
      id: 'danger-item',
      title: 'Danger Item',
      example: {
        component: 'DropdownDangerItem',
        code: `<ODropdownSeparator />
<ODropdownItem id="delete" variant="danger">
  Delete
</ODropdownItem>`,
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'DropdownDisabled',
        code: `<ODropdownItem id="archive" disabled>
  Archive
</ODropdownItem>`,
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'boolean', description: 'Controls open/close state (v-model).' },
    { name: 'shadow', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'lg'", description: 'Elevation shadow (on ODropdownPopover).' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Whether the dropdown starts open.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  parts: [
    {
      name: 'ODropdownTrigger',
      description: 'The element that opens and closes the menu. Wrap a button in it.',
      slots: [
        { name: 'default', type: 'slot', description: 'The trigger content, usually an OButton.' },
      ],
    },
    {
      name: 'ODropdownPopover',
      description: 'The floating panel that holds the menu. It flips and shifts to stay inside the viewport, and closes on Escape or a click outside.',
      props: [
        { name: 'placement', type: "'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end' | 'left' | 'right'", default: "'bottom-start'", description: 'Where the panel opens relative to the trigger.' },
        { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
      ],
      slots: [
        { name: 'default', type: 'slot', description: 'The ODropdownMenu.' },
      ],
    },
    {
      name: 'ODropdownMenu',
      description: 'The list of items. It owns selection and keyboard navigation.',
      props: [
        { name: 'selectionMode', type: "'none' | 'single' | 'multiple'", default: "'none'", description: 'With none, activating an item fires action and closes the menu. With single or multiple it toggles the item instead, keeps the menu open and emits selectionChange. In single mode, choosing the selected item again clears it.' },
        { name: 'selectedKeys', type: 'Set<string>', default: '-', description: 'Ids of the selected items. Pass it to control the selection (v-model:selected-keys).' },
        { name: 'defaultSelectedKeys', type: 'Set<string>', default: 'new Set()', description: 'Ids selected first when the selection is uncontrolled.' },
        { name: 'disabledKeys', type: 'Set<string>', default: 'new Set()', description: 'Ids of items that cannot be activated, without setting disabled on each one.' },
        { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
      ],
      slots: [
        { name: 'default', type: 'slot', description: 'ODropdownItem, ODropdownSection and ODropdownSeparator.' },
      ],
      emits: [
        { name: 'action', type: '[key: string]', description: 'Emitted with the item id when an item is activated and selectionMode is none.' },
        { name: 'selectionChange', type: '[keys: Set<string>]', description: 'Emitted when the selection changes.' },
        { name: 'update:selectedKeys', type: '[keys: Set<string>]', description: 'Emitted when the selection changes (v-model:selected-keys).' },
      ],
    },
    {
      name: 'ODropdownItem',
      description: 'One option of the menu.',
      props: [
        { name: 'id', type: 'string', default: 'required', description: 'Unique key of the item. It is what action and the selection sets carry.' },
        { name: 'variant', type: "'default' | 'danger'", default: "'default'", description: 'Visual style. Use danger for destructive actions.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Makes the item non-interactive.' },
        { name: 'haptic', type: 'HapticInput', default: "'light'", description: 'Haptic feedback on click. Pass false to turn it off.' },
        { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
      ],
      slots: [
        { name: 'default', type: 'slot', description: 'The item content. Put an ODropdownItemIndicator first to show the selection.' },
      ],
    },
    {
      name: 'ODropdownItemIndicator',
      description: 'A check mark that shows while its item is selected. It keeps its space when it is not, so the labels stay aligned.',
      slots: [
        { name: 'default', type: 'slot', description: 'Replaces the check mark.' },
      ],
    },
    {
      name: 'ODropdownSection',
      description: 'Groups related items under a heading.',
      props: [
        { name: 'title', type: 'string', default: '-', description: 'Heading shown above the section.' },
        { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
      ],
      slots: [
        { name: 'default', type: 'slot', description: 'The ODropdownItem elements of the section.' },
      ],
    },
    {
      name: 'ODropdownSeparator',
      description: 'A divider line between items or sections. It has no props.',
    },
  ],

  slots: [
    { name: 'default', type: 'slot', description: 'Dropdown trigger and popover content.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '[value: boolean]', description: 'Emitted when open state changes.' },
    { name: 'openChange', type: '[value: boolean]', description: 'Emitted when the dropdown opens or closes.' },
  ],

  keyboard: [
    { key: 'enter', description: 'Opens the menu or activates the focused item.' },
    { key: 'space', description: 'Opens the menu or activates the focused item.' },
    { key: 'escape', description: 'Closes the menu.' },
    { key: 'arrow-down', description: 'Moves focus to the next item.' },
    { key: 'arrow-up', description: 'Moves focus to the previous item.' },
    { key: 'home', description: 'Moves focus to the first item.' },
    { key: 'end', description: 'Moves focus to the last item.' },
  ],

  aria: [
    { attribute: 'role="menu"', condition: 'on menu', description: 'The menu container has menu role.' },
    { attribute: 'role="menuitem"', condition: 'on items', description: 'Each item has menuitem role.' },
    { attribute: 'aria-expanded', condition: 'on trigger', description: 'Reflects whether the menu is open.' },
    { attribute: 'aria-haspopup', condition: 'on trigger', description: 'Indicates the trigger opens a menu.' },
    { attribute: 'aria-disabled', condition: 'disabled items', description: 'Marks items as non-interactive.' },
  ],

  bestPractices: [
    { text: 'Group related actions using ODropdownSection.', good: true },
    { text: 'Place destructive actions at the end with variant="danger".', good: true },
    { text: "Don't put too many items in a single dropdown. Consider grouping.", good: false },
  ],

  haptics: {
    defaultPreset: "'light' (or 'warning' for danger items)",
    trigger: 'On dropdown item click',
    notes: 'Danger-variant items automatically use the warning preset.',
  },
}
