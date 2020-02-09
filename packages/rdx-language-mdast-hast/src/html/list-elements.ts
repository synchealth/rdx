import u from 'unist-builder'
import * as HAST from 'hast-format'
import * as MDAST from 'mdast'
import { Parent, Node } from 'unist'
import { H, wrap, all } from '../index'

export function listItem(
  h: H,
  node: MDAST.ListItem & Node,
  parent: MDAST.List & Parent
) {
  const { children } = node
  const head = children[0]
  const raw = all(h, node)
  const loose = parent ? _listLoose(parent) : _listItemLoose(node)
  const props: HAST.Properties = {}
  let result
  let container
  let index
  let length
  let child

  // Tight lists should not render `paragraph` nodes as `p` elements.
  if (loose) {
    result = raw
  } else {
    result = []
    length = raw.length
    index = -1

    while (++index < length) {
      child = raw[index]

      if (child.tagName === 'p') {
        result = result.concat(child.children)
      } else {
        result.push(child)
      }
    }
  }

  if (typeof node.checked === 'boolean') {
    if (loose && (!head || head.type !== 'paragraph')) {
      result.unshift(h(null, 'p', []))
    }

    container = loose ? result[0].children : result

    if (container.length !== 0) {
      container.unshift(u('text', ' '))
    }

    container.unshift(
      h(null, 'input', {
        type: 'checkbox',
        checked: node.checked,
        disabled: true
      })
    )

    props.className = ['task-list-item']
  }

  if (loose && result.length !== 0) {
    result = wrap(result, true)
  }

  return h(node, 'li', props, result)
}

export function list(h: H, node: MDAST.List & Parent): HAST.Element {
  const props: any = {}
  const name = node.ordered ? 'ol' : 'ul'
  let index = -1

  if (typeof node.start === 'number' && node.start !== 1) {
    props.start = node.start
  }

  const items = all(h, node)
  const { length } = items

  // Like GitHub, add a class for custom styling.
  while (++index < length) {
    if (
      (items[index].properties as any).className &&
      (items[index].properties as any).className.indexOf('task-list-item') !==
        -1
    ) {
      props.className = ['contains-task-list']
      break
    }
  }

  return h(node, name, props, wrap(items, true))
}

function _listLoose(node: MDAST.List & Parent) {
  let loose = node.spread
  const { children } = node
  const { length } = children
  let index = -1

  while (!loose && ++index < length) {
    loose = _listItemLoose(children[index])
  }

  return loose
}

function _listItemLoose(node: MDAST.ListItem & Node) {
  const { spread } = node

  return spread === undefined || spread === null
    ? node.children.length > 1
    : spread
}
