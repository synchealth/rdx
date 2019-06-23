# Content transformation utilities for Reactive Cards

## RHAST (ReactiveCards Html-like Abstract Syntax Tree)

> RHAST is to JSX as HAST is to HTML

Similar to HAST in the Unified collected, RHAST adds JSX Code elements in addition to text and native elements

Utilities included

- RHAST to JSX (creates raw JSX string output)
- RHAST to Hyperscript code (like a JSX transpiler)
- JSX to RHAST (a fast, tiny javascript-based JSX parser)

## RCAST (Reactive Cards Abstract Syntax Tree)

> RCAST is to Reactive Cards JSX as ReactElement is to React JSX

Similar to Reacts internal virtual dom, RCAST is an abstract syntax tree that

- has a `type` as the tagName (or function) of every element
- has a `props` bag (equivalent to `properties` in RHAST, HAST)
- has the `children` listed in the `props` bag instead of separately

Utilities included:

- JSX to RCAST (a fast, tiny javascript-based JSX parser)
- RCAST to RHAST
- Adaptive Cards JSON to RCAST (a simple re-export of `ReactiveCards.createFromObject`)
- RCAST to Adaptive Cards JSON (a simple re-export of `ReactiveCards.render`)

## Dependencies

Each of these utilities is intended to be a tiny javascript transformer that can be used on its own or plugged into frameworks like Unified

The only transformer with an external dependency is the RHAST to JSX formatter, that uses a similarly tiny `rhype-format` to prettify the abstract syntax tree with additional line breaks and spaces before formatting
