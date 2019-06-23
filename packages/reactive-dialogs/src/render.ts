const { Fragment } = require('./fragment') // important must use commonjs required Symbol in case running under webpack
const EMPTY_OBJECT = Object.freeze({})

export default function render(element, _parent?: any): any {
  if (
    typeof element === 'string' ||
    typeof element === 'number' ||
    typeof element === 'boolean' ||
    element == null
  ) {
    return element
  } else if (Array.isArray(element)) {
    let result: any[] = []

    for (let i = 0, len = element.length; i < len; i++) {
      const item = render(element[i], element)
      if (item) {
        result.push(item)
      }
    }

    return result as any
  }

  const type = element.type

  if (!type) {
    throw new Error(`Invalid dialog element type`)
  }

  const props = element.props || EMPTY_OBJECT

  for (const prop in props) {
    if (prop.startsWith('__')) {
      delete props[prop]
    }
  }

  if (typeof type === 'function') {
    return render(type(props), element)
  } else if (type === Fragment) {
    return render(props.children, element)
  } else if (typeof type === 'string') {
    let result: any = {}

    result.type = type

    result.props = {}

    result.props.children = render(props.children, element)

    for (const prop in props) {
      const value = props[prop]

      if (prop === 'children' || prop === 'key' || prop === 'ref') {
        // ignore
      } else if (prop === 'style') {
        // for future use if we have a css in js simulation
      } else {
        result.props[prop] = value
      }
    }

    return result
  }
}
