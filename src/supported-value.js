import isBrowser from 'is-browser'
import prefix from './prefix'

const cache = {}
let el

if (isBrowser) el = document.createElement('p')

/**
 * Returns prefixed value if needed. Returns `false` if value is not supported.
 *
 * @param {String} property
 * @param {String} value
 * @return {String|Boolean}
 * @api public
 */
export default function supportedValue(property, value) {
  // For server-side rendering.
  if (!el) return value

  // It is a string or a number as a string like '1'.
  // We want only prefixable values here.
  if (typeof value !== 'string' || !isNaN(parseInt(value, 10))) return value

  const cacheKey = property + value

  if (cache[cacheKey] != null) return cache[cacheKey]

  // IE can even throw an error in some cases, for e.g. style.content = 'bar'
  try {
    // Test value as it is.
    el.style[property] = value
  }
  catch (err) {
    cache[cacheKey] = false
    return false
  }

  // Value is supported as it is.
  if (el.style[property] === value) {
    cache[cacheKey] = value
  }
  else {
    // Test value with vendor prefix.
    value = prefix.css + value

    // Hardcode test to convert "flex" to "-ms-flexbox" for IE10.
    if (value === '-ms-flex') value = '-ms-flexbox'

    el.style[property] = value

    // Value is supported with vendor prefix.
    if (el.style[property] === value) cache[cacheKey] = value
  }

  if (!cache[cacheKey]) cache[cacheKey] = false

  return cache[cacheKey]
}
