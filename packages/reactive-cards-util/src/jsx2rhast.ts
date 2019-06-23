import { parserRHast } from './jsx-parser/parser-rhast'
import { tokenizer } from './jsx-parser/tokenizer'
import { RHastNode } from 'reactive-cards'

/* Parse JSX raw source to ReactiveCards HAST (Html-Like Abstract Syntax Tree) */
export function jsx2rhast(input, opts = {}): RHastNode {
  const result = parserRHast(tokenizer(input), opts) as RHastNode

  return result
}
