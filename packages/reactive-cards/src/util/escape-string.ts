const ESCAPE_REGEXP = /["&<>]/g

const ESCAPE_MAP = {
  '"': '&quot;',
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
}

function escapeChar(char) {
  return ESCAPE_MAP[char]
}

export default function escapeString(value) {
  if (!ESCAPE_REGEXP.test(value)) {
    return value
  }

  return String(value).replace(ESCAPE_REGEXP, escapeChar)
}
