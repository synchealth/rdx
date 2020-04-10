/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable @typescript-eslint/interface-name-prefix */
export = ReactiveCards
export as namespace ReactiveCards

declare namespace ReactiveCards {
  function h(
    type: any,
    props: any,
    ...children: any[]
  ): {
    type: any
    props: any
  }
  type createElement = typeof h

  function cloneElement<T>(
    element: Element<T>,
    props: any,
    ...children: any[]
  ): {
    type: any
    props: any
  }

  function renderToObject(element: any, resourceRoot?: string): IAdaptiveCard
  function render(element: any, resourceRoot?: string): IAdaptiveCard
  function createFromObject(element: any): Element
  function setLocalResourceProtocolMapper(
    mapper: (partialUrl: string) => string
  ): void

  namespace util {
    function rcast2rhast(
      element: RCastNode
    ): RHastNode | RHastNode[] | RHastChild | null

    function rhast2jsx(tree: RHastElement): string
  }

  function toArray(
    x: any
  ): {
    type: string
    props: any
  }[]

  export const Children: {
    toArray: typeof toArray
  }

  type ElementConstructor<P> = (props: P) => Element | null

  interface Element<
    P = any,
    T extends string | ElementConstructor<any> =
      | string
      | ElementConstructor<any>
  > {
    type: T
    props: P
    key: string | number | null
  }

  // Reactive HAST -- with type: element and tagname and isolated children
  // Identical to HAST (see unifiedjs) but with addition RHastCode type

  type RHastChild = RHastElement | RHastText | string | number | RHastCode

  interface RHastCode {
    type: 'code'
    value: string
  }

  interface RHastElement {
    type: 'element'
    tagName: string
    properties: {
      [key: string]: string | number | RHastCode
    }
    children: RHastChild[]
  }

  interface RHastText {
    type: 'text'
    value: string | number | boolean
  }

  type RHastNode = RHastElement | RHastText | RHastChild

  // Reactive Cards AST -- with type as the tagname and  children in props
  // Pretty much the virtual dom model of reactive cards, but with strings for functions
  // Used primarily in editors

  type RCastChild = RCastElement | string | number | RCastCode

  type RCastCode = string

  interface RCastProps {
    children: RCastChild[]
    [key: string]: string | number | RCastCode | RCastChild[]
  }

  interface RCastElement {
    type: string | Function
    props: RCastProps
  }

  type RCastNode = RCastElement | RCastChild

  // Core Virtual dom of Reactive Cards

  type NodeArray = Array<Node>
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

  // OBJECT SCHEMA
  // Copyright (c) Microsoft Corporation. All rights reserved.
  // Licensed under the MIT License.
  export type Size = 'auto' | 'stretch' | 'small' | 'medium' | 'large'
  export type TextSize = 'small' | 'default' | 'medium' | 'large' | 'extraLarge'
  export type HorizontalAlignment = 'left' | 'center' | 'right'
  export type VerticalAlignment = 'top' | 'center' | 'bottom'
  export type Spacing =
    | 'none'
    | 'small'
    | 'default'
    | 'medium'
    | 'large'
    | 'extraLarge'
    | 'padding'
  export type TextWeight = 'lighter' | 'default' | 'bolder'
  export type TextColor =
    | 'default'
    | 'dark'
    | 'light'
    | 'accent'
    | 'good'
    | 'warning'
    | 'attention'
  export type ContainerStyle = 'default' | 'emphasis'
  export type ImageStyle = 'default' | 'person'

  export interface IAction {
    id: string
    title?: string
  }

  export interface ISubmitAction extends IAction {
    type: 'Action.Submit'
    data?: any
  }

  export interface IOpenUrlAction extends IAction {
    type: 'Action.OpenUrl'
    url: string
  }

  export interface IShowCardAction extends IAction {
    type: 'Action.ShowCard'
    card: IAdaptiveCard
  }

  export interface ICardElement {
    id?: string
    speak?: string
    horizontalAlignment?: HorizontalAlignment
    spacing?: Spacing
    separator?: boolean
    height?: 'auto' | 'stretch'
    [propName: string]: any
  }

  export interface IBackgroundImage {
    url: string
  }

  export interface ITextBlock extends ICardElement {
    type: 'TextBlock'
    size?: TextSize
    weight?: TextWeight
    color?: TextColor
    text: string
    isSubtle?: boolean
    wrap?: boolean
    maxLines?: number
  }

  export interface IContainer extends ICardElement {
    type: 'Container'
    backgroundImage?: IBackgroundImage | string
    style?: ContainerStyle
    verticalContentAlignment?: VerticalAlignment
    selectAction?: IAction
    items?: ICardElement[]
    bleed?: boolean
    minHeight?: string | number
  }

  export interface IColumn extends ICardElement {
    backgroundImage?: IBackgroundImage | string
    style?: ContainerStyle
    verticalContentAlignment?: VerticalAlignment
    selectAction?: IAction
    items?: ICardElement[]
    width?: number | 'auto' | 'stretch' | 'auto'
  }

  export interface IColumnSet extends ICardElement {
    type: 'ColumnSet'
    columns: IColumn[]
  }

  export interface IFact {
    title: string
    value: string
    speak?: string
  }

  export interface IFactSet extends ICardElement {
    type: 'FactSet'
    facts: IFact[]
  }

  export interface IImage extends ICardElement {
    type: 'Image'
    altText?: string
    selectAction?: IAction
    size?: Size
    style?: ImageStyle
    url: string
  }

  export interface IImageSet extends ICardElement {
    type: 'ImageSet'
    images: IImage[]
    size?: Size
  }

  export interface IInput extends ICardElement {
    id: string
    value?: string
  }

  export interface IDateInput extends IInput {
    type: 'Input.Date'
    min?: string
    max?: string
    placeholder?: string
  }

  export interface ITimeInput extends IInput {
    type: 'Input.Time'
    min?: string
    max?: string
    placeholder?: string
  }

  export interface INumberInput extends IInput {
    type: 'Input.Number'
    min?: number
    max?: number
    placeholder?: string
  }

  export interface ITextInput extends IInput {
    type: 'Input.Text'
    isMultiline?: boolean
    maxLength?: number
    placeholder?: string
  }

  export interface IToggleInput extends IInput {
    type: 'Input.Toggle'
    title: string
    valueOn?: string
    valueOff?: string
  }

  export interface IChoice {
    title: string
    value: string
  }

  export interface IChoiceSetInput extends IInput {
    type: 'Input.ChoiceSet'
    isMultiSelect?: boolean
    style?: 'expanded' | 'compact'
    placeholder?: string
    choices: IChoice[]
  }

  export interface IVersion {
    major: number
    minor: number
  }

  export interface IAdaptiveCard extends ICardElement {
    type: 'AdaptiveCard'
    version?: IVersion | string
    backgroundImage?: IBackgroundImage | string
    body?: (
      | ITextBlock
      | IImage
      | IImageSet
      | IFactSet
      | IColumnSet
      | IContainer
    )[]
    actions?: (ISubmitAction | IOpenUrlAction | IShowCardAction)[]
    style?: ContainerStyle
    minHeight?: string | number
    speak?: string
  }
}

declare global {
  export namespace ReactiveCards.JSX {
    /** Allows a user to input a date, time, number, text, option or choice */
    export interface IntrinsicElements {
      /** Root element in a Reactive (Adaptive) Card */
      card: card
      /** The card elements to show in the primary card region. */
      body: body
      /** The Actions to show in the card's action bar or within a container (v1.2+) */
      actionset: actionset
      /** action button to open a url, show a card, or send an event to the cot  */
      action: action
      /** Text shown when the client doesn't support the version specified (may contain markdown). */
      fallback: fallback
      /** Displays a media player for audio or video content */
      media: media
      /** Displays an image */
      image: image
      /** The ImageSet displays a collection of Images similar to a gallery. */
      imageset: imageset
      /** Displays a text block */
      text: text
      /** Containers group items together. */
      container: container
      /** ColumnSet divides a region into Columns, allowing elements to sit side-by-side. */
      columnset: columnset
      /** Defines a container that is part of a ColumnSet */
      column: column
      /** The FactSet element displays a series of facts (i.e. name/value pairs) in a tabular form. */
      factset: factset
      /** Describes a Fact in a FactSet as a key/value pair. */
      fact: fact
      /** Allows a user to input a date, time, number, text, option or choice */
      input: input
      /** Indicates whether there should be a visible separator (i.e. a line) between the element and its predecessor. If not specified, no separator is displayed. A separator will only be displayed if there is a preceding element. */
      separator: separator
      /** Defines a source for a Media element */
      mediasource: mediasource
      /** Describes a choice for use in a ChoiceSet. */
      choice: choice
      /** The text to speak on voice interfaces */
      speak: speak
    }

    /** Root element in a Reactive (Adaptive) Card */
    export interface card extends StyleAttributes<card> {
      type?: 'AdaptiveCard' | 'ReactiveCard' | string
      /** Schema version that this card requires. If a client is **lower** than this version, the `fallbackText` will be rendered. */
      version?: string
      /** JSON schema, usually http://adaptivecards.io/schemas/adaptive-card.json */
      $schema?: string
      /** An image to use as the background of the card. */
      backgroundImage?: string
      /** he 2-letter ISO-639-1 language used in the card. Used to localize any date/time functions. */
      lang?: string
      /** Style hint for the Card */
      style?: 'default' | 'emphasis'
      /** Specifies the minimum height of the card. */
      minHeight?: string

      [key: string]: any
    }
    /** The card elements to show in the primary card region. */
    export interface body {}
    /** Text shown when the client doesn't support the version specified (may contain markdown). */
    export interface fallback {}
    /** The text to speak on voice interfaces */
    export interface speak {}
    /** The Actions to show in the card's action bar or within a container (v1.2+) */
    export interface actionset {}
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
    interface actionGeneric {
      type: string
      // children = Label for button that represents this action.
      /** Optional icon to be shown on the action in conjunction with the label */
      iconUrl?: string
      /**
       * Initial data that input fields will be combined with. These are essentially 'hidden' properties."
       */
      data?: string | object
      [key: string]: any
    }
    export interface actionSubmit extends actionGeneric {
      type: 'submit'
    }
    export interface actionOpenUrl extends actionGeneric {
      /** Url that represents the locator of the resource to display or navigate to */
      url?: string
      type: 'openurl'
    }
    export interface actionShowCard extends actionGeneric {
      type: 'showcard'
      /** Child card to display, usually as drop down but dependent on host interface capabilities */
      card?: card
    }
    export interface cardelement {
      id?: string
      /** Controls the amount of spacing between this element and the preceding element. */
      spacing?:
        | 'none'
        | 'small'
        | 'default'
        | 'medium'
        | 'large'
        | 'extraLarge'
        | 'padding'
      /** Controls how elements are horizontally positioned within their container. */
      horizontalALignment?: 'left' | 'center' | 'right'
    }
    /** Indicates whether there should be a visible separator (i.e. a line) between the element and its predecessor. If not specified, no separator is displayed. A separator will only be displayed if there is a preceding element. */
    export interface separator {
      /** Specifies separator thickness. */
      thickness?: 'default' | 'thick'
      /** Specifies separator color */
      color?: 'default' | 'accent'
    }
    /** Displays a text block */
    export interface text {
      color?:
        | 'default'
        | 'dark'
        | 'light'
        | 'accent'
        | 'good'
        | 'warning'
        | 'attention'
      isSubtle?: boolean
      maxLines?: number
      size?: 'small' | 'default' | 'medium' | 'large' | 'extraLarge'
      weight?: 'lighter' | 'default' | 'bolder'
      wrap?: boolean
      // children = text to display
      [k: string]: any
    }
    /** Displays a media player for audio or video content */
    export interface media extends cardelement {
      poster?: string
      altText?: string
      [k: string]: any
    }
    /** Defines a source for a Media element */
    export interface mediasource {
      mimeType?: string
      url?: string
      [k: string]: any
    }
    /** Displays an image */
    export interface image {
      altText?: string
      size?: 'auto' | 'stretch' | 'small' | 'medium' | 'large'
      style?: 'default' | 'person'
      url: string
      [k: string]: any
    }
    /** The ImageSet displays a collection of Images similar to a gallery. */
    export interface imageset {
      /** Controls the approximate size of the image. The physical dimensions will vary per host. Specify `\"auto\"` for true image dimension, or `\"stretch\"` to force it to fill the container. */
      size?: 'auto' | 'stretch' | 'small' | 'medium' | 'large'
      [k: string]: any
    }
    /** Containers group items together. */
    export interface container extends cardelement {
      style?: 'default' | 'emphasis'
      verticalContentAlignment?: 'top' | 'center' | 'bottom'
      /** Determines whether the element should bleed through its parent’s padding */
      bleed?: boolean
      /** Specifies the background image  */
      backgroundImage?: string
      /** Specifies the minimum height of the container in pixels, like "80px" */
      minHeight?: string
      [k: string]: any
    }
    /** Describes a Fact in a FactSet as a key/value pair. */
    export interface fact {
      title: string
      value: string
      [k: string]: any
    }
    /** The FactSet element displays a series of facts (i.e. name/value pairs) in a tabular form. */
    export type factset = cardelement
    /** Defines a container that is part of a ColumnSet */
    export interface column extends cardelement {
      style?: 'default' | 'emphasis'
      width?: 'auto' | 'stretch' | number
      [k: string]: any
    }
    /** ColumnSet divides a region into Columns, allowing elements to sit side-by-side. */
    export interface columnset extends cardelement {
      [k: string]: any
    }
    /** base properties of all input elements */
    export interface inputbase extends cardelement {
      id: string
      value?: string
      [k: string]: any
    }
    /** Lets a user choose a date. */
    export interface dateinput extends inputbase {
      type: 'date'
      min?: string
      max?: string
      placeholder?: string
    }
    /** Lets a user select a time. */
    export interface timeinput extends inputbase {
      type: 'time'
      min?: string
      max?: string
      placeholder?: string
    }
    /** Allows a user to enter a number */
    export interface numberinput extends inputbase {
      type: 'number'
      min?: number
      max?: number
      placeholder?: string
    }
    /** Lets a user enter text. */
    export interface textinput extends inputbase {
      type: 'text'
      isMultiline?: boolean
      maxLength?: number
      placeholder?: string
      style?: 'text' | 'tel' | 'url' | 'email'
    }
    /** Lets a user choose between two options. */
    export interface toggleinput extends inputbase {
      type: 'toggle'
      title: string
      valueOn?: string
      valueOff?: string
    }
    /** Lets a user choose between two options. */
    export interface genericinput extends inputbase {
      type: string
      [k: string]: any
    }
    /** Allows a user to input a date, time, number, text, option or choice */
    export type input =
      | dateinput
      | timeinput
      | numberinput
      | textinput
      | toggleinput
      | choiceset
      | genericinput
    /** Allows a user to input a Choice. */
    export interface choiceset extends inputbase {
      type: 'choiceset'
      title: string
      isMultiSelect?: boolean
      style?: 'expanded' | 'compact'
      placeholder?: string
    }
    /** Describes a choice for use in a ChoiceSet. */
    export interface choice {
      value: string
      // children = title
      [k: string]: any
    }
  }
}
