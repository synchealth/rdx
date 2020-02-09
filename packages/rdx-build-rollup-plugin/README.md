# rdx-build-rollup-plugin

Rollup Plugin to process rdx and markdown files

## RDX Transpiler Plugin

Simple wrapper around `@rdx-js/rdx` converts `.md` and `.rdx` files to `.jsx`/`.tsx`

Use with sucrase or basbel to transpile the generated `.jsx`/`.tsx` to `.js`

### Usage in rollup configuration

```js
import { rdxTranspiler } from '@rdx-js/build-rollup-plugin'

// ...

plugins: [
  // :
  resolve(),
  rdxTranspiler(),
  renameExtensions({
    mappings: {
      '.md': '.js',
      '.rdx': '.js'
    }
  }),
  sucrase({
    jsxPragma: 'h',
    production: true,
    exclude: ['node_modules/**'],
    transforms: ['jsx', 'typescript']
  })
]
```

## RDX Packer Plugin

Simple aggregator that converts a dummy index.js in the source folder to a full index of all the transpiled markdown files, including meta data. Creates a single IOPA function that when called registers itself with the Reactive Dialogs manager.

### Required Source Repository structure

```
/
/assets
   image1.jpg
   video1.mp4
markdownfile1.md
markdownfile2.rdx
index.js
global.d.ts
```

```js
// global.d.ts
declare module "*.md" {
  const value: string;
  export default value;
  export const meta;
}

declare module "*.rdx" {
  const value: string;
  export default value;
  export const meta;
}
```

```js
// index.ts
// placeholder, replaced with index during rollup phase
```

### Rollup configuration

```js
import { rdxPacker } from '@rdx-js/build-rollup-plugin'

// import other plugins

const dist = 'dist'
const build = 'build'

const external = id =>
  !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('\0')

export default [{
  preserveModules: true,
  input: './src/*.md',
  external,
  output: [
    {
      dir: `${dist}/cjs`,
      format: 'cjs',
      exports: 'named'
    }
  ],
  plugins: [
    rdxPacker(),
    resolve({
      extensions: ['.js', '.ts' ]
    }),
    rdxTranspiler(),
    renameExtensions({
      mappings: {
        '.md': '.js',
        '.rdx': '.js'
      }
    }),
    sucrase({
      jsxPragma: 'h',
      production: true,
      exclude: ['node_modules/**'],
      transforms: ['jsx', 'typescript']
    }),
    terser()
  ]
}

```

### License

MIT
