import { Fragment } from './fragment'
import h from './create-element'
import cloneElement from './clone-element'
import renderToObject, {
  setLocalResourceProtocolMapper
} from './render-to-object'
import createFromObject from './create-from-object'
import { toArray } from './util/children'
import { rhast2jsx } from './util/rhast2jsx'
import { rcast2rhast } from './util/rcast2rhast'

const Children = { toArray }
const util = { rcast2rhast, rhast2jsx }

export {
  Fragment,
  h,
  h as createElement,
  cloneElement,
  renderToObject,
  renderToObject as render,
  createFromObject,
  Children,
  setLocalResourceProtocolMapper,
  util
}
