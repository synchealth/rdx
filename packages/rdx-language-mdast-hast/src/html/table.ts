import type { Node } from 'unist'
import type * as HAST from 'hast-format'
import type * as MDAST from 'mdast'
import position from 'unist-util-position'
import { H, wrap, all } from '../index'

export function table(h: H, node: MDAST.Table & Node) {
  const rows = node.children
  let index = rows.length
  const { align } = node
  const alignLength = align ? align.length : undefined
  const result: HAST.Element[] = []
  let pos
  let row
  let out
  let name
  let cell

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
