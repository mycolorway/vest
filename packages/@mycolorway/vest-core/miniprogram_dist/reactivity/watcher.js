"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../utils");

var _dependency = require("./dependency");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Watcher =
/*#__PURE__*/
function () {
  function Watcher(getter, callback) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$lazy = _ref.lazy,
        lazy = _ref$lazy === void 0 ? false : _ref$lazy,
        _ref$deep = _ref.deep,
        deep = _ref$deep === void 0 ? false : _ref$deep;

    _classCallCheck(this, Watcher);

    this.callback = callback;
    this.id = (0, _utils.uniqueId)();
    this.active = true;
    this.lazy = lazy;
    this.dirty = this.lazy;
    this.deep = deep;
    this.dependencies = [];
    this.newDependencies = [];
    this.dependencyIds = new Set();
    this.newDependencyIds = new Set();
    this.getter = getter;
    this.value = this.lazy ? undefined : this.get();
  }

  _createClass(Watcher, [{
    key: "get",
    value: function get() {
      (0, _dependency.pushTarget)(this);
      var value = this.getter();
      if (this.deep) this._traverseObject(value);
      (0, _dependency.popTarget)();
      this.cleanupDependencies();
      return value;
    }
  }, {
    key: "addDependency",
    value: function addDependency(dependency) {
      var id = dependency.id;

      if (!this.newDependencyIds.has(id)) {
        this.newDependencyIds.add(id);
        this.newDependencies.push(dependency);

        if (!this.dependencyIds.has(id)) {
          dependency.addSubscriber(this);
        }
      }
    }
  }, {
    key: "cleanupDependencies",
    value: function cleanupDependencies() {
      var _this = this;

      this.dependencies.forEach(function (dependency) {
        if (!_this.newDependencyIds.has(dependency.id)) {
          dependency.removeSubscriber(_this);
        }
      });
      var tmp = this.dependencyIds;
      this.dependencyIds = this.newDependencyIds;
      this.newDependencyIds = tmp;
      this.newDependencyIds.clear();
      tmp = this.dependencies;
      this.dependencies = this.newDependencies;
      this.newDependencies = tmp;
      this.newDependencies.length = 0;
    }
  }, {
    key: "update",
    value: function update() {
      if (this.lazy) {
        this.dirty = true;
      } else {
        this.run();
      }
    }
  }, {
    key: "run",
    value: function run() {
      if (!this.active) return;
      var value = this.get();

      if (value !== this.value || (0, _utils.isObject)(value) || this.deep) {
        var oldValue = this.value;
        this.value = value;
        this.callback && this.callback(value, oldValue);
      }
    }
  }, {
    key: "evaluate",
    value: function evaluate() {
      this.value = this.get();
      this.dirty = false;
    }
  }, {
    key: "teardown",
    value: function teardown() {
      var _this2 = this;

      if (!this.active) return;
      this.dependencies.forEach(function (dependency) {
        dependency.removeSubscriber(_this2);
      });
      this.active = false;
    }
  }, {
    key: "_traverseObject",
    value: function _traverseObject(object, traversedObjects) {
      var _this3 = this;

      if (!traversedObjects) {
        traversedObjects = this._traversedObjects;
        traversedObjects = traversedObjects || new Set();
        traversedObjects.clear();
      }

      var isArray = Array.isArray(object);
      if (!isArray && !(0, _utils.isObject)(object) || !Object.isExtensible(object)) return;

      if (object.__observer__) {
        var dependencyId = object.__observer__.dependency.id;

        if (traversedObjects.has(dependencyId)) {
          return;
        }

        traversedObjects.add(dependencyId);
      }

      if (isArray) {
        object.forEach(function (item) {
          _this3._traverseObject(item, traversedObjects);
        });
      } else {
        Object.keys(object).forEach(function (key) {
          _this3._traverseObject(object[key], traversedObjects);
        });
      }
    }
  }]);

  return Watcher;
}();

exports.default = Watcher;