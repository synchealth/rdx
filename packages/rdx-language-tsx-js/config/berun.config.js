const webpack = require('@berun/runner-webpack')
const jestRunner = require('@berun/runner-jest')
const polyfills = require('@berun/runner-web-polyfills')

const Babel = require('@berun/fluent-babel').Babel

module.exports = {
  use: [
    '@berun/runner-prettier',

    (berun, options = {}) => {
      const ISPRODUCTION = process.env.NODE_ENV == 'production'
      console.log(
        berun.options.paths.isTypeScript
          ? 'TypeScript Project'
          : 'JavaScript Project'
      )

      berun.use(Babel)

      berun.babel.merge({
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
        plugins: [
          '@babel/plugin-transform-typescript',
          '@babel/plugin-transform-modules-commonjs'
        ],
        highlightCode: true,
        compact: options.ISPRODUCTION ? true : false
      })

      berun.babel
        .plugin('@babel/plugin-proposal-decorators')
        .options({ legacy: true })
        .end()

      berun
        .use(webpack)
        .use(jestRunner)
        .use(polyfills)
        .when(ISPRODUCTION, b => b.use(webpack.terser))
        .use(webpack.ruleParser)
        .use(webpack.ruleMjs)
        .use(webpack.ruleMainCompile)
        .use(webpack.ruleMainStatic)
        .use(webpack.pluginPackageInfo)
        .use(webpack.pluginProgressBar)
        .use(webpack.pluginModuleNotFound)
        .when(ISPRODUCTION && berun.options.paths.isTypeScript, b =>
          b.use(webpack.pluginForkTsChecker)
        )

      berun.sparky.task('build', webpack.taskProd)
    },

    berun => {
      const ISPRODUCTION = process.env.NODE_ENV == 'production'

      berun.webpack.optimization.splitChunks({}).runtimeChunk(false)

      berun.webpack.output.filename('[name].js')
    }
  ]
}
