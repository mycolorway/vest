"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchArray = patchArray;
var originalArrayPrototype = Array.prototype;
var patchedArrayPrototype = Object.create(originalArrayPrototype);
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (methodName) {
  var originalMethod = originalArrayPrototype[methodName];
  Object.defineProperty(patchedArrayPrototype, methodName, {
    value: function value() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = originalMethod.apply(this, args);
      var observer = this.__observer__;
      var inserted;

      switch (methodName) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      }

      if (inserted) observer.observeArray(inserted);
      observer.dependency.notify();
      return result;
    },
    enumerable: false,
    writable: true,
    configurable: true
  });
});

function patchArray(array) {
  array.__proto__ = patchedArrayPrototype;
}