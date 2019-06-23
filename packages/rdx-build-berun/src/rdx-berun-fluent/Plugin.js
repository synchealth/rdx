const fluent_1 = require('@berun/fluent')

class Plugin extends fluent_1.OrderableMap {
  constructor(parent, name) {
    super(parent, name)
    this.options = fluent_1.FluentValue()
    this.extendfluent()
  }
  use(plugin, options = {}) {
    return this.set('plugin', plugin).set('options', options)
  }
  tap(f) {
    this.set('options', f(this.get('options') || {}))
    return this
  }
  merge(obj, omit = []) {
    if ('plugin' in obj) {
      this.set('plugin', obj.plugin)
    }
    if ('options' in obj) {
      this.set('options', obj.options)
    } else this.set('options', {})
    return super.merge(obj, [...omit, 'options', 'plugin'])
  }
  toConfig() {
    const options = this.get('options') || {}
    if (Object.keys(options).length === 0) return this.get('plugin')
    return [this.get('plugin'), options]
  }
}
exports.Plugin = Plugin
