const RDX = require('./Rdx')

exports.TdxConfig = RDX.Rdx

exports.Rdx = berun => {
  berun.rdx = new RDX.Rdx()
}
