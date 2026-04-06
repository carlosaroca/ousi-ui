import Card from './Card.vue'
import CardHeader from './CardHeader.vue'
import CardTitle from './CardTitle.vue'
import CardDescription from './CardDescription.vue'
import CardContent from './CardContent.vue'
import CardFooter from './CardFooter.vue'

const OCard = Object.assign(Card, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
})

export { OCard }
export type { CardProps, CardSubProps } from './card.types'
export {
  cardTheme,
  cardHeaderTheme,
  cardTitleTheme,
  cardDescriptionTheme,
  cardContentTheme,
  cardFooterTheme,
} from './card.theme'
