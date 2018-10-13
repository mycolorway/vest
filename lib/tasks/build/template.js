const {template, resolvePath} = require('../utils')
const gulpPlumber = require('gulp-plumber')

module.exports = function(gulp) {
  gulp.task(`${this.config.name}:template`, () => {
    this.log(`start compiling wxml and json files...`)
    return gulp.src(this.templateGlobs, { base: this.config.srcPath })
      .pipe(gulpPlumber())
      .pipe(template(this.config))
      .pipe(resolvePath())
      .pipe(gulp.dest(this.config.distPath))
      .on('finish', () => this.log(`finish compiling wxml and json files.`))
  })
}
