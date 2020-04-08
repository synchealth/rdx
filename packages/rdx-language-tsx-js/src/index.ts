import { rdx } from '@rdx-js/rdx'
import { transform } from 'sucrase'

export default async function rdxAsync(src, filename) {
  const { content: interim, meta } = await rdx(src, {
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
    return { content: code, meta }
  }
  const newCode = `return ${code.substr(
    '"use strict";/** @jsx h */\n\n'.length
  )}`
  return { content: newCode, meta }
}
