import { parserRCast } from './jsx-parser/parser-rcast'
import { tokenizer } from './jsx-parser/tokenizer'
import { RCastNode } from 'reactive-cards'

/* Parse JSX raw source to Reactive Cards Abstract Syntax Tree */
export function jsx2rcast(input, opts = {}): RCastNode {
  const result = parserRCast(tokenizer(input), opts) as RCastNode

  return result
}
