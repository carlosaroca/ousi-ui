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
    { text: "Don't put too many items in a single dropdown — consider grouping.", good: false },
  ],

  haptics: {
    defaultPreset: "'light' (or 'warning' for danger items)",
    trigger: 'On dropdown item click',
    notes: 'Danger-variant items automatically use the warning preset.',
  },
}
