import greedyHtml from './mdast-jsx-remark-token'
const visit = require('unist-util-visit') // CJS ONLY

const commentOpen = '<!--'
const commentClose = '-->'

const isDOM = /^<[a-z]/
// const noop = () => false

export default function jsxtoRdxAst(this: { Parser: any }, _options) {
  var Parser = this.Parser
  Parser.prototype.inlineTokenizers.html = greedyHtml
  Parser.prototype.blockTokenizers.html = greedyHtml

  return tree => {
    visit(tree, 'html', node => {
      if (
        node.value.startsWith(commentOpen) &&
        node.value.endsWith(commentClose)
      ) {
        node.type = 'comment'
        node.value = node.value.slice(commentOpen.length, -commentClose.length)
      } else if (isDOM.test(node.value)) {
        node.type = node.mdxType || 'html'
      } else {
        node.type = node.mdxType || 'jsx'
      }
    })

    return tree
  }
}
