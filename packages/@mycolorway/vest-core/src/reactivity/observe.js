import { isObject, isPlainObject } from '../utils'
import { patchArray } from './array'
import Dependency from './dependency'

export class Observer {
  constructor(object) {
    this.value = object
    this.dependency = new Dependency()

    Object.defineProperty(object, '__observer__', {
      value: this,
      enumerable: false,
      writable: true,
      configurable: true
    })

    if (Array.isArray(object)) {
      patchArray(object)
      this.observeArray(object)
    } else {
      this.walk(object)
    }
  }

  walk(object) {
    Object.keys(object).forEach(key => {
      defineReactive(object, key, object[key])
    })
  }

  observeArray(object) {
    object.forEach(item => observe(item))
  }
}

export function observe(object) {
  if (!isObject(object)) return

  if (object.hasOwnProperty('__observer__') && object.__observer__ instanceof Observer) {
    return object.__observer__
  } else if ((Array.isArray(object) || isPlainObject(object)) && Object.isExtensible(object)) {
    return new Observer(object)
  } else {
    return null
  }
}

export function defineReactive(object, key, value, { shallow = false } = {}) {
  const property = Object.getOwnPropertyDescriptor(object, key)
  if (property && property.configurable === false) return

  const dependency = new Dependency()
  const getter = property && property.get
  const setter = property && property.set
  let childObject = !shallow && observe(value)

  Object.defineProperty(object, key, {
    enumerable: true,
    configurable: true,
    get() {
      const result = getter ? getter.call(object) : value
      if (Dependency.target) {
        dependency.depend()
        if (childObject) {
          childObject.dependency.depend()
          if (Array.isArray(result)) dependArray(result)
        }
      }
      return result
    },
    set(newValue) {
      const oldValue = getter ? getter.call(object) : value
      /* eslint-disable no-self-compare */
      if (newValue === oldValue || (newValue !== newValue && oldValue !== oldValue)) {
        return
      }

      if (setter) {
        setter.call(object, newValue)
      } else {
        value = newValue
      }
      childObject = !shallow && observe(newValue)
      dependency.notify()
    }
  })
}

export function setProperty(object, key, value) {
  if (Array.isArray(object) && typeof key === 'number' && key > -1) {
    object.length = Math.max(object.length, key)
    object.splice(key, 1, value)
    return value
  }

  const observer = object.__observer__
  if (!observer || object.hasOwnProperty(key)) {
    object[key] = value
    return value
  }

  defineReactive(observer.value, key, value)
  observer.dependency.notify()
  return value
}

export function deleteProperty(object, key) {
  if (Array.isArray(object) && typeof key === 'number' && key > -1) {
    object.splice(key, 1)
    return
  }

  if (object.hasOwnProperty(key)) {
    delete object[key]
  }

  if (object.__observer__) {
    object.__observer__.dependency.notify()
  }
}

function dependArray(array) {
  array.forEach(item => {
    item && item.__observer__ && item.__observer__.dependency.depend()
    if (Array.isArray(item)) dependArray(item)
  })
}
