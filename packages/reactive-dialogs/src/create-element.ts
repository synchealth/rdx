import { DEFAULTS } from './util/constants'

function h(type, props, ...children) {
  props = props || {}

  props.children = (children.length === 0 && props.children
    ? props.children
    : children
  ).filter(Boolean)

  if (props.children.length == 1 && Array.isArray(props.children[0])) {
    props.children = props.children[0]
  }

  if (type && type.defaultProps) {
    for (const prop in type.defaultProps) {
      if (props[prop] === undefined) {
        props[prop] = type.defaultProps[prop]
      }
    }
  }

  if (type && type in DEFAULTS) {
    for (const prop in DEFAULTS[type]) {
      if (props[prop] === undefined) {
        props[prop] = DEFAULTS[type][prop]
      }
    }
  }

  return { type, props }
}

export default h
