import { observe, Watcher } from '../reactivity'
import { mergeLifecycleMethod } from './utils'
import { isObject, getPropertyByPath } from '../utils'

export default Behavior({
  lifetimes: {
    created() {
      this._originalSetData = this.setData
      this.setData = this._setData
      this._dataQueue = []
      this._dataCallbackQueue = []
    }
  },

  definitionFilter(defFields) {
    const computed = defFields.computed || {}
    const computedKeys = Object.keys(computed)
    const watches = defFields.watch || {}
    const watchesKeys = Object.keys(watches)
    const initialData = defFields.data = defFields.data || {}

    Object.keys(computed).forEach(key => {
      initialData[key] = null
    })

    defFields.lifetimes = defFields.lifetimes || {}
    defFields.lifetimes.attached = mergeLifecycleMethod(function() {
      observe(this.data)

      const needUpdate = {}
      this.computed = computedKeys.reduce((result, key) => {
        result[key] = this.watch(computed[key].bind(this, this), (value) => {
          this.queueData({ [key]: value }, { allowComputed: true })
        }, { deep: true })
        needUpdate[key] = result[key].value
        return result
      }, {})

      if (computedKeys.length > 0) {
        this._setData(needUpdate, { allowComputed: true })
      }

      this.watches = watchesKeys.reduce((result, key) => {
        let callback = watches[key], options = {}
        if (isObject(callback)) {
          ({ handler: callback, ...options } = watches[key])
        }
        result[key] = this.watch(key, callback, options)
        return result
      }, {})
    }, defFields.lifetimes.attached)

    defFields.lifetimes.detached = mergeLifecycleMethod(function() {
      computedKeys.forEach(key => this.computed[key].teardown())
      watchesKeys.forEach(key => this.watches[key].teardown())
      this.computed = {}
      this.watches = {}
    }, defFields.lifetimes.detached)

    defFields.methods = defFields.methods || {}
    defFields.methods._filterComputedData = function(data) {
      Object.keys(data).forEach(key => {
        if (computed[key]) {
          delete data[key]
        }
      })
      return data
    }
  },

  methods: {
    _setData(data, callback, options = {}) {
      if (isObject(callback)) {
        options = callback
        callback = undefined
      }
      if (!options.allowComputed) this._filterComputedData(data)
      this._originalSetData(data, callback)
    },

    watch(target, callback, options = {}) {
      if (typeof target === 'string') {
        const dataKey = target
        target = () => getPropertyByPath(this.data, dataKey, { separator: '.' })
      }
      if (typeof callback === 'string') {
        callback = this[callback].bind(this)
      }
      return new Watcher(target, callback, options)
    },

    queueData(data, callback, options = {}) {
      if (isObject(callback)) {
        options = callback
        callback = undefined
      }
      if (this._dataQueue.length === 0) {
        wx.nextTick(this._flushDataQueue.bind(this))
      }

      if (!options.allowComputed) this._filterComputedData(data)
      this._dataQueue.push(data)
      if (callback) this._dataCallbackQueue.push(callback)
    },

    _flushDataQueue() {
      const data = this._dataQueue.reduce((data, item) => {
        Object.assign(data, item)
        return data
      }, {})
      const callbacks = this._dataCallbackQueue.slice()

      this._dataQueue.length = 0
      this._dataCallbackQueue.length = 0

      this._originalSetData(data, () => {
        callbacks.forEach(callback => {
          callback.call(this)
        })
      })
    }
  }
})
