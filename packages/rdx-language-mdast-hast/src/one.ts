import u from 'unist-builder'
import { all } from './all'
import { Node, Parent } from 'unist'
import { H } from './Handler'

const own = {}.hasOwnProperty

/** Visit a node.  */
export function one(h: H, node: Node, parent?: Parent): Node {
  var type = node && node.type
  var fn = own.call(h.handlers, type) ? h.handlers[type] : null

  // Fail on non-nodes.
  if (!type) {
    throw new Error('Expected node, got `' + node + '`')
  }

  return (typeof fn === 'function' ? fn : unknown)(h, node, parent)
}

/** Transform an unknown node. */
function unknown(h: H, node: Parent, _: Parent) {
  if (text(node)) {
    return h.augment(node, u('text', node.value))
  }

  return h(node, 'div', all(h, node))
}

/**  Check if the node should be renderered as a text node. */
function text(node) {
  var data = node.data || {}

  if (
    own.call(data, 'hName') ||
    own.call(data, 'hProperties') ||
    own.call(data, 'hChildren')
  ) {
    return false
  }

  return 'value' in node
}
