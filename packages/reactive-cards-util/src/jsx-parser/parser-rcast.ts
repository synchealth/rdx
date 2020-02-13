import * as ReactiveCards from 'reactive-cards'

export function parserRCast(
  tokens,
  opts: { useEval?: boolean } = { useEval: false }
): ReactiveCards.RCastNode | ReactiveCards.RCastNode[] {
  let current = 0
  let token = tokens[current]

  const parseProps = () => {
    const props: object = {}
    let key: string | null = null
    let last: string | null = null

    while (
      current < tokens.length &&
      token.type !== 'endTag' &&
      token.type !== 'closeTag'
    ) {
      if (last && token.type === 'word') {
        props[last] = true
        last = token.value
      } else if (!key && token.type === 'word') {
        last = token.value
      } else if (last && token.type === 'equals') {
        key = last
        last = null
      } else if (key && token.type === 'code') {
        //
        if (opts.useEval) {
          throw new Error('useEval Not implemented')
        }
        props[key] = `{${token.value}}`
        key = null
        last = null
      } else if (
        key &&
        (token.type === 'number' ||
          token.type === 'text' ||
          token.type === 'boolean')
      ) {
        props[key] = token.value
        key = null
        last = null
      } else {
        throw new Error(`Invalid property value: ${key}=${token.value}`)
      }
      token = tokens[++current]
    }
    if (last) {
      props[last] = true
    }
    return props
  }

  const genNode: (tagType) => ReactiveCards.RCastElement = tagType => {
    token = tokens[++current]

    return {
      type: tagType,
      props: Object.assign(parseProps(), { children: getChildren(tagType) })
    }
  }

  const getChildren: (tagType?: string) => ReactiveCards.RCastChild[] = (
    tagType?: string
  ) => {
    const children: any[] = []
    while (current < tokens.length) {
      if (token.type === 'endTag') {
        if (token.value && token.value !== tagType) {
          throw new Error(
            `Invalid closing tag: ${token.value}. Expected closing tag of type: ${tagType}`
          )
        } else {
          break
        }
      }
      if (token.type === 'openTag') {
        children.push(genNode(token.value))
      } else if (token.type === 'text') {
        children.push(token.value)
      }
      token = tokens[++current]
    }
    return children
  }

  const result = getChildren()
  if (result.length === 1) {
    return result[0]
  }
  return result
}

// import { tokenizer } from './tokenizer'
// const tokens = parserRCast(tokenizer("<body><test width={5+5 } /></body>"))
// console.log(JSON.stringify(tokens, null, 2))
