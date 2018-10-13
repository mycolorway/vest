const utils = require('../utils')
const gulpPlumber = require('gulp-plumber')

module.exports = function(gulp) {
  gulp.task(`${this.config.name}:template`, () => {
    utils.log(`start compiling wxml and json files...`)
    return gulp.src(this.templateGlobs, { base: this.config.srcPath })
      .pipe(gulpPlumber())
      .pipe(utils.template(this.config))
      .pipe(utils.resolvePath())
      .pipe(gulp.dest(this.config.distPath))
      .on('finish', () => utils.log(`finish compiling wxml and json files.`))
  })
}
