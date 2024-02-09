import { isEmpty, compact, isArray } from './LodashImports'

export const cleanObj = (object) => {
  Object.entries(object).forEach((entry) => {
    const [key, value] = entry
    if (value === '' || value === null) {
      delete object[key]
    }
  })
  return object
}

export const cleanDeepObj = (object) => {
  if (typeof object === 'object' && object !== null) {
    Object.entries(object).forEach((entry) => {
      const [key, value] = entry

      if (value === '' || value === null) {
        delete object[key]
      }

      if (typeof value === 'object' && value !== null) {
        const temp = cleanDeepObj(value)
        if (isEmpty(temp)) {
          delete object[key]
        } else {
          object[key] = isArray(temp) ? compact(temp) : temp
        }
      }
    })
  }
  return object
}

export const copyObj = (object) => {
  return JSON.parse(JSON.stringify(object))
}

export const getDataFromObject = (data, key) => {
  if (!data || !key || typeof data !== 'object') return false
  key = key.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '')
  let keys = key.split('.')

  for (var i = 0, n = keys.length; i < n; ++i) {
    var _key = keys[i]
    if (_key in data && data[_key]) {
      data = data[_key]
    } else {
      return false
    }
  }
  return data
}

export const toAbsoluteUrl = (pathname) => process.env.PUBLIC_URL + pathname

export const checkActiveTab = (path, location) => location.startsWith(path)

export const getOptions = (obj) => {
  let finalOptions = []
  Object.entries(obj).forEach(([key, value]) => {
    finalOptions.push({ value: key, label: value })
  })
  return finalOptions
}

export const getSelectOptions = (array = [], nameKey, valueKey) => {
  let finalOptions = []
  array.forEach((opt) => {
    finalOptions.push({ label: opt[nameKey], value: opt[valueKey], ...opt })
  })
  return finalOptions
}

export const retry = (lazyComponent, retriesLeft = 5, interval = 1000) => {
  return new Promise((resolve, reject) => {
    lazyComponent()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            reject(error)
            return
          }
          retry(lazyComponent, retriesLeft - 1, interval).then(resolve, reject)
        }, interval)
      })
  })
}
