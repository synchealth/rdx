import {
  RCastNode,
  RHastNode,
  RCastElement,
  RHastChild,
  RHastElement
} from './types'

import { Fragment } from '../fragment'

const EMPTY_OBJECT = Object.freeze({})

/* Transform Reactive Cards Abstract Syntax Tree to ReactiveCards HAST (Html-Like Abstract Syntax Tree) */
export function rcast2rhast(
  element: RCastNode
): RHastNode | RHastNode[] | RHastChild | null {
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
  }
  if (element == null) {
    return null
  }
  if (element.type === Function) {
    // in this case eval the functions with the known props

    return rcast2rhast(element.type(props))
  }
  const { children, ...rest } = props as any
  let newChildren: RHastChild[]

  if (children && Array.isArray(children)) {
    newChildren = children
      ? (children.map((child) => rcast2rhast(child)).filter(Boolean) as any)
      : []
  } else if (children) {
    newChildren = [children]
  } else {
    newChildren = []
  }

  const result = {
    type: 'element',
    tagName: element.type,
    properties: rest,
    children: newChildren
  } as RHastElement

  if ((result.tagName as any) === Fragment) {
    result.tagName = 'ReactiveCards.Fragment'
  }

  return result
}
