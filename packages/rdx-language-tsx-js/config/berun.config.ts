import webpack from '@berun/runner-webpack'
import jestRunner from '@berun/runner-jest'
import polyfills from '@berun/runner-web-polyfills'
import { Babel } from '@berun/fluent-babel'
import { BerunRdx } from '../../rdx-build-berun/src/rdx-berun-fluent'

export default {
  use: [
    require.resolve('@berun/runner-prettier'),

    (berun: BerunRdx, options: { ISPRODUCTION?: boolean } = {}) => {
      const ISPRODUCTION =
        options.ISPRODUCTION || process.env.NODE_ENV === 'production'
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
            require.resolve('@babel/preset-env'),
            {
              targets: {
                node: '8'
              }
            }
          ]
        ],
        plugins: [
          require.resolve('@babel/plugin-transform-typescript'),
          require.resolve('@babel/plugin-transform-modules-commonjs')
        ],
        highlightCode: true,
        compact: !!ISPRODUCTION
      })

      berun.babel
        .plugin(require.resolve('@babel/plugin-proposal-decorators'))
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

    (berun: BerunRdx) => {
      berun.webpack.optimization.splitChunks({}).runtimeChunk(false)

      berun.webpack.output.filename('[name].js')
    }
  ]
}
