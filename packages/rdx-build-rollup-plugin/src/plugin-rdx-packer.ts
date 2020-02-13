import matched from 'matched'

declare const require: any
declare const process: any

const path = require('path')

const cwd = process.cwd()
const entry = path.resolve(cwd, './src/index.js')
const { name, version } = require(path.resolve(process.cwd(), './package.json'))

export default function rdxPacker(...args) {
  const config = args.length > 0 && args[0] !== undefined ? args[0] : null
  let include = []
  let exclude = []

  const importer = function importer(path) {
    const id = path
      .replace(/^.*[\\/]/, '')
      .replace(/ {2}/, ' ')
      .replace(/.md$/, '')
      .replace(/\([0-9]+\)/g, '')
      .replace(/\./g, '-')
      .toLowerCase()
    const idCamel = id.replace(/[_\-\s]([a-z0-9])/g, match => {
      return match[1].toUpperCase()
    })
    return `import { meta as meta_${idCamel}, rdx as rdx_${idCamel} } from ${JSON.stringify(
      path
    )};`
  }

  const exporter = function exporter(path) {
    const id = path
      .replace(/^.*[\\/]/, '')
      .replace(/ {2}/, ' ')
      .replace(/.md$/, '')
      .replace(/\([0-9]+\)/g, '')
      .replace(/\./g, '-')
      .toLowerCase()
    const idCamel = id.replace(/[_\-\s]([a-z0-9])/g, match => {
      return match[1].toUpperCase()
    })
    return `  "${id}": { meta: meta_${idCamel}, rdx: rdx_${idCamel} }`
  }

  function configure(config) {
    if (typeof config === 'string') {
      include = [config]
    } else if (Array.isArray(config)) {
      include = config
    } else {
      include = config.include || []
      exclude = config.exclude || []
    }
  }

  if (config) {
    configure(config)
  }

  return {
    options(options) {
      if (options.input && options.input !== entry) {
        configure(options.input)
      }

      options.input = entry
    },

    resolveId(id) {
      if (id === entry) {
        return entry // this signals that rollup should not ask other plugins or check the file system to find this id
      }
      return undefined
    },

    load(id) {
      console.log(path.relative(cwd, id))
      if (id === entry) {
        if (!include.length) {
          return Promise.resolve('')
        }

        const patterns = include.concat(
          exclude.map(pattern => {
            return `!${pattern}`
          })
        )

        return matched
          .promise(patterns, {
            realpath: true
          })
          .then(paths => {
            const result = `${paths.map(importer).join('\n')}
        
export const pack = {
${paths.map(exporter).join(',\n')}
}

export function usePack(app) {
    app.properties["rdx.Version"] = app.properties["rdx.Version"] || {};
    app.properties["rdx.Version"]["${name}"] = "${version}";
    const reactivedialogs = app.reactivedialogs;
    Object.keys(pack).forEach(id => {
      pack[id].meta.nkar = "${name}.nkar"
      reactivedialogs.use(pack[id].rdx, pack[id].meta )
    })
}

export default usePack`

            return result
          })
      }
      return null // other ids should be handled as usually
    }
  }
}
