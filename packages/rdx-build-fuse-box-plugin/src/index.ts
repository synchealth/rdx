import { WorkFlowContext, File, Plugin } from 'fuse-box'
const rdx = require('@rdx-js/rdx')

export interface RDXPluginOptions {
  remarkPlugins?: any[]
  rehypePlugins?: any[]
}

export class FuseBoxRDXPlugin implements Plugin {
  public test: RegExp = /\.(md|rdx)$/

  public options: RDXPluginOptions = {
    remarkPlugins: [],
    rehypePlugins: []
  }

  constructor(opts: RDXPluginOptions = {}) {
    this.options = Object.assign(this.options, opts)
  }

  public init(context: WorkFlowContext) {
    context.allowExtension('.md')
    context.allowExtension('.rdx')
  }

  public async transform(file: File) {
    const context = file.context

    if (context.useCache) {
      if (file.loadFromCache()) {
        return
      }
    }

    file.loadContents()

    const result = await rdx(file.contents, this.options)

    file.contents = result
  }
}

export const RDXPlugin = (options?: RDXPluginOptions) => {
  return new FuseBoxRDXPlugin(options)
}
