/** @jsx ReactiveCards.h */
import * as ReactiveCards from 'reactive-cards'

export const RDXImageCard: ReactiveCards.FC<{
  src: string
  altText?: string
  title?: string
  footer?: string
}> = ({ src, altText, title, footer }) => {
  return (
    <card
      $schema="http://adaptivecards.io/schemas/adaptive-card.json"
      version="1.0"
    >
      <body>
        {title && (
          <container>
            <text horizontalAlignment="center" size="large" weight="bolder">
              {title}
            </text>
          </container>
        )}
        <image url={src} altText={altText} horizontalAlignment="center" />
        {footer && (
          <text wrap horizontalAlignment="Center">
            {footer}
          </text>
        )}
      </body>
    </card>
  )
}
