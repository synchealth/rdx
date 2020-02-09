import mdurlEncode from 'mdurl/encode'
import u from 'unist-builder'
import * as MDAST from 'mdast'
import { Node } from 'unist'
import { all, revert, H } from '../index'

export const reference = {
  footnoteReference,
  footnote,
  imageReference,
  linkReference
}

function footnoteReference(h: H, node: MDAST.FootnoteReference & Node) {
  const { footnoteOrder } = h
  const { identifier } = node

  if (footnoteOrder.indexOf(identifier) === -1) {
    footnoteOrder.push(identifier)
  }

  return h(node.position as any, 'sup', { id: `fnref-${identifier}` }, [
    h(node, 'a', { href: `#fn-${identifier}`, className: ['footnote-ref'] }, [
      u('text', node.label || identifier)
    ])
  ])
}

function footnote(h: H, node: MDAST.Footnote & Node) {
  const { footnoteById } = h
  const { footnoteOrder } = h
  let identifier: number | string = 1

  while (identifier in footnoteById) {
    identifier++
  }

  identifier = String(identifier)

  // No need to check if `identifier` exists in `footnoteOrder`, it’s guaranteed
  // to not exist because we just generated it.
  footnoteOrder.push(identifier)

  footnoteById[identifier] = {
    type: 'footnoteDefinition',
    identifier,
    children: [{ type: 'paragraph', children: node.children }],
    position: node.position
  }

  return footnoteReference(h, {
    type: 'footnoteReference',
    identifier,
    position: node.position
  })
}

function imageReference(h: H, node: MDAST.ImageReference & Node) {
  const def = h.definition(node.identifier)

  if (!def) {
    return revert(h, node)
  }

  const props: any = { src: mdurlEncode(def.url || ''), alt: node.alt }

  if (def.title !== null && def.title !== undefined) {
    props.title = def.title
  }

  return h(node, 'img', props)
}

function linkReference(h, node) {
  const def = h.definition(node.identifier)
  if (!def) {
    return revert(h, node)
  }

  const props: any = { href: mdurlEncode(def.url || '') }

  if (def.title !== null && def.title !== undefined) {
    props.title = def.title
  }

  return h(node, 'a', props, all(h, node))
}
