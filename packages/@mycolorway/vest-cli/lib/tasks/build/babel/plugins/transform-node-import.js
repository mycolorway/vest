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
    },
  };
};

