import mdurlEncode from 'mdurl/encode'
import detab from 'detab'
import collapseWhiteSpace from 'collapse-white-space'
import u from 'unist-builder'
import trimLines from 'trim-lines'

import type * as HAST from 'hast-format'
import type * as MDAST from 'mdast'
import type { Node, Parent } from 'unist'
import { H, wrap, all, revert } from '../index'

export const core = {
  blockquote(h: H, node: MDAST.Blockquote & Parent) {
    return h(node, 'blockquote', wrap(all(h, node), true))
  },

  break(h: H, node: MDAST.Break & Node) {
    return [h(node, 'br'), u('text', '\n')]
  },

  code(h: H, node: MDAST.Code & Node) {
    const value = node.value ? detab(`${node.value}\n`) : ''
    const lang = node.lang && node.lang.match(/^[^ \t]+(?=[ \t]|$)/)
    const props: HAST.Properties = {}

    if (lang) {
      props.className = [`language-${lang}`]
    }

    return h(node.position as any, 'pre', [
      h(node, 'code', props, [u('text', value)])
    ])
  },

  delete(h: H, node: MDAST.Emphasis & Node) {
    return h(node, 'del', all(h, node))
  },

  emphasis(h: H, node: MDAST.Emphasis & Node) {
    return h(node, 'em', all(h, node))
  },

  heading(h: H, node: MDAST.Heading & Node) {
    return h(node, `h${node.depth}`, all(h, node))
  },

  html(h: H, node: MDAST.HTML & Node) {
    return h.dangerous ? h.augment(node, u('raw', node.value)) : null
  },

  imageReference(h: H, node: MDAST.ImageReference & Node) {
    const def = h.definition(node.identifier)

    if (!def) {
      return revert(h, node)
    }

    const props: any = { src: mdurlEncode(def.url || ''), alt: node.alt }

    if (def.title !== null && def.title !== undefined) {
      props.title = def.title
    }

    return h(node, 'img', props)
  },

  image(h: H, node: MDAST.Image & Node) {
    const props: HAST.Properties = { src: mdurlEncode(node.url), alt: node.alt }

    if (node.title !== null && node.title !== undefined) {
      props.title = node.title
    }

    return h(node, 'img', props)
  },

  inlineCode(h: H, node: MDAST.InlineCode & Node) {
    return h(node, 'code', [u('text', collapseWhiteSpace(node.value))])
  },

  link(h: H, node: MDAST.Link & Node) {
    const props: HAST.Properties = { href: mdurlEncode(node.url) }

    if (node.title !== null && node.title !== undefined) {
      props.title = node.title
    }

    return h(node, 'a', props, all(h, node))
  },

  paragraph(h: H, node: MDAST.Paragraph & Node) {
    return h(node, 'p', all(h, node))
  },

  root(h: H, node: MDAST.Root & Node) {
    return h.augment(node, u('root', wrap(all(h, node))))
  },

  strong(h: H, node: MDAST.Strong & Node) {
    return h(node, 'strong', all(h, node))
  },

  text(h: H, node: MDAST.Text & Node) {
    return h.augment(node, u('text', trimLines(node.value)))
  }
}
