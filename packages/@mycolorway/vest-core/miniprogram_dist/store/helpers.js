"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNamespacedHelpers = createNamespacedHelpers;
exports.mapActions = exports.mapMutations = exports.mapGetters = exports.mapState = void 0;

function createNamespacedHelpers(namespace) {
  return {
    mapState: mapState.bind(null, namespace),
    mapGetters: mapGetters.bind(null, namespace),
    mapMutations: mapMutations.bind(null, namespace),
    mapActions: mapActions.bind(null, namespace)
  };
}

var mapState = normalizeNamespace(function (namespace, states) {
  return normalizeMap(states).reduce(function (result, _ref) {
    var key = _ref.key,
        val = _ref.val;

    result[key] = function () {
      var ns = typeof namespace === 'function' ? namespace.call(this, this) : namespace;
      var store = ns ? this.store.getModuleByPath(ns) : this.store;
      return typeof val === 'function' ? val.call(this, store.state, store.getters) : store.state[val];
    };

    return result;
  }, {});
});
exports.mapState = mapState;
var mapGetters = normalizeNamespace(function (namespace, getters) {
  return normalizeMap(getters).reduce(function (result, _ref2) {
    var key = _ref2.key,
        val = _ref2.val;

    result[key] = function () {
      var ns = typeof namespace === 'function' ? namespace.call(this, this) : namespace;
      var store = ns ? this.store.getModuleByPath(ns) : this.store;
      return store._getters[val].getter();
    };

    return result;
  }, {});
});
exports.mapGetters = mapGetters;
var mapMutations = normalizeNamespace(function (namespace, mutations) {
  return normalizeMap(mutations).reduce(function (result, _ref3) {
    var key = _ref3.key,
        val = _ref3.val;

    result[key] = function () {
      var ns = typeof namespace === 'function' ? namespace.call(this, this) : namespace;
      var store = ns ? this.store.getModuleByPath(ns) : this.store;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return typeof val === 'function' ? val.apply(this, [store.commit].concat(args)) : store.commit.apply(store, [val].concat(args));
    };

    return result;
  }, {});
});
exports.mapMutations = mapMutations;
var mapActions = normalizeNamespace(function (namespace, actions) {
  return normalizeMap(actions).reduce(function (result, _ref4) {
    var key = _ref4.key,
        val = _ref4.val;

    result[key] = function () {
      var ns = typeof namespace === 'function' ? namespace.call(this, this) : namespace;
      var store = ns ? this.store.getModuleByPath(ns) : this.store;

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return typeof val === 'function' ? val.apply(this, [store.dispatch].concat(args)) : store.dispatch.apply(store, [val].concat(args));
    };

    return result;
  }, {});
});
exports.mapActions = mapActions;

function normalizeMap(map) {
  return Array.isArray(map) ? map.map(function (key) {
    return {
      key: key,
      val: key
    };
  }) : Object.keys(map).map(function (key) {
    return {
      key: key,
      val: map[key]
    };
  });
}

function normalizeNamespace(fn) {
  return function (_namespace, map) {
    if (typeof _namespace === 'string') {
      if (_namespace.charAt(_namespace.length - 1) !== '/') {
        _namespace += '/';
      }
    } else if (typeof _namespace === 'function') {
      var originNamespace = _namespace;

      _namespace = function namespace() {
        var result = originNamespace.call(this);

        if (result.charAt(_namespace.length - 1) !== '/') {
          result += '/';
        }

        return result;
      };
    } else {
      map = _namespace;
      _namespace = '';
    }

    return fn(_namespace, map);
  };
}