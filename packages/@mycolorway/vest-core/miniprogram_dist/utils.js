"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clone = clone;
exports.getPropertyByPath = getPropertyByPath;
exports.setPropertyByPath = setPropertyByPath;
exports.deletePropertyByPath = deletePropertyByPath;
exports.uniqueId = uniqueId;
exports.removeFromArray = removeFromArray;
exports.isObject = isObject;
exports.isPlainObject = isPlainObject;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function getPropertyByPath(obj, path) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$separator = _ref.separator,
      separator = _ref$separator === void 0 ? '/' : _ref$separator,
      innerProperty = _ref.innerProperty;

  if (typeof path === 'string') {
    path = path.split(separator);
  }

  return path.reduce(function (property, name) {
    if (name) {
      return (innerProperty ? getPropertyByPath(property, innerProperty, {
        separator: separator
      }) : property)[name];
    } else {
      return property;
    }
  }, obj);
}

function setPropertyByPath(obj, path, value) {
  var _ref2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref2$separator = _ref2.separator,
      separator = _ref2$separator === void 0 ? '/' : _ref2$separator,
      setProperty = _ref2.setProperty;

  if (typeof path === 'string') {
    path = path.split(separator);
  }

  setProperty = setProperty || function (object, key, value) {
    object[key] = value;
  };

  return path.reduce(function (property, name, index) {
    if (!name) return property;

    if (index === path.length - 1) {
      setProperty(property, name, value);
    } else if (!property[name]) {
      setProperty(property, name, {});
    }

    return property[name];
  }, obj);
}

function deletePropertyByPath(obj, path) {
  var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref3$separator = _ref3.separator,
      separator = _ref3$separator === void 0 ? '/' : _ref3$separator,
      deleteProperty = _ref3.deleteProperty;

  if (typeof path === 'string') {
    path = path.split(separator);
  }

  deleteProperty = deleteProperty || function (object, key) {
    delete object[key];
  };

  return path.reduce(function (property, name, index) {
    if (!name) return property;

    if (index === path.length - 1) {
      deleteProperty(property, name);
    } else if (!property[name]) {
      return {};
    }

    return property[name];
  }, obj);
}

function uniqueId() {
  return "".concat(Date.now(), "-").concat(Math.random().toString(16).slice(2));
}

function removeFromArray(array, item) {
  var index = array.indexOf(item);

  if (index > -1) {
    array.splice(index, 1);
  }
}

function isObject(object) {
  return object !== null && _typeof(object) === 'object';
}

function isPlainObject(object) {
  return object.toString() === '[object Object]';
}