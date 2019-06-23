import { rdx } from '@rdx-js/rdx'
import { transform } from 'sucrase'

export default async function rdxAsync(src, filename) {
  const interim: any = await rdx(src, {
    skipImport: true,
    skipExport: true,
    filename
  })
  const code: any = transform(interim, {
    jsxPragma: 'h',
    production: true,
    transforms: ['typescript', 'imports', 'jsx']
  }).code
  if (!code) return code
  const new_code =
    'return ' + code.substr('"use strict";/** @jsx h */\n\n'.length)
  return new_code
}
