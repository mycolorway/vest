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

function resolvePath() {
  return gulpReplace(/(["'`])@\//g, function(match, p1) {
    return p1 + (path.relative(this.file.dirname, this.file.base) || '.') + '/'
  }, {
    skipBinary: false
  })
}

function resolveMiniprogramDistPath(basePath) {
  return gulpReplace(/(require\("([^"]*)"\))/g, function(match, p1, p2) {
    if (/^(?!\.)/.test(p2)) {
      var relativePath = path.relative(this.file.dirname, basePath) || '.'
      return p1.replace(p2, relativePath + '/miniprogram_npm/' + p2)
    }

    return match
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

function resolveDependencies(cwd, modulePath = cwd) {
  const packageConfig = require(path.resolve(modulePath, 'package.json'))
  const dependencyNames = packageConfig.dependencies ? Object.keys(packageConfig.dependencies) : []

  return dependencyNames.reduce((dependencies, dependencyName) => {
    const modulePath = path.resolve(cwd, 'node_modules', dependencyName)
    return Object.assign(dependencies, {
      [dependencyName]: modulePath
    }, resolveDependencies(cwd, modulePath))
  }, {})
}

module.exports = {
  log, template, resolvePath, sassProjectImporter, resolveDependencies, resolveMiniprogramDistPath
}
