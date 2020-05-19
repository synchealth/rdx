/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable @typescript-eslint/interface-name-prefix */
export {}
export type RHastChild = RHastElement | RHastText | string | number | RHastCode

export interface RHastCode {
  type: 'code'
  value: string
}

export interface RHastElement {
  type: 'element'
  tagName: string
  properties: {
    [key: string]: string | number | RHastCode
  }
  children: RHastChild[]
}

export interface RHastText {
  type: 'text'
  value: string | number | boolean
}

export type RHastNode = RHastElement | RHastText | RHastChild

export type RCastCode = string

export type RCastChild = RCastElement | string | number | RCastCode

export interface RCastProps {
  children: RCastChild[]
  [key: string]: string | number | RCastCode | RCastChild[]
}

export interface RCastElement {
  type: string | Function
  props: RCastProps
}

export type RCastNode = RCastElement | RCastChild
