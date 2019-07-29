"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "wx", {
  enumerable: true,
  get: function get() {
    return _wxApi.default;
  }
});
Object.defineProperty(exports, "Store", {
  enumerable: true,
  get: function get() {
    return _store.default;
  }
});
Object.defineProperty(exports, "Component", {
  enumerable: true,
  get: function get() {
    return _component.default;
  }
});
Object.defineProperty(exports, "Behavior", {
  enumerable: true,
  get: function get() {
    return _behavior.default;
  }
});

var _wxApi = _interopRequireDefault(require("./wx-api"));

var _store = _interopRequireDefault(require("./store"));

var _component = _interopRequireDefault(require("./component"));

var _behavior = _interopRequireDefault(require("./behavior"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }