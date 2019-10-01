const { Fragment } = require('./fragment') // important must use commonjs required Symbol in case running under webpack
import {
  ATTR_ALIASES,
  CHILDREN_PROPS,
  CHILDREN_TEXT_PROPS,
  CLASS_ALIASES,
  PROMOTE_ALIASES,
  SPLIT_ALIASES
} from './util/constants'
const EMPTY_OBJECT = Object.freeze({})
import { toArray } from './util/children'
import { toAbsoluteUrl } from './util'
declare const document: any;

const AbsoluteRegExp = new RegExp('^(?:[a-z]+:)', 'i')

var localResourceProtocolMapper: (partial_url: string) => string | null = null

export function setLocalResourceProtocolMapper(mapper: (partial_url: string) => string) {
  localResourceProtocolMapper = mapper
}

function renderToObject(element, resourceRoot?: string, _parent?: any) {
  if (
    element == null ||
    typeof element === 'string' ||
    typeof element === 'number' ||
    typeof element === 'boolean' ||
    element == null
  ) {
    return element
  } else if (Array.isArray(element)) {
    let result: any[] = []

    for (let i = 0, len = element.length; i < len; i++) {
      const item = renderToObject(element[i], resourceRoot, element)
      if (item) {
        result.push(item)
      }
    }

    return result as any
  }

  const type = element.type

  if (type) {
    const props = element.props || EMPTY_OBJECT

    if (
      type == 'image' &&
      props.url &&
      global.process && (global.process.platform == "darwin" || global.process.platform == "android")
      // running on mobile or non html based browser 
      // https://github.com/microsoft/AdaptiveCards/issues/777
    ) {
      props.url = props.url.replace(/\.svg$/, '.png')
      console.log(`SVG not supported on mobile. Converted to ${props.url}`)
    }

    if (
      type == 'image' &&
      localResourceProtocolMapper &&
      !AbsoluteRegExp.test(props.url)
    ) {
      props.url = toAbsoluteUrl(
        props.url,
        localResourceProtocolMapper(resourceRoot || '')
      )
    }

    if (
      props.backgroundImage &&
      localResourceProtocolMapper &&
      !AbsoluteRegExp.test(props.backgroundImage)
    ) {
      props.backgroundImage = toAbsoluteUrl(
        props.backgroundImage,
        localResourceProtocolMapper(resourceRoot || '')
      )
    }

    if (
      type == 'action' &&
      props.children &&
      (Object.keys(props).length == 1 ||
        (props.intents && Object.keys(props).length == 2))
    ) {
      props.type = 'submit'
      props.data = props.children.join(' ')
    }

    if (type == 'action') {
      props.style = props.style /** uncomment to default to "positive" if needed: || 'positive' */
    }

    for (const prop in props) {
      if (prop.startsWith('__')) {
        delete props[prop]
      }
    }

    if (typeof type === 'function') {
      return renderToObject(type(props), resourceRoot, element)
    } else if (type === Fragment) {
      return renderToObject(props.children, resourceRoot, element)
    } else if (typeof type === 'string') {
      let result: any = {}

      let children = props.children // always an array

      if (children.length > 0 && type in PROMOTE_ALIASES) {
        const MY_PROMOTE_ALIASES = PROMOTE_ALIASES[type]
        const promote = children.filter(
          child => child && child.type in MY_PROMOTE_ALIASES
        )
        if (promote.length > 0) {
          children = children.filter(
            child => !(child && child.type in MY_PROMOTE_ALIASES)
          )

          promote.forEach((child, i) => {
            const childresult = renderToObject(child.props.children, resourceRoot, element)
            result[MY_PROMOTE_ALIASES[child.type]] =
              childresult.length == 1 && typeof childresult[0] !== 'object'
                ? childresult[0]
                : childresult
          })
        }
      }

      children = renderToObject(children, resourceRoot, element)

      let new_type = type

      if (type in SPLIT_ALIASES && props.type in SPLIT_ALIASES[type]) {
        new_type = SPLIT_ALIASES[type][props.type]
      } else if (CLASS_ALIASES[type]) {
        new_type = CLASS_ALIASES[type]
      }

      if (children.length > 0 && type in CHILDREN_PROPS) {
        const firstchild = children[0]

        if (typeof firstchild == null) {
          children = []
        } else if (
          typeof firstchild === 'string' ||
          typeof firstchild === 'number' ||
          typeof firstchild === 'boolean'
        ) {
          children = firstchild
        }

        result[CHILDREN_PROPS[type]] = toArray(children)

      } else if (children.length > 0 && type in CHILDREN_TEXT_PROPS) {
        const firstchild = children.join('')

        if (typeof firstchild == null) {
          children = ''
        } else if (
          typeof firstchild === 'string' ||
          typeof firstchild === 'number' ||
          typeof firstchild === 'boolean'
        ) {
          children = firstchild
        }

        result[CHILDREN_TEXT_PROPS[type]] = children

      } else if (children.length == 1) {
        const firstchild = children[0]

        if (!firstchild) {
          debugger
        }

        if (
          typeof firstchild === 'string' ||
          typeof firstchild === 'number' ||
          typeof firstchild === 'boolean' ||
          firstchild == null
        ) {
          children = firstchild
        }

        result[firstchild.type] = toArray(children)
      }

      result.type = new_type

      for (const prop in props) {
        const value = props[prop]

        if (
          prop === 'type' ||
          prop === 'children' ||
          prop === 'key' ||
          prop === 'ref'
        ) {
          // ignore
        } else {
          const name = ATTR_ALIASES[prop] || prop
          result[name] = value
        }
      }

      return result
    }
  } else {
    throw new Error(`Invalid card element type`)
  }
}

export default renderToObject
