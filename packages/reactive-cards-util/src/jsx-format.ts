import minify from 'rehype-minify-whitespace'
import repeat from 'repeat-string'
import visit from 'unist-util-visit-parents'

const double = '\n\n'
const single = '\n'
const re = /\n/g

const minifyTree = minify({ newlines: true })

export interface FormatOptions {
  indent?: number
  indentInitial?: boolean
  blanks?: any[]
}

export default function format(
  options: FormatOptions = {
    indentInitial: true
  }
) {
  const settings = options
  let indent = settings.indent || 2
  let { indentInitial } = settings
  const blanks = settings.blanks || []

  if (typeof indent === 'number') {
    indent = repeat(' ', indent)
  }

  if (indentInitial === null || indentInitial === undefined) {
    indentInitial = true
  }

  return transform

  function transform(tree) {
    const root = minifyTree(tree)

    visit(root, visitor)

    return root

    // eslint-disable-next-line complexity
    function visitor(node, parents) {
      const children = node.children || []
      const { length } = children
      let level = parents.length
      let index = -1
      const result = []
      let prev
      let child
      let newline

      if (!length) {
        return
      }

      if (!indentInitial) {
        level--
      }

      while (++index < length) {
        child = children[index]

        if (child.type === 'text') {
          if (child.value.indexOf('\n') !== -1) {
            newline = true
          }

          child.value = child.value.replace(re, `$&${repeat(indent, level)}`)
        }
      }

      index = -1

      node.children = result

      while (++index < length) {
        child = children[index]

        if (padding(child) || (newline && index === 0)) {
          result.push({
            type: 'text',
            value:
              (prev && blank(prev) && blank(child) ? double : single) +
              repeat(indent, level)
          })
        }

        prev = child
        result.push(child)
      }

      if (newline || padding(prev)) {
        result.push({
          type: 'text',
          value: single + repeat(indent, level - 1)
        })
      }
    }
  }

  function blank(node) {
    return (
      node.type === 'element' &&
      blanks.length !== 0 &&
      blanks.indexOf(node.tagName) !== -1
    )
  }
}

function padding(node) {
  if (node.type === 'card') {
    return true
  }

  return true
}
