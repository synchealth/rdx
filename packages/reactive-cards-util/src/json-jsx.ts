import { RHastNode } from 'reactive-cards'
import { ac2rcast, rcast2rhast, rhast2jsx, rcast2ac, jsx2rcast } from './index'

export function json2jsx(json: ReactiveCards.IAdaptiveCard): string {
  try {
    const rcx = ac2rcast(json)
    const hast = rcast2rhast(rcx) as RHastNode
    const jsx = rhast2jsx(hast)
    return jsx
  } catch (ex) {
    console.log(ex)
    return ''
  }
}

export function jsx2json(jsx: string): ReactiveCards.IAdaptiveCard | {} {
  try {
    const component = jsx2rcast(jsx)
    const cardjson = rcast2ac(component)
    return cardjson
  } catch (ex) {
    console.log(ex)
    return {}
  }
}
