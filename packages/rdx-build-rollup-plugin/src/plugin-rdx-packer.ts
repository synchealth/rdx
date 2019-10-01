import matched from 'matched'

declare const require: any, process: any;

const path = require('path')
const entry = path.resolve(process.cwd(), './src/index.js');
const { name } = require(path.resolve(process.cwd(), './package.json'))

export default function rdxPacker() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var include = [];
  var exclude = [];

  var importer = function importer(path) {
    const id = path.replace(/^.*[\\\/]/, '').replace(/  /, ' ').replace(/.md$/, '').replace(/\([0-9]+\)/g, '').replace(/\./g,'-').toLowerCase()
    const idCamel = id.replace(/[_\-\s]([a-z0-9])/g, function (g) { return g[1].toUpperCase(); });
    return `import { meta as meta_${idCamel}, rdx as rdx_${idCamel} } from ${JSON.stringify(path)};`;
  };

  var exporter = function exporter(path) {
    const id = path.replace(/^.*[\\\/]/, '').replace(/  /, ' ').replace(/.md$/, '').replace(/\([0-9]+\)/g, '').replace(/\./g,'-').toLowerCase()
    const idCamel = id.replace(/[_\-\s]([a-z0-9])/g, function (g) { return g[1].toUpperCase(); });
    return `  "${id}": { meta: meta_${idCamel}, rdx: rdx_${idCamel} }`
  };

  function configure(config) {
    if (typeof config === 'string') {
      include = [config];
    } else if (Array.isArray(config)) {
      include = config;
    } else {
      include = config.include || [];
      exclude = config.exclude || [];
    }
  }

  if (config) {
    configure(config);
  }

  return {
    options(options) {
      if (options.input && options.input !== entry) {
        configure(options.input);
      }

      options.input = entry;
    },

    resolveId(id) {
      if (id === entry) {
        return entry;  // this signals that rollup should not ask other plugins or check the file system to find this id
      }
    },

    load(id) {
      console.log(id)
      if (id === entry) {
        if (!include.length) {
          return Promise.resolve('');
        }

        var patterns = include.concat(exclude.map(function (pattern) {
          return '!' + pattern;
        }));

        console.log(patterns)
        return matched.promise(patterns, {
          realpath: true
        }).then(function (paths) {
          const result = `${paths.map(importer).join('\n')}
        
export const pack = {
${paths.map(exporter).join(',\n')}
}

export function usePack(app) {
    const reactivedialogs = app.reactivedialogs;
    Object.keys(pack).forEach(id => {
      pack[id].meta.nkar = "${name}.nkar"
      reactivedialogs.use(pack[id].rdx, pack[id].meta )
    })
}

export default usePack`

          console.log(result)

          return result
        });
      }
      return null; // other ids should be handled as usually
    }

  };

}
