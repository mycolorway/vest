const del = require('del')
const path = require('path')

module.exports = function(gulp) {
  gulp.task(`${this.config.name}:clean`, () => {
    this.log(`start cleaning dist directory...`)
    return del([path.join(this.config.distPath, '**/*')])
      .then(() => this.log(`finish cleaning dist directory.`))
  })
}
