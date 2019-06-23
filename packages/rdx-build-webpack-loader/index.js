const {getOptions} = require('loader-utils')
const { rdx } = require('@rdx-js/rdx')

module.exports = async function(content) {
  const callback = this.async()
  const options = Object.assign({}, getOptions(this), {
    filepath: this.resourcePath
  })
  let result

  try {
    result = await rdx(content, options)
  } catch (err) {
    return callback(err)
  }

  return callback(null, result)
}