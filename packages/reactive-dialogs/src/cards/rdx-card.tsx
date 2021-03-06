/* eslint-disable react/no-array-index-key */
/* eslint-disable no-case-declarations */
/** @jsx ReactiveCards.h */
import * as ReactiveCards from 'reactive-cards'

export const RDXCard: ReactiveCards.FC<{ title?: string }> = ({
  title,
  children
}) => {
  const elements = ReactiveCards.Children.toArray(children)

  const textimages: any[] = []
  let actions: any[] = []
  let lastimage: any = null

  elements.forEach((child, i) => {
    switch (child.type) {
      case 'text':
        const text = (
          <text horizontalAlignment="Left" height="stretch" wrap>
            {child.props.children.join(' ')}
          </text>
        )
        if (lastimage) {
          textimages.push(
            <columnset key={i}>
              <column verticalContentAlignment="Center" width={1}>
                {lastimage}
              </column>
              <column verticalContentAlignment="Center" width={2}>
                {text}
              </column>
            </columnset>
          )
          lastimage = null
        } else {
          textimages.push(
            <container key={i} spacing="medium">
              {text}
            </container>
          )
        }
        break
      case 'image':
        lastimage = child
        break
      case 'actionset':
        actions = actions.concat(
          ReactiveCards.Children.toArray(child.props.children)
        )
        break
      case 'action':
        actions.push(child)
        break
      default:
      /** noop */
    }
  })

  if (lastimage) {
    textimages.push(<container spacing="medium">{lastimage}</container>)
  }

  return (
    <card
      $schema="http://adaptivecards.io/schemas/adaptive-card.json"
      version="1.2"
      style="default"
    >
      <body>
        {title && (
          <text horizontalAlignment="center" size="extraLarge" weight="bolder">
            {title}
          </text>
        )}
        {textimages}
      </body>
      <actionset>{actions}</actionset>
    </card>
  )
}
