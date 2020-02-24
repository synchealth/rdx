import { RHastNode, RHastCode, RHastText, RHastElement } from 'reactive-cards'
import format from './jsx-format'
import escapeString from './util/escape-string'

const EMPTY_OBJECT = Object.freeze({})

/* Compile ReactiveCards HAST (Html-Like Abstract Syntax Tree) to JSX source code */
export function rhast2jsx(tree: RHastNode, padding = true): string {
  const paddedTree = padding ? format()(tree) : tree

  if (paddedTree.tagName === 'card') {
    if (
      paddedTree.properties.$schema ===
      'http://adaptivecards.io/schemas/adaptive-card.json'
    ) {
      delete paddedTree.properties.$schema
    }
  }

  return renderToJSX(paddedTree)
}

function renderToJSX(element: RHastNode): string {
  if (typeof element === 'string') {
    return element
  }
  if (typeof element === 'number') {
    return `${element}`
  }
  if (typeof element === 'boolean' || element == null) {
    return `{${element}}`
  }

  if ((element as RHastText).type === 'text') {
    const { value } = element as RHastText

    if (typeof value === 'string') {
      return value
    }
    if (typeof value === 'number') {
      return `${value}`
    }
    if (typeof value === 'boolean' || value == null) {
      return `{${value}}`
    }

    return value
  }
  if ((element as RHastCode).type === 'code') {
    return `{${(element as RHastCode).value}}`
  }
  element = element as RHastElement

  const { tagName } = element

  const properties = element.properties || EMPTY_OBJECT

  let jsx = `<${tagName}`

  Object.keys(properties).forEach(prop => {
    const value = properties[prop]

    if (prop === 'children' || prop === 'key' || prop === 'ref') {
      // skip
    } else if (typeof value === 'string') {
      jsx += ` ${prop}="${escapeString(value)}"`
    } else if (typeof value === 'number') {
      jsx += ` ${prop}={${String(value)}}`
    } else if (typeof value === 'boolean' && value) {
      jsx += ` ${prop}`
    } else if (typeof value === 'object' && value && value.type === 'code') {
      jsx += ` ${prop}={${value}}`
    }
  })

  if (!element.children) {
    throw new Error('Children in HAST must be an array')
  }

  if (element.children.length > 0) {
    jsx += '>'
    jsx += element.children.map(child => renderToJSX(child)).join('')
    jsx += `</${tagName}>`
  } else {
    jsx += ` />`
  }

  return jsx
}
