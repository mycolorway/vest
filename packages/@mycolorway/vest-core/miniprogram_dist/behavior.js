"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _utils = require("./behaviors/utils");

function _default(config) {
  return {
    id: Behavior((0, _utils.patchBehaviors)(config)),
    config: config,
    _vest: true
  };
}