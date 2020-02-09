/* eslint-disable prefer-destructuring */
import { DEFAULTS } from './util/constants'

function h(type, props, ...children) {
  props = props || {}

  props.children = (children.length === 0 && props.children
    ? props.children
    : children
  ).filter(Boolean)

  if (props.children.length === 1 && Array.isArray(props.children[0])) {
    props.children = props.children[0]
  }

  if (type && type.defaultProps) {
    Object.keys(type.defaultProps).forEach(prop => {
      if (props[prop] === undefined) {
        props[prop] = type.defaultProps[prop]
      }
    })
  }

  if (type && type in DEFAULTS) {
    Object.keys(DEFAULTS[type]).forEach(prop => {
      if (props[prop] === undefined) {
        props[prop] = DEFAULTS[type][prop]
      }
    })
  }

  return { type, props }
}

export default h
