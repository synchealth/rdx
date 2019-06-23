const fluent_1 = require('@berun/fluent')
const Plugin_1 = require('./Plugin')
class Rdx extends fluent_1.FluentMap {
  constructor(parent = null, name = null) {
    super(parent, name)
    this.mdPlugins = new fluent_1.FluentMap(this)
    this.hastPlugins = new fluent_1.FluentMap(this)
    this.extendfluent()
  }
  plugin(name, use, opts) {
    if (!this.mdPlugins.has(name)) {
      this.mdPlugins.set(name, new Plugin_1.Plugin(this, name))
    }
    const plugin = this.mdPlugins.get(name)
    if (use) plugin.use(use, opts)
    else plugin.use(name)
    return plugin
  }
  hast(name, use, opts) {
    if (!this.hastPlugins.has(name)) {
      this.hastPlugins.set(name, new Plugin_1.Plugin(this, name))
    }
    const plugin = this.hastPlugins.get(name)
    if (use) plugin.use(use, opts)
    else plugin.use(name)
    return plugin
  }
  toConfig(omit = []) {
    return Object.assign(
      super.toConfig(omit.concat(['mdPlugins', 'hastPlugins'])) || {},
      this.clean({
        mdPlugins: this.mdPlugins.values().map(p => p.toConfig()),
        hastPlugins: this.hastPlugins.values().map(p => p.toConfig())
      })
    )
  }
  merge(obj, omit = []) {
    if (!obj) return this
    if (!omit.includes('mdPlugins') && 'mdPlugins' in obj) {
      Object.keys(obj.mdPlugins).forEach(name =>
        this.plugin(name).merge(obj.mdPlugins[name])
      )
    }
    if (!omit.includes('hastPlugins') && 'hastPlugins' in obj) {
      Object.keys(obj.bundle).forEach(name =>
        this.hast(name).merge(obj.hastPlugins[name])
      )
    }
    return super.merge(obj, [...omit, 'mdPlugins', 'hastPlugins'])
  }
}
exports.Rdx = Rdx
