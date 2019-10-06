export = ReactiveDialogs
export as namespace ReactiveDialogs
import * as ReactiveCards from 'reactive-cards'

declare namespace ReactiveDialogs {
  export function h(
    type: any,
    props: any,
    ...children: any[]
  ): {
    type: any
    props: any
  }

  function cloneElement<T>(
    element: Element<T>,
    props: any,
    ...children: any[]
  ): {
    type: any
    props: any
  }

  export type createElement = typeof h

  export function render<P>(element: Element, parent?: any): P

  /** simpler version of reactive card with fewer options used for RDX documents */
  export const RDXCard: ReactiveCards.FC<{ title?: string }>
  /** RDX Image Card */
  export const RDXImageCard: ReactiveCards.FC<{
    src: string
    altText?: string
    title?: string
    footer?: string
  }>
  /** RDX Table Card with embedded fact set */
  export const RDXTableCard: ReactiveCards.FC<{
    title?: string,
    subheading?: string,
    footer?: string,
    titleimage?: string,
    image?: string,
    fontType?: string
    style?: any
    data: [string, string][]
  }>

  export function toArray(
    x: any
  ): {
    type: string
    props: any
  }[]

  const Children: {
    toArray: typeof toArray
  }

  export interface Element<
    P = any,
    T extends string | FunctionComponent<P> = string | FunctionComponent<P>
    > {
    type: T
    props: P
    key: string | number | null
  }

  export interface CustomElement<
    P = any,
    T extends FunctionComponent<P> = FunctionComponent<P>
    > {
    type: T
    props: P
    key: string | number | null
  }

  export type TextElement = Element<JSX.text, 'text'>
  export type ActionElement =
    | ActionOpenUrlElement
    | ActionShowCardElement
    | actionSubmitElement
    | ActionGenericElement
  export type ActionOpenUrlElement = Element<JSX.actionOpenUrl, 'action'>
  export type ActionShowCardElement = Element<JSX.actionShowCard, 'action'>
  export type actionSubmitElement = Element<JSX.actionSubmit, 'action'>
  export type ActionGenericElement = Element<JSX.actionGeneric, 'action'>

  export type BodyElement = Element<JSX.body, 'body'>
  export type ImageElement = Element<JSX.image, 'image'>
  export type ActionSetElement = Element<
    JSX.actionset & { children: (ActionElement)[] },
    'actionset'
  >
  export type SpeakElement = Element<JSX.speak, 'speak'>
  export type CardElement = Element<
    JSX.card & { children: (BodyElement | ActionSetElement | SpeakElement)[] },
    'card'
  >
  export type DialogElement = Element<
    JSX.dialog & {
      children: (TextElement | CardElement | ActionElement | CustomElement)[]
    },
    'dialog'
  >
  export type FlowElement = Element<
    JSX.flow & { children: DialogElement[] },
    'flow'
  >

  export type TableElement = Element<
    JSX.table & { children: ListElement[] },
    'table'
  >

  export type ListElement = Element<
    JSX.list & { children: string[] },
    'list'
  >

  // Reactive HAST -- with type: element and tagname and isolated children
  // Identical to HAST (see unifiedjs) but with addition RHastCode type

  type RDHastChild = RDHastElement | RDHastText | string | number | RDHastCode

  interface RDHastCode {
    type: 'code'
    value: string
  }

  interface RDHastElement {
    type: 'element'
    tagName: string
    properties: {
      [key: string]: string | number | RDHastCode
    }
    children: RDHastChild[]
  }

  interface RDHastText {
    type: 'text'
    value: string | number | boolean
  }

  type RDHastNode = RDHastElement | RDHastText | RDHastChild

  // Core Virtual dom of Reactive Cards

  interface NodeArray extends Array<Node> { }
  type Child = Element | string | number
  type ElementFragment = {} | NodeArray

  type Node = Child | ElementFragment | boolean | null | undefined

  type PropsWithChildren<P> = P & { children?: Node } & StyleAttributes<any>

  interface FunctionComponent<P = {}> {
    (props: PropsWithChildren<P>, context?: any): Element | null
    defaultProps?: Partial<P>
    displayName?: string
  }

  type FC<P = {}> = FunctionComponent<P>

  interface ExoticComponent<P = {}> {
    (props: P): Element | null
    readonly $$typeof: symbol
  }

  const Fragment: ExoticComponent<{ children?: Node }>

  interface Attributes {
    key?: string | number
  }
  interface RefObject<T> {
    readonly current: T | null
  }
  type Ref<T> =
    | { bivarianceHack(instance: T | null): void }['bivarianceHack']
    | RefObject<T>
    | null
  interface RefAttributes<T> extends Attributes {
    ref?: Ref<T>
  }
  interface StyleAttributes<T> extends RefAttributes<T> {
    /** Additional styles object passed to host renderer */
    style?: any
  }
}

declare global {
  export namespace ReactiveDialogs.JSX {
    /** Allows a user to input a date, time, number, text, option or choice */
    export interface IntrinsicElements
      extends ReactiveCards.JSX.IntrinsicElements {
      /** Root element in a Reactive Dialogs Skill Flow  */
      flow: flow
      /** One or more sequence of prompts and cards in a conversation  */
      dialog: dialog
      /** Render a single text message */
      text: text
      /** Render a reactive card */
      card: card
      /** Display an actionset button in a card or take the action if outside */
      action: action
      /** Simpler type of reactive card for text and buttons */
      MultiChoiceCard: card
      /** Simpler type of reactive card for text and buttons */
      ImageCard: card

      /** Root element in a Reactive Dialogs Table Set  */
      table: table
      /** Set of columnar data in a table  */
      list: list

    }

    /** Root element in a Reactive Dialogs Skill Flow  */
    export interface flow {
      /** unique short name of the flow */
      id: string
      /** semantic version of the flow interaction model, e.g., 1.2.0 */
      version: string
      /** list of intent ids that can trigger this flow; used globally to launch the first step in flow */
      utterances?: string[]
      /** register as a global skill flow */
      isGlobal?: boolean
      /** register launch utterances on default skill even if not a global flow */
      canLaunchFromGlobal?: boolean
      //  children must include dialog elements
    }

    /** Root element in a Reactive Dialogs Table Set  */
    export interface table {
      /** unique short name of the flow */
      id: string
      /** semantic version of the flow interaction model, e.g., 1.2.0 */
      version: string
    }

    /** Set of columnar data in a table   */
    export interface list {
      /** unique short name of the list */
      id: string
    }

    /** One or more sequence of text prompts, cards, and directive actionset in a multi-turn conversation  */
    export interface dialog {
      /** human readable of the step */
      title: string
      /** unique short name of the step */
      id: string

      //   children can include text, card, and action (used here as bot directive)
    }

    /** One or more sequence of text prompts, cards, and directive actionset in a conversation  */
    export interface intent {
      /** unique short name of the intent */
      id: string
      /** list of utterances that can trigger this step */
      utterances?: string[]
    }

    /** Root element in a Reactive (Adaptive) Card */
    export type card = ReactiveCards.JSX.card
    /** The card elements to show in the primary card region. */
    export type body = ReactiveCards.JSX.body
    /** Text shown when the client doesn't support the version specified (may contain markdown). */
    export type fallback = ReactiveCards.JSX.fallback
    /** The text to speak on voice interfaces */
    export type speak = ReactiveCards.JSX.speak
    /** The Actions to show in the card's action bar. */
    export type actionset = ReactiveCards.JSX.actionset

    export enum ActionType {
      /** Navigate to Url on web (https://), another dialog flow (dialog:), this flow (#), or a custom command (command:) */
      OpenUrl = 'openurl',

      /** Submit choice */
      Submit = 'submit',

      /** Show another card, as a drop down on most interfaces */
      ShowCard = 'showcard'
    }
    /**
     * Action that defines an AdaptiveCard which is shown to the user when the button or link is clicked.
     * or that gathers input fields, merges with optional data field, and sends an event to the client. It is up to the client to determine how this data is processed. For example: With BotFramework bots, the client would send an activity through the messaging medium to the bot.",
     * or that when invoked, show the given url either by launching it in an external web browser or showing in-situ with embedded web browser.
     */
    export type action =
      | actionSubmit
      | actionOpenUrl
      | actionShowCard
      | actionGeneric
    interface actionGeneric extends ReactiveCards.JSX.actionGeneric {
      /**
       * Utterance hints that may be used in interpreting this action by NLP of host platform
       */
      utterances?: string[]
      /** Intent matches that may be used in interpreting this action by NLP of host platform */
      intents?: string[]
    }
    export interface actionSubmit extends actionGeneric {
      type: 'submit'
    }
    export interface actionOpenUrl extends actionGeneric {
      type: 'openurl'
      /**
       * Url that represents the locator of the resource to display or navigate to
       * Schemes include 'https://', 'flow://flow#dialog', or anchor element
       * ids '#other-dialog-anchor-id' of flow dialogs in parent flow
       * or a custom command (command:pause?delay=500)
       * */
      url?: string
    }
    export interface actionShowCard extends actionGeneric {
      type: 'showcard'
      /** Child card to display, usually as drop down but dependent on host interface capabilities */
      card?: card
    }
    /** Displays a text block */
    export interface text extends ReactiveCards.JSX.text {
      /** when <text> is used as a direct child of a <dialog> step, pause for n seconds after rendering */
      pause?: number
    }
    export type cardelement = ReactiveCards.JSX.cardelement
    /** Indicates whether there should be a visible separator (i.e. a line) between the element and its predecessor. If not specified, no separator is displayed. A separator will only be displayed if there is a preceding element. */
    export type separator = ReactiveCards.JSX.separator
    /** Displays a media player for audio or video content */
    export type media = ReactiveCards.JSX.media
    /** Defines a source for a Media element */
    export type mediasource = ReactiveCards.JSX.mediasource
    /** Displays an image */
    export type image = ReactiveCards.JSX.image
    /** The ImageSet displays a collection of Images similar to a gallery. */
    export type imageset = ReactiveCards.JSX.imageset
    /** Containers group items together. */
    export type container = ReactiveCards.JSX.container
    /** Describes a Fact in a FactSet as a key/value pair. */
    export type fact = ReactiveCards.JSX.fact
    /** The FactSet element displays a series of facts (i.e. name/value pairs) in a tabular form. */
    export type factset = ReactiveCards.JSX.factset
    /** Defines a container that is part of a ColumnSet */
    export type column = ReactiveCards.JSX.column
    /** ColumnSet divides a region into Columns, allowing elements to sit side-by-side. */
    export type columnset = ReactiveCards.JSX.columnset
    /** base properties of all input elements */
    export type inputbase = ReactiveCards.JSX.inputbase
    /** Lets a user choose a date. */
    export type dateinput = ReactiveCards.JSX.dateinput
    /** Lets a user select a time. */
    export type timeinput = ReactiveCards.JSX.timeinput
    /** Allows a user to enter a number */
    export type numberinput = ReactiveCards.JSX.numberinput
    /** Lets a user enter text. */
    export type textinput = ReactiveCards.JSX.textinput
    /** Lets a user choose between two options. */
    export type toggleinput = ReactiveCards.JSX.toggleinput
    /** Lets a user choose between two options. */
    export type genericinput = ReactiveCards.JSX.genericinput
    /** Allows a user to input a date, time, number, text, option or choice */
    export type input = ReactiveCards.JSX.input
    /** Allows a user to input a Choice. */
    export type choiceset = ReactiveCards.JSX.choiceset
    /** Describes a choice for use in a ChoiceSet. */
    export type choice = ReactiveCards.JSX.choice
  }
}
