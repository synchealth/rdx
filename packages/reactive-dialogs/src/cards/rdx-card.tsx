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
          <text horizontalAlignment="Left" wrap>
            {child.props.children.join(' ')}
          </text>
        )
        if (lastimage) {
          textimages.push(
            <columnset key={i} spacing="medium">
              <column verticalContentAlignment="Center" width={1}>
                {lastimage}
              </column>
              <column spacing="medium" width={2}>
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
    }
  })

  if (lastimage) {
    textimages.push(<container spacing="medium">{lastimage}</container>)
  }

  return (
    <card
      $schema="http://adaptivecards.io/schemas/adaptive-card.json"
      version="1.0"
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
