import BentoGrid from './BentoGrid.vue'
import BentoGridItem from './BentoGridItem.vue'

const OBentoGrid = Object.assign(BentoGrid, {
  Item: BentoGridItem,
})

export { OBentoGrid, BentoGridItem as OBentoGridItem }
export type { BentoGridProps, BentoGridItemProps, BentoGridCols } from './bento-grid.types'
export { bentoGridTheme, bentoGridItemTheme } from './bento-grid.theme'
