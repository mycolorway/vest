"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "mapState", {
  enumerable: true,
  get: function get() {
    return _helpers.mapState;
  }
});
Object.defineProperty(exports, "mapGetters", {
  enumerable: true,
  get: function get() {
    return _helpers.mapGetters;
  }
});
Object.defineProperty(exports, "mapActions", {
  enumerable: true,
  get: function get() {
    return _helpers.mapActions;
  }
});
Object.defineProperty(exports, "mapMutations", {
  enumerable: true,
  get: function get() {
    return _helpers.mapMutations;
  }
});
exports.default = void 0;

var _base = _interopRequireDefault(require("./store/base"));

var _helpers = require("./store/helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _base.default;
exports.default = _default;