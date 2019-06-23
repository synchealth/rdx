export function toArray(x): { type: string; props: any }[] {
  if (Array.isArray(x)) {
    return x.flat()
  } else {
    return [x]
  }
}

if (!Array.prototype.flat) {
  Object.defineProperty(Array.prototype, 'flat', {
    enumerable: false,
    value: function() {
      var depth = arguments[0]
      depth = depth === undefined ? 1 : Math.floor(depth)
      if (depth < 1) return Array.prototype.slice.call(this)
      return (function flat(arr, depth) {
        var len = arr.length >>> 0
        var flattened: any[] = []
        var i = 0
        while (i < len) {
          if (i in arr) {
            var el = arr[i]
            if (Array.isArray(el) && depth > 0)
              flattened = flattened.concat(flat(el, depth - 1))
            else flattened.push(el)
          }
          i++
        }
        return flattened
      })(this, depth)
    }
  })
}
