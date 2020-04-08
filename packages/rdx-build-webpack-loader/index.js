// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getOptions } = require('loader-utils')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { rdx } = require('@rdx-js/rdx')

module.exports = async content => {
  const callback = this.async()
  const options = { ...getOptions(this), filepath: this.resourcePath }
  let result

  try {
    result = await rdx(content, options).content
  } catch (err) {
    return callback(err)
  }

  return callback(null, result)
}
