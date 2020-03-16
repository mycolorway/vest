"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../utils");

var _reactivity = require("../reactivity");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Store = /*#__PURE__*/function () {
  function Store(_ref) {
    var _this = this;

    var _ref$state = _ref.state,
        state = _ref$state === void 0 ? {} : _ref$state,
        _ref$getters = _ref.getters,
        getters = _ref$getters === void 0 ? {} : _ref$getters,
        _ref$mutations = _ref.mutations,
        mutations = _ref$mutations === void 0 ? {} : _ref$mutations,
        _ref$actions = _ref.actions,
        actions = _ref$actions === void 0 ? {} : _ref$actions,
        _ref$modules = _ref.modules,
        modules = _ref$modules === void 0 ? {} : _ref$modules,
        _ref$namespace = _ref.namespace,
        namespace = _ref$namespace === void 0 ? 'root' : _ref$namespace,
        _ref$parentStore = _ref.parentStore,
        parentStore = _ref$parentStore === void 0 ? null : _ref$parentStore,
        _ref$rootStore = _ref.rootStore,
        rootStore = _ref$rootStore === void 0 ? null : _ref$rootStore;

    _classCallCheck(this, Store);

    this.namespace = namespace;
    this.rootStore = rootStore || this;
    this.parentStore = parentStore;
    this.modulePath = parentStore ? parentStore.modulePath.concat(this.namespace) : [];
    this.isRoot = !this.parentStore;

    this._initState(state);

    this._initGetters(getters);

    this._initMutations(mutations);

    this._initActions(actions);

    this._initModules(modules);

    if (this.isRoot) {
      new _reactivity.Watcher(function () {
        return _this.state;
      }, function () {
        if (!_this._committing) {
          throw new Error('do not mutate store state outside mutation handler.');
        }
      }, {
        deep: true
      });
    }
  }

  _createClass(Store, [{
    key: "_initState",
    value: function _initState(state) {
      var _this2 = this;

      if (typeof state === 'function') state = state.call(null);

      if (this.isRoot) {
        (0, _reactivity.observe)(state);
      } else {
        Object.defineProperty(this, '_state', {
          configurable: true,
          get: function get() {
            return (0, _utils.getPropertyByPath)(_this2.rootStore._state, _this2.modulePath);
          },
          set: function set(state) {
            (0, _utils.setPropertyByPath)(_this2.rootStore._state, _this2.modulePath, state, {
              setProperty: _reactivity.setProperty
            });
          }
        });
      }

      this._state = state;
    }
  }, {
    key: "_initGetters",
    value: function _initGetters(getters) {
      var _this3 = this;

      this._getters = {};
      this.getters = {};
      Object.keys(getters).forEach(function (getterName) {
        _this3._getters[getterName] = new _reactivity.Watcher(function () {
          return getters[getterName].call(_this3, _this3.state, _this3.getters, _this3.rootStore.state, _this3.rootStore.getters);
        });

        _this3._defineGetter(getterName);
      });
    }
  }, {
    key: "_defineGetter",
    value: function _defineGetter(name) {
      var _this4 = this;

      Object.defineProperty(this.getters, name, {
        get: function get() {
          return _this4._getters[name].value;
        },
        configurable: true,
        enumerable: true
      });
    }
  }, {
    key: "_initMutations",
    value: function _initMutations(mutations) {
      this._mutations = Object.assign({}, mutations);
    }
  }, {
    key: "_initActions",
    value: function _initActions(actions) {
      this._actions = Object.assign({}, actions);
      this._pendingActions = {};
    }
  }, {
    key: "_initModules",
    value: function _initModules(modules) {
      var _this5 = this;

      this._modules = {};
      Object.keys(modules).forEach(function (moduleName) {
        _this5.registerModule(moduleName, modules[moduleName]);
      });
    }
  }, {
    key: "registerModule",
    value: function registerModule(modulePath, moduleConfig) {
      if (!Array.isArray(modulePath)) modulePath = [modulePath];
      var ancestorPath = modulePath.slice();
      var moduleName, parent;

      while (ancestorPath.length > 0) {
        moduleName = ancestorPath.pop();
        parent = this.getModuleByPath(ancestorPath);

        if (ancestorPath.length === modulePath.length - 1) {
          parent._modules[moduleName] = new Store(Object.assign({}, moduleConfig, {
            namespace: moduleName,
            parentStore: parent,
            rootStore: parent.rootStore
          }));
        }

        parent._patchModuleGetters(moduleName);
      }
    }
  }, {
    key: "unregisterModule",
    value: function unregisterModule(modulePath) {
      if (!Array.isArray(modulePath)) modulePath = [modulePath];
      var ancestorPath = modulePath.slice();
      var moduleName, parent;

      while (ancestorPath.length > 0) {
        moduleName = ancestorPath.pop();
        parent = this.getModuleByPath(ancestorPath);

        parent._unpatchModuleGetters(moduleName);

        if (ancestorPath.length === modulePath.length - 1) {
          (0, _utils.deletePropertyByPath)(parent.rootStore._state, parent._modules[moduleName].modulePath, {
            deleteProperty: _reactivity.deleteProperty
          });
          delete parent._modules[moduleName];
        }
      }
    } // support rootStore.getters['modulePath/getterName']

  }, {
    key: "_patchModuleGetters",
    value: function _patchModuleGetters(moduleName) {
      var _this6 = this;

      Object.keys(this._modules[moduleName]._getters).forEach(function (getterName) {
        var getterPath = "".concat(moduleName, "/").concat(getterName);
        _this6._getters[getterPath] = _this6._modules[moduleName]._getters[getterName];

        _this6._defineGetter(getterPath);
      });
    }
  }, {
    key: "_unpatchModuleGetters",
    value: function _unpatchModuleGetters(moduleName) {
      var _this7 = this;

      Object.keys(this._modules[moduleName]._getters).forEach(function (getterName) {
        var getterPath = "".concat(moduleName, "/").concat(getterName);
        delete _this7._getters[getterPath];
        delete _this7.getters[getterPath];
      });
    }
  }, {
    key: "_resolvePath",
    value: function _resolvePath(path) {
      var names = path.split('/');
      return names.length > 1 ? {
        name: names.pop(),
        store: this.getModuleByPath(names)
      } : {
        name: path,
        store: this
      };
    }
  }, {
    key: "_isActionPending",
    value: function _isActionPending(name, key) {
      if (this._pendingActions[name] && this._pendingActions[name][key]) {
        return this._pendingActions[name][key];
      } else {
        return false;
      }
    }
  }, {
    key: "getModuleByPath",
    value: function getModuleByPath(path) {
      return (0, _utils.getPropertyByPath)(this, path, {
        innerProperty: '_modules'
      });
    }
  }, {
    key: "commit",
    value: function commit(mutationName) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var _this$_resolvePath = this._resolvePath(mutationName),
          store = _this$_resolvePath.store,
          name = _this$_resolvePath.name;

      if (!store._mutations[name]) {
        throw new Error("mutation ".concat(name, " is undefined"));
      }

      this._withCommit(function () {
        var _store$_mutations$nam;

        (_store$_mutations$nam = store._mutations[name]).call.apply(_store$_mutations$nam, [store, store.state].concat(args));
      });

      return store.state;
    }
  }, {
    key: "dispatch",
    value: function dispatch(actionName) {
      var _store$_actions$name;

      var _this$_resolvePath2 = this._resolvePath(actionName),
          store = _this$_resolvePath2.store,
          name = _this$_resolvePath2.name;

      if (!store._actions[name]) {
        throw new Error("action ".concat(actionName, " is undefined"));
      }

      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      var argsKey = JSON.stringify(args);

      var pending = store._isActionPending(name, argsKey);

      if (pending) return pending;

      var promise = (_store$_actions$name = store._actions[name]).call.apply(_store$_actions$name, [store, {
        state: store.state,
        commit: store.commit.bind(store),
        dispatch: store.dispatch.bind(store),
        getters: store.getters,
        rootState: this.rootStore.state,
        rootGetters: this.rootStore.getters
      }].concat(args));

      if (promise instanceof Promise) {
        promise.then(function (value) {
          delete store._pendingActions[name][argsKey];
          return value;
        }).catch(function (reason) {
          delete store._pendingActions[name][argsKey];
          return reason;
        });
        store._pendingActions[name] = store._pendingActions[name] || {};
        store._pendingActions[name][argsKey] = promise;
      }

      return promise;
    }
  }, {
    key: "_withCommit",
    value: function _withCommit(fn) {
      var committing = this.rootStore._committing;
      this.rootStore._committing = true;
      fn();
      this.rootStore._committing = committing;
    }
  }, {
    key: "state",
    get: function get() {
      return this._state;
    }
  }]);

  return Store;
}();

exports.default = Store;