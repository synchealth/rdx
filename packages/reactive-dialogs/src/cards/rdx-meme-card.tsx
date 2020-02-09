/** @jsx ReactiveCards.h */
import * as ReactiveCards from 'reactive-cards'

export const RDXMemeCard: ReactiveCards.FC<{ title?: string }> = ({
  title,
  children
}) => {
  const elements = ReactiveCards.Children.toArray(children)

  const texts = elements
    .filter(child => child.type === 'text')
    .map(text => text.props.children.join(' '))

  const images = elements
    .filter(child => child.type === 'image')
    .map(image => image.props.url)

  const actionset = elements.find(child => child.type === 'actionset')
  const actions = elements
    .filter(child => child.type === 'action')
    .concat(
      actionset ? ReactiveCards.Children.toArray(actionset.props.children) : []
    )

  // TO DO SWITCH TO BLEED CONTAINER AND FOREGROUND IMAGE WITH ADAPTIVE CARDS 1.2+

  return (
    <card backgroundImage={images[0]} version="1.2" style="default">
      <body>
        <container minHeight="300px">
          <text
            fontType="default"
            size="extraLarge"
            weight="bolder"
            color="light"
            wrap
          >
            {texts[0]}
          </text>
          {texts.length > 1 && (
            <text size="large" color="light" wrap>
              {texts[1]}
            </text>
          )}
        </container>
      </body>
      <actionset>{actions}</actionset>
      <speak>{texts[0]}</speak>
    </card>
  )
}
