import * as HAST from 'hast-format'
import * as MDAST from 'mdast'
import { Node, Parent } from 'unist'
import mdurlEncode from 'mdurl/encode'
import detab from 'detab'
import collapseWhiteSpace from 'collapse-white-space'
import u from 'unist-builder'
import trimLines from 'trim-lines'
import {
  default as toHAST,
  H,
  wrap,
  all,
  allText,
  revert
} from '@rdx-js/language-mdast-hast'

export default function toRDHast() {
  return (tree, _file) => {
    const handlers = {
      /**  convert blockquote to code comment */
      blockquote(h: H, node: MDAST.Blockquote & Parent) {
        const value = allText(h, node).join('\n')
        return u('comment', value)
      },

      /** convert thematic breaks (---) to section divider */
      thematicBreak(h: H, node: MDAST.Break & Node) {
        return u('section')
        // note: all sections after the first are removed in toJSX compiler
      },

      /** pass through imports */
      import(h, node) {
        // pass through
        return Object.assign({}, node, {
          type: 'import'
        })
      },

      /** convert h1 to dialog, ignore h2+ -- future use card titles (TODO) */
      heading(h: H, node: MDAST.Heading & Node) {
        switch (node.depth) {
          case 1:
          case 2:
            return h(node, 'dialog', {
              title: allText(h, node)
                .join(' ')
                .toLowerCase()
            })
          case 4:
            return h(node, 'h4', {
              type: allText(h, node)[0] || 'RDXCard'
            })
          default:
            return null
        }
      },

      /** convert paragraph to prompt  */
      paragraph(h: H, node: MDAST.Paragraph & Node, parent: Node) {
        if (parent.type == 'root') {
          var raw = all(h, node)
          //
          // promote actionset and images to replace parent paragraph
          //
          if (raw.length == 1) {
            const firstChild = raw[0]
            if (
              firstChild.tagName == 'action' ||
              firstChild.tagName == 'image'
            ) {
              return firstChild
            }
          }
          return h(node, 'text', raw)
        }
        if (parent.type == 'listItem') {
          return h(node, 'text', all(h, node))
        }
        const value = allText(h, node).join('\n')
        return u('text', value)
      },

      /** convert list to actionset (or utterances if not in root == flow/dialog)  */
      list(h: H, node: MDAST.List & Parent, parent: Node): HAST.Element | null {
        var props: any = {}

        if (node.ordered) props.ordered = true

        var name =
          parent.type == 'root'
            ? 'actionset'
            : parent.type == 'listItem'
            ? 'utterances'
            : null

        if (typeof node.start === 'number' && node.start !== 1) {
          props.start = node.start
        }

        const items = all(h, node)

        return name ? h(node, name, props, wrap(items, true)) : null
      },

      /** images are represented similarly in both trees */
      image(h: H, node: MDAST.Image & Node) {
        var props: HAST.Properties = {
          url: mdurlEncode(node.url),
          altText: node.alt
        }

        if (node.title !== null && node.title !== undefined) {
          props.title = node.title
        }

        return h(node, 'image', props)
      },

      /** convert listitem to action  */
      listItem(h: H, node: MDAST.ListItem & Node, parent: MDAST.List & Parent) {
        var raw = all(h, node)
        var props: HAST.Properties = {}
        var result
        var index
        var length
        var child
        var childlength
        var childindex

        result = []
        length = raw.length
        index = -1

        while (++index < length) {
          child = raw[index]

          if (child.tagName === 'text') {
            childlength = child.children.length
            childindex = -1

            while (++childindex < childlength) {
              if (child.children[childindex].tagName == 'action') {
                result = result.concat(child.children[0].children)
                props = Object.assign(props, child.children[0].properties)
              } else {
                result = result.concat(child.children[childindex])
              }
            }
          } else if (child.tagName === 'utterances') {
            const results: string[] = []

            const flat = flatten(child.children)

            flat.forEach(child => {
              if (child.type == 'text') {
                if (!child.value.startsWith('\n')) {
                  results.push(child.value)
                }
              } else if (child.tagName == 'action') {
                child.children.forEach(subchild => results.push(subchild.value))
              }
            })

            props.utterances = results.map(utterance =>
              utterance.replace(/^["']/, '').replace(/["']$/, '')
            )
          } else {
            result.push(child)
          }
        }

        if (typeof node.checked === 'boolean') {
          // TO DO use cards with check boxes in future
        }

        return h(node, 'action', props, result)
      },

      /** convert links to actions */
      link(h: H, node: MDAST.Link & Node) {
        var props: HAST.Properties = {
          url: mdurlEncode(node.url),
          type: 'openurl'
        }

        if (node.title !== null && node.title !== undefined) {
          props.title = node.title
        }

        return h(node, 'action', props, all(h, node))
      },

      /** included code as is as long as 'live' is included after language name */
      code(h: H, node: MDAST.Code & Node) {
        var value = node.value ? detab(node.value + '\n') : ''
        var lang = node.lang && node.lang.match(/^[^ \t]+(?=[ \t]|$)/)
        var props: HAST.Properties = {}

        if (lang) {
          props.lang = lang
        }

        if (node.meta) {
          props.meta = node.meta
        }

        props.metastring = node.meta || undefined

        const meta =
          node.meta &&
          node.meta.split(' ').reduce((acc, cur) => {
            if (cur.split('=').length > 1) {
              const t = cur.split('=')
              acc[t[0]] = t[1]
              return acc
            }

            acc[cur] = true
            return acc
          }, {})

        if (meta) {
          Object.keys(meta).forEach(key => {
            props[key] = meta[key]
          })
        }

        if (props.live) {
          return u('code', props, value)
        } else {
          return null
        }
      },

      /** pass jsx through as is */
      jsx(h, node) {
        return Object.assign({}, node, {
          type: 'jsx'
        })
      },

      /** follow html conventions for delete emphasis and strong */
      delete(h: H, node: MDAST.Emphasis & Node) {
        return h(node, 'del', all(h, node))
      },

      /** follow html conventions for delete emphasis and strong */
      emphasis(h: H, node: MDAST.Emphasis & Node) {
        return h(node, 'em', all(h, node))
      },

      /** follow html conventions for delete emphasis and strong */
      strong(h: H, node: MDAST.Strong & Node) {
        return h(node, 'strong', all(h, node))
      },

      /** html is probably just reactive cards jsx so pass thru if dangerous flag set */
      html(h: H, node: MDAST.HTML & Node) {
        return h.dangerous ? h.augment(node, u('jsx', node.value)) : null
      },

      /** image references are formatted similarly to images with url, altText */
      imageReference(h: H, node: MDAST.ImageReference & Node) {
        var def = h.definition(node.identifier)
        var props

        if (!def) {
          return revert(h, node)
        }

        props = { url: mdurlEncode(def.url || ''), altText: node.alt }

        if (def.title !== null && def.title !== undefined) {
          props.title = def.title
        }

        return h(node, 'image', props)
      },

      /** pass inline code as code with flag set so that {` `} is used in jsx output */
      inlineCode(h: H, node: MDAST.InlineCode & Node) {
        return u('code', { inline: true }, collapseWhiteSpace(node.value))
      },

      /** pass through template variable blocks as inline code with block flag set */
      block(h, node) {
        return u('code', { block: true }, collapseWhiteSpace(node.value))
      },

      /** process root normally with all children */
      root(h: H, node: MDAST.Root & Node) {
        return h.augment(node, u('root', wrap(all(h, node))))
      },

      /** pass text through */
      text(h: H, node: MDAST.Text & Node) {
        return h.augment(node, u('text', trimLines(node.value)))
      },

      /** pass through exports as is */
      export(h, node) {
        return Object.assign({}, node, {
          type: 'export'
        })
      },

      /** pass comments through as is */
      comment(h, node) {
        return h(node, 'comment')
      },

      /** parse yaml properties */
      yaml(_h, node) {
        const props = node.value.split('\n').reduce((accum, x) => {
          let parts = x.split(/:(.+)/)
          return Object.assign(
            {},
            {
              [parts[0] ? parts[0].trim() : '']: parts[1] ? parts[1].trim() : ''
            },
            accum
          )
        }, {})

        return u('yaml', { properties: props })
      },

      /** pass through tables as is */
      table(h, node) {
        return Object.assign({}, node, {
          type: 'table'
        })
      },

      tableRow(h, node) {
        return Object.assign({}, node, {
          type: 'tableRow'
        })
      },

      tableCell(h, node) {
        return Object.assign({}, node, {
          type: 'tableCell'
        })
      }
    }

    const hast = toHAST(tree, {
      handlers,
      // Enable passing of html nodes to HAST as raw nodes
      allowDangerousHTML: true
    })

    return hast
  }
}

function flatten(node) {
  if (node.children && node.children.length > 0) {
    return flattenAll(node.children)
  }

  return node
}

function flattenAll(children) {
  var results = []
  var length = children.length
  var index = -1

  while (++index < length) {
    results = results.concat(flatten(children[index]))
  }

  return results
}
