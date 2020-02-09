import { Node, Parent } from 'unist'
import * as HAST from 'hast-format'

import xtend from 'xtend'
import u from 'unist-builder' // CJS ONLY
import position from 'unist-util-position'
import generated from 'unist-util-generated'
import definitions from 'mdast-util-definitions'
import { H } from './Handler'

import defaultHandlers from './default-handlers'
import { one } from './one'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const visit = require('unist-util-visit')

export { all, allText } from './all'
export { one } from './one'
export { revert } from './revert'
export { wrap } from './wrap'
export { H, Handler } from './Handler'

export interface ToHastProps {
  allowDangerousHTML?: boolean
  handlers?: object
  footer?: (h: H) => HAST.Element | null
}

/** Transform `tree`, which is an mdast node, to a hast node.  */
export default function toHAST(tree: Parent, options: ToHastProps) {
  const h = factory(tree, options)

  const node = one(h, tree) as Parent

  if (options.footer) {
    const foot = options.footer(h)

    if (foot) {
      node.children = node.children.concat(u('text', '\n'), foot)
    }
  }

  return node
}

export const rdhastRaw = () => ast => {
  /** noop */
}

/**  Factory to transform. */
function factory(tree: Parent, options: ToHastProps): H {
  const settings = options || {}
  const dangerous = settings.allowDangerousHTML
  const footnoteById = {}

  h.dangerous = dangerous
  h.definition = definitions(tree, settings)
  h.footnoteById = footnoteById
  h.footnoteOrder = []
  h.augment = augment
  h.handlers = xtend(defaultHandlers, settings.handlers || {})

  visit(tree, 'footnoteDefinition', onfootnotedefinition)

  return h

  // Finalise the created `right`, a hast node, from `left`, an mdast node.
  function augment(left: Node, right: HAST.Element): HAST.Element {
    let data

    // Handle `data.hName`, `data.hProperties, `data.hChildren`.
    if (left && 'data' in left) {
      data = left.data

      if (right.type === 'element' && data.hName) {
        right.tagName = data.hName
      }

      if (right.type === 'element' && data.hProperties) {
        right.properties = xtend(right.properties, data.hProperties)
      }

      if (right.children && data.hChildren) {
        right.children = data.hChildren
      }
    }

    const ctx = left && left.position ? left : { position: left }

    if (!generated(ctx)) {
      right.position = {
        start: position.start(ctx),
        end: position.end(ctx)
      }
    }

    return right
  }

  /** Create an element for `node`.  */
  function h(
    node: Node,
    tagName: string,
    props: HAST.Properties,
    children: Array<HAST.Element | HAST.DocType | HAST.Comment | HAST.Text>
  ): HAST.Element {
    if (
      (children === undefined || children === null) &&
      typeof props === 'object' &&
      'length' in props
    ) {
      children = props as any
      props = {}
    }

    return augment(node, {
      type: 'element',
      tagName,
      properties: props || {},
      children: (children || []) as any
    })
  }

  function onfootnotedefinition(definition) {
    const id = definition.identifier.toUpperCase()

    // Mimick CM behavior of link definitions.
    // See: <https://github.com/syntax-tree/mdast-util-definitions/blob/8d48e57/index.js#L26>.
    if (!Object.prototype.hasOwnProperty.call(footnoteById, id)) {
      footnoteById[id] = definition
    }
  }
}
