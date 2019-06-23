import { H } from '../'
import { Node } from 'unist'
import * as HAST from 'hast-format'
import * as MDAST from 'mdast'

export function thematicBreak(
  h: H,
  node?: MDAST.ThematicBreak & Node
): HAST.Element {
  return h(node, 'hr')
}
