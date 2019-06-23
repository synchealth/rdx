import { H, wrap, all } from '../'
import u from 'unist-builder'
import * as HAST from 'hast-format'
import * as MDAST from 'mdast'
import { Parent, Node } from 'unist'

export function listItem(
  h: H,
  node: MDAST.ListItem & Node,
  parent: MDAST.List & Parent
) {
  var children = node.children
  var head = children[0]
  var raw = all(h, node)
  var loose = parent ? _listLoose(parent) : _listItemLoose(node)
  var props: HAST.Properties = {}
  var result
  var container
  var index
  var length
  var child

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
  var props: any = {}
  var name = node.ordered ? 'ol' : 'ul'
  var items
  var index = -1
  var length

  if (typeof node.start === 'number' && node.start !== 1) {
    props.start = node.start
  }

  items = all(h, node)
  length = items.length

  // Like GitHub, add a class for custom styling.
  while (++index < length) {
    if (
      items[index].properties.className &&
      items[index].properties.className.indexOf('task-list-item') !== -1
    ) {
      props.className = ['contains-task-list']
      break
    }
  }

  return h(node, name, props, wrap(items, true))
}

function _listLoose(node: MDAST.List & Parent) {
  var loose = node.spread
  var children = node.children
  var length = children.length
  var index = -1

  while (!loose && ++index < length) {
    loose = _listItemLoose(children[index])
  }

  return loose
}

function _listItemLoose(node: MDAST.ListItem & Node) {
  var spread = node.spread

  return spread === undefined || spread === null
    ? node.children.length > 1
    : spread
}
