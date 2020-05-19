import type { Node, Parent } from 'unist'
import type * as HAST from 'hast-format'

export type Handler = (
  h: H,
  node: Node | Parent,
  parent?: Parent
) => HAST.Element

export interface H {
  (
    node: Partial<Node> | null | undefined,
    tagName: string,
    props?: HAST.Properties,
    children?: Array<
      Node | HAST.Element | HAST.DocType | HAST.Comment | HAST.Text
    >
  ): HAST.Element
  handlers: { [key: string]: Handler }
  dangerous: boolean | undefined
  definition: any
  footnoteById: object
  footnoteOrder: any[]
  augment: (left: Node, right: HAST.Element) => HAST.Element
}
