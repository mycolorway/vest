import { patchBehaviors, mergeLifecycleMethod } from './behaviors/utils'
import reactivityBehavior from './behaviors/reactivity'

const defaultBehaviors = [];

export function addDefaultBehavior(...behaviors) {
  defaultBehaviors.push(...behaviors);
}

export default function ({ store, ...config }) {
  config.behaviors = (config.behaviors || []).concat([...defaultBehaviors, reactivityBehavior])

  const initStore = function() {
    if (!store){
      store = getApp().store;
      store = typeof store === 'function' ? store() : store;
    }

    this.store = store;
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
