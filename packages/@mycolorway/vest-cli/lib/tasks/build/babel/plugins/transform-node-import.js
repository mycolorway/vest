const { isNodeModulePath, isNodeModuleRootPath } = require('../../../utils');

module.exports = function({ types: t }) {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        const source = path.node.source.value;
        const { specifiers } = path.node;

        if (isNodeModulePath(source)) {
          const transformedSource = isNodeModuleRootPath(source) ? `${source}/index` : source;
          path.replaceWith(
            t.importDeclaration(specifiers, t.stringLiteral(`@@/${transformedSource}`))
          )
        }
      },

      ExportAllDeclaration(path, state) {
        const source = path.node.source.value;
        
        if (isNodeModulePath(source)) {
          const transformedSource = isNodeModuleRootPath(source) ? `${source}/index` : source;
          path.replaceWith(
            t.exportAllDeclaration(t.stringLiteral(`@@/${transformedSource}`))
          )
        }
      },

      ExportNamedDeclaration(path, state) {
        const { specifiers, declaration, source } = path.node;
        
        if (source && isNodeModulePath(source.value)) {
          const transformedSource = isNodeModuleRootPath(source.value) ? `${source.value}/index` : source.value;
          path.replaceWith(
            t.exportNamedDeclaration(declaration, specifiers, t.stringLiteral(`@@/${transformedSource}`))
          )
        }
      },
    },
  };
};

