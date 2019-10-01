import {
  DEFAULTS,
  objectFlip,
  categoryObjectFlip,
  heirarchyObjectFlip,
  ATTR_ALIASES,
  CHILDREN_PROPS,
  CHILDREN_TEXT_PROPS,
  CHILDREN_CONTAINER_PROPS,
  CLASS_ALIASES,
  PROMOTE_ALIASES,
  SPLIT_ALIASES,
  CASE_INSENSITIVE
} from './util/constants'

const CLASS_ALIASES_FLIPPED = objectFlip(CLASS_ALIASES)
const ATTR_ALIASES_FLIPPED = objectFlip(ATTR_ALIASES)
const PROMOTE_ALIASES_FLIPPED = categoryObjectFlip(PROMOTE_ALIASES)
const CHILDREN_PROPS_FLIPPED = objectFlip(CHILDREN_PROPS)
const CHILDREN_TEXT_PROPS_FLIPPED = objectFlip(CHILDREN_TEXT_PROPS)
const CHILDREN_CONTAINER_PROPS_FLIPPED = objectFlip(CHILDREN_CONTAINER_PROPS)
const SPLIT_ALIASES_FLIPPED = heirarchyObjectFlip(SPLIT_ALIASES)

function createFromObject(element, _parent) {
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
      result.push(createFromObject(element[i], element))
    }

    return result
  }

  const type = element.type

  if (type && typeof type == 'string') {
    let result: any = {
      type: CLASS_ALIASES_FLIPPED[type],
      props: { children: [] }
    }

    Object.keys(element).forEach(key => {
      if (CASE_INSENSITIVE[key] === true) {
        const str = element[key]
        if (str && typeof str == 'string') {
          element[key] = str.charAt(0).toLowerCase() + str.slice(1)
        }
      }
    })

    if (type in SPLIT_ALIASES_FLIPPED) {
      const { type: new_type, subtype } = SPLIT_ALIASES_FLIPPED[type]
      const new_element = { ...element, type: new_type }
      const result = createFromObject(new_element, _parent)
      result.type = new_type
      result.props.type = subtype
      return result
    }

    Object.keys(element).forEach(key => {
      if (key == 'type') {
      } else {
        if (key in CHILDREN_PROPS_FLIPPED) {
          const new_children = createFromObject(element[key], element)
          result.props.children = result.props.children.concat( new_children ) 
        } else if (key in CHILDREN_TEXT_PROPS_FLIPPED) {
          const new_children = createFromObject(element[key], element)
          result.props.children = result.props.children.concat( new_children ) 
        } else if (key in CHILDREN_CONTAINER_PROPS_FLIPPED) {
          const new_children = createFromObject(element[key], element)

          result.props.children = result.props.children.concat({
           type: CHILDREN_CONTAINER_PROPS_FLIPPED[key],
           props: { children: new_children }
          })
          
        }  else if (
          type in PROMOTE_ALIASES_FLIPPED &&
          key in PROMOTE_ALIASES_FLIPPED[type]
        ) {
          const child_new_type = PROMOTE_ALIASES_FLIPPED[type][key]
          const children = element[key]

          if (
            typeof children === 'string' ||
            typeof children === 'number' ||
            typeof children === 'boolean'
          ) {
            result.props.children.push({
              type: child_new_type,
              props: { children }
            })
          } else if (Array.isArray(children)) {
            result.props.children = result.props.children.concat({
              type: child_new_type,
              props: {
                children: children.map(child => {
                  const new_child = createFromObject(child, element)
                  return new_child
                })
              }
            })
          } else {
            result.props.children.push({
              type: child_new_type,
              props: { ...children }
            })
          }
        } else {
          result.props[key] = createFromObject(element[key], element)
        }
      }
    })

    return result
  } else {
    throw new Error(`Invalid card element type`)
  }
}

export default createFromObject
