import { rdxAsync as rdxDefault, rdxSync as rdxSyncDefault } from './rdx'

export function rdx(
  src: string,
  options: any = { skipImport: false, filename: undefined! as string }
) {
  return rdxDefault(src, {
    remarkPlugins: [
      require('remark-emoji'),
      require('remark-images'),
      require('remark-slug')
    ],
    rehypePlugins: [],
    ...options
  })
}

export function rdxSync(
  src,
  options: any = { skipImport: false, filename: undefined! as string }
) {
  return rdxSyncDefault(src, {
    remarkPlugins: [
      require('remark-emoji'),
      require('remark-images'),
      require('remark-slug')
    ],
    rehypePlugins: [],
    ...options
  })
}
