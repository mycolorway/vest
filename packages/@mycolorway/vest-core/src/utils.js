
export function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

export function getPropertyByPath(obj, path, { separator = '/', innerProperty } = {}) {
  if (typeof path === 'string') {
    path = path.split(separator)
  }

  return path.reduce((property, name) => {
    if (name) {
      return (innerProperty ? getPropertyByPath(property, innerProperty, { separator }) : property)[name]
    } else {
      return property
    }
  }, obj)
}

export function setPropertyByPath(obj, path, value, { separator = '/', setProperty } = {}) {
  if (typeof path === 'string') {
    path = path.split(separator)
  }

  setProperty = setProperty || function(object, key, value) {
    object[key] = value
  }

  return path.reduce((property, name, index) => {
    if (!name) return property
    if (index === path.length - 1) {
      setProperty(property, name, value)
    } else if (!property[name]) {
      setProperty(property, name, {})
    }
    return property[name]
  }, obj)
}

export function deletePropertyByPath(obj, path, { separator = '/', deleteProperty } = {}) {
  if (typeof path === 'string') {
    path = path.split(separator)
  }

  deleteProperty = deleteProperty || function(object, key) {
    delete object[key]
  }

  return path.reduce((property, name, index) => {
    if (!name) return property
    if (index === path.length - 1) {
      deleteProperty(property, name)
    } else if (!property[name]) {
      return {}
    }
    return property[name]
  }, obj)
}

export function uniqueId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function removeFromArray(array, item) {
  const index = array.indexOf(item)
  if (index > -1) {
    array.splice(index, 1)
  }
}

export function isObject(object) {
  return object !== null && typeof object === 'object'
}

export function isPlainObject(object) {
  return object.toString() === '[object Object]'
}
