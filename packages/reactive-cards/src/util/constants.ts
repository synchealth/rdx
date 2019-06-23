export const CLASS_ALIASES = {
  card: 'AdaptiveCard',
  // card elements
  text: 'TextBlock',
  image: 'Image',
  media: 'Media',
  mediasource: 'MediaSource',
  // containers
  container: 'Container',
  columnset: 'ColumnSet',
  column: 'Column',
  factset: 'FactSet',
  fact: 'Fact',
  imageset: 'ImageSet',
  // inputs
  choice: 'Input.Choice',
  actionset: 'ActionSet'
}

export const ATTR_ALIASES: { [k: string]: string } = {
  /* intentionally left blank */
}

export const PROMOTE_ALIASES = {
  card: {
    body: 'body',
    actionset: 'actions',
    speak: 'speak',
    fallback: 'fallback',
    action: 'selectAction'
  },
  image: {
    action: 'selectAction'
  },
  container: {
    action: 'selectAction'
  },
  columnset: {
    action: 'selectAction'
  },
  column: {
    action: 'selectAction'
  }
}

export const CHILDREN_PROPS = {
  action: 'title',
  text: 'text',
  container: 'items',
  columnset: 'columns',
  column: 'items',
  factset: 'facts',
  imageset: 'images',
  choiceset: 'choices',
  choice: 'title',
  actionset: 'actions'
  //  input: "actionset"
}

export const SPLIT_ALIASES = {
  action: {
    openurl: 'Action.OpenUrl',
    submit: 'Action.Submit',
    showcard: 'Action.ShowCard'
  },
  input: {
    date: 'Input.Date',
    time: 'Input.Time',
    number: 'Input.Number',
    text: 'Input.Text',
    toggle: 'Input.Toggle',
    choiceset: 'Input.ChoiceSet'
  }
}

export const CASE_INSENSITIVE = {
  spacing: true,
  style: true,
  horizontalAlignment: true,
  size: true,
  imageSize: true,
  color: true,
  weight: true,
  thickness: true
}

export const DEFAULTS = {
  card: {
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    version: '1.1'
  }
}

export function objectFlip(obj) {
  const ret = {}
  Object.keys(obj).forEach(key => {
    ret[obj[key]] = key
  })
  return ret
}

export function categoryObjectFlip(obj) {
  const ret = {}
  Object.keys(obj).forEach(key => {
    ret[CLASS_ALIASES[key]] = objectFlip(obj[key])
  })
  return ret
}

export function heirarchyObjectFlip(obj) {
  const ret = {}
  Object.keys(obj).forEach(key => {
    const child = obj[key]
    Object.keys(child).forEach(childkey => {
      ret[child[childkey]] = { type: key, subtype: childkey }
    })
  })
  return ret
}
