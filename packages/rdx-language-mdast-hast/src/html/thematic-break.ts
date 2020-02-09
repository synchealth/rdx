import { Node } from 'unist'
import * as HAST from 'hast-format'
import * as MDAST from 'mdast'
import { H } from '../index'

export function thematicBreak(
  h: H,
  node?: MDAST.ThematicBreak & Node
): HAST.Element {
  return h(node, 'hr')
}
