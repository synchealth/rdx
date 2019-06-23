import format from 'rehype-format'
import escapeString from './util/escape-string'
import { RHastNode, RHastCode, RHastText, RHastElement } from 'reactive-cards'

const EMPTY_OBJECT = Object.freeze({})

/* Compile ReactiveCards HAST (Html-Like Abstract Syntax Tree) to JSX source code */
export function rhast2jsx(tree: RHastNode): string {
  const paddedTree = format()(tree)

  if (paddedTree.tagName == 'card') {
    if (
      paddedTree.properties.$schema ==
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
  } else if (typeof element === 'number') {
    return `${element}`
  } else if (typeof element === 'boolean' || element == null) {
    return `{${element}}`
  }

  if ((element as RHastText).type == 'text') {
    const value = (element as RHastText).value

    if (typeof value === 'string') {
      return value
    } else if (typeof value === 'number') {
      return `${value}`
    } else if (typeof value === 'boolean' || value == null) {
      return `{${value}}`
    }

    return value
  } else if ((element as RHastCode).type == 'code') {
    return `{${(element as RHastCode).value}}`
  } else {
    element = element as RHastElement

    const tagName = element.tagName

    const properties = element.properties || EMPTY_OBJECT

    let jsx = `<${tagName}`

    for (const prop in properties) {
      const value = properties[prop]

      if (prop === 'children' || prop === 'key' || prop === 'ref') {
        // skip
      } else {
        if (typeof value === 'string') {
          jsx += ` ${prop}="${escapeString(value)}"`
        } else if (typeof value === 'number') {
          jsx += ` ${prop}={${String(value)}}`
        } else if (typeof value === 'boolean' && value) {
          jsx += ` ${prop}`
        } else if (typeof value === 'object' && value && value.type == 'code') {
          jsx += ` ${prop}={${value}}`
        }
      }
    }

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
}
