import { patchBehaviors, mergeLifecycleMethod } from './behaviors/utils'
import reactivityBehavior from './behaviors/reactivity'

export default function (config) {
  config.behaviors = (config.behaviors || []).concat([reactivityBehavior])
  config.store = config.store || getApp().store

  const initStore = function() {
    this.store = config.store
  }

  if (config.lifetimes && config.lifetimes.created) {
    config.lifetimes.created = mergeLifecycleMethod(initStore, config.lifetimes.created)
  } else if (config.created) {
    config.created = mergeLifecycleMethod(initStore, config.created)
  } else {
    config.lifetimes = config.lifetimes || {}
    config.lifetimes.created = initStore
  }

  Component(patchBehaviors(config, true))
}
