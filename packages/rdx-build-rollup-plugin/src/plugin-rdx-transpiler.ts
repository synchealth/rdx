import { rdxSync } from '@rdx-js/rdx'
import { createFilter } from '@rollup/pluginutils'
import * as path from 'path'
import * as fs from 'fs-extra'

export interface RdxTranspilerOptions {
  remarkPlugins?: any[]
  rehypePlugins?: any[]
  include?: string[]
  exclude?: string[]
  fileRegex?: RegExp
  writeManifest?: boolean
  manifestMerge?: boolean
  manifestFilename?: string
  manifestTransformPackageJson?: (content: any) => any
  manifestPackageJson?: string
  manifestOutputPath?: string
  manifestFilter?: (meta: any) => boolean
  manifestMap?: (meta: any, id: string) => any
  manifestMapId?: (meta: any) => string
  manifestSerialize?: (manifest: object) => string
}

export default function rdxTranspilerWithMeta(
  pluginOptions: RdxTranspilerOptions = {}
) {
  const filter = createFilter(
    pluginOptions.include || ['**/*.md'],
    pluginOptions.exclude
  )
  const fileRegex = pluginOptions.fileRegex
    ? pluginOptions.fileRegex
    : /\.(md|rdx)$/
  const manifest: any = {}
  return {
    name: 'rdx',
    transform(code, id) {
      if (!fileRegex.test(id)) {
        return null
      }
      if (!filter(id)) {
        return null
      }

      const { content: result, meta } = rdxSync(code, {})

      const {
        writeManifest,
        manifestFilter = (meta: any) => true,
        manifestMap = (meta: any) => {
          const newMeta = meta
          delete newMeta.id
          newMeta.originalSource = path.relative(process.cwd(), id)
          return newMeta
        },
        manifestMapId = (meta: any) => meta.id
      } = (pluginOptions || {}) as RdxTranspilerOptions

      if (writeManifest && manifestFilter(meta)) {
        manifest[manifestMapId(meta)] = manifestMap(meta, id)
      }

      return {
        code: result,
        map: { mappings: '' }
      }
    },
    async generateBundle(options, bundle) {
      const {
        writeManifest,
        manifestMerge,
        manifestFilename = 'manifest.json',
        manifestTransformPackageJson = (pkg: any) => ({
          created: new Date().toISOString(),
          packageName: pkg.name,
          version: pkg.version,
          description: pkg.description,
          author: pkg.author && pkg.author.name ? pkg.author.name : pkg.author
        }),
        manifestPackageJson = 'package.json',
        manifestOutputPath,
        manifestSerialize = (manifest: any) => JSON.stringify(manifest, null, 2)
      } = (pluginOptions || {}) as RdxTranspilerOptions

      if (writeManifest) {
        let targetDir: string | undefined
        if (manifestOutputPath) {
          targetDir = manifestOutputPath
        } else if (options.dir) {
          targetDir = options.dir
        } else if (options.file) {
          targetDir = path.dirname(options.file)
        }

        if (!targetDir) {
          throw new Error(
            'Please set outputPath, so we can know where to place the manifest.json file'
          )
        }

        const workspace = process.cwd()
        const filePathManifest = path.resolve(
          workspace,
          targetDir,
          manifestFilename
        )
        const filePathPackage = path.resolve(workspace, manifestPackageJson)

        let seed
        try {
          seed = manifestTransformPackageJson(
            await readJSON(filePathPackage, { encoding: 'utf-8' })
          )
        } catch (e) {
          seed = {}
        }

        if (manifestMerge) {
          try {
            seed = {
              ...(await readJSON(filePathManifest, { encoding: 'utf-8' })),
              ...seed
            }
          } catch (e) {
            /** noop */
          }
        }

        seed = {
          ...seed,
          dialogs: {
            ...seed.dialogs,
            ...manifest
          }
        }

        const manifestStr = manifestSerialize(seed)

        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true })
        }
        await fs.writeFile(filePathManifest, manifestStr)
      }
    }
  }
}

export async function readJSON<T = object>(
  path: string,
  option: {
    encoding?: string | null | undefined
    flag?: string | undefined
  } = { encoding: 'utf-8', flag: 'r' }
) {
  const content = await fs.readFile(path, option)
  const json: T = JSON.parse(content as string)
  return json
}
