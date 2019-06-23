import { core } from './core-elements'
import { footer } from './footer'
import { list, listItem } from './list-elements'
import { reference } from './reference-elements'
import { table } from './table'
import { thematicBreak } from './thematic-break'

export default {
  ...core,
  ...reference,
  list,
  listItem,
  table,
  thematicBreak
}

export { footer }
