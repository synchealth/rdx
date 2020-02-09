import u from 'unist-builder'
import { Node, Parent } from 'unist'
import { all } from './all'
import { H } from './Handler'

/** Return the content of a reference without definition as Markdown.  */

export function revert(h: H, node: Node | Parent): Node[] {
  const subtype = node.referenceType
  let suffix = ']'

  if (subtype === 'collapsed') {
    suffix += '[]'
  } else if (subtype === 'full') {
    suffix += `[${node.label || node.identifier}]`
  }

  if (node.type === 'imageReference') {
    return u('text', `![${node.alt}${suffix}`)
  }

  const contents = all(h, node as Parent)
  const head = contents[0]

  if (head && head.type === 'text') {
    head.value = `[${head.value}`
  } else {
    contents.unshift(u('text', '['))
  }

  const tail = contents[contents.length - 1]

  if (tail && tail.type === 'text') {
    tail.value += suffix
  } else {
    contents.push(u('text', suffix))
  }

  return contents
}
