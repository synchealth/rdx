export function h(type, props_, ...children_) {
  const props = props_ || {}

  props.children = (children_.length === 0 && props.children
    ? props.children
    : children_
  ).filter(Boolean)

  if (type && type.defaultProps) {
    Object.keys(type.defaultProps).forEach(prop => {
      if (props[prop] === undefined) {
        props[prop] = type.defaultProps[prop]
      }
    })
  }

  const { children, ...rest } = props

  return { type, props: rest, children }
}
