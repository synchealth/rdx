import { H, wrap, all } from '../index'
import { Node } from 'unist'
import * as HAST from 'hast-format'
import * as MDAST from 'mdast'
import position from 'unist-util-position'

export function table(h: H, node: MDAST.Table & Node) {
  var rows = node.children
  var index = rows.length
  var align = node.align
  var alignLength = align ? align.length : undefined
  var result: HAST.Element[] = []
  var pos
  var row
  var out
  var name
  var cell

  while (index--) {
    row = rows[index].children
    name = index === 0 ? 'th' : 'td'
    pos = alignLength
    out = []

    while (pos--) {
      cell = row[pos]
      out[pos] = h(
        cell,
        name,
        { align: align ? align[pos] : undefined },
        cell ? all(h, cell) : []
      )
    }

    result[index] = h(rows[index], 'tr', wrap(out, true))
  }

  return h(
    node,
    'table',
    wrap(
      [
        h(result[0].position as any, 'thead', wrap([result[0]], true)),
        h(
          {
            start: position.start(result[1]),
            end: position.end(result[result.length - 1])
          },
          'tbody',
          wrap(result.slice(1), true)
        )
      ],
      true
    )
  )
}
