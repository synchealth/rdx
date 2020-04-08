import resolve from 'rollup-plugin-node-resolve'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'

export default {
  preserveModules: false,
  input: './src/index.ts',
  external: [],
  output: [
    {
      file: `dist/transpile.js`,
      format: 'esm'
    }
  ],
  plugins: [
    commonjs(),
    resolve(),
    json(),
    babel({
      babelrc: false,
      presets: [
        [
          require.resolve('@babel/preset-env'),
          {
            targets: {
              node: '8'
            }
          }
        ]
      ],
      plugins: [require.resolve('@babel/plugin-transform-typescript')],
      highlightCode: true,
      compact: true,
      extensions: [...DEFAULT_EXTENSIONS, 'ts', 'tsx']
    })
    // terser()
  ]
}
