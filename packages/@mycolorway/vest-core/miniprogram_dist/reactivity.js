"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Observer", {
  enumerable: true,
  get: function get() {
    return _observe.Observer;
  }
});
Object.defineProperty(exports, "observe", {
  enumerable: true,
  get: function get() {
    return _observe.observe;
  }
});
Object.defineProperty(exports, "defineReactive", {
  enumerable: true,
  get: function get() {
    return _observe.defineReactive;
  }
});
Object.defineProperty(exports, "setProperty", {
  enumerable: true,
  get: function get() {
    return _observe.setProperty;
  }
});
Object.defineProperty(exports, "deleteProperty", {
  enumerable: true,
  get: function get() {
    return _observe.deleteProperty;
  }
});
Object.defineProperty(exports, "Watcher", {
  enumerable: true,
  get: function get() {
    return _watcher.default;
  }
});

var _observe = require("./reactivity/observe");

var _watcher = _interopRequireDefault(require("./reactivity/watcher"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }