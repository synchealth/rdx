import { thematicBreak } from './thematic-break'
import { list } from './list-elements'
import { wrap } from '../wrap'
import { Node } from 'unist'
import { H } from '../Handler'
import * as MDAST from 'mdast'

export function footer(h: H) {
  var footnoteById = h.footnoteById
  var footnoteOrder = h.footnoteOrder
  var length = footnoteOrder.length
  var index = -1
  var listItems: (MDAST.ListItem & Node)[] = []
  var def
  var backReference
  var content
  var tail

  while (++index < length) {
    def = footnoteById[footnoteOrder[index].toUpperCase()]

    if (!def) {
      continue
    }

    content = def.children.concat()
    tail = content[content.length - 1]
    backReference = {
      type: 'link',
      url: '#fnref-' + def.identifier,
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
      data: { hProperties: { id: 'fn-' + def.identifier } },
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
