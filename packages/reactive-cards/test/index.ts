import { createFromObject, renderToObject } from '../src/index'

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
              size: 'extraLarge',
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
  actions: [
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

const result = createFromObject(item, null)

console.log(JSON.stringify(result, null, 2))

const itemOutput = renderToObject(result)

console.log(JSON.stringify(itemOutput, null, 2))
