// eslint-disable-next-line @typescript-eslint/no-var-requires
const { definitions } = require('./adaptivecards.json')

const refs: string[] = []
const result: string[] = []

Object.keys(definitions).forEach(tagname => {
  const definition = definitions[tagname]

  if (definition.type === 'string' && 'enum' in definition) {
    refs.push(`#/definitions/${tagname}`)
  }
})

Object.keys(definitions).forEach(tagname => {
  const definition = definitions[tagname]

  const { properties } = definition
  if (properties) {
    Object.keys(properties).forEach(key => {
      const prop = properties[key]
      if (key === 'type' || result.indexOf(key) !== -1) {
        /** noop */
      } else if (prop.type === 'string' && 'enum' in prop) {
        result.push(key)
      } else if ('$ref' in prop && refs.indexOf(prop.$ref) !== -1) {
        result.push(key)
      }
    })
  }
})

console.log(JSON.stringify(refs, null, 2))

console.log(JSON.stringify(result, null, 2))
