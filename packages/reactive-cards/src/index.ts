import { Fragment } from './fragment'
import h from './create-element'
import cloneElement from './clone-element'
import renderToObject from './render-to-object'
import createFromObject from './create-from-object'
import { toArray } from './util/children'

const Children = { toArray }

let config = {
  localResourceRoot: null as string | null
}

export {
  Fragment,
  h,
  h as createElement,
  cloneElement,
  renderToObject,
  renderToObject as render,
  createFromObject,
  Children,
  config
}
