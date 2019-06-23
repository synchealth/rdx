# `@rdx-js/build-webpack-loader`

Webpack loader for [RDX][].   Part of the Besync design system for digital conversations.

## Installation

[npm][]:

```sh
npm i -D @rdx-js/build-webpack-loader
```

## Usage

```js
// ...
module: {
  rules: [
    // ...
    {
      test: /\.[rdx|md]$/,
      use: [
        'babel-loader',
        '@rdx-js/build-webpack-loader'
      ]
    }
  ]
}
```

## License

[MIT][] © [Synchronous Health][] 

A Sync Health Labs innovation

<!-- Definitions -->

[mit]: license

[Synchronous Health]: https://sync.health

[rdx]: https://github.com/besync/rdx

[npm]: https://docs.npmjs.com/cli/install
