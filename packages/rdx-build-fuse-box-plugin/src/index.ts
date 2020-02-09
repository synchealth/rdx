/* eslint-disable class-methods-use-this */
import { WorkFlowContext, File, Plugin } from 'fuse-box'

import { rdx } from '@rdx-js/rdx'

export interface RDXPluginOptions {
  remarkPlugins?: any[]
  rehypePlugins?: any[]
}

export class FuseBoxRDXPlugin implements Plugin {
  public test = /\.(md|rdx)$/

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
    const { context } = file

    if (context.useCache) {
      if (file.loadFromCache()) {
        return
      }
    }

    file.loadContents()

    const result = await rdx(file.contents, this.options)

    file.contents = result.toString()
  }
}

export const RDXPlugin = (options?: RDXPluginOptions) => {
  return new FuseBoxRDXPlugin(options)
}
