import trim from 'trim'
import type { Node, Parent } from 'unist'
import { one } from './one'
import { H } from './Handler'

export function all(h: H, parent: Parent): Node[] {
  const nodes: Node[] = parent.children || []
  const { length } = nodes
  let values: Node[] = []
  let index = -1
  let result
  let head

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
  const nodes: Node[] = parent.children || []
  const { length } = nodes

  let values: string[] = []
  let index = -1
  let result

  if (parent.value && typeof parent.value === 'string') {
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
