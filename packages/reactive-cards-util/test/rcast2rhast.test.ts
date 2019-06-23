import { rcast2rhast } from '../src/rcast2rhast'

import { default as h } from '../../reactive-cards/src/create-element'

const rcast = h(
  'card',
  {
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    version: '1.0'
  },
  h(
    'speak',
    {},
    "Tom's Pie is a Pizza restaurant which is rated 9.3 by customers."
  ),
  h(
    'body',
    {},
    h(
      'columnset',
      {},
      h(
        'column',
        {
          width: 2
        },
        h('text', {}, 'PIZZA'),
        h(
          'text',
          {
            weight: 'bolder',
            size: 'extraLarge',
            spacing: 'none'
          },
          "Tom's Pie"
        ),
        h(
          'text',
          {
            isSubtle: true,
            spacing: 'none'
          },
          '4.2 ★★★☆ (93) · $$'
        ),
        h(
          'text',
          {
            size: 'small',
            wrap: true
          },
          "**Matt H. said** &quot;I'm compelled to give this place 5 stars due to the number of times I've chosen to eat here this past year!&quot;"
        )
      ),
      h(
        'column',
        {
          width: 1
        },
        h('image', {
          size: 'auto',
          url: 'https://picsum.photos/300?image=882'
        })
      )
    )
  ),
  h(
    'actionset',
    {},
    h('action', {
      title: 'more info',
      type: 'openurl',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    })
  )
)
var el = rcast2rhast(rcast as any)

console.log(JSON.stringify(el, null, 2))
