const originalArrayPrototype = Array.prototype
const patchedArrayPrototype = Object.create(originalArrayPrototype)

;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (methodName) {
  const originalMethod = originalArrayPrototype[methodName]

  Object.defineProperty(patchedArrayPrototype, methodName, {
    value: function(...args) {
      const result = originalMethod.apply(this, args)
      const observer = this.__observer__
      let inserted
      switch (methodName) {
        case 'push':
        case 'unshift':
          inserted = args
          break
        case 'splice':
          inserted = args.slice(2)
          break
      }
      if (inserted) observer.observeArray(inserted)
      observer.dependency.notify()
      return result
    },
    enumerable: false,
    writable: true,
    configurable: true
  })
})


export function patchArray(array) {
  array.__proto__ = patchedArrayPrototype
}
