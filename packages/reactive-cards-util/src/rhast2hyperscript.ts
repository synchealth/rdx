import { RHastNode, RHastCode, RHastText, RHastElement } from 'reactive-cards'
import escapeString from './util/escape-string'

const EMPTY_OBJECT = Object.freeze({})

/* Compile ReactiveCards HAST (Html-Like Abstract Syntax Tree) to transpiled h() hyperscript source code */
export function rhast2hyperscript(tree: RHastNode): string {
  return renderTohyperscript(tree)
}

function renderTohyperscript(element: RHastNode): string {
  if (typeof element === 'string' && element.startsWith('\n')) {
    return element
  }
  if (typeof element === 'string') {
    return `"${escapeString(element)}"`
  }
  if (typeof element === 'number') {
    return `${element}`
  }
  if (typeof element === 'boolean' || element == null) {
    return `${element}`
  }

  if ((element as RHastText).type === 'text') {
    const { value } = element as RHastText
    if (typeof value === 'string' && value.startsWith('\n')) {
      return value
    }
    if (typeof value === 'string') {
      return `"${escapeString(value)}"`
    }
    if (typeof value === 'number') {
      return `${value}`
    }
    if (typeof value === 'boolean' || value == null) {
      return `${value}`
    }

    return value
  }
  if ((element as RHastCode).type === 'code') {
    return `${(element as RHastCode).value}`
  }
  element = element as RHastElement

  const { tagName } = element

  const properties = element.properties || EMPTY_OBJECT

  let hyperscript = `h("${tagName}"`

  if (Object.keys(properties).length > 0) {
    hyperscript += ', {\n'
    hyperscript += Object.keys(properties)
      .map(prop => {
        const value = properties[prop]

        if (prop === 'children' || prop === 'key' || prop === 'ref') {
          return undefined
        }
        if (typeof value === 'string') {
          return `${prop}: "${escapeString(value)}"`
        }
        if (typeof value === 'number') {
          return `${prop}: ${String(value)}`
        }
        if (typeof value === 'boolean' && value) {
          return `${prop}: ${String(value)}`
        }
        return undefined
      })
      .filter(Boolean)
      .join(',\n')
    hyperscript += `\n}`
  } else {
    hyperscript += `,{}\n`
  }

  if (element.children.length > 0) {
    hyperscript += ', '
    hyperscript += element.children
      .map(child => renderTohyperscript(child))
      .join(',\n')
    hyperscript += `)`
  } else {
    hyperscript += `)`
  }

  return hyperscript
}
