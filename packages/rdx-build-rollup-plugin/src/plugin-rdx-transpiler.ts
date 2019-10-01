import { rdxSync } from '@rdx-js/rdx'
import { createFilter } from 'rollup-pluginutils'

export interface RDXPluginOptions {
  remarkPlugins?: any[]
  rehypePlugins?: any[]
}

export default function rdxTranspiler(options: any = {}) {
  const filter = createFilter(options.include || ['**/*.md'], options.exclude)
  const fileRegex = options.fileRegex ? options.fileRegex : /\.(md|rdx)$/
  return {
    name: 'rdx',
    transform(code, id) {
      if (!fileRegex.test(id)) {
        return null
      }
      if (!filter(id)) return null

      const result = rdxSync(code, {})

      return {
        code: result,
        map: { mappings: '' }
      }
    }
  }
}
