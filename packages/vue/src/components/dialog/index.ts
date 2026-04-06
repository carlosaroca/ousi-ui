import Dialog from './Dialog.vue'
import DialogHeader from './DialogHeader.vue'
import DialogBody from './DialogBody.vue'
import DialogFooter from './DialogFooter.vue'

const ODialog = Object.assign(Dialog, {
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
})

export { ODialog }
export type { DialogProps, DialogEmits, DialogSubProps } from './dialog.types'
export {
  dialogBackdropTheme,
  dialogContainerTheme,
  dialogPanelTheme,
  dialogHeaderTheme,
  dialogHeadingTheme,
  dialogBodyTheme,
  dialogFooterTheme,
} from './dialog.theme'
