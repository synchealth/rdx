import resolve from 'rollup-plugin-node-resolve'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import json from 'rollup-plugin-json'

const dist = 'dist'

const external = id =>
  !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('\0')

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
    resolve(),
    json(),
    babel({
      babelrc: false,
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: '8'
            }
          }
        ]
      ],
      plugins: ['@babel/plugin-transform-typescript'],
      highlightCode: true,
      compact: true,
      extensions: [...DEFAULT_EXTENSIONS, 'ts', 'tsx']
    }),
    commonjs(),
    terser()
  ]
}
