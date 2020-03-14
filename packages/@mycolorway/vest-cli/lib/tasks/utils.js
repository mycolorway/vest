const gulpTemplate = require('gulp-template')
const gulpReplace = require('gulp-replace')
const path = require('path')
const fancyLog = require('fancy-log')

function log(message, ...prefixes) {
  fancyLog(prefixes.map(prefix => `[${prefix}] `) + message)
}

function template(config) {
  return gulpTemplate(config, {
    interpolate: /<%=([\s\S]+?)%>/g,
    evaluate: false
  })
}

function resolveProjectPath() {
  return gulpReplace(/(["'`])@\//g, function(match, p1) {
    return p1 + (path.relative(this.file.dirname, this.file.base) || '.') + '/'
  }, {
    skipBinary: false
  })
}

function resolveNodePath({ projectType, projectName }) {
  return gulpReplace(/(["'`])@@\//g, function(match, p1) {
    if (projectType === 'miniprogram') {
      return p1 + (path.relative(this.file.dirname, this.file.base) || '.') + '/miniprogram_npm/'
    } else if (projectType === 'miniprogram-node-package') {
      const basePath = projectName.startsWith('@') ? '../../' : '../';
      return p1 + (path.relative(this.file.dirname, path.resolve(this.file.base, basePath)) || '.') + '/'
    }
  }, {
    skipBinary: false
  })
}

function sassProjectImporter(config) {
  const regex = /^@\//g
  return function(url, prev) {
    return regex.test(url) ? {
      file: url.replace(regex, config.srcPath + '/')
    } : null
  }
}

const defaultIgnoreDependencies = [
  '@babel/core',
  '@babel/plugin-transform-modules-commonjs',
  '@babel/preset-env',
  '@mycolorway/weui-wxss',
];

function resolveDependencies(cwd, { modulePath = cwd, ignoreDependencies = [] } = {}) {
  const packageConfig = require(path.resolve(modulePath, 'package.json'));
  const dependencyNames = packageConfig.dependencies ? Object.keys(packageConfig.dependencies) : [];
  const ignores = [...defaultIgnoreDependencies, ...ignoreDependencies];
  
  return dependencyNames.reduce((dependencies, dependencyName) => {
    if (ignores.includes(dependencyName)) return dependencies;
    const modulePath = path.resolve(cwd, 'node_modules', dependencyName);
    return Object.assign(dependencies, {
      [dependencyName]: modulePath,
    }, resolveDependencies(cwd, { modulePath, ignoreDependencies }));
  }, {});
}

function isNodeModulePath(path) {
  return !/^(\.|~|@\/|\/|@@\/)/g.test(path);
}

function isNodeModuleRootPath(path) {
  const parts = path.split('/');
  return parts.length === 1 || (parts.length === 2 && parts[0].startsWith('@'));
}

module.exports = {
  log, template, resolveProjectPath, resolveNodePath, sassProjectImporter, resolveDependencies,
  isNodeModulePath, isNodeModuleRootPath,
}
