import { all, revert, H } from '../index'
import mdurlEncode from 'mdurl/encode'
import u from 'unist-builder'
import * as MDAST from 'mdast'
import { Node } from 'unist'

export const reference = {
  footnoteReference,
  footnote,
  imageReference,
  linkReference
}

function footnoteReference(h: H, node: MDAST.FootnoteReference & Node) {
  var footnoteOrder = h.footnoteOrder
  var identifier = node.identifier

  if (footnoteOrder.indexOf(identifier) === -1) {
    footnoteOrder.push(identifier)
  }

  return h(node.position as any, 'sup', { id: 'fnref-' + identifier }, [
    h(node, 'a', { href: '#fn-' + identifier, className: ['footnote-ref'] }, [
      u('text', node.label || identifier)
    ])
  ])
}

function footnote(h: H, node: MDAST.Footnote & Node) {
  var footnoteById = h.footnoteById
  var footnoteOrder = h.footnoteOrder
  var identifier: number | string = 1

  while (identifier in footnoteById) {
    identifier++
  }

  identifier = String(identifier)

  // No need to check if `identifier` exists in `footnoteOrder`, it’s guaranteed
  // to not exist because we just generated it.
  footnoteOrder.push(identifier)

  footnoteById[identifier] = {
    type: 'footnoteDefinition',
    identifier: identifier,
    children: [{ type: 'paragraph', children: node.children }],
    position: node.position
  }

  return footnoteReference(h, {
    type: 'footnoteReference',
    identifier: identifier,
    position: node.position
  })
}

function imageReference(h: H, node: MDAST.ImageReference & Node) {
  var def = h.definition(node.identifier)
  var props

  if (!def) {
    return revert(h, node)
  }

  props = { src: mdurlEncode(def.url || ''), alt: node.alt }

  if (def.title !== null && def.title !== undefined) {
    props.title = def.title
  }

  return h(node, 'img', props)
}

function linkReference(h, node) {
  var def = h.definition(node.identifier)
  var props

  if (!def) {
    return revert(h, node)
  }

  props = { href: mdurlEncode(def.url || '') }

  if (def.title !== null && def.title !== undefined) {
    props.title = def.title
  }

  return h(node, 'a', props, all(h, node))
}
