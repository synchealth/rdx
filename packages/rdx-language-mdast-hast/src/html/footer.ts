import { Node } from 'unist'
import * as MDAST from 'mdast'
import { thematicBreak } from './thematic-break'
import { list } from './list-elements'
import { wrap } from '../wrap'
import { H } from '../Handler'

export function footer(h: H) {
  const { footnoteById } = h
  const { footnoteOrder } = h
  const { length } = footnoteOrder
  let index = -1
  const listItems: (MDAST.ListItem & Node)[] = []
  let def
  let backReference
  let content
  let tail

  while (++index < length) {
    def = footnoteById[footnoteOrder[index].toUpperCase()]

    if (!def) {
      // eslint-disable-next-line no-continue
      continue
    }

    content = def.children.concat()
    tail = content[content.length - 1]
    backReference = {
      type: 'link',
      url: `#fnref-${def.identifier}`,
      data: { hProperties: { className: ['footnote-backref'] } },
      children: [{ type: 'text', value: '↩' }]
    }

    if (!tail || tail.type !== 'paragraph') {
      tail = { type: 'paragraph', children: [] }
      content.push(tail)
    }

    tail.children.push(backReference)

    listItems.push({
      type: 'listItem',
      data: { hProperties: { id: `fn-${def.identifier}` } },
      children: content,
      position: def.position
    })
  }

  if (listItems.length === 0) {
    return null
  }

  return h(
    null,
    'div',
    { className: ['footnotes'] },
    wrap(
      [
        thematicBreak(h),
        list(h, { type: 'list', ordered: true, children: listItems })
      ],
      true
    )
  )
}
