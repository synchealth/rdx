const { Fragment } = require('reactive-cards')
const EMPTY_OBJECT = Object.freeze({})
import { RCastNode, RHastNode, RCastElement } from 'reactive-cards'

/* Transform Reactive Cards Abstract Syntax Tree to ReactiveCards HAST (Html-Like Abstract Syntax Tree) */
export function rcast2rhast(
  element: RCastNode
): RHastNode | RHastNode[] | null {
  const props = (element as RCastElement).props || EMPTY_OBJECT

  if (typeof element === 'string') {
    return {
      type: 'text',
      value: element
    }
  }
  if (typeof element === 'number' || typeof element === 'boolean') {
    return {
      type: 'text',
      value: element
    }
  } else if (element == null) {
    return null
  } else if (element.type === Function) {
    // in this case eval the functions with the known props

    return rcast2rhast(element.type(props))
  } else {
    const { children, ...rest } = props as any
    let new_children: ReactiveCards.RHastChild[]

    if (children && Array.isArray(children)) {
      new_children = children
        ? (children.map(child => rcast2rhast(child)).filter(Boolean) as any)
        : []
    } else if (children) {
      new_children = [children]
    } else {
      new_children = []
    }

    const result = {
      type: 'element',
      tagName: element.type,
      properties: rest,
      children: new_children
    } as ReactiveCards.RHastElement

    if (result.tagName == Fragment) {
      result.tagName = 'ReactiveCards.Fragment'
    }

    return result
  }
}
