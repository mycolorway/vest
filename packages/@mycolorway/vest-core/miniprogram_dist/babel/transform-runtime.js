"use strict";

var _require = require('@babel/helper-module-imports'),
    addDefault = _require.addDefault,
    isModule = _require.isModule;

var _require2 = require('@babel/core'),
    types = _require2.types;

module.exports = function () {
  return {
    pre: function pre(file) {
      var cache = new Map();

      this.addDefaultImport = function (source, nameHint, blockHoist) {
        // If something on the page adds a helper when the file is an ES6
        // file, we can't reused the cached helper name after things have been
        // transformed because it has almost certainly been renamed.
        var cacheKey = isModule(file.path);
        var key = "".concat(source, ":").concat(nameHint, ":").concat(cacheKey || "");
        var cached = cache.get(key);

        if (cached) {
          cached = types.cloneNode(cached);
        } else {
          cached = addDefault(file.path, source, {
            importedInterop: "uncompiled",
            nameHint: nameHint,
            blockHoist: blockHoist
          });
          cache.set(key, cached);
        }

        return cached;
      };
    },
    visitor: {
      ReferencedIdentifier: function ReferencedIdentifier(path) {
        var node = path.node,
            parent = path.parent,
            scope = path.scope;

        if (node.name === 'regeneratorRuntime') {
          path.replaceWith(this.addDefaultImport('regenerator-runtime', 'regeneratorRuntime'));
        }
      }
    }
  };
};