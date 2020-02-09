/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import { Rdx, BerunRdx } from './rdx-berun-fluent'

export default (berun: BerunRdx, options = {}) => {
  if (!('webpack' in berun) && !('fusebox' in berun)) {
    throw new Error(
      'MD, RDX files only supported by webpack or fuse-box runners currently'
    )
  }

  berun
    .use(Rdx)
    .rdx.plugin(require('remark-emoji'))
    .end()
    .plugin(require('remark-images'))
    .end()

  berun
    .when('webpack' in berun, (_berun: BerunRdx) =>
      _berun.use(require('./webpack-preset'), options)
    )
    .when('fusebox' in berun, (_berun: BerunRdx) =>
      _berun.use(require('./fuse-box-preset'), options)
    )
}
