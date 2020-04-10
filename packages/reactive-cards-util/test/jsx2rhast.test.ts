import { jsx2rhast } from '../src/jsx2rhast'

const item = `<card>
<speak>Tom's Pie is a Pizza restaurant which is rated 9.3 by customers.</speak>
<body>
  <columnset>
    <column width={finalizeDog}>
      <text>PIZZA</text>
      <text weight="bolder" size="extraLarge" spacing="none">Tom's Pie</text>
      <text isSubtle spacing="none">4.2 ★★★☆ (93) · $$</text>
      <text size="small" wrap>**Matt H. said** "I'm compelled to give this place 5 stars due to the number
        of times I've chosen to eat here this past year!"
        </text>
    </column>
    <column width={1 + 3}>
      <image size="auto" url="https://picsum.photos/300?image=882" />
    </column>
  </columnset>
</body>
<actionset>
  <action url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" type="openurl">more info</action>
</actionset>
</card>`

const el = jsx2rhast(item)

console.log(JSON.stringify(el, null, 2))
