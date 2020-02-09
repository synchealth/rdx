import { ruleMainDocs } from './webpack-rule'
import { BerunRdx } from './rdx-berun-fluent'

export default (berun: BerunRdx) => {
  if (!('webpack' in berun)) {
    throw new Error('Missing webpack configuration')
  }

  berun.use(ruleMainDocs)

  const _webpackOldToConfig = berun.webpack.toConfig
  berun.webpack.toConfig = (...rest) => {
    const _ = _webpackOldToConfig.call(berun.webpack, ...rest)

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

    return _webpackOldToConfig.call(berun.webpack, ...rest)
  }
}
