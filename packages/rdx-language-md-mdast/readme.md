# @besync/md-to-mdast

Reactive Dialogs (RDX) customizations of Markdown Parser

When used as a set of Unified plugs directly after `remark-parse`, this package parses an `.rdx` markdown file into MDAST format (with the RDX / JSX extensions)

Forked from `mdx-js/mdx`, converted to typescript, and much faster as it doesnt use `@babel/core`, pure javacript only, and with a better greedy html processor forked without change from Tinia Labs `tdx` implementation

## Installation

```sh
npm i -S @rdx-js/language-md-mdast
```

## Usage

```js
import unified from 'unified'
import toMDAST from 'remark-parse'
import {
  default as toRDAST,
  mdJsxComments,
  mdJsxImportExport,
  mdJsxTemplateVariables
} from '@rdx-js/language-md-mdast'

const fn = unified()
  .use(toMDAST, options)
  .use(mdJsxTemplateVariables)
  .use(mdJsxComments)
  .use(mdJsxImportExport)
  // include frontmatter and squeeze plugins here
  .use(toRDAST)
```

## License

MIT
