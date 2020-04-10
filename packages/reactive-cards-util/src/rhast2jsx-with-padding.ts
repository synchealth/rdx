import { RHastNode, util } from 'reactive-cards'
import format from './jsx-format'

/* Compile ReactiveCards HAST (Html-Like Abstract Syntax Tree) to JSX source code */
export function rhast2jsx(tree: RHastNode, padding = true): string {
  const paddedTree = padding ? format()(tree) : tree

  return util.rhast2jsx(paddedTree)
}
