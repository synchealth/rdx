/** @jsx ReactiveCards.h */
import * as ReactiveCards from 'reactive-cards'

export const RDXQuoteCard: ReactiveCards.FC<{ title?: string }> = ({
  title,
  children
}) => {
  const elements = ReactiveCards.Children.toArray(children)

  const image = elements.find(child => child.type == 'image')

  let texts = elements
    .filter(child => child.type == 'text')
    .map(text => text.props.children.join(' '))

  let lastText

  if (texts.length > 1) {
    lastText = texts[texts.length - 1]
    texts.splice(-1, 1)
  }

  const actionset = elements.find(child => child.type == 'actionset')
  const actions = elements
    .filter(child => child.type == 'action')
    .concat(
      actionset ? ReactiveCards.Children.toArray(actionset.props.children) : []
    )

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
        <columnset spacing="medium">
          <column verticalContentAlignment="Center" width={1}>
            {image}
          </column>
          <column spacing="medium" width={2}>
            {texts.map((text, i) => (
              <text key={i} horizontalAlignment="Left" wrap>
                *&#8220;{text}&#8221;*
              </text>
            ))}
            {lastText && (
              <text horizontalAlignment="Right" wrap>
                *&#8213; {lastText}*
              </text>
            )}
          </column>
        </columnset>
      </body>
      <actionset>{actions}</actionset>
    </card>
  )
}
