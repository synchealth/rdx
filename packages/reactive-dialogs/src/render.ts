// important must use commonjs required Symbol in case running under webpack
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Fragment } = require('./fragment')

const EMPTY_OBJECT = Object.freeze({})

export default function render(element, _parent?: any): any {
  if (
    typeof element === 'string' ||
    typeof element === 'number' ||
    typeof element === 'boolean' ||
    element == null
  ) {
    return element
  }
  if (Array.isArray(element)) {
    const result: any[] = []

    for (let i = 0, len = element.length; i < len; i++) {
      const item = render(element[i], element)
      if (item) {
        result.push(item)
      }
    }

    return result as any
  }

  const { type } = element

  if (!type) {
    throw new Error(`Invalid dialog element type`)
  }

  const props = element.props || EMPTY_OBJECT

  Object.keys(props).forEach(prop => {
    if (prop.startsWith('__')) {
      delete props[prop]
    }
  })

  if (typeof type === 'function') {
    return render(type(props), element)
  }
  if (type === Fragment) {
    return render(props.children, element)
  }
  if (typeof type === 'string') {
    const result: any = {}

    result.type = type

    result.props = {}

    result.props.children = render(props.children, element)

    Object.keys(props).forEach(prop => {
      const value = props[prop]

      if (prop === 'children' || prop === 'key' || prop === 'ref') {
        // ignore
      } else {
        result.props[prop] = value
      }
    })

    return result
  }

  return undefined
}
