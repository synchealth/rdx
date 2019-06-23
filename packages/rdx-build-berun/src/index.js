'use strict'

const { Rdx } = require('./rdx-berun-fluent')

module.exports = (berun, options = {}) => {
  if (!('webpack' in berun) && !('fusebox' in berun))
    throw new Error(
      'MD, RDX files only supported by webpack or fuse-box runners currently'
    )

  berun
    .use(Rdx)
    .rdx.plugin(require('remark-emoji'))
    .end()
    .plugin(require('remark-images'))
    .end()

  berun
    .when('webpack' in berun, berun =>
      berun.use(require('./webpack-preset'), options)
    )
    .when('fusebox' in berun, berun =>
      berun.use(require('./fuse-box-preset'), options)
    )
}

module.exports.presetRdx = module.exports
