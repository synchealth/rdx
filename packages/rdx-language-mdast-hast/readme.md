# @rdx-js/rdx

Reactive Dialogs (RDX) implementation for digital conversations using Remark. Forked from @tinialabs/tdx and @mdx-js/mdx with updated transpiler for whendo runtime

While the `rdx` specification is very similar to markdown and similar formats such as `mdx`, a different extension is used as the code in any code blocks may be executed. In addition the execution order of formats such as `mdx` are linear (a single document) where as a `rdx` module may be executed as an adaptive dialog over the series of many days. The specification also includes yaml front matter by default.

https://github.com/besync/rdx

## Installation

```sh
npm i -S @rdx-js/rdx
```

# @besync/md-to-mdast

Reactive Dialogs (RDX) implementation of Markdown Parser

This package parses an `.rdx` markdown file into MDAST format (modified for RDX / JSX extensions)

Forked from `mdx-js/mdx`, converted to typescript, and much faster as it doesnt use `@babel/core`, pure javacript only, and with a better greedy html processor forked without change from Tinia Labs `tdx` implementation

## Usage

```js
import unified from 'unified'
import {
  default as toMDAST,
  mdJsxComments,
  mdJsxImportExport,
  mdJsxTemplateVariables
} from '@rdx-js/language-md-mdast'
import { default as toHAST, wrap, all } from '@rdx-js/language-md-mdast'

function toRDHAST() {
  return (tree, _file) => {
    const handlers = {
      blockquote(h: H, node: MDAST.Blockquote & Parent) {
        return h(node, 'blockquote', wrap(all(h, node), true))
      }

      // include remaining handlers, see html folder for examples
    }

    const hast = toHAST(tree, {
      handlers,
      allowDangerousHTML: false,
      footer: undefined
    })

    return hast
  }
}

const fn = unified()
  .use(toMDAST, options)
  .use(mdJsxTemplateVariables)
  .use(mdJsxComments)
  .use(mdJsxImportExport)
  .use(toRDHAST) // PLACE THIS PACKAGE AFTER THE MDAST PARSERs

// add compiler and process
```

## License

MIT
