import { createFromObject } from 'reactive-cards'
import { rcast2rhast, rhast2jsx } from '../src/index'

const item = {
  speak: "Tom's Pie is a Pizza restaurant which is rated 9.3 by customers.",
  body: [
    {
      columns: [
        {
          items: [
            {
              text: 'PIZZA',
              type: 'TextBlock'
            },
            {
              text: "Tom's Pie",
              type: 'TextBlock',
              weight: 'bolder',
              size: 'ExtraLarge',
              spacing: 'none'
            },
            {
              text: '4.2 ★★★☆ (93) · $$',
              type: 'TextBlock',
              isSubtle: true,
              spacing: 'none'
            },
            {
              text:
                '**Matt H. said** "I\'m compelled to give this place 5 stars due to the number of times I\'ve chosen to eat here this past year!"',
              type: 'TextBlock',
              size: 'small',
              wrap: true
            }
          ],
          type: 'Column',
          width: 2
        },
        {
          items: [
            {
              type: 'Image',
              size: 'auto',
              url: 'https://picsum.photos/300?image=882'
            }
          ],
          type: 'Column',
          width: 1
        }
      ],
      type: 'ColumnSet'
    }
  ],
  actionset: [
    {
      title: 'more info',
      type: 'Action.OpenUrl',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    }
  ],
  type: 'AdaptiveCard',
  $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
  version: '1.0'
}

const rcast = createFromObject(item)
console.log(JSON.stringify(rcast, null, 2))

const rhast = rcast2rhast(rcast)
console.log(JSON.stringify(rhast, null, 2))

const jsx = rhast2jsx(rhast as ReactiveCards.RHastNode)

console.log(jsx)
