import { default as rcast2ac } from '../../reactive-cards/src/render-to-object'
import { jsx2rcast } from '../src/jsx2rcast'

const jsx = `<card version="1.0">
<speak>Tom's Pie is a Pizza restaurant which is rated 9.3 by customers.</speak>
<body>
  <columnset>
    <column width={2}>
      <text>PIZZA</text>
      <text weight="bolder" size="extraLarge" spacing="none">Tom's Pie</text>
      <text isSubtle spacing="none">4.2 ★★★☆ (93) · $$</text>
      <text size="small" wrap>**Matt H. said** "I'm compelled to give this place 5 stars due to the number of times I've chosen to eat here this past year!"</text>
    </column>
    <column width={1}>
      <image size="auto" url="https://picsum.photos/300?image=882" />
    </column>
  </columnset>
</body>
<actionset>
  <action id="action1" title="more info" type="openurl" url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
</actionset>
</card>`

import * as Adaptive from 'adaptivecards'
let card: Adaptive.AdaptiveCard
card = new Adaptive.AdaptiveCard()

const component = jsx2rcast(jsx)
console.log(JSON.stringify(component, null, 2))
const cardjson = rcast2ac(component, null)
console.log(JSON.stringify(cardjson, null, 2))

card.parse(cardjson, [])
const result: any = card.toJSON() as any
console.log('-----')
console.log(JSON.stringify(cardjson, null, 2))
