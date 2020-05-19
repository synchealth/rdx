import type { Node } from 'unist'
import type * as HAST from 'hast-format'
import type * as MDAST from 'mdast'
import type { H } from '../index'

export function thematicBreak(
  h: H,
  node?: MDAST.ThematicBreak & Node
): HAST.Element {
  return h(node, 'hr')
}
