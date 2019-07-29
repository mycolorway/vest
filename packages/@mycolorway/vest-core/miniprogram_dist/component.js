"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _utils = require("./behaviors/utils");

var _reactivity = _interopRequireDefault(require("./behaviors/reactivity"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(config) {
  config.behaviors = (config.behaviors || []).concat([_reactivity.default]);
  config.store = config.store || getApp().store;

  var initStore = function initStore() {
    this.store = config.store;
  };

  if (config.lifetimes && config.lifetimes.created) {
    config.lifetimes.created = (0, _utils.mergeLifecycleMethod)(initStore, config.lifetimes.created);
  } else if (config.created) {
    config.created = (0, _utils.mergeLifecycleMethod)(initStore, config.created);
  } else {
    config.lifetimes = config.lifetimes || {};
    config.lifetimes.created = initStore;
  }

  Component((0, _utils.patchBehaviors)(config, true));
}