import { RCastNode } from 'reactive-cards'
import { parserRCast } from './jsx-parser/parser-rcast'
import { tokenizer } from './jsx-parser/tokenizer'

/* Parse JSX raw source to Reactive Cards Abstract Syntax Tree */
export function jsx2rcast(input, opts = {}): RCastNode {
  const result = parserRCast(tokenizer(input), opts) as RCastNode

  return result
}
