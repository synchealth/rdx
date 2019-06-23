import u from 'unist-builder'
import { Node } from 'unist'

/** Wrap `nodes` with line feeds between each entry.
    Optionally adds line feeds at the start and end. */
export function wrap(nodes: Node[], loose?: boolean): Node[] {
  var result: Node[] = []
  var index = -1
  var length = nodes.length

  if (loose) {
    result.push(u('text', '\n'))
  }

  while (++index < length) {
    if (index) {
      result.push(u('text', '\n'))
    }

    result.push(nodes[index])
  }

  if (loose && nodes.length !== 0) {
    result.push(u('text', '\n'))
  }

  return result
}
