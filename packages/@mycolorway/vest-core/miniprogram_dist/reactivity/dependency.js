"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pushTarget = pushTarget;
exports.popTarget = popTarget;
exports.default = void 0;

var _utils = require("../utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Dependency = /*#__PURE__*/function () {
  function Dependency() {
    _classCallCheck(this, Dependency);

    this.id = (0, _utils.uniqueId)();
    this.subscribers = [];
  }

  _createClass(Dependency, [{
    key: "addSubscriber",
    value: function addSubscriber(subscriber) {
      this.subscribers.push(subscriber);
    }
  }, {
    key: "removeSubscriber",
    value: function removeSubscriber(subscriber) {
      (0, _utils.removeFromArray)(this.subscribers, subscriber);
    }
  }, {
    key: "depend",
    value: function depend() {
      if (Dependency.target) {
        Dependency.target.addDependency(this);
      }
    }
  }, {
    key: "notify",
    value: function notify() {
      this.subscribers.slice().forEach(function (subscriber) {
        subscriber.update();
      });
    }
  }]);

  return Dependency;
}();

exports.default = Dependency;
Dependency.target = null;
var targetStack = [];

function pushTarget(target) {
  if (Dependency.target) targetStack.push(Dependency.target);
  Dependency.target = target;
}

function popTarget() {
  Dependency.target = targetStack.pop();
}