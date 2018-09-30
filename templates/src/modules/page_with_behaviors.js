const LIFECYCLE_METHODS = 'onLoad onReady onShow onHide onUnload onPullDownRefresh onReachBottom onShareAppMessage onPageScroll onTabItemTap'.split(' ')

function extractBehaviors(config) {
  if (Array.isArray(config.behaviors)) {
    const behaviors = config.behaviors.slice()
    delete config.behaviors
    return behaviors
  } else {
    return []
  }
}

function mergeData(data1, data2) {
  return Object.assign({}, data1, data2)
}

function mergeLifecycleMethod(method1, method2) {
  if (!method1) {
    return method2
  } else if(!method2) {
    return method1
  }

  return function() {
    method1.apply(this, arguments)
    method2.apply(this, arguments)
  }
}

function mergeBehavior(config, behavior) {
  const result = {}
  Object.keys(behavior).forEach(key => {
    if (key === 'data') {
      result.data = mergeData(behavior.data, config.data)
    } else if(LIFECYCLE_METHODS.indexOf(key) > -1) {
      result[key] = mergeLifecycleMethod(config[key], behavior[key])
    } else {
      result[key] = config[key] || behavior[key]
    }
  })

  return Object.assign({}, config, result)
}

function mergeBehaviors(config, behaviors) {
  behaviors = behaviors || extractBehaviors(config)

  behaviors.forEach(behavior => {
    config = mergeBehavior(config, mergeBehaviors(behavior))
  })

  return config
}

export default function(config) {
  Page(mergeBehaviors(config))
}
