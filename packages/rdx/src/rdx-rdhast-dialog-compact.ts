import visit from 'unist-util-visit'
import filter from 'unist-util-filter'
import findAllAfter from 'unist-util-find-all-after'
import type * as HAST from 'hast-format'
import u from 'unist-builder'
import { paramCase } from 'change-case'
import remove from 'unist-util-remove'

const CARD_SHORTCUTS = {
  TextCard: 'RDXCard',
  MemeCard: 'RDXMemeCard',
  QuoteCard: 'RDXQuoteCard'
}

// Make an rdhast tree compact by merging adjacent dialog nodes.
export default function compact() {
  return (tree, _file) => {
    tree = filter(tree, squeeze)
    visit(tree, 'element', visitorFirstPass)
    visit(tree, 'element', visitorSecondPass)
    visit(tree, 'root', removeSections)

    return tree
  }
}
function squeeze(node: HAST.Parent, index, parent: HAST.Parent) {
  return !(
    node.type === 'text' &&
    node.value === '\n' &&
    (parent.type === 'root' ||
      parent.tagName === 'dialog' ||
      parent.tagName === 'actions')
  )
}

function visitorFirstPass(
  child: HAST.Parent & HAST.Element,
  index,
  parent: HAST.Parent
) {
  switch (child.tagName) {
    case 'dialog':
    case 'h4':
      demoteDialogOrHeaderSection(child, index, parent)
      break
    default:
    /* noop */
  }
}

function visitorSecondPass(
  child: HAST.Element & HAST.Parent,
  index,
  parent: HAST.Parent
) {
  if (child.properties != null) {
    const paramCaseRe = /^(aria[A-Z])|(data[A-Z])/
    child.properties = Object.entries(child.properties!).reduce(
      (properties, [key, value]) => ({
        ...properties,
        [paramCaseRe.test(key) ? paramCase(key) : key]: value
      }),
      {}
    )
  }

  switch (child.tagName) {
    case 'text':
      if (parent && parent.tagName === 'dialog') {
        visitTextInDialog(child, index, parent)
      }
      break
    case 'image':
      if (parent && parent.tagName === 'dialog') {
        visitImageInDialog(child, index, parent)
      }
      break
    case 'h4':
      visitH4(child, index, parent)
      break
    case 'em':
    case 'del':
    case 'strong':
      visitText(child, index, parent)
      break
    default:
    /** noop */
  }
}

/** demote siblings following a dialog or h4 to be children of the dialog or h4  */
function demoteDialogOrHeaderSection(
  child: HAST.Element & HAST.Parent,
  index,
  parent: HAST.Parent
) {
  const siblings = parent ? parent.children : []

  let foundNextSection = false

  const localsiblings = findAllAfter(parent, index, (node) => {
    if (
      node.tagName === 'dialog' ||
      node.type === 'section' ||
      node.tagName === child.tagName
    ) {
      foundNextSection = true
      return false
    }
    return !foundNextSection
  })

  siblings.splice(index + 1, localsiblings.length)

  child.children = child.children.concat(child.children || [], localsiblings)
}

/** demote text and actions immediately following in a dialog to children of a single card element  */
function visitTextInDialog(
  child: HAST.Element & HAST.Parent,
  index,
  parent: HAST.Parent
) {
  const siblings = parent.children

  if (
    index < siblings.length - 1 &&
    siblings[index + 1].tagName === 'actionset'
  ) {
    const actions = (siblings[index + 1] as HAST.Element).children || []

    const card = u('element', {
      tagName: 'Reactive.RDXCard',
      children: [child, ...actions]
    })
    siblings[index] = card
    siblings.splice(index + 1, 1)
  }
}

/** demote image in a dialog a single card element  */
function visitImageInDialog(child: HAST.Element, index, parent: HAST.Parent) {
  const properties = child.properties || {}

  properties.src = properties.url
  delete properties.url

  const card = u('element', { tagName: 'Reactive.RDXImageCard', properties })

  parent.children[index] = card
}

/** Convert H4 to RDX Card  */
function visitH4(
  child: HAST.Element & HAST.Parent,
  index,
  parent: HAST.Parent
) {
  let tagName = child.properties.type
  delete child.properties.id
  delete child.properties.type

  if (tagName && tagName in CARD_SHORTCUTS) {
    tagName = CARD_SHORTCUTS[tagName]
  }

  if (tagName && tagName.startsWith('RDX')) {
    tagName = `Reactive.${tagName}`
  }
  child.tagName = tagName
}

/* convert text annotations to text nodes */
function visitText(
  child: HAST.Element & HAST.Parent,
  index,
  parent: HAST.Parent
) {
  const { tagName, children } = child
  let text: string
  if (tagName === 'em') {
    text = `*${children}*`
  }
  if (tagName === 'del') {
    text = `~~${children}~~`
  }
  if (tagName === 'strong') {
    text = `**${children}**`
  }

  parent[index] = u('element', { tagName: 'text', properties: {} }, text)
}

function removeSections(tree) {
  let section = 0

  remove(tree, { cascade: true }, test)

  function test(node) {
    if (node.type === 'section') {
      section++
    }

    return section > 1
  }
}
