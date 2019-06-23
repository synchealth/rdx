const { ruleMainDocs } = require('./webpack-rule')

module.exports = (berun, options = {}) => {
  if (!('webpack' in berun)) throw new Error('Missing webpack configuration')

  berun.use(ruleMainDocs)

  const _webpackOldToConfig = berun.webpack.toConfig
  berun.webpack.toConfig = () => {
    const _ = _webpackOldToConfig.call(berun.webpack, ...arguments)

    const main = berun.webpack.module.rule('main')

    if (main.oneOfs.has('markdown')) {
      main
        .oneOf('markdown')
        .use('babel')
        .options(berun.babel.toConfig())
        .end()
        .use('rdx')
        .options(berun.rdx.toConfig())
    }

    return _webpackOldToConfig.call(berun.webpack, ...arguments)
  }
}
