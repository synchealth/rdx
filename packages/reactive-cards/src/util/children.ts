/* eslint-disable no-bitwise */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-extend-native */
export function toArray(x): { type: string; props: any }[] {
  if (Array.isArray(x)) {
    return x.flat()
  }
  return [x]
}

if (!Array.prototype.flat) {
  Object.defineProperty(Array.prototype, 'flat', {
    enumerable: false,
    value() {
      let depth = arguments[0]
      depth = depth === undefined ? 1 : Math.floor(depth)
      if (depth < 1) {
        return Array.prototype.slice.call(this)
      }
      return (function flat(arr, flatDepth) {
        const len = arr.length >>> 0
        let flattened: any[] = []
        let i = 0
        while (i < len) {
          if (i in arr) {
            const el = arr[i]
            if (Array.isArray(el) && flatDepth > 0) {
              flattened = flattened.concat(flat(el, flatDepth - 1))
            } else {
              flattened.push(el)
            }
          }
          i++
        }
        return flattened
      })(this, depth)
    }
  })
}
