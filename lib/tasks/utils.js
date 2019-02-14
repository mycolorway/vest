const gulpTemplate = require('gulp-template')
const gulpReplace = require('gulp-replace')
const path = require('path')
const fs = require('fs')
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

function resolveMiniprogramDistPath(cwd) {
  var modulesPath = path.resolve(cwd, 'node_modules')
  var dependencies = resolveDependencies(cwd)
  var regExp = new RegExp(`(["'])((${Object.keys(dependencies).join('|')})[^"']*)(["'])`, 'g')

  return gulpReplace(regExp, function(match, p1, p2, p3, p4) {
    var basePath = this.file.base
    if (basePath.indexOf(modulesPath) !== -1) {
      basePath = modulesPath
    }

    var relativePath = path.relative(this.file.dirname, basePath) || '.'
    var moduleFileStat
    try {
      moduleFileStat = fs.statSync(path.resolve(modulesPath, p2))
    } catch (e) {}

    return `${p1}${relativePath}/miniprogram_npm/${
      moduleFileStat && moduleFileStat.isDirectory() ? p2 + '/index' : p2
    }${p4}`
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
