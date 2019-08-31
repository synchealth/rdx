const { paramCase } = require('change-case')
const remove = require('unist-util-remove')
import escapeString from './util/escape-string'

export const toTemplateLiteral = text => {
  const escaped = text
    .replace(/\\/g, '\\\\') // Escape all "\" to avoid unwanted escaping in text nodes
    .replace(/`/g, '\\`') // Escape "`"" since
    .replace(/\$\{/g, '\\${') // Escape ${} in text so that it doesn't eval

  return '{`' + escaped + '`}'
}

const EMPTY_OBJECT = Object.freeze({})

const CARD_SHORTCUTS = {
  TextCard: 'RDXCard',
  MemeCard: 'RDXMemeCard',
  QuoteCard: 'RDXQuoteCard'
}

function removeSections(tree) {
  let section = 0

  remove(tree, { cascade: true }, test)

  function test(node) {
    if (node.type == 'section') {
      section++
    }

    return section > 1
  }
}

export function toJSX(
  node,
  parentNode: any = {},
  options: {
    skipExport?: boolean
    skipImport?: boolean
    preserveNewlines?: boolean
    wrapExport?: any
    filename?: string
  } = {}
) {
  const {
    // Default options
    skipImport = false,
    skipExport = false,
    preserveNewlines = false
  } = options

  let children = ''

  if (node.properties != null) {
    const paramCaseRe = /^(aria[A-Z])|(data[A-Z])/
    node.properties = Object.entries(node.properties!).reduce(
      (properties, [key, value]) =>
        Object.assign({}, properties, {
          [paramCaseRe.test(key) ? paramCase(key) : key]: value
        }),
      {}
    )
  }

  if (node.type === 'root') {
    removeSections(node)

    const importNodes: any[] = []
    const exportNodes: any[] = []
    const jsxNodes: any[] = []
    let yaml: object = {}

    for (const childNode of node.children) {
      if (childNode.type === 'yaml') {
        yaml = Object.assign(yaml, childNode.properties)
        continue
      }

      if (childNode.type === 'import') {
        importNodes.push(childNode)
        continue
      }

      if (childNode.type === 'export') {
        if (childNode.default) {
          continue
        }

        exportNodes.push(childNode)
        continue
      }

      jsxNodes.push(childNode)
    }

    const importStatements = importNodes
      .map(childNode => toJSX(childNode, node))
      .join('\n')

    const exportStatements = exportNodes
      .map(childNode => toJSX(childNode, node))
      .join('\n')

    const fn =
      (jsxNodes.length <= 3 && jsxNodes[jsxNodes.length - 1] && jsxNodes[jsxNodes.length - 1].type == 'table') ||
      (jsxNodes.length == 4 && jsxNodes[jsxNodes.length - 2].type == 'table')
        ? `(props) => {
          return (
        <table id="${yaml['id'] || ''}" version={props.version} >
        ${jsxNodes.map(childNode => toJSX(childNode, node)).join('')}
        </table>
          )
        }`
        : `(props) => {
          return (
        <flow id="${yaml['id'] ||
          ''}" version={props.version} utterances={props.utterances} isGlobal={props.isGlobal} canLaunchFromGlobal={props.canLaunchFromGlobal}>
        ${jsxNodes.map(childNode => toJSX(childNode, node)).join('')}
        </flow>
          )
        }`

    const preamble = skipImport
      ? `/** @jsx h */\n`
      : [`/** @jsx h */`]
          .concat(
            ['/**'],
            [' * !This module was system generated by @rdx-js/rdx!']
          )
          .concat(Object.keys(yaml)
            .map(key =>
              yaml[key] ? ` * ${key}: ${escapeString(yaml[key])}` : null
            )
            .filter(Boolean) as string[])
          .concat([' */\n'])
          .concat([
            '',
            options.skipImport
              ? ''
              : `import * as Reactive from 'reactive-dialogs'\nimport {h} from 'reactive-dialogs'`
          ])
          .join('\n')

    const postamble =
      !skipExport &&
      ['']
        .concat(['export const meta={'])
        .concat(Object.keys(yaml)
          .map(key =>
            yaml[key] ? `  ${key}: "${escapeString(yaml[key])}",` : null
          )
          .filter(Boolean) as string[])
        .concat(['}'])
        .join('\n')

    const moduleBase = !options.skipImport
      ? `
${importStatements}
${exportStatements}
`
      : ''

    if (skipExport) {
      return `${preamble}${moduleBase}
${fn}`
    }

    return `${preamble}${moduleBase}
export const rdx = ${fn}

${postamble}
export default rdx`
  }

  // Recursively walk through children
  if (node.children) {
    children = node.children
      .map(childNode => {
        const childOptions = Object.assign({}, options, {
          // Tell all children inside <pre> tags to preserve newlines as text nodes
          preserveNewlines: preserveNewlines || node.tagName === 'pre'
        })
        return toJSX(childNode, node, childOptions)
      })
      .join('')
  }

  if (node.type === 'element') {
    let tagName = node.tagName

    if (tagName == 'em') {
      return `*${children}*`
    } else if (tagName == 'del') {
      return `~~${children}~~`
    } else if (tagName == 'strong') {
      return `**${children}**`
    }

    const properties = node.properties || EMPTY_OBJECT

    if (tagName == 'h4') {
      tagName = properties.type
      delete properties.id
      delete properties.type

      if (tagName && tagName in CARD_SHORTCUTS) {
        tagName = CARD_SHORTCUTS[tagName]
      }

      if (tagName && tagName.startsWith('RDX')) {
        tagName = `Reactive.${tagName}`
      }
    }

    const propertiesformatted = Object.keys(properties)
      .map(prop => {
        const value = properties[prop]

        if (prop === 'children' || prop === 'key' || prop === 'ref') {
          // skip
        } else {
          if (typeof value === 'string') {
            return ` ${prop}="${escapeString(value)}"`
          } else if (typeof value === 'number') {
            return ` ${prop}={${String(value)}}`
          } else if (typeof value === 'boolean' && value) {
            return ` ${prop}`
          } else if (Array.isArray(value)) {
            return ` ${prop}={${JSON.stringify(value)}}`
          } else if (
            typeof value === 'object' &&
            value &&
            value.type == 'code'
          ) {
            return ` ${prop}={${value}}`
          }
        }
        return ''
      })
      .join('')

    return `<${tagName}${propertiesformatted}>${children}</${tagName}>`
  }

  // Wraps text nodes inside template string, so that we don't run into escaping issues.
  if (node.type === 'text') {
    // Don't wrap newlines unless specifically instructed to by the flag,
    // to avoid issues like React warnings caused by text nodes in tables.
    const shouldPreserveNewlines =
      preserveNewlines || parentNode.tagName === 'p'

    if (node.value === '\n' && !shouldPreserveNewlines) {
      return node.value
    }

    if (node.value.startsWith('\n')) {
      return node.value
    }

    if (parentNode.tagName == 'action') {
      return escapeString(node.value)
    }

    if (
      parentNode.tagName == 'em' ||
      parentNode.tagName == 'del' ||
      parentNode.tagName == 'strong'
    ) {
      return node.value
    }

    return toTemplateLiteral(node.value)
  }

  if (node.type === 'code') {
    if (node.inline) {
      return ` {\`${node.value}\`} `
    }

    if (node.block) {
      return ` {${node.value}} `
    }

    return `{\n${node.value}\n}`
  }

  if (node.type === 'comment') {
    const lines = node.value.split('\n')
    if (lines.length == 1) {
      return `\n{/** ${node.value} */}\n`
    }

    return `{\n/**\n${lines.map(line => ` * ${line}`).join('\n')}\n */}`
  }

  if (node.type === 'section') {
    return null
  }

  if (node.type === 'jsx') {
    return node.value
  }

  if (node.type === 'table') {
    const table = {}
    const columns = []

    node.children[0].children.map(child => {
      const name = child.children[0].value
      columns.push(name)
      table[name] = []
    })

    node.children.slice(1).map(row => {
      return row.children.map((child, i) => {
        const value = child.children[0] ? child.children[0].value : undefined
        if (value) { table[columns[i]].push(value); }
        
      })
    })

    if (columns[0] == '#' || columns[0] == 'id') {
      delete table[columns[0]]
      delete columns[0]
    }

    return columns
      .map(
        id => `<list id="${id}" >{
${JSON.stringify(table[id], null, 2)}
}</list>`
      )
      .join('\n')
  }

  if (node.type === 'import' || node.type === 'export') {
    return node.value
  }
}

export function compile(this: any, options = {}) {
  this.Compiler = tree => {
    return toJSX(tree, {}, options)
  }
}
