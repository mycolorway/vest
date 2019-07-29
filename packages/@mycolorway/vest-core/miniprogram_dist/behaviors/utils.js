"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeLifecycleMethod = mergeLifecycleMethod;
exports.patchBehaviors = patchBehaviors;

var _utils = require("../utils");

var LIFECYCLE_METHODS = 'onLoad onReady onShow onHide onUnload onPullDownRefresh onReachBottom onShareAppMessage onPageScroll onTabItemTap'.split(' ');

function mergeLifecycleMethod(method1, method2) {
  if (!method1) {
    return method2;
  } else if (!method2) {
    return method1;
  } else {
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      method1.apply(this, args);
      method2.apply(this, args);
    };
  }
}

function patchLifecycleMethods(config, behavior) {
  config.methods = config.methods || {};
  Object.keys(behavior.methods || {}).forEach(function (key) {
    if (LIFECYCLE_METHODS.indexOf(key) > -1) {
      config.methods[key] = mergeLifecycleMethod(behavior.methods[key], config.methods[key]);
    }
  });
}

function patchComputed(config, behavior) {
  var root = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (root) {
    config.computed = Object.assign({}, behavior.computed, config.computed);
  } else {
    config.computed = Object.assign({}, config.computed, behavior.computed);
  }
}

function patchBehaviors(config) {
  var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  config.behaviors = (config.behaviors || []).reduce(function (result, behavior) {
    if ((0, _utils.isObject)(behavior) && behavior._vest) {
      patchLifecycleMethods(config, behavior.config);
      patchComputed(config, behavior.config, root);
      result.push(behavior.id);
    } else {
      result.push(behavior);
    }

    return result;
  }, []);
  return config;
}