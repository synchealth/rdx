import resolve from 'rollup-plugin-node-resolve'
import { rdxTranspiler, rdxPacker } from './index'
import sucrase from 'rollup-plugin-sucrase'
import renameExtensions from '@betit/rollup-plugin-rename-extensions'
import { terser } from 'rollup-plugin-terser'

const dist = 'dist'

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
},{
  preserveModules: true,
  input: './src/*.md',
  external,
  output: [
    {
      dir: `${dist}/esm`,
      format: 'esm'
    }
  ],
  plugins: [
    rdxPacker(),
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
}]