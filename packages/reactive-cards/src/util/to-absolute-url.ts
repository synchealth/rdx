export function toAbsoluteUrl(relative: string, base: string) {
  const stack = base.replace(/\/$/, '').split('/')
  const parts = relative.split('/')

  if (parts[0] === 'local') {
    return relative
  }

  if (parts[0] === '' && parts[1] === 'local') {
    return relative.replace(/^\//, '')
  }

  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === '.') {
      // eslint-disable-next-line no-continue
      continue
    }
    if (parts[i] === '..') {
      stack.pop()
    } else {
      stack.push(parts[i])
    }
  }
  return stack.join('/')
}
