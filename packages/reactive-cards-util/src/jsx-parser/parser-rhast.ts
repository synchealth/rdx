import * as Reactive from 'reactive-cards'

export function parserRHast(
  tokens,
  opts: {} = {}
): Reactive.RHastNode | Reactive.RHastNode[] {
  let current = 0
  let token = tokens[current]

  const parseProps = () => {
    let props: object = {}
    let key: string | null = null
    let last: string | null = null

    while (
      current < tokens.length &&
      token.type != 'endTag' &&
      token.type != 'closeTag'
    ) {
      if (last && token.type == 'word') {
        props[last] = true
        last = token.value
      } else if (!key && token.type == 'word') {
        last = token.value
      } else if (last && token.type == 'equals') {
        key = last
        last = null
      } else if (key && token.type == 'code') {
        props[key] = {
          type: 'code',
          value: token.value
        }

        key = null
        last = null
      } else if (
        key &&
        (token.type == 'number' ||
          token.type == 'text' ||
          token.type == 'boolean')
      ) {
        props[key] = token.value
        key = null
        last = null
      } else {
        throw `Invalid property value: ${key}=${token.value}`
      }
      token = tokens[++current]
    }
    if (last) props[last] = true
    return props
  }

  const genNode = tagType => {
    token = tokens[++current]

    return {
      type: 'element',
      tagName: tagType,
      properties: parseProps(),
      children: getChildren(tagType)
    } as Reactive.RHastElement
  }

  const getChildren = (tagType?: string) => {
    let children: Reactive.RHastChild[] = []
    while (current < tokens.length) {
      if (token.type == 'endTag') {
        if (token.value && token.value != tagType) {
          throw `Invalid closing tag: ${token.value}. Expected closing tag of type: ${tagType}`
        } else {
          break
        }
      }
      if (token.type == 'openTag') {
        children.push(genNode(token.value))
      } else if (token.type == 'text') {
        children.push(token.value)
      }
      token = tokens[++current]
    }
    return children
  }

  const result = getChildren()
  if (result.length == 1) return result[0]
  return result
}

// import { tokenizer } from './tokenizer'
// const tokens = parserRHast(tokenizer("<body><test width={5+5 } /></body>"))
// console.log(JSON.stringify(tokens, null, 2))
