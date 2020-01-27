"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactivity = require("../reactivity");

var _utils = require("./utils");

var _utils2 = require("../utils");

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = Behavior({
  lifetimes: {
    created: function created() {
      this._originalSetData = this.setData;
      this.setData = this._setData;
      this._dataQueue = [];
      this._dataCallbackQueue = [];
    }
  },
  definitionFilter: function definitionFilter(defFields) {
    var computed = defFields.computed || {};
    var computedKeys = Object.keys(computed);
    var watches = defFields.watch || {};
    var watchesKeys = Object.keys(watches);
    var initialData = defFields.data = defFields.data || {};
    Object.keys(computed).forEach(function (key) {
      initialData[key] = null;
    });
    defFields.lifetimes = defFields.lifetimes || {};
    defFields.lifetimes.attached = (0, _utils.mergeLifecycleMethod)(function () {
      var _this = this;

      (0, _reactivity.observe)(this.data);
      var needUpdate = {};
      this.computed = computedKeys.reduce(function (result, key) {
        result[key] = _this.watch(computed[key].bind(_this, _this), function (value) {
          _this.queueData(_defineProperty({}, key, value), {
            allowComputed: true
          });
        }, {
          deep: true
        });
        needUpdate[key] = result[key].value;
        return result;
      }, {});

      if (computedKeys.length > 0) {
        this._setData(needUpdate, {
          allowComputed: true
        });
      }

      this.watches = watchesKeys.reduce(function (result, key) {
        var callback = watches[key],
            options = {};

        if ((0, _utils2.isObject)(callback)) {
          var _watches$key = watches[key];
          callback = _watches$key.handler;
          options = _objectWithoutProperties(_watches$key, ["handler"]);
        }

        result[key] = _this.watch(key, callback, options);
        return result;
      }, {});
    }, defFields.lifetimes.attached);
    defFields.lifetimes.detached = (0, _utils.mergeLifecycleMethod)(function () {
      var _this2 = this;

      computedKeys.forEach(function (key) {
        return _this2.computed[key].teardown();
      });
      watchesKeys.forEach(function (key) {
        return _this2.watches[key].teardown();
      });
      this.computed = {};
      this.watches = {};
    }, defFields.lifetimes.detached);
    defFields.methods = defFields.methods || {};

    defFields.methods._filterComputedData = function (data) {
      Object.keys(data).forEach(function (key) {
        if (computed[key]) {
          delete data[key];
        }
      });
      return data;
    };
  },
  methods: {
    _setData: function _setData(data, callback) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if ((0, _utils2.isObject)(callback)) {
        options = callback;
        callback = undefined;
      }

      if (!options.allowComputed) this._filterComputedData(data);

      this._originalSetData(data, callback);
    },
    watch: function watch(target, callback) {
      var _this3 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (typeof target === 'string') {
        var dataKey = target;

        target = function target() {
          return (0, _utils2.getPropertyByPath)(_this3.data, dataKey, {
            separator: '.'
          });
        };
      }

      if (typeof callback === 'string') {
        callback = this[callback].bind(this);
      }

      return new _reactivity.Watcher(target, callback, options);
    },
    queueData: function queueData(data, callback) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if ((0, _utils2.isObject)(callback)) {
        options = callback;
        callback = undefined;
      }

      if (this._dataQueue.length === 0) {
        setTimeout(this._flushDataQueue.bind(this));
      }

      if (!options.allowComputed) this._filterComputedData(data);

      this._dataQueue.push(data);

      if (callback) this._dataCallbackQueue.push(callback);
    },
    _flushDataQueue: function _flushDataQueue() {
      var _this4 = this;

      var data = this._dataQueue.reduce(function (data, item) {
        Object.assign(data, item);
        return data;
      }, {});

      var callbacks = this._dataCallbackQueue.slice();

      this._dataQueue.length = 0;
      this._dataCallbackQueue.length = 0;

      this._originalSetData(data, function () {
        callbacks.forEach(function (callback) {
          callback.call(_this4);
        });
      });
    }
  }
});

exports.default = _default;