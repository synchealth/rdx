import { rdx } from '@rdx-js/rdx'
import { transform } from 'sucrase'

export default async function rdxAsync(src, filename) {
  const interim: any = await rdx(src, {
    skipImport: true,
    skipExport: true,
    filename
  })
  const { code } = transform(interim, {
    jsxPragma: 'h',
    production: true,
    transforms: ['typescript', 'imports', 'jsx']
  })
  if (!code) {
    return code
  }
  const newCode = `return ${code.substr(
    '"use strict";/** @jsx h */\n\n'.length
  )}`
  return newCode
}
