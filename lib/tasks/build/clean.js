const del = require('del')
const path = require('path')
const utils = require('../utils')

module.exports = function(gulp) {
  gulp.task('clean', () => {
    utils.log(`start cleaning dist directory...`)
    return del([path.join(this.config.distPath, '**/*')])
      .then(() => utils.log(`finish cleaning dist directory.`))
  })
}
