"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.observe = observe;
exports.defineReactive = defineReactive;
exports.setProperty = setProperty;
exports.deleteProperty = deleteProperty;
exports.Observer = void 0;

var _utils = require("../utils");

var _array = require("./array");

var _dependency = _interopRequireDefault(require("./dependency"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Observer =
/*#__PURE__*/
function () {
  function Observer(object) {
    _classCallCheck(this, Observer);

    this.value = object;
    this.dependency = new _dependency.default();
    Object.defineProperty(object, '__observer__', {
      value: this,
      enumerable: false,
      writable: true,
      configurable: true
    });

    if (Array.isArray(object)) {
      (0, _array.patchArray)(object);
      this.observeArray(object);
    } else {
      this.walk(object);
    }
  }

  _createClass(Observer, [{
    key: "walk",
    value: function walk(object) {
      Object.keys(object).forEach(function (key) {
        defineReactive(object, key, object[key]);
      });
    }
  }, {
    key: "observeArray",
    value: function observeArray(object) {
      object.forEach(function (item) {
        return observe(item);
      });
    }
  }]);

  return Observer;
}();

exports.Observer = Observer;

function observe(object) {
  if (!(0, _utils.isObject)(object)) return;

  if (object.hasOwnProperty('__observer__') && object.__observer__ instanceof Observer) {
    return object.__observer__;
  } else if ((Array.isArray(object) || (0, _utils.isPlainObject)(object)) && Object.isExtensible(object)) {
    return new Observer(object);
  } else {
    return null;
  }
}

function defineReactive(object, key, value) {
  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref$shallow = _ref.shallow,
      shallow = _ref$shallow === void 0 ? false : _ref$shallow;

  var property = Object.getOwnPropertyDescriptor(object, key);
  if (property && property.configurable === false) return;
  var dependency = new _dependency.default();
  var getter = property && property.get;
  var setter = property && property.set;
  var childObject = !shallow && observe(value);
  Object.defineProperty(object, key, {
    enumerable: true,
    configurable: true,
    get: function get() {
      var result = getter ? getter.call(object) : value;

      if (_dependency.default.target) {
        dependency.depend();

        if (childObject) {
          childObject.dependency.depend();
          if (Array.isArray(result)) dependArray(result);
        }
      }

      return result;
    },
    set: function set(newValue) {
      var oldValue = getter ? getter.call(object) : value;
      /* eslint-disable no-self-compare */

      if (newValue === oldValue || newValue !== newValue && oldValue !== oldValue) {
        return;
      }

      if (setter) {
        setter.call(object, newValue);
      } else {
        value = newValue;
      }

      childObject = !shallow && observe(newValue);
      dependency.notify();
    }
  });
}

function setProperty(object, key, value) {
  if (Array.isArray(object) && typeof key === 'number' && key > -1) {
    object.length = Math.max(object.length, key);
    object.splice(key, 1, value);
    return value;
  }

  var observer = object.__observer__;

  if (!observer || object.hasOwnProperty(key)) {
    object[key] = value;
    return value;
  }

  defineReactive(observer.value, key, value);
  observer.dependency.notify();
  return value;
}

function deleteProperty(object, key) {
  if (Array.isArray(object) && typeof key === 'number' && key > -1) {
    object.splice(key, 1);
    return;
  }

  if (object.hasOwnProperty(key)) {
    delete object[key];
  }

  if (object.__observer__) {
    object.__observer__.dependency.notify();
  }
}

function dependArray(array) {
  array.forEach(function (item) {
    item && item.__observer__ && item.__observer__.dependency.depend();
    if (Array.isArray(item)) dependArray(item);
  });
}