/* eslint-disable prefer-destructuring */
function cloneElement(element, props, ...children) {
  props = { ...element.props, ...(props || {}) }

  props.children = (children.length === 0 && props.children
    ? props.children
    : children
  ).filter(Boolean)

  if (props.children.length === 0) {
    props.children = element.props.children || []
  }

  if (props.children.length === 1 && Array.isArray(props.children[0])) {
    props.children = props.children[0]
  }

  return { type: element.type, props }
}

export default cloneElement
