import trim from 'trim'
import { one } from './one'
import { Node, Parent } from 'unist'
import { H } from './Handler'

export function all(h: H, parent: Parent): Node[] {
  var nodes: Node[] = parent.children || []
  var length = nodes.length
  var values: Node[] = []
  var index = -1
  var result
  var head

  while (++index < length) {
    result = one(h, nodes[index], parent)

    if (result) {
      if (index && nodes[index - 1].type === 'break') {
        if (result.value) {
          result.value = trim.left(result.value)
        }

        head = result.children && result.children[0]

        if (head && head.value) {
          head.value = trim.left(head.value)
        }
      }

      values = values.concat(result)
    }
  }

  return values
}

export function allText(h: H, parent: Parent): string[] {
  var nodes: Node[] = parent.children || []
  var length = nodes.length

  var values: string[] = []
  var index = -1
  var result

  if (parent.value && typeof parent.value == 'string') {
    values.push(parent.value)
  }

  while (++index < length) {
    result = allText(h, nodes[index] as any)

    if (result) {
      values = values.concat(result)
    }
  }

  return values
}
