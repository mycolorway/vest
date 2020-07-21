import { patchBehaviors, mergeLifecycleMethod } from './behaviors/utils'
import reactivityBehavior from './behaviors/reactivity'

const defaultBehaviors = [];

export function addDefaultBehavior(...behaviors) {
  defaultBehaviors.push(...behaviors);
}

export default function (config) {
  config.behaviors = (config.behaviors || []).concat([...defaultBehaviors, reactivityBehavior])
  const { store } = getApp();
  config.store = config.store || (typeof store === 'function' ? store() : store);

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
