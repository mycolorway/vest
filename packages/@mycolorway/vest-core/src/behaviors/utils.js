import { isObject } from '../utils'

const LIFECYCLE_METHODS = 'onLoad onReady onShow onHide onUnload onPullDownRefresh onReachBottom onShareAppMessage onPageScroll onTabItemTap'.split(' ')

export function mergeLifecycleMethod(method1, method2) {
  if (!method1) {
    return method2
  } else if (!method2) {
    return method1
  } else {
    return function (...args) {
      method1.apply(this, args)
      method2.apply(this, args)
    }
  }
}

function patchLifecycleMethods(config, behavior) {
  config.methods = config.methods || {}
  Object.keys(behavior.methods || {}).forEach(key => {
    if (LIFECYCLE_METHODS.indexOf(key) > -1) {
      config.methods[key] = mergeLifecycleMethod(
        behavior.methods[key],
        config.methods[key]
      )
    }
  })
}

function patchComputed(config, behavior, root = false) {
  if (root) {
    config.computed = Object.assign({}, behavior.computed, config.computed)
  } else {
    config.computed = Object.assign({}, config.computed, behavior.computed)
  }
}

export function patchBehaviors(config, root = false) {
  config.behaviors = (config.behaviors || []).reduce((result, behavior) => {
    if (isObject(behavior) && behavior._vest) {
      patchLifecycleMethods(config, behavior.config)
      patchComputed(config, behavior.config, root)
      result.push(behavior.id)
    } else {
      result.push(behavior)
    }
    return result
  }, [])

  return config
}
