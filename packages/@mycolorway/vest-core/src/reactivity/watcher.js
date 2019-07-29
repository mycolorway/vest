import { uniqueId, isObject } from '../utils'
import { pushTarget, popTarget } from './dependency'

export default class Watcher {

  constructor(getter, callback, { lazy = false, deep = false } = {}) {
    this.callback = callback
    this.id = uniqueId()
    this.active = true
    this.lazy = lazy
    this.dirty = this.lazy
    this.deep = deep
    this.dependencies = []
    this.newDependencies = []
    this.dependencyIds = new Set()
    this.newDependencyIds = new Set()
    this.getter = getter

    this.value = this.lazy ? undefined : this.get()
  }

  get() {
    pushTarget(this)
    const value = this.getter()
    if (this.deep) this._traverseObject(value)
    popTarget()
    this.cleanupDependencies()
    return value
  }

  addDependency(dependency) {
    const id = dependency.id
    if (!this.newDependencyIds.has(id)) {
      this.newDependencyIds.add(id)
      this.newDependencies.push(dependency)
      if (!this.dependencyIds.has(id)) {
        dependency.addSubscriber(this)
      }
    }
  }

  cleanupDependencies() {
    this.dependencies.forEach(dependency => {
      if (!this.newDependencyIds.has(dependency.id)) {
        dependency.removeSubscriber(this)
      }
    })

    let tmp = this.dependencyIds
    this.dependencyIds = this.newDependencyIds
    this.newDependencyIds = tmp
    this.newDependencyIds.clear()
    tmp = this.dependencies
    this.dependencies = this.newDependencies
    this.newDependencies = tmp
    this.newDependencies.length = 0
  }

  update() {
    if (this.lazy) {
      this.dirty = true
    } else {
      this.run()
    }
  }

  run() {
    if (!this.active) return

    const value = this.get()
    if (value !== this.value || isObject(value) || this.deep) {
      const oldValue = this.value
      this.value = value
      this.callback && this.callback(value, oldValue)
    }
  }

  evaluate() {
    this.value = this.get()
    this.dirty = false
  }

  teardown() {
    if (!this.active) return
    this.dependencies.forEach(dependency => {
      dependency.removeSubscriber(this)
    })
    this.active = false
  }

  _traverseObject(object, traversedObjects) {
    if (!traversedObjects) {
      traversedObjects = this._traversedObjects
      traversedObjects = traversedObjects || new Set()
      traversedObjects.clear()
    }

    const isArray = Array.isArray(object)

    if ((!isArray && !isObject(object)) || !Object.isExtensible(object)) return
    if (object.__observer__) {
      const dependencyId = object.__observer__.dependency.id
      if (traversedObjects.has(dependencyId)) {
        return
      }
      traversedObjects.add(dependencyId)
    }

    if (isArray) {
      object.forEach(item => {
        this._traverseObject(item, traversedObjects)
      })
    } else {
      Object.keys(object).forEach(key => {
        this._traverseObject(object[key], traversedObjects)
      })
    }
  }

}
