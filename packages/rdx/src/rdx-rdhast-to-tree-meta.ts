/* eslint-disable no-control-regex */
import { paramCase } from 'change-case'
import remove from 'unist-util-remove'
import escapeString from './util/escape-string'

export function toQuestionsMeta(
  node,
  parentNode: any = {},
  result: any = {},
  options: {} = {}
) {
  if (node.properties != null) {
    const paramCaseRe = /^(aria[A-Z])|(data[A-Z])/
    node.properties = Object.entries(node.properties!).reduce(
      (properties, [key, value]) => ({
        ...properties,
        [paramCaseRe.test(key) ? paramCase(key) : key]: value
      }),
      {}
    )
  }

  // Recursively walk through children
  if (node.children) {
    node.children.forEach((childNode) => {
      toQuestionsMeta(childNode, node, result, options)
    })
  }

  if (node.type === 'root') {
    return result
  }

  if (node.type === 'element' && node.tagName === 'dialog') {
    const [id, text] = processDialog(node)
    if (id && text) {
      if (id in result) {
        throw new Error(
          `Duplicate question id ${id} with text ${result[id]} and ${text}`
        )
      }
      result[id] = text
    }
    return result
  }

  return null
}

function processDialog(node) {
  let text = null
  let isAction = false
  let firstCard = false
  const { id } = node.properties
  if (node.children) {
    node.children.forEach((childNode) => {
      if (
        !text &&
        childNode.type === 'element' &&
        childNode.tagName === 'text'
      ) {
        text = toText(childNode, node)
      } else if (
        !isAction &&
        childNode.type === 'element' &&
        childNode.tagName === 'action'
      ) {
        isAction = true
      } else if (
        !text &&
        !firstCard &&
        childNode.type === 'element' &&
        childNode.tagName === 'Reactive.RDXCard'
      ) {
        firstCard = true
        text = processCard(childNode)
        isAction = !!text
      }
    })
  }

  return isAction ? [id, text] : [null, null]
}

function processCard(node) {
  let text = null
  let isAction = false
  if (node.children) {
    node.children.forEach((childNode) => {
      if (
        !text &&
        childNode.type === 'element' &&
        childNode.tagName === 'text'
      ) {
        text = toText(childNode, node)
      } else if (
        !isAction &&
        childNode.type === 'element' &&
        (childNode.tagName === 'actionset' || childNode.tagName === 'action')
      ) {
        isAction = true
      }
    })
  }

  return isAction ? text : null
}

function toText(node, parentNode: any): string | null {
  // Recursively walk through children
  if (node.children) {
    return node.children.map((childNode) => toText(childNode, node)).join('')
  }

  // Wraps text nodes inside template string, so that we don't run into escaping issues.
  if (node.type === 'text') {
    if (node.value.startsWith('\n')) {
      return node.value.replace(/\n\s*/g, '')
    }

    if (parentNode.tagName === 'action') {
      return escapeString(node.value)
    }

    if (
      parentNode.tagName === 'em' ||
      parentNode.tagName === 'del' ||
      parentNode.tagName === 'strong'
    ) {
      return node.value
    }

    return node.value
  }

  return null
}

export function toYaml(
  node,
  parentNode: any = {},
  options: {
    filename?: string
  } = {}
): any {
  if (node.type === 'root') {
    let yaml: { id?: any; [key: string]: any } = {}

    node.children.forEach((childNode) => {
      if (childNode.type === 'yaml') {
        yaml = Object.assign(yaml, childNode.properties)
      }
    })
    return yaml
  }
  return {}
}

export function compile(this: any, options: any = {}) {
  this.Compiler = (tree) => {
    const meta = toYaml(tree, {}, options)
    const questions = toQuestionsMeta(tree)
    if (Object.keys(questions).length > 0) {
      meta.questions = questions
    }
    return { meta, tree }
  }
}
