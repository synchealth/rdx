import Berun from '@berun/berun'

/**
 * TDX Loader
 */
export const ruleMainDocs = (berun: Berun) => {
  const main = berun.webpack.module.rule('main')

  if (main.oneOfs.has('static')) {
    main.oneOf('static').exclude.add(/\.(?:md|rdx)$/)
  }

  main
    .oneOf('markdown')
    .test(/(\.(?:md|rdx))$/)
    .include.merge([berun.options.paths.appPath])
    .end()
    .exclude.add(/node_modules/)
    .end()
    .use('babel')
    .loader(require.resolve('babel-loader'))
    .options({
      /* placeholder */
    })
    .end()
    .use('rdx')
    .loader(require.resolve('@rdx-js/build-webpack-loader'))
    .options({
      /* placeholder */
    })
    .end()
}
