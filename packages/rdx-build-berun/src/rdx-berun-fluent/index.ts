import Berun from '@berun/berun'
import RdxClass from './Rdx'

export const TdxConfig = RdxClass

export const Rdx = (berun: BerunRdx) => {
  berun.rdx = new RdxClass()
}

export type BerunRdx = Berun & {
  rdx: RdxClass
}
