"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addDefaultBehavior = addDefaultBehavior;
exports.default = _default;

var _utils = require("./behaviors/utils");

var _reactivity = _interopRequireDefault(require("./behaviors/reactivity"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var defaultBehaviors = [];

function addDefaultBehavior() {
  defaultBehaviors.push.apply(defaultBehaviors, arguments);
}

function _default(_ref) {
  var store = _ref.store,
      config = _objectWithoutProperties(_ref, ["store"]);

  config.behaviors = (config.behaviors || []).concat([].concat(defaultBehaviors, [_reactivity.default]));

  var initStore = function initStore() {
    if (!store) {
      store = getApp().store;
      store = typeof store === 'function' ? store() : store;
    }

    this.store = store;
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