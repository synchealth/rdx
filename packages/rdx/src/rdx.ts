// Third Party Remark Plugins (to MDAST)
import toMDAST from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkSqueeze from 'remark-squeeze-paragraphs'

// Custom RDX Remark Plugins (to RDAST)
import toRDAST, {
  mdJsxComments,
  mdJsxImportExport,
  mdJsxTemplateVariables
} from '@rdx-js/language-md-mdast'

// Convert RDAST to RDHAST (Remark -> Rehype)
import hastFormat from 'rehype-format'
import unified from 'unified'
import toRDHAST from './rdx-mdast-to-rdhast'
import compactDialogs from './rdx-rdhast-dialog-compact'

// Custom RDX Rehype Compilers
import { compile as toJSX } from './rdx-rdhast-to-jsx'

const DEFAULT_OPTIONS = {
  footnotes: true,
  remarkPlugins: [],
  rehypePlugins: [],
  compilers: []
}

export function createRdxCompiler(options) {
  const { remarkPlugins } = options
  const plugins = remarkPlugins

  //
  // PARSE WITH REMARK AND PLUGINS FOR MDAST / RDAST
  //
  const fn = unified()
    .use(toMDAST)
    .use(mdJsxComments)
    .use(mdJsxImportExport)
    .use(mdJsxTemplateVariables)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkSqueeze)
    .use(toRDAST, options)

  plugins.forEach(plugin => {
    if (Array.isArray(plugin) && plugin.length > 1) {
      fn.use(plugin[0], plugin[1])
    } else {
      fn.use(plugin)
    }
  })

  //
  // CONVERT TREE FROM RDAST TO RDHAST
  //

  fn.use(toRDHAST, options)
  fn.use(compactDialogs)
  fn.use(hastFormat)

  //
  // PROCESS WITH REHYPE PLUGINS FOR HAST / RDHAST
  //

  const { rehypePlugins } = options
  const { compilers } = options

  rehypePlugins.forEach(plugin => {
    // Handle [plugin, pluginOptions] syntax
    if (Array.isArray(plugin) && plugin.length > 1) {
      fn.use(plugin[0], plugin[1])
    } else {
      fn.use(plugin)
    }
  })

  //
  // COMPILE RDHAST TREE TO JSX STRING OR WITH OTHER COMPILERS
  //

  fn.use(toJSX, options)

  compilers.forEach(compilerPlugin => {
    fn.use(compilerPlugin, options)
  })

  return fn
}

export function rdxSync(rdx, options) {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const compiler = createRdxCompiler(opts)

  const fileOpts: any = { contents: rdx }
  if (opts.filepath) {
    fileOpts.path = opts.filepath
  }

  const { contents } = compiler.processSync(fileOpts)
  return contents
}

export async function rdxAsync(rdx, options: any = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const compiler = createRdxCompiler(opts)

  const fileOpts: any = { contents: rdx }
  if (opts.filepath) {
    fileOpts.path = opts.filepath
  }

  const { contents } = await compiler.process(fileOpts)
  return contents
}
