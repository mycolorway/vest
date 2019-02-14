const {template, resolvePath, resolveMiniprogramDistPath} = require('../utils')
const gulpPlumber = require('gulp-plumber')
const gulpIf = require('gulp-if')

module.exports = function(gulp) {
  gulp.task(`${this.config.name}:template`, () => {
    this.log(`start compiling wxml and json files...`)
    return gulp.src(this.templateGlobs, { base: this.config.srcPath })
      .pipe(gulpPlumber())
      .pipe(template(this.config))
      .pipe(resolvePath())
      .pipe(gulpIf(this.config.lark, resolveMiniprogramDistPath(this.config.cwd)))
      .pipe(gulp.dest(this.config.distPath))
      .on('finish', () => this.log(`finish compiling wxml and json files.`))
  })
}
