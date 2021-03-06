const WHITESPACE = /(\s|\t|\n|\r)/g
const NUMBERS = /[0-9]/
const NUMBERS_CODE = /^[-+]?[0-9.]+$/
const NAME = /[0-9a-zA-Z_.]/

export type TokenList = { type: string; value?: string | number | boolean }[]

export const tokenizer: (input: string) => TokenList = (input: string) => {
  const tokens: TokenList = []
  let current = 0
  let inTag = false
  let char

  const getToken = regex => {
    let value = ''
    while (regex.test(char) && current < input.length) {
      value += char
      char = input[++current]
    }
    return value
  }

  const getCode = () => {
    let code = ''
    let braceCount = 1
    while (braceCount > 0 && current < input.length) {
      char = input[++current]
      if (char === '{') {
        braceCount++
      }
      if (char === '}') {
        braceCount--
      }
      code += char
    }
    return code.slice(0, -1).trim()
  }

  while (current < input.length) {
    char = input[current]

    if (inTag) {
      if (char === '>') {
        inTag = false
        tokens.push({ type: 'closeTag' })
      } else if (char === '/' && input[current + 1] === '>') {
        inTag = false
        tokens.push({ type: 'endTag' })
        current++
      } else if (char === '=') {
        tokens.push({ type: 'equals' })
      } else if (char === '{') {
        const value = getCode()

        if (NUMBERS_CODE.test(value)) {
          tokens.push({
            type: 'number',
            value: Number(value)
          })
        } else {
          tokens.push({
            type: 'code',
            value
          })
        }
      } else if (WHITESPACE.test(char)) {
        /** noop */
      } else if (NUMBERS.test(char)) {
        tokens.push({
          type: 'number',
          value: Number(getToken(NUMBERS))
        })
        current--
      } else if (NAME.test(char)) {
        const word = getToken(NAME)
        if (word === 'true' || word === 'false') {
          tokens.push({
            type: 'boolean',
            value: word === 'true'
          })
        } else {
          tokens.push({
            type: 'word',
            value: word
          })
        }
        current--
      } else if (char === "'") {
        char = input[++current]
        tokens.push({
          type: 'text',
          value: getToken(/[^']/)
        })
      } else if (char === '"') {
        char = input[++current]
        tokens.push({
          type: 'text',
          value: getToken(/[^"]/)
        })
      }
    }
    // Not tokenizing a tag definition
    else if (char === '<' && input[current + 1] === '/') {
      char = input[++current]
      char = input[++current]
      tokens.push({
        type: 'endTag',
        value: getToken(NAME)
      })
    } else if (char === '<') {
      inTag = true
      char = input[++current]
      tokens.push({
        type: 'openTag',
        value: getToken(NAME)
      })
      current--
    } else {
      // Handle slush text
      let value = ''
      while (char !== '<' && current < input.length) {
        value += char
        char = input[++current]
      }
      value = value.trim()
      if (value) {
        tokens.push({
          type: 'text',
          value
        })
      }
      current--
    }
    current++
  }
  return tokens
}
