import ButtonGroup from './ButtonGroup.vue'
import ButtonGroupSeparator from './ButtonGroupSeparator.vue'

const OButtonGroup = Object.assign(ButtonGroup, {
  Separator: ButtonGroupSeparator,
})

export { OButtonGroup }
export type { ButtonGroupProps, ButtonGroupOrientation } from './button-group.types'
export { buttonGroupBaseTheme } from './button-group.theme'
