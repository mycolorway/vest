const { addDefault, isModule } = require('@babel/helper-module-imports')
const { types } = require('@babel/core')

module.exports = function() {
  return {
    pre(file) {
      const cache = new Map();

      this.addDefaultImport = (source, nameHint, blockHoist) => {
        // If something on the page adds a helper when the file is an ES6
        // file, we can't reused the cached helper name after things have been
        // transformed because it has almost certainly been renamed.
        const cacheKey = isModule(file.path);
        const key = `${source}:${nameHint}:${cacheKey || ""}`;

        let cached = cache.get(key);
        if (cached) {
          cached = types.cloneNode(cached);
        } else {
          cached = addDefault(file.path, source, {
            importedInterop: "uncompiled",
            nameHint,
            blockHoist,
          });

          cache.set(key, cached);
        }
        return cached;
      };
    },

    visitor: {
      ReferencedIdentifier(path) {
        const { node, parent, scope } = path
        if (node.name === 'regeneratorRuntime') {
          path.replaceWith(
            this.addDefaultImport(
              'regenerator-runtime',
              'regeneratorRuntime',
            ),
          )
        }
      }
    }
  }
}
