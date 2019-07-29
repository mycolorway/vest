import { getPropertyByPath, setPropertyByPath, deletePropertyByPath } from '../utils'
import { Watcher, observe, setProperty, deleteProperty } from '../reactivity'

export default class Store {
  constructor({
    state = {}, getters = {}, mutations = {}, actions = {}, modules = {},
    namespace = 'root', parentStore = null, rootStore = null
  }) {
    this.namespace = namespace
    this.rootStore = rootStore || this
    this.parentStore = parentStore
    this.modulePath = parentStore ? parentStore.modulePath.concat(this.namespace) : []
    this.isRoot = !this.parentStore
    this._initState(state)
    this._initGetters(getters)
    this._initMutations(mutations)
    this._initActions(actions)
    this._initModules(modules)

    if (this.isRoot) {
      new Watcher(() => this.state, () => {
        if (!this._committing) {
          throw new Error('do not mutate store state outside mutation handler.')
        }
      }, { deep: true })
    }
  }

  get state() {
    return this._state
  }

  _initState(state) {
    if (typeof state === 'function') state = state.call(null)
    if (this.isRoot) {
      observe(state)
    } else {
      Object.defineProperty(this, '_state', {
        configurable: true,
        get: () => getPropertyByPath(this.rootStore._state, this.modulePath),
        set: (state) => {
          setPropertyByPath(this.rootStore._state, this.modulePath, state, { setProperty })
        }
      })
    }
    this._state = state
  }

  _initGetters(getters) {
    this._getters = {}
    this.getters = {}

    Object.keys(getters).forEach(getterName => {
      this._getters[getterName] = new Watcher(() => {
        return getters[getterName].call(
          this, this.state, this.getters,
          this.rootStore.state, this.rootStore.getters
        )
      })
      this._defineGetter(getterName)
    })
  }

  _defineGetter(name) {
    Object.defineProperty(this.getters, name, {
      get: () => this._getters[name].value,
      configurable: true,
      enumerable: true
    })
  }

  _initMutations(mutations) {
    this._mutations = Object.assign({}, mutations)
  }

  _initActions(actions) {
    this._actions = Object.assign({}, actions)
    this._pendingActions = {}
  }

  _initModules(modules) {
    this._modules = {}
    Object.keys(modules).forEach(moduleName => {
      this.registerModule(moduleName, modules[moduleName])
    })
  }

  registerModule(modulePath, moduleConfig) {
    if (!Array.isArray(modulePath)) modulePath = [modulePath]

    const ancestorPath = modulePath.slice()
    let moduleName, parent
    while (ancestorPath.length > 0) {
      moduleName = ancestorPath.pop()
      parent = this.getModuleByPath(ancestorPath)
      if (ancestorPath.length === modulePath.length - 1) {
        parent._modules[moduleName] = new Store(Object.assign({}, moduleConfig, {
          namespace: moduleName,
          parentStore: parent,
          rootStore: parent.rootStore
        }))
      }
      parent._patchModuleGetters(moduleName)
    }
  }

  unregisterModule(modulePath) {
    if (!Array.isArray(modulePath)) modulePath = [modulePath]

    const ancestorPath = modulePath.slice()
    let moduleName, parent
    while (ancestorPath.length > 0) {
      moduleName = ancestorPath.pop()
      parent = this.getModuleByPath(ancestorPath)
      parent._unpatchModuleGetters(moduleName)
      if (ancestorPath.length === modulePath.length - 1) {
        deletePropertyByPath(parent.rootStore._state, parent._modules[moduleName].modulePath, { deleteProperty })
        delete parent._modules[moduleName]
      }
    }
  }

  // support rootStore.getters['modulePath/getterName']
  _patchModuleGetters(moduleName) {
    Object.keys(this._modules[moduleName]._getters).forEach(getterName => {
      const getterPath = `${moduleName}/${getterName}`
      this._getters[getterPath] = this._modules[moduleName]._getters[getterName]
      this._defineGetter(getterPath)
    })
  }

  _unpatchModuleGetters(moduleName) {
    Object.keys(this._modules[moduleName]._getters).forEach(getterName => {
      const getterPath = `${moduleName}/${getterName}`
      delete this._getters[getterPath]
      delete this.getters[getterPath]
    })
  }

  _resolvePath(path) {
    const names = path.split('/')
    return names.length > 1 ? {
      name: names.pop(),
      store: this.getModuleByPath(names)
    } : {
      name: path,
      store: this
    }
  }

  _isActionPending(name, key) {
    if (this._pendingActions[name] && this._pendingActions[name][key]) {
      return this._pendingActions[name][key]
    } else {
      return false
    }
  }

  getModuleByPath(path) {
    return getPropertyByPath(this, path, {innerProperty: '_modules'})
  }

  commit(mutationName, ...args) {
    const {store, name} = this._resolvePath(mutationName)
    if (!store._mutations[name]) {
      throw new Error(`mutation ${name} is undefined`)
    }
    this._withCommit(() => {
      store._mutations[name].call(store, store.state, ...args)
    })
    return store.state
  }

  dispatch(actionName, ...args) {
    const {store, name} = this._resolvePath(actionName)
    if (!store._actions[name]) {
      throw new Error(`action ${actionName} is undefined`)
    }

    const argsKey = JSON.stringify(args)
    const pending = store._isActionPending(name, argsKey)
    if (pending) return pending

    const promise = store._actions[name].call(store, {
      state: store.state,
      commit: store.commit.bind(store),
      dispatch: store.dispatch.bind(store),
      getters: store.getters,
      rootState: this.rootStore.state,
      rootGetters: this.rootStore.getters
    }, ...args)

    if (promise instanceof Promise) {
      promise.then((value) => {
        delete store._pendingActions[name][argsKey]
        return value
      }).catch((reason) => {
        delete store._pendingActions[name][argsKey]
        return reason
      })
      store._pendingActions[name] = store._pendingActions[name] || {}
      store._pendingActions[name][argsKey] = promise
    }

    return promise
  }

  _withCommit (fn) {
    const committing = this.rootStore._committing
    this.rootStore._committing = true
    fn()
    this.rootStore._committing = committing
  }
}
