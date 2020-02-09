// eslint-disable-next-line @typescript-eslint/no-var-requires
const visit = require('unist-util-visit') // CJS ONLY

const commentOpen = '<!--'
const commentClose = '-->'

export default _options => tree => {
  visit(tree, 'jsx', node => {
    if (
      node.value.startsWith(commentOpen) &&
      node.value.endsWith(commentClose)
    ) {
      node.type = 'comment'
      node.value = node.value.slice(commentOpen.length, -commentClose.length)
    }
  })

  return tree
}
