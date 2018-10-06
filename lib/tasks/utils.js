const gulpTemplate = require('gulp-template')
const gulpReplace = require('gulp-replace')
const path = require('path')
const fancyLog = require('fancy-log')

function log(message) {
  fancyLog(message)
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

function sassProjectImporter(config) {
  const regex = /^@\//g
  return function(url, prev) {
    return regex.test(url) ? {
      file: url.replace(regex, config.srcPath + '/')
    } : null
  }
}


module.exports = {
  log, template, resolvePath, sassProjectImporter
}
