/** @jsx ReactiveCards.h */
import * as ReactiveCards from 'reactive-cards'

interface RDXTableCard {
    title?: string,
    subheading?: string,
    footer?: string,
    image?: string,
    fontType?: string
    style?: any
    data: [string, string][]
  }
  
export const RDXTableCard: ReactiveCards.FC<RDXTableCard> = ({ title, subheading, footer, fontType, image, style, data, children }) => (
    <card style={style}>
      <body>
          {title && <text fontType="monospace" horizontalAlignment="center" size="small" weight="lighter">
                {title}
            </text>}
        {(image || children) && <columnset spacing="small">
          {image && <column verticalContentAlignment="Center" width={1}>
            <image url={image} />
          </column>}
          {children && <column spacing="medium" width={2}>
            <text fontType={fontType} horizontalAlignment="Left" wrap>
              {children}
            </text>
          </column>}
        </columnset>}
        <container spacing="none">
        {subheading && <text fontType="monospace" horizontalAlignment="center" wrap>
              {subheading}
        </text>}
        <factset>
            {data.map((item, i) => <fact key={i} title={item[0]} value={item[1]} />)}
        </factset>
        </container>
        {footer && <text fontType="monospace" horizontalAlignment="center" size="small" weight="lighter">
          {footer}
        </text>}
      </body>
    </card>
  )

  export default RDXTableCard