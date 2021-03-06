import { RDXPlugin } from '@rdx-js/build-fuse-box-plugin'
import { BabelPlugin } from '@berun/fuse-box-plugin-babel'
import babel from '@berun/runner-babel'
import { BerunRdx } from './rdx-berun-fluent'

export default (berun: BerunRdx, options = {}) => {
  if (!('fusebox' in berun)) {
    throw new Error('Missing fuse-box configuration')
  }

  // Add babel even if not used by Typescript
  if (!('babel' in berun)) {
    berun.use(babel)
  }

  berun.fusebox
    .pluginset('RDXset')
    .plugin('RDX')
    .use(RDXPlugin)
    .end()
    .plugin('Babel')
    .use(BabelPlugin, [
      /* placeholder */
    ])

  const _toConfig = berun.fusebox.toConfig
  berun.fusebox.toConfig = (omit = []) => {
    const _ = _toConfig.call(berun.fusebox, omit)

    if (berun.fusebox.plugins.has('RDXset')) {
      berun.fusebox
        .pluginset('RDXset')
        .plugin('RDX')
        .tap(() => berun.rdx.toConfig())
        .end()
        .plugin('Babel')
        .tap(() => ({
          extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.md', '.rdx'],
          limit2project: true,
          config: Object.assign(berun.babel.toConfig(), { ast: true })
        }))
    }

    return _toConfig.call(berun.fusebox, omit)
  }
}
