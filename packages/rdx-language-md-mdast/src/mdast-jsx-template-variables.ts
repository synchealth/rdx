import { parseUntil } from 'character-parser'

export default function remarkTemplateBlocks(this: { Parser: any }) {
  const { Parser } = this
  const tokenizers = Parser.prototype.inlineTokenizers
  const methods = Parser.prototype.inlineMethods

  /* Add an inline tokenizer  */
  tokenizers.variable = tokenizeVariable

  /* Run it just before `text`. */
  methods.splice(methods.indexOf('text'), 0, 'variable')
}

tokenizeVariable.notInBlock = false
tokenizeVariable.notInList = false
tokenizeVariable.notInLink = false
tokenizeVariable.locator = locateVariable

const dollarCurly = '${'
const closeCurly = '}'

function tokenizeVariable(eat, value, silent) {
  if (value.substr(0, 2) !== dollarCurly) {
    return null
  }

  let range

  try {
    range = parseUntil(value, closeCurly, {
      start: 2,
      ignoreLineComment: false,
      ignoreNesting: false
    })
  } catch (ex) {
    console.log(
      // eslint-disable-next-line no-template-curly-in-string
      "RDX syntax error - found template variable opening brace '${' start without closing brace '}' "
    )
    return eat(value)({ type: 'text', value })
  }

  if (silent) {
    return true
  }

  return eat(value.substr(0, range.end + 1))({
    type: 'block',
    value: range.src
  })
}

function locateVariable(value, fromIndex) {
  return value.indexOf(dollarCurly, fromIndex)
}
