# HTML handlers

This folder contains the original HAST handlers for HTML markup. It is not
included by default in the main exports, but included here for ease of
reference; they have already converted to Typescript

## Usage

```js
import { default as toHAST, footer } from '@rdx-js/language-mdast-hast/src/html'
import { default as HTML, footer } from '@rdx-js/language-mdast-hast/src/html'

const hast = toHAST(tree, {
  HTML,
  allowDangerousHTML: true,
  footer
})
```
