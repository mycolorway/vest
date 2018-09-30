const gulpBabel = require('gulp-babel')
const gulpPlumber = require('gulp-plumber')
const utils = require('../utils')

module.exports = function(gulp) {
  gulp.task('babel', () => {
    utils.log(`start compiling js files...`)
    return gulp.src(this.babelGlobs, { base: this.config.srcPath })
      .pipe(gulpPlumber())
      .pipe(utils.template(this.config))
      .pipe(gulpBabel(this.babelOptions))
      .pipe(utils.resolvePath())
      .pipe(gulp.dest(this.config.distPath))
      .on('finish', () => utils.log(`finish compiling js files.`))
  })
}
