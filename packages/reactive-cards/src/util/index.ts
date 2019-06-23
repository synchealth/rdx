export function toAbsoluteUrl(relative: string, base: string) {
  var stack = base.split('/'),
    parts = relative.split('/')

  if (parts[0] == 'local') {
    return relative
  }

  if (parts[0] == '' && parts[1] == 'local') {
    return relative.replace(/^\//, '')
  }

  for (var i = 0; i < parts.length; i++) {
    if (parts[i] == '.') continue
    if (parts[i] == '..') stack.pop()
    else stack.push(parts[i])
  }
  return stack.join('/')
}
