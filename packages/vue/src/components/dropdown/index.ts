import Dropdown from './Dropdown.vue'
import DropdownTrigger from './DropdownTrigger.vue'
import DropdownPopover from './DropdownPopover.vue'
import DropdownMenu from './DropdownMenu.vue'
import DropdownItem from './DropdownItem.vue'
import DropdownItemIndicator from './DropdownItemIndicator.vue'
import DropdownSection from './DropdownSection.vue'
import DropdownSubmenuTrigger from './DropdownSubmenuTrigger.vue'
import DropdownSubmenuIndicator from './DropdownSubmenuIndicator.vue'
import DropdownSeparator from './DropdownSeparator.vue'

const ODropdown = Object.assign(Dropdown, {
  Trigger: DropdownTrigger,
  Popover: DropdownPopover,
  Menu: DropdownMenu,
  Item: DropdownItem,
  ItemIndicator: DropdownItemIndicator,
  Section: DropdownSection,
  SubmenuTrigger: DropdownSubmenuTrigger,
  SubmenuIndicator: DropdownSubmenuIndicator,
  Separator: DropdownSeparator,
})

export { ODropdown }
export type {
  DropdownProps, DropdownMenuProps, DropdownItemProps,
  DropdownPopoverProps, DropdownSectionProps, DropdownSelectionMode,
} from './dropdown.types'
export {
  dropdownPopoverTheme, dropdownMenuTheme, dropdownItemTheme,
  dropdownSectionTheme, dropdownSeparatorTheme, dropdownItemIndicatorTheme,
} from './dropdown.theme'
